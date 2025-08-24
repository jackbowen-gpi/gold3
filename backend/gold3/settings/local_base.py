from django.core.management.utils import get_random_secret_key
import os
from decouple import config

from .base import *


DEBUG = True

HOST = "http://localhost:8000"

SECRET_KEY = get_random_secret_key()

STATIC_ROOT = base_dir_join("staticfiles")
STATIC_URL = "/static/"

MEDIA_ROOT = base_dir_join("mediafiles")
MEDIA_URL = "/media/"

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
}

AUTH_PASSWORD_VALIDATORS = []  # allow easy passwords only on local

# Celery
CELERY_BROKER_URL = config("CELERY_BROKER_URL", default="")
CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True

# Email settings for mailhog
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "mailhog"
EMAIL_PORT = 1025

# Logging
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "filters": {
        "correlation_id": {"()": "django_guid.log_filters.CorrelationId"},
    },
    "formatters": {
        "standard": {
            "format": "%(levelname)-8s [%(asctime)s] [%(correlation_id)s] %(name)s: %(message)s"
        },
    },
    "handlers": {
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "formatter": "standard",
            "filters": ["correlation_id"],
        },
    },
    "loggers": {
        "": {"handlers": ["console"], "level": "INFO"},
        "celery": {"handlers": ["console"], "level": "INFO"},
        "django_guid": {
            "handlers": ["console"],
            "level": "WARNING",
            "propagate": False,
        },
    },
}

JS_REVERSE_JS_MINIFY = False

# Django-CSP
# Dev host used by the webpack devserver (containers -> host.docker.internal)
LOCAL_HOST_URL = "http://host.docker.internal:3000"
LOCAL_HOST_WS_URL = "ws://host.docker.internal:3000/ws"

# Make the dev CSP allowance explicit and opt-in via env var to avoid leaking
# a permissive CSP into unintended environments. Set ALLOW_DEV_CSP_HOST=1
# (or true/yes) in your local .env when you need the devserver to serve styles/js.
_allow_dev_csp = os.getenv("ALLOW_DEV_CSP_HOST", "").lower() in ("1", "true", "yes")
if _allow_dev_csp:
    # Add the primary docker -> host dev URL
    CSP_SCRIPT_SRC += [LOCAL_HOST_URL, LOCAL_HOST_WS_URL]
    CSP_CONNECT_SRC += [LOCAL_HOST_URL, LOCAL_HOST_WS_URL]
    CSP_FONT_SRC += [LOCAL_HOST_URL]
    CSP_IMG_SRC += [LOCAL_HOST_URL]
    # Allow styles from the webpack devserver when running in local/dev compose
    CSP_STYLE_SRC += [LOCAL_HOST_URL]
    # Also allow common alternative dev hostnames used by developers and CI
    ALT_DEV_HOSTS = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    ALT_DEV_WS = [
        "ws://localhost:3000/ws",
        "ws://127.0.0.1:3000/ws",
    ]
    for h in ALT_DEV_HOSTS:
        CSP_SCRIPT_SRC.append(h)
        CSP_CONNECT_SRC.append(h)
        CSP_FONT_SRC.append(h)
        CSP_IMG_SRC.append(h)
        CSP_STYLE_SRC.append(h)
    for w in ALT_DEV_WS:
        CSP_SCRIPT_SRC.append(w)
        CSP_CONNECT_SRC.append(w)

# If no DATABASE_URL is provided in local development, use a lightweight
# sqlite database so the dev server can boot without requiring Postgres.
if not config("DATABASE_URL", default=""):
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": base_dir_join("db.sqlite3"),
        }
    }
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False
SECURE_SSL_REDIRECT = False
SECURE_HSTS_SECONDS = 0
SECURE_HSTS_INCLUDE_SUBDOMAINS = False
SECURE_HSTS_PRELOAD = False

# For local development, prefer a lightweight sqlite database so the dev
# server can start without an external Postgres service. local_base is only
# loaded in development, so this is safe and convenient.
if DEBUG:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": base_dir_join("db.sqlite3"),
        }
    }
