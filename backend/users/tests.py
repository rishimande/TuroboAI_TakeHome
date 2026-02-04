"""
Tests for the users app.
"""
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import User


class UserModelTestCase(TestCase):
    """Test cases for User model."""

    def test_create_user(self):
        """Test creating a regular user."""
        user = User.objects.create_user(
            email="test@example.com",
            password="TestPass123"
        )
        self.assertEqual(user.email, "test@example.com")
        self.assertTrue(user.check_password("TestPass123"))
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_superuser(self):
        """Test creating a superuser."""
        user = User.objects.create_superuser(
            email="admin@example.com",
            password="AdminPass123"
        )
        self.assertEqual(user.email, "admin@example.com")
        self.assertTrue(user.is_active)
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)

    def test_user_str_representation(self):
        """Test string representation of user."""
        user = User.objects.create_user(
            email="test@example.com",
            password="TestPass123"
        )
        self.assertEqual(str(user), "test@example.com")


class SignUpViewTestCase(TestCase):
    """Test cases for signup view."""

    def setUp(self):
        self.client = APIClient()
        self.signup_url = reverse("users:signup")

    def test_signup_success(self):
        """Test successful user registration."""
        data = {
            "email": "newuser@example.com",
            "password": "NewPass123"
        }
        response = self.client.post(self.signup_url, data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("user", response.data)
        self.assertEqual(response.data["user"]["email"], "newuser@example.com")
        self.assertTrue(User.objects.filter(email="newuser@example.com").exists())

    def test_signup_invalid_email(self):
        """Test signup with invalid email."""
        data = {
            "email": "invalid-email",
            "password": "TestPass123"
        }
        response = self.client.post(self.signup_url, data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_signup_weak_password(self):
        """Test signup with weak password."""
        data = {
            "email": "test@example.com",
            "password": "weakpass"
        }
        response = self.client.post(self.signup_url, data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)

    def test_signup_duplicate_email(self):
        """Test signup with existing email."""
        User.objects.create_user(
            email="existing@example.com",
            password="TestPass123"
        )
        
        data = {
            "email": "existing@example.com",
            "password": "NewPass123"
        }
        response = self.client.post(self.signup_url, data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)


class LoginViewTestCase(TestCase):
    """Test cases for login view."""

    def setUp(self):
        self.client = APIClient()
        self.login_url = reverse("users:login")
        self.user = User.objects.create_user(
            email="test@example.com",
            password="TestPass123"
        )

    def test_login_success(self):
        """Test successful login."""
        data = {
            "email": "test@example.com",
            "password": "TestPass123"
        }
        response = self.client.post(self.login_url, data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("user", response.data)
        self.assertEqual(response.data["user"]["email"], "test@example.com")

    def test_login_wrong_password(self):
        """Test login with wrong password."""
        data = {
            "email": "test@example.com",
            "password": "WrongPass123"
        }
        response = self.client.post(self.login_url, data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_nonexistent_user(self):
        """Test login with nonexistent user."""
        data = {
            "email": "nonexistent@example.com",
            "password": "TestPass123"
        }
        response = self.client.post(self.login_url, data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LogoutViewTestCase(TestCase):
    """Test cases for logout view."""

    def setUp(self):
        self.client = APIClient()
        self.logout_url = reverse("users:logout")
        self.user = User.objects.create_user(
            email="test@example.com",
            password="TestPass123"
        )

    def test_logout_success(self):
        """Test successful logout."""
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.logout_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Logout successful")

    def test_logout_unauthenticated(self):
        """Test logout without authentication."""
        response = self.client.post(self.logout_url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
