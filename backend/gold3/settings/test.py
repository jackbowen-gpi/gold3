from .base import *  # noqa: F403,F405


DEBUG = True
ALLOWED_HOSTS = ["*"]  
# Allow all hosts during testing to avoid host header issues
SECRET_KEY = ["test-secret-key"]


STATIC_ROOT = base_dir_join("staticfiles")  # noqa: F405
STATIC_URL = "/static/"

MEDIA_ROOT = base_dir_join("mediafiles")  # noqa: F405
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
