from django.contrib.auth import authenticate

from domains.shared.exceptions.base import (
    NotFoundError,
    PermissionDeniedError,
    ValidationError,
)
from domains.shared.services.base import BaseService
from users.models import User

from .repositories import UserRepository


class AuthService(BaseService[User]):
    """Service for authentication operations."""
    
    def __init__(self):
        super().__init__(UserRepository())
    
    def get_model_class(self) -> type[User]:
        """Return the User model class."""
        return User
    
    def authenticate_user(self, email: str, password: str) -> User:
        """
        Authenticate a user with email and password.
        
        Args:
            email: User's email address
            password: User's password
            
        Returns:
            User: The authenticated user
            
        Raises:
            ValidationError: If email or password is invalid
            NotFoundError: If user doesn't exist
            PermissionDeniedError: If user is inactive
        """
        if not email or not password:
            raise ValidationError("Email and password are required")
        
        user = authenticate(username=email, password=password)
        
        if not user:
            # Check if user exists to provide better error message
            if self.repository.email_exists(email):
                raise ValidationError("Invalid password")
            else:
                raise NotFoundError("User", email)
        
        if not user.is_active:
            raise PermissionDeniedError("Account is deactivated")
        
        return user
    
    def register_user(self, email: str, password: str, **kwargs) -> User:
        """
        Register a new user.
        
        Args:
            email: User's email address
            password: User's password
            **kwargs: Additional user data
            
        Returns:
            User: The created user
            
        Raises:
            ValidationError: If email already exists or data is invalid
        """
        if self.repository.email_exists(email):
            raise ValidationError("Email already exists", field="email")
        
        user_data = {"email": email, **kwargs}
        user = self.repository.create(**user_data)
        user.set_password(password)
        user.save()
        
        return user
    
    def get_user_by_email(self, email: str) -> User:
        """
        Get a user by email address.
        
        Args:
            email: User's email address
            
        Returns:
            User: The user
            
        Raises:
            NotFoundError: If user doesn't exist
        """
        user = self.repository.get_by_email(email)
        if not user:
            raise NotFoundError("User", email)
        return user