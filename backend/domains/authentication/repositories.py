from typing import Any

from domains.shared.repositories.base import BaseRepository
from users.models import User


class UserRepository(BaseRepository[User]):
    """Repository for User model operations."""
    
    def get_model_class(self) -> type[User]:
        """Return the User model class."""
        return User
    
    def get_by_email(self, email: str) -> User | None:
        """Get a user by email address."""
        try:
            return self.get_queryset().get(email=email)
        except User.DoesNotExist:
            return None
    
    def get_active_users(self) -> list[User]:
        """Get all active users."""
        return list(self.get_queryset().filter(is_active=True))
    
    def email_exists(self, email: str) -> bool:
        """Check if email already exists."""
        return self.get_queryset().filter(email=email).exists()