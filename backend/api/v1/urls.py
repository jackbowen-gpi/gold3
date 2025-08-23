from django.urls import include, path


app_name = 'api_v1'

urlpatterns = [
    path('auth/', include('users.routes')),
    path('', include('common.routes')),
]