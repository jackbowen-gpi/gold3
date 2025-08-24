from django.urls import path
from .views_auth import LoginView, LogoutView, RegisterView, MeView, RefreshView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', MeView.as_view(), name='me'),
    path('refresh/', RefreshView.as_view(), name='refresh'),
]
