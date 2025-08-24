#!/usr/bin/env python
"""Startup checks for development.

Checks performed:
 - presence of the webpack stats file (configurable via WEBPACK_STATS_FILE)
 - presence of the frontend directory (FRONTEND_DIR)
 - optional health-check of the frontend dev server (FRONTEND_DEV_HOST/PORT)

All checks are non-fatal in development: the script will only print warnings and
exit with 0 so Django can still start. An idempotency marker ensures this script
doesn't spam logs when the Django autoreloader runs multiple times.
"""
import os
import sys
import socket
import urllib.request


def check_tcp(host, port, timeout=2.0):
    try:
        with socket.create_connection((host, int(port)), timeout=timeout):
            return True
    except Exception:
        return False


def check_http_root(host, port, scheme="http", timeout=3.0):
    url = f"{scheme}://{host}:{port}/"
    try:
        with urllib.request.urlopen(url, timeout=timeout) as resp:
            return resp.getcode()
    except Exception:
        return None


def main():
    stats = os.environ.get("WEBPACK_STATS_FILE", "/repo/webpack-stats.json")
    frontend = os.environ.get("FRONTEND_DIR", "/app/frontend")

    # idempotency marker: avoid duplicate output when the container or autoreloader
    # causes this script to run multiple times. Use a simple tmp file as a guard.
    marker = "/tmp/.webpack_stats_checked"
    if os.path.exists(marker):
        return 0

    print(f"Checking WEBPACK_STATS_FILE={stats}")
    print(f"Checking FRONTEND_DIR={frontend}")

    if not os.path.exists(stats):
        print("WARNING: webpack-stats.json not found at:", stats, file=sys.stderr)
        print("Expected either the frontend container to generate it or the file to be mounted into /repo/webpack-stats.json.", file=sys.stderr)
        print("You can set WEBPACK_STATS_FILE env var in docker-compose to point to the actual path inside the container.", file=sys.stderr)
        # Non-fatal in development: continue startup so Django still runs without built assets.
    else:
        print("OK: webpack-stats present.")

    if not os.path.isdir(frontend):
        print("WARNING: FRONTEND_DIR does not exist:", frontend, file=sys.stderr)
    else:
        print("OK: frontend directory exists.")

    # Frontend dev-server health check (non-fatal). Configurable via env vars.
    dev_host = os.environ.get("FRONTEND_DEV_HOST", "frontend")
    dev_port = os.environ.get("FRONTEND_DEV_PORT", "3000")
    dev_scheme = os.environ.get("FRONTEND_DEV_SCHEME", "http")

    print(f"Checking frontend dev-server at {dev_host}:{dev_port} (scheme={dev_scheme})")

    tcp_ok = check_tcp(dev_host, dev_port, timeout=2.0)
    if not tcp_ok:
        print(f"WARNING: Cannot connect to {dev_host}:{dev_port} (TCP). Is the frontend dev server running?", file=sys.stderr)
        print("If you're using the frontend dev-server in development, ensure the `frontend` service is up and `npm run dev` is running.", file=sys.stderr)
    else:
        code = check_http_root(dev_host, dev_port, scheme=dev_scheme, timeout=3.0)
        if code is None:
            print(f"NOTICE: TCP to {dev_host}:{dev_port} succeeded but HTTP root did not respond; dev-server may be up but not serving HTTP.")
        elif 200 <= code < 400:
            print(f"OK: frontend dev-server responded with HTTP {code}.")
        else:
            print(f"WARNING: frontend dev-server HTTP root returned status {code}.", file=sys.stderr)

    # create marker so subsequent runs in the same container are no-ops
    try:
        with open(marker, "w") as f:
            f.write("1")
    except Exception:
        pass
    return 0


if __name__ == '__main__':
    sys.exit(main())
