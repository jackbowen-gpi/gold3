from django.contrib.auth import authenticate, login, logout
import logging
from django.db import transaction
from django.utils import timezone

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import UserSerializer
from .models import User


class LoginView(APIView):
    permission_classes = (AllowAny,)

    _logger = logging.getLogger(__name__)

    def post(self, request):
        # Debug logging to inspect incoming login requests while avoiding printing raw passwords
        try:
            cookie = request.META.get('HTTP_COOKIE')
            content_type = request.META.get('CONTENT_TYPE')
            remote_addr = request.META.get('REMOTE_ADDR')
            self._logger.debug('Login POST received: remote_addr=%s content_type=%s cookies=%s', remote_addr, content_type, cookie)
            # log request.data keys and mask password value
            data_keys = list(request.data.keys()) if hasattr(request, 'data') else []
            has_password = 'password' in request.data if hasattr(request, 'data') else False
            self._logger.debug('Login POST payload keys: %s password_present=%s', data_keys, has_password)
            # avoid accessing request.body after DRF has read request.data
            # (accessing request.body here causes RawPostDataException)
            self._logger.debug('Skipping raw body preview to avoid RawPostDataException')
        except Exception:
            # Never fail the request due to logging
            self._logger.exception('Error while logging login request')

        email = request.data.get("email")
        password = request.data.get("password")
        try:
            # request.data is already parsed by DRF; log a safe preview
            try:
                data_preview = dict(request.data)
            except Exception:
                data_preview = str(request.data)
            self._logger.debug('Parsed request.data: %s', data_preview)
        except Exception:
            self._logger.exception('Failed to log parsed request.data')
        user = authenticate(request, username=email, password=password)
        if user is None:
            # Log failed attempts with non-sensitive details to help debugging in dev
            try:
                self._logger.warning('Login attempt failed for email=%s remote_addr=%s content_type=%s', email, remote_addr, content_type)
            except Exception:
                self._logger.exception('Failed to log failed login attempt')
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
        login(request, user)
        # update last_login
        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])
        self._logger.info('User %s logged in via session (id will be set in Set-Cookie)', getattr(user, 'email', user.username if hasattr(user, 'username') else 'unknown'))
        return Response(UserSerializer(user).data)


class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class RegisterView(APIView):
    permission_classes = (AllowAny,)

    @transaction.atomic
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        if not email or not password:
            return Response({"detail": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=email).exists():
            return Response({"detail": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_user(email=email, password=password)
        login(request, user)
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class MeView(APIView):
    def get(self, request):
        user = request.user
        if not user or not getattr(user, "is_authenticated", False):
            return Response({"detail": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(UserSerializer(user).data)


class RefreshView(APIView):
    def post(self, request):
        # For session based auth this is a noop; return current user if authenticated
        user = request.user
        if not user or not getattr(user, "is_authenticated", False):
            return Response({"detail": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(UserSerializer(user).data)
