import socket
import urllib.request
import urllib.parse
from django.http import JsonResponse
from django.conf import settings

from django.db import connections


def _check_db(timeout=2.0):
    try:
        # simple query to check DB connection
        conn = connections["default"]
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        cursor.fetchone()
        return {"ok": True}
    except Exception as e:
        return {"ok": False, "error": str(e)}


def _check_redis(timeout=2.0):
    # Be tolerant: Redis may not be configured in every dev environment
    redis_url = getattr(settings, "REDIS_URL", None)
    if not redis_url:
        return {"ok": False, "skipped": True, "reason": "REDIS_URL not set in settings"}
    try:
        # lazily import redis to avoid hard dependency in production
        import redis as _redis

        r = _redis.from_url(redis_url, socket_timeout=timeout)
        pong = r.ping()
        return {"ok": bool(pong)}
    except ModuleNotFoundError:
        return {"ok": False, "skipped": True, "reason": "redis package not installed"}
    except Exception as e:
        return {"ok": False, "error": str(e)}


def _check_broker(timeout=2.0):
    # Try common envs/settings for broker (RabbitMQ). Be best-effort.
    rabbit_url = (
        getattr(settings, "BROKER_URL", None)
        or getattr(settings, "RABBITMQ_URL", None)
        or getattr(settings, "CELERY_BROKER_URL", None)
    )
    if not rabbit_url:
        return {"ok": False, "skipped": True, "reason": "no broker URL configured"}
    try:
        # Use urllib.parse to robustly extract host and port
        parsed = urllib.parse.urlparse(rabbit_url)
        host = parsed.hostname
        port = parsed.port or (5672 if parsed.scheme.startswith("amqp") else None)
        if not host or not port:
            return {"ok": False, "error": "unable to parse host/port from broker URL"}
        with socket.create_connection((host, int(port)), timeout=timeout):
            return {"ok": True}
    except Exception as e:
        return {"ok": False, "error": str(e)}


def _require_token(request):
    """Return True if a token is configured and valid (or if no token configured).

    Token is read from settings.DEV_HEALTH_TOKEN. If set, the request must provide
    the same token either via the X-DEV-HEALTH-TOKEN header or the `token` query param.
    """
    token = getattr(settings, "DEV_HEALTH_TOKEN", None)
    if not token:
        return True
    # header first
    hdr = request.META.get("HTTP_X_DEV_HEALTH_TOKEN")
    if hdr and hdr == token:
        return True
    q = request.GET.get("token")
    if q and q == token:
        return True
    return False


def _check_celery(timeout=3.0):
    # Best-effort: try to use celery.app.control.inspect if celery is installed and configured
    try:
        from celery import Celery

        app = Celery()
        broker = getattr(settings, "CELERY_BROKER_URL", None) or getattr(settings, "BROKER_URL", None)
        if broker:
            app.conf.broker_url = broker
        inspect = app.control.inspect(timeout=timeout)
        active = inspect.active() or {}
        return {"ok": True, "active_workers": list(active.keys())}
    except ModuleNotFoundError:
        return {"ok": False, "skipped": True, "reason": "celery not installed"}
    except Exception as e:
        return {"ok": False, "error": str(e)}


def _check_frontend(host: str, port: int, scheme: str = "http"):
    # TCP check
    try:
        with socket.create_connection((host, int(port)), timeout=2.0):
            pass
    except Exception as e:
        return {"ok": False, "error": f"tcp: {e}"}

    # HTTP root check
    url = f"{scheme}://{host}:{port}/"
    try:
        with urllib.request.urlopen(url, timeout=3.0) as resp:
            code = resp.getcode()
            return {"ok": 200 <= code < 400, "status_code": code}
    except Exception as e:
        return {"ok": False, "error": str(e)}


def dev_health(request):
    # Only expose in DEBUG to avoid leaking info in production
    if not getattr(settings, "DEBUG", False):
        return JsonResponse({"error": "dev-only endpoint"}, status=404)

    frontend_host = getattr(settings, "FRONTEND_DEV_HOST", "frontend")
    frontend_port = int(getattr(settings, "FRONTEND_DEV_PORT", 3000))
    frontend_scheme = getattr(settings, "FRONTEND_DEV_SCHEME", "http")

    data = {
        "db": _check_db(),
        "redis": _check_redis(),
        "broker": _check_broker(),
        "celery": _check_celery(),
        "frontend": _check_frontend(frontend_host, frontend_port, frontend_scheme),
    }

    # If an API protection toggle is set, enforce token for API as well
    api_protect = getattr(settings, "DEV_HEALTH_API_PROTECT", False)
    if api_protect and not _require_token(request):
        return JsonResponse({"error": "invalid token"}, status=403)

    return JsonResponse(data)


def dev_health_ui(request):
    """Render a small page that fetches /dev-health/ and shows statuses visually.

    This is intentionally minimal and only enabled in DEBUG.
    """
    from django.shortcuts import render

    if not getattr(settings, "DEBUG", False):
        from django.http import Http404

        raise Http404()

    # Enforce token if configured
    if not _require_token(request):
        from django.http import HttpResponseForbidden

        return HttpResponseForbidden("Invalid or missing token")

    # Attempt to read webpack manifest so the UI can check a real asset path
    asset_url = None
    try:
        stats_file = getattr(settings, 'WEBPACK_STATS_FILE', None)
        if stats_file:
            import json

            with open(stats_file, 'r', encoding='utf-8') as fh:
                stats = json.load(fh)
            # Prefer an explicit asset entry that looks like an image, else fall back
            assets = stats.get('assets', {}) or {}
            chosen = None
            for name, meta in assets.items():
                if name.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg')):
                    chosen = meta.get('publicPath') or meta.get('path') or None
                    break
            # If not found, try top-level publicPath + first asset name
            if not chosen and assets:
                first = next(iter(assets.values()))
                chosen = first.get('publicPath') or (stats.get('publicPath', '').rstrip('/') + '/' + first.get('name') if first.get('name') else None)
            asset_url = chosen
    except Exception:
        asset_url = None

    return render(request, "dev_health.html", {"STATIC_CHECK_ASSET": asset_url})


def dev_asset(request):
    """Return a small JSON payload with the manifest-selected asset URL.

    This endpoint is intended for CI or programmatic checks that need a
    deterministic URL to probe. Respects DEBUG and DEV_HEALTH_TOKEN like
    the other dev endpoints.
    """
    if not getattr(settings, "DEBUG", False):
        return JsonResponse({"error": "dev-only endpoint"}, status=404)

    # Enforce token if configured
    if not _require_token(request):
        from django.http import HttpResponseForbidden

        return HttpResponseForbidden("Invalid or missing token")

    asset_url = None
    try:
        stats_file = getattr(settings, 'WEBPACK_STATS_FILE', None)
        if stats_file:
            import json

            with open(stats_file, 'r', encoding='utf-8') as fh:
                stats = json.load(fh)
            assets = stats.get('assets', {}) or {}
            chosen = None
            for name, meta in assets.items():
                if name.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg')):
                    chosen = meta.get('publicPath') or meta.get('path') or None
                    break
            if not chosen and assets:
                first = next(iter(assets.values()))
                chosen = first.get('publicPath') or (stats.get('publicPath', '').rstrip('/') + '/' + first.get('name') if first.get('name') else None)
            asset_url = chosen
    except Exception:
        asset_url = None

    return JsonResponse({"asset": asset_url})


def readiness(request):
    """A readiness endpoint intended for CI: returns 200 when all required services are healthy,
    otherwise 503. The set of required services is read from settings.DEV_REQUIRED_SERVICES
    (list) or defaults to ['db', 'frontend'].
    """
    if not getattr(settings, "DEBUG", False):
        # keep it simple: disallow in prod
        return JsonResponse({"error": "dev-only endpoint"}, status=404)

    required = getattr(settings, "DEV_REQUIRED_SERVICES", ["db", "frontend"]) or []
    # reuse dev checks
    checks = {
        "db": _check_db(),
        "redis": _check_redis(),
        "broker": _check_broker(),
        "celery": _check_celery(),
        "frontend": _check_frontend(getattr(settings, "FRONTEND_DEV_HOST", "frontend"), int(getattr(settings, "FRONTEND_DEV_PORT", 3000)), getattr(settings, "FRONTEND_DEV_SCHEME", "http")),
    }
    failed = []
    for svc in required:
        r = checks.get(svc)
        if not r:
            failed.append(svc)
            continue
        if not r.get("ok", False):
            # if skipped is True treat as failure for readiness
            failed.append({"service": svc, "detail": r})

    status = 200 if not failed else 503
    return JsonResponse({"ok": not failed, "failed": failed, "checks": checks}, status=status)
