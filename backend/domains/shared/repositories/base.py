from abc import ABC, abstractmethod
from typing import Any, Generic, TypeVar

from django.core.exceptions import ObjectDoesNotExist
from django.db import models


ModelType = TypeVar('ModelType', bound=models.Model)


class BaseRepository(ABC, Generic[ModelType]):
    """
    Base repository class for data access operations.
    
    This class provides a common interface for repositories that handle
    data access and database operations for a specific model.
    """
    
    @abstractmethod
    def get_model_class(self) -> type[ModelType]:
        """Return the model class this repository handles."""
        pass
    
    def get_queryset(self):
        """Get the base queryset for this repository."""
        return self.get_model_class().objects.all()
    
    def get_by_id(self, pk: Any) -> ModelType | None:
        """Get an instance by its primary key."""
        try:
            return self.get_queryset().get(pk=pk)
        except ObjectDoesNotExist:
            return None
    
    def get_all(self) -> list[ModelType]:
        """Get all instances."""
        return list(self.get_queryset())
    
    def filter(self, **kwargs) -> list[ModelType]:
        """Filter instances by the given criteria."""
        return list(self.get_queryset().filter(**kwargs))
    
    def create(self, **kwargs) -> ModelType:
        """Create a new instance with the given data."""
        return self.get_model_class().objects.create(**kwargs)
    
    def update(self, instance: ModelType, **kwargs) -> ModelType:
        """Update an existing instance with the given data."""
        for key, value in kwargs.items():
            setattr(instance, key, value)
        instance.save()
        return instance
    
    def delete(self, instance: ModelType) -> bool:
        """Delete an instance."""
        try:
            instance.delete()
            return True
        except Exception:  # noqa: BLE001
            return False
    
    def exists(self, **kwargs) -> bool:
        """Check if an instance exists with the given criteria."""
        return self.get_queryset().filter(**kwargs).exists()
    
    def count(self, **kwargs) -> int:
        """Count instances with the given criteria."""
        if kwargs:
            return self.get_queryset().filter(**kwargs).count()
        return self.get_queryset().count()