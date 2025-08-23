from abc import ABC, abstractmethod
from typing import TYPE_CHECKING, Any, Generic, TypeVar

from django.db import models


if TYPE_CHECKING:
    from domains.shared.repositories.base import BaseRepository

ModelType = TypeVar('ModelType', bound=models.Model)


class BaseService(ABC, Generic[ModelType]):
    """
    Base service class for business logic operations.
    
    This class provides a common interface for services that handle
    business logic and coordinate between repositories and other services.
    """
    
    def __init__(self, repository: 'BaseRepository[ModelType]'):
        self.repository = repository
    
    @abstractmethod
    def get_model_class(self) -> type[ModelType]:
        """Return the model class this service handles."""
        pass
    
    def get_by_id(self, pk: Any) -> ModelType | None:
        """Get an instance by its primary key."""
        return self.repository.get_by_id(pk)
    
    def get_all(self) -> list[ModelType]:
        """Get all instances."""
        return self.repository.get_all()
    
    def create(self, **kwargs) -> ModelType:
        """Create a new instance with the given data."""
        return self.repository.create(**kwargs)
    
    def update(self, instance: ModelType, **kwargs) -> ModelType:
        """Update an existing instance with the given data."""
        return self.repository.update(instance, **kwargs)
    
    def delete(self, instance: ModelType) -> bool:
        """Delete an instance."""
        return self.repository.delete(instance)
    
    def filter(self, **kwargs) -> list[ModelType]:
        """Filter instances by the given criteria."""
        return self.repository.filter(**kwargs)