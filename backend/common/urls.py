from django.urls import path

from . import views


app_name = "common"
urlpatterns = [
    path("", views.IndexView.as_view(), name="index"),
    # Single-page app entry points (handled by the frontend router)
    path("login/", views.IndexView.as_view(), name="login"),
    path("register/", views.IndexView.as_view(), name="register"),
    # Frontend routes the System Health and status pages client-side
    path("health/", views.IndexView.as_view(), name="health"),
    path("status/", views.IndexView.as_view(), name="status"),
]
