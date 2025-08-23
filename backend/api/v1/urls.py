from django.urls import include, path
from rest_framework.routers import DefaultRouter

from common.routes import routes as common_routes
from users.routes import routes as users_routes


app_name = 'api_v1'

router = DefaultRouter()
for route in common_routes + users_routes:
    router.register(route["regex"], route["viewset"], basename=route["basename"])

urlpatterns = [
    path('', include(router.urls)),
]