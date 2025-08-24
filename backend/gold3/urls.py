from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

import django_js_reverse.views
from api.v1.urls import urlpatterns as v1_urls
from common.routes import routes as common_routes
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from rest_framework.routers import DefaultRouter
from users.routes import routes as users_routes


router = DefaultRouter()

routes = common_routes + users_routes
for route in routes:
    router.register(route["regex"], route["viewset"], basename=route["basename"])
def trigger_error(request):
    division_by_zero = 1 / 0  # noqa: F841  # nosec
urlpatterns = [
    path("", include("common.urls"), name="common"),
    path("admin/", admin.site.urls, name="admin"),
    path("admin/defender/", include("defender.urls")),
    path("jsreverse/", django_js_reverse.views.urls_js, name="js_reverse"),
    # API versioning
    path("api/v1/", include(v1_urls), name="api_v1"),
    # Legacy API support (will be deprecated)
    path("api/", include(router.urls), name="api"),
    # drf-spectacular
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/schema/swagger-ui/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "api/schema/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
    path('sentry-debug/', trigger_error),
]

# In development, ensure the staticfiles app serves static assets referenced under STATIC_URL
if getattr(settings, "DEBUG", False):
    urlpatterns += staticfiles_urlpatterns()
