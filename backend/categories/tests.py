"""
Tests for categories app.
"""

from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User
from .models import Category


class CategoryModelTest(TestCase):
    """Test Category model."""
    
    def test_create_category(self):
        """Test creating a category."""
        category = Category.objects.create(
            name="Test Category",
            color="#FF5733",
            sort_order=1
        )
        self.assertEqual(str(category), "Test Category")
        self.assertEqual(category.color, "#FF5733")
        self.assertEqual(category.sort_order, 1)
    
    def test_category_ordering(self):
        """Test categories are ordered by sort_order."""
        Category.objects.create(name="Third", color="#000000", sort_order=3)
        Category.objects.create(name="First", color="#111111", sort_order=1)
        Category.objects.create(name="Second", color="#222222", sort_order=2)
        
        categories = Category.objects.all()
        self.assertEqual(categories[0].name, "First")
        self.assertEqual(categories[1].name, "Second")
        self.assertEqual(categories[2].name, "Third")
    
    def test_category_unique_name(self):
        """Test category name must be unique."""
        Category.objects.create(name="Unique", color="#FF5733", sort_order=1)
        
        with self.assertRaises(Exception):
            Category.objects.create(name="Unique", color="#FF5733", sort_order=2)


class CategoryAPITest(TestCase):
    """Test Category API endpoints."""
    
    def setUp(self):
        """Set up test client and create test user."""
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="test@example.com",
            password="TestPass123"
        )
        
        # Create test categories
        self.category1 = Category.objects.create(
            name="Random Thoughts",
            color="#FFA07A",
            sort_order=1
        )
        self.category2 = Category.objects.create(
            name="School",
            color="#87CEEB",
            sort_order=2
        )
        self.category3 = Category.objects.create(
            name="Personal",
            color="#98FB98",
            sort_order=3
        )
    
    def test_list_categories_authenticated(self):
        """Test authenticated user can list categories."""
        self.client.force_authenticate(user=self.user)
        
        url = reverse("category-list")
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)
        
        # Check ordering
        self.assertEqual(response.data[0]["name"], "Random Thoughts")
        self.assertEqual(response.data[1]["name"], "School")
        self.assertEqual(response.data[2]["name"], "Personal")
        
        # Check fields
        self.assertIn("id", response.data[0])
        self.assertIn("name", response.data[0])
        self.assertIn("color", response.data[0])
        self.assertIn("sort_order", response.data[0])
        self.assertIn("created_at", response.data[0])
        self.assertIn("updated_at", response.data[0])
    
    def test_list_categories_unauthenticated(self):
        """Test unauthenticated user cannot list categories."""
        url = reverse("category-list")
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_category_color_format(self):
        """Test category returns correct color format."""
        self.client.force_authenticate(user=self.user)
        
        url = reverse("category-list")
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        for category in response.data:
            # Check color is a string starting with #
            self.assertTrue(category["color"].startswith("#"))
            self.assertIsInstance(category["color"], str)


class SeedCategoriesCommandTest(TestCase):
    """Test seed_categories management command."""
    
    def test_seed_categories_creates_defaults(self):
        """Test seeding creates default categories."""
        from django.core.management import call_command
        
        # Ensure no categories exist
        self.assertEqual(Category.objects.count(), 0)
        
        # Run seed command
        call_command("seed_categories")
        
        # Check categories were created
        self.assertEqual(Category.objects.count(), 3)
        
        # Check specific categories
        random_thoughts = Category.objects.get(name="Random Thoughts")
        self.assertEqual(random_thoughts.color, "#FFA07A")
        self.assertEqual(random_thoughts.sort_order, 1)
        
        school = Category.objects.get(name="School")
        self.assertEqual(school.color, "#87CEEB")
        self.assertEqual(school.sort_order, 2)
        
        personal = Category.objects.get(name="Personal")
        self.assertEqual(personal.color, "#98FB98")
        self.assertEqual(personal.sort_order, 3)
    
    def test_seed_categories_idempotent(self):
        """Test seeding is idempotent (can run multiple times)."""
        from django.core.management import call_command
        
        # Run seed command twice
        call_command("seed_categories")
        call_command("seed_categories")
        
        # Should still only have 3 categories
        self.assertEqual(Category.objects.count(), 3)
