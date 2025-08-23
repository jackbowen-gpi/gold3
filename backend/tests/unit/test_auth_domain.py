"""
Unit tests for authentication domain services.

This file demonstrates the testing patterns used in the application
following the domain-driven design approach.
"""
from unittest.mock import Mock, patch

from django.test import TestCase

from domains.authentication.repositories import UserRepository
from domains.authentication.services import AuthService
from domains.shared.exceptions.base import (
    NotFoundError,
    PermissionDeniedError,
    ValidationError,
)
from users.models import User


class AuthServiceTestCase(TestCase):
    """Test cases for AuthService."""
    
    def setUp(self):
        """Set up test dependencies."""
        self.auth_service = AuthService()
        self.test_email = "test@example.com"
        self.test_password = "testpassword123"
    
    def test_get_model_class_returns_user_model(self):
        """Test that get_model_class returns the User model."""
        result = self.auth_service.get_model_class()
        self.assertEqual(result, User)
    
    @patch('domains.authentication.services.authenticate')
    def test_authenticate_user_success(self, mock_authenticate):
        """Test successful user authentication."""
        # Arrange
        mock_user = Mock(spec=User)
        mock_user.is_active = True
        mock_authenticate.return_value = mock_user
        
        # Act
        result = self.auth_service.authenticate_user(self.test_email, self.test_password)
        
        # Assert
        self.assertEqual(result, mock_user)
        mock_authenticate.assert_called_once_with(
            username=self.test_email,
            password=self.test_password
        )
    
    @patch('domains.authentication.services.authenticate')
    def test_authenticate_user_invalid_credentials(self, mock_authenticate):
        """Test authentication with invalid credentials."""
        # Arrange
        mock_authenticate.return_value = None
        
        # Mock repository to simulate user doesn't exist
        with patch.object(self.auth_service.repository, 'email_exists', return_value=False):
            # Act & Assert
            with self.assertRaises(NotFoundError) as context:
                self.auth_service.authenticate_user(self.test_email, self.test_password)
            
            self.assertIn(self.test_email, str(context.exception))
    
    @patch('domains.authentication.services.authenticate')
    def test_authenticate_user_wrong_password(self, mock_authenticate):
        """Test authentication with wrong password."""
        # Arrange
        mock_authenticate.return_value = None
        
        # Mock repository to simulate user exists
        with patch.object(self.auth_service.repository, 'email_exists', return_value=True):
            # Act & Assert
            with self.assertRaises(ValidationError) as context:
                self.auth_service.authenticate_user(self.test_email, self.test_password)
            
            self.assertIn("Invalid password", str(context.exception))
    
    @patch('domains.authentication.services.authenticate')
    def test_authenticate_user_inactive_account(self, mock_authenticate):
        """Test authentication with inactive user account."""
        # Arrange
        mock_user = Mock(spec=User)
        mock_user.is_active = False
        mock_authenticate.return_value = mock_user
        
        # Act & Assert
        with self.assertRaises(PermissionDeniedError) as context:
            self.auth_service.authenticate_user(self.test_email, self.test_password)
        
        self.assertIn("Account is deactivated", str(context.exception))
    
    def test_authenticate_user_missing_email(self):
        """Test authentication with missing email."""
        with self.assertRaises(ValidationError) as context:
            self.auth_service.authenticate_user("", self.test_password)
        
        self.assertIn("Email and password are required", str(context.exception))
    
    def test_authenticate_user_missing_password(self):
        """Test authentication with missing password."""
        with self.assertRaises(ValidationError) as context:
            self.auth_service.authenticate_user(self.test_email, "")
        
        self.assertIn("Email and password are required", str(context.exception))
    
    def test_register_user_success(self):
        """Test successful user registration."""
        # Arrange
        user_data = {
            "first_name": "Test",
            "last_name": "User"
        }
        
        mock_user = Mock(spec=User)
        
        with patch.object(self.auth_service.repository, 'email_exists', return_value=False), \
             patch.object(self.auth_service.repository, 'create', return_value=mock_user):
            
            # Act
            result = self.auth_service.register_user(
                self.test_email, 
                self.test_password, 
                **user_data
            )
            
            # Assert
            self.assertEqual(result, mock_user)
            mock_user.set_password.assert_called_once_with(self.test_password)
            mock_user.save.assert_called_once()
    
    def test_register_user_email_exists(self):
        """Test registration with existing email."""
        # Arrange
        with patch.object(self.auth_service.repository, 'email_exists', return_value=True):
            # Act & Assert
            with self.assertRaises(ValidationError) as context:
                self.auth_service.register_user(self.test_email, self.test_password)
            
            self.assertIn("Email already exists", str(context.exception))
            self.assertEqual(context.exception.field, "email")
    
    def test_get_user_by_email_success(self):
        """Test getting user by email successfully."""
        # Arrange
        mock_user = Mock(spec=User)
        
        with patch.object(self.auth_service.repository, 'get_by_email', return_value=mock_user):
            # Act
            result = self.auth_service.get_user_by_email(self.test_email)
            
            # Assert
            self.assertEqual(result, mock_user)
    
    def test_get_user_by_email_not_found(self):
        """Test getting user by email when user doesn't exist."""
        # Arrange
        with patch.object(self.auth_service.repository, 'get_by_email', return_value=None):
            # Act & Assert
            with self.assertRaises(NotFoundError) as context:
                self.auth_service.get_user_by_email(self.test_email)
            
            self.assertIn(self.test_email, str(context.exception))


class UserRepositoryTestCase(TestCase):
    """Test cases for UserRepository."""
    
    def setUp(self):
        """Set up test dependencies."""
        self.repository = UserRepository()
        self.test_user = User.objects.create_user(
            email="test@example.com",
            password="testpassword123"
        )
    
    def test_get_model_class_returns_user_model(self):
        """Test that get_model_class returns the User model."""
        result = self.repository.get_model_class()
        self.assertEqual(result, User)
    
    def test_get_by_email_success(self):
        """Test getting user by email successfully."""
        result = self.repository.get_by_email(self.test_user.email)
        self.assertEqual(result, self.test_user)
    
    def test_get_by_email_not_found(self):
        """Test getting user by email when user doesn't exist."""
        result = self.repository.get_by_email("nonexistent@example.com")
        self.assertIsNone(result)
    
    def test_get_active_users(self):
        """Test getting active users."""
        # Create inactive user
        User.objects.create_user(
            email="inactive@example.com",
            password="password",
            is_active=False
        )
        
        active_users = self.repository.get_active_users()
        
        # Should only return active users
        self.assertEqual(len(active_users), 1)
        self.assertEqual(active_users[0], self.test_user)
        self.assertTrue(active_users[0].is_active)
    
    def test_email_exists_true(self):
        """Test email_exists returns True for existing email."""
        result = self.repository.email_exists(self.test_user.email)
        self.assertTrue(result)
    
    def test_email_exists_false(self):
        """Test email_exists returns False for non-existing email."""
        result = self.repository.email_exists("nonexistent@example.com")
        self.assertFalse(result)