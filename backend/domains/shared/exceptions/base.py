"""
Custom exceptions for the application.

This module defines custom exceptions that provide more specific
error handling and better error messages throughout the application.
"""


class DomainError(Exception):
    """Base exception for domain-related errors."""
    
    def __init__(self, message: str = "A domain error occurred"):
        self.message = message
        super().__init__(self.message)


class ValidationError(DomainError):
    """Exception raised when validation fails."""
    
    def __init__(self, message: str = "Validation failed", field: str | None = None):
        self.field = field
        super().__init__(message)


class NotFoundError(DomainError):
    """Exception raised when a requested resource is not found."""
    
    def __init__(self, resource: str = "Resource", resource_id: str | None = None):
        message = f"{resource} not found"
        if resource_id:
            message += f" with id: {resource_id}"
        super().__init__(message)


class PermissionDeniedError(DomainError):
    """Exception raised when permission is denied."""
    
    def __init__(self, message: str = "Permission denied"):
        super().__init__(message)


class BusinessRuleViolationError(DomainError):
    """Exception raised when a business rule is violated."""
    
    def __init__(self, rule: str, message: str | None = None):
        self.rule = rule
        if not message:
            message = f"Business rule violation: {rule}"
        super().__init__(message)


class ServiceError(DomainError):
    """Exception raised when a service operation fails."""
    
    def __init__(self, service: str, operation: str, message: str | None = None):
        self.service = service
        self.operation = operation
        if not message:
            message = f"Service error in {service}.{operation}"
        super().__init__(message)