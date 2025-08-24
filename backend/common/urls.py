from django.urls import path

from . import views


app_name = "common"
urlpatterns = [
    path("", views.IndexView.as_view(), name="index"),
    # Single-page app entry points (handled by the frontend router)
    path("login/", views.IndexView.as_view(), name="login"),
    path("register/", views.IndexView.as_view(), name="register"),
]
