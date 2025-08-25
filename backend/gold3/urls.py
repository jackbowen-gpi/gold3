from django.contrib import admin
from django.urls import include, path, re_path
from django.conf import settings
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.views.generic.base import RedirectView

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
from common.dev_health import dev_health, dev_health_ui, readiness, dev_asset
from common.views import IndexView


router = DefaultRouter()

routes = common_routes + users_routes
for route in routes:
    router.register(route["regex"], route["viewset"], basename=route["basename"])
def trigger_error(request):
    division_by_zero = 1 / 0  # noqa: F841  # nosec
urlpatterns = [
    # Redirect the friendly /health path to the developer UI at /dev/health/
    path('health/', RedirectView.as_view(url='/dev/health/', permanent=False), name='health-redirect'),
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
    # Development-only aggregated health endpoint
    path('dev-health/', dev_health, name='dev-health'),
    # developer UI (served by Django template)
    path('dev/health/', dev_health_ui, name='dev-health-ui'),
    # small JSON endpoint exposing a manifest-proven asset URL for CI checks
    path('dev-asset/', dev_asset, name='dev-asset'),
    path('healthz/', readiness, name='readiness'),
]

# In development, ensure the staticfiles app serves static assets referenced under STATIC_URL
if getattr(settings, "DEBUG", False):
    urlpatterns += staticfiles_urlpatterns()

# SPA fallback: let the frontend router handle any remaining client-side routes
# This must be last so existing Django routes (api/, admin/, staticfiles, etc.) take precedence.
urlpatterns += [
    re_path(r'^(?:.*)/?$', IndexView.as_view(), name='spa-fallback'),
]
