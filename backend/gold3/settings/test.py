from .base import *


DEBUG = True
ALLOWED_HOSTS = ["*"]


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

# Speed up password hashing
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.MD5PasswordHasher",
]

# Celery
CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True
