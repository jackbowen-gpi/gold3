import os
from django.conf import settings


def frontend_dev_settings(request):
    frontend_host = os.environ.get('FRONTEND_DEV_HOST')
    frontend_port = os.environ.get('FRONTEND_DEV_PORT')
    # If the webpack build exposes a public host, prefer that (includes scheme)
    webpack_public = os.environ.get('WEBPACK_PUBLIC_HOST')

    # When running backend in Docker the dev frontend service name is typically
    # 'frontend' which is resolvable only from other containers, not from the
    # host/browser. Map that to host.docker.internal so the browser can reach
    # the dev server when DEBUG/dev compose is used.
    if not webpack_public and frontend_host:
        if frontend_host == 'frontend' and frontend_port:
            webpack_public = f'http://host.docker.internal:{frontend_port}'
        elif frontend_port:
            webpack_public = f'http://{frontend_host}:{frontend_port}'

    return {
        'FRONTEND_DEV_HOST': frontend_host,
        'FRONTEND_DEV_PORT': frontend_port,
        'WEBPACK_PUBLIC_HOST': webpack_public,
    }


def sentry_dsn(request):
    return {"SENTRY_DSN": settings.SENTRY_DSN}


def commit_sha(request):
    return {"COMMIT_SHA": settings.COMMIT_SHA}
