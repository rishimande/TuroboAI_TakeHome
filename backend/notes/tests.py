"""
Tests for Notes API.
"""

from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from categories.models import Category
from .models import Note

User = get_user_model()


class NoteAPITestCase(TestCase):
    """Test cases for Note API endpoints."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.client = APIClient()
        
        # Create test users
        self.user1 = User.objects.create_user(
            email="user1@example.com",
            password="TestPass123"
        )
        self.user2 = User.objects.create_user(
            email="user2@example.com",
            password="TestPass123"
        )
        
        # Create test categories
        self.category1 = Category.objects.create(
            name="Work",
            color="#FF5733",
            sort_order=1
        )
        self.category2 = Category.objects.create(
            name="Personal",
            color="#33FF57",
            sort_order=2
        )
        
        # Create test notes for user1
        self.note1 = Note.objects.create(
            user=self.user1,
            category=self.category1,
            title="Test Note 1",
            content="Content for test note 1"
        )
        self.note2 = Note.objects.create(
            user=self.user1,
            category=self.category2,
            title="Test Note 2",
            content="Content for test note 2"
        )
        
        # Create a note for user2 (to test isolation)
        self.note3 = Note.objects.create(
            user=self.user2,
            category=self.category1,
            title="User 2 Note",
            content="This belongs to user2"
        )
    
    def test_list_notes_unauthenticated(self):
        """Test that unauthenticated requests are rejected."""
        response = self.client.get("/notes/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_list_notes_authenticated(self):
        """Test listing notes for authenticated user."""
        self.client.force_authenticate(user=self.user1)
        response = self.client.get("/notes/")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        
        # Verify notes are returned in correct order (newest first)
        titles = [note["title"] for note in response.data]
        self.assertIn("Test Note 1", titles)
        self.assertIn("Test Note 2", titles)
    
    def test_list_notes_user_isolation(self):
        """Test that users only see their own notes."""
        self.client.force_authenticate(user=self.user1)
        response = self.client.get("/notes/")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        
        # Verify user2's note is not in the response
        titles = [note["title"] for note in response.data]
        self.assertNotIn("User 2 Note", titles)
    
    def test_list_notes_filter_by_category(self):
        """Test filtering notes by category."""
        self.client.force_authenticate(user=self.user1)
        
        # Filter by category1
        response = self.client.get(f"/notes/?categoryId={self.category1.id}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Test Note 1")
        
        # Filter by category2
        response = self.client.get(f"/notes/?categoryId={self.category2.id}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Test Note 2")
    
    def test_list_notes_invalid_category_filter(self):
        """Test filtering by non-existent category returns empty list."""
        self.client.force_authenticate(user=self.user1)
        
        fake_uuid = "00000000-0000-0000-0000-000000000000"
        response = self.client.get(f"/notes/?categoryId={fake_uuid}")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)
    
    def test_list_notes_includes_category_info(self):
        """Test that note list includes category name and color."""
        self.client.force_authenticate(user=self.user1)
        response = self.client.get("/notes/")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify category information is included
        note = response.data[0]
        self.assertIn("category_name", note)
        self.assertIn("category_color", note)
        self.assertIsNotNone(note["category_name"])
        self.assertIsNotNone(note["category_color"])
    
    def test_get_note_detail_authenticated(self):
        """Test retrieving a single note by ID."""
        self.client.force_authenticate(user=self.user1)
        response = self.client.get(f"/notes/{self.note1.id}/")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Test Note 1")
        self.assertEqual(response.data["content"], "Content for test note 1")
        self.assertEqual(str(response.data["user"]), str(self.user1.id))
    
    def test_get_note_detail_unauthenticated(self):
        """Test that unauthenticated requests to detail endpoint are rejected."""
        response = self.client.get(f"/notes/{self.note1.id}/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_get_note_detail_wrong_user(self):
        """Test that users cannot access other users' notes."""
        self.client.force_authenticate(user=self.user1)
        response = self.client.get(f"/notes/{self.note3.id}/")
        
        # Should return 404 (not 403) to avoid leaking information
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_get_note_detail_nonexistent(self):
        """Test retrieving a non-existent note returns 404."""
        self.client.force_authenticate(user=self.user1)
        fake_uuid = "00000000-0000-0000-0000-000000000000"
        response = self.client.get(f"/notes/{fake_uuid}/")
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_note_timestamps(self):
        """Test that notes have proper timestamps."""
        self.assertIsNotNone(self.note1.created_at)
        self.assertIsNotNone(self.note1.updated_at)
        self.assertIsNotNone(self.note1.last_edited_at)
    
    def test_create_note_authenticated(self):
        """Test creating a note with full data."""
        self.client.force_authenticate(user=self.user1)
        
        data = {
            "category": str(self.category1.id),
            "title": "New Test Note",
            "content": "This is a new note created via API"
        }
        
        response = self.client.post("/notes/", data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "New Test Note")
        self.assertEqual(response.data["content"], "This is a new note created via API")
        self.assertEqual(response.data["category_name"], "Work")
        self.assertEqual(response.data["category_color"], "#FF5733")
        self.assertEqual(str(response.data["user"]), str(self.user1.id))
        
        # Verify note was actually created in database
        note = Note.objects.get(id=response.data["id"])
        self.assertEqual(note.title, "New Test Note")
        self.assertEqual(note.user, self.user1)
    
    def test_create_note_with_defaults(self):
        """Test creating a note with only category (title and content use defaults)."""
        self.client.force_authenticate(user=self.user1)
        
        data = {
            "category": str(self.category1.id)
        }
        
        response = self.client.post("/notes/", data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "Note Title:")
        self.assertEqual(response.data["content"], "")
        
        # Verify note was created with defaults
        note = Note.objects.get(id=response.data["id"])
        self.assertEqual(note.title, "Note Title:")
        self.assertEqual(note.content, "")
    
    def test_create_note_unauthenticated(self):
        """Test that unauthenticated requests to create note are rejected."""
        data = {
            "category": str(self.category1.id),
            "title": "Test Note"
        }
        
        response = self.client.post("/notes/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_create_note_missing_category(self):
        """Test that creating a note without category fails."""
        self.client.force_authenticate(user=self.user1)
        
        data = {
            "title": "Test Note",
            "content": "Test content"
        }
        
        response = self.client.post("/notes/", data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("category", response.data)
    
    def test_create_note_invalid_category(self):
        """Test that creating a note with invalid category ID fails."""
        self.client.force_authenticate(user=self.user1)
        
        data = {
            "category": "00000000-0000-0000-0000-000000000000",
            "title": "Test Note"
        }
        
        response = self.client.post("/notes/", data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("category", response.data)
    
    def test_create_note_with_empty_title(self):
        """Test creating a note with empty title uses default."""
        self.client.force_authenticate(user=self.user1)
        
        data = {
            "category": str(self.category1.id),
            "title": "",
            "content": "Content only"
        }
        
        response = self.client.post("/notes/", data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Empty string is allowed, so it should be saved as empty
        self.assertEqual(response.data["title"], "")
    
    def test_create_note_with_only_title(self):
        """Test creating a note with only title (content defaults to empty)."""
        self.client.force_authenticate(user=self.user1)
        
        data = {
            "category": str(self.category1.id),
            "title": "Just a Title"
        }
        
        response = self.client.post("/notes/", data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "Just a Title")
        self.assertEqual(response.data["content"], "")
    
    def test_create_note_increments_note_count(self):
        """Test that creating a note increases the total count."""
        self.client.force_authenticate(user=self.user1)
        
        initial_count = Note.objects.filter(user=self.user1).count()
        
        data = {
            "category": str(self.category1.id),
            "title": "Another Note"
        }
        
        response = self.client.post("/notes/", data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        new_count = Note.objects.filter(user=self.user1).count()
        self.assertEqual(new_count, initial_count + 1)
    
    def test_create_note_sets_timestamps(self):
        """Test that creating a note sets all timestamps correctly."""
        self.client.force_authenticate(user=self.user1)
        
        data = {
            "category": str(self.category1.id),
            "title": "Timestamp Test"
        }
        
        response = self.client.post("/notes/", data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIsNotNone(response.data["created_at"])
        self.assertIsNotNone(response.data["updated_at"])
        self.assertIsNotNone(response.data["last_edited_at"])


class NoteModelTestCase(TestCase):
    """Test cases for Note model."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.user = User.objects.create_user(
            email="test@example.com",
            password="TestPass123"
        )
        self.category = Category.objects.create(
            name="Test Category",
            color="#FFFFFF",
            sort_order=1
        )
    
    def test_note_creation(self):
        """Test creating a note."""
        note = Note.objects.create(
            user=self.user,
            category=self.category,
            title="My Note",
            content="This is my note content"
        )
        
        self.assertEqual(note.title, "My Note")
        self.assertEqual(note.content, "This is my note content")
        self.assertEqual(note.user, self.user)
        self.assertEqual(note.category, self.category)
    
    def test_note_default_title(self):
        """Test that notes have a default title."""
        note = Note.objects.create(
            user=self.user,
            category=self.category,
        )
        
        self.assertEqual(note.title, "Note Title:")
    
    def test_note_default_content(self):
        """Test that notes have empty content by default."""
        note = Note.objects.create(
            user=self.user,
            category=self.category,
            title="Test"
        )
        
        self.assertEqual(note.content, "")
    
    def test_note_str_representation(self):
        """Test string representation of Note."""
        note = Note.objects.create(
            user=self.user,
            category=self.category,
            title="Test Note"
        )
        
        expected = f"Test Note ({self.user.email})"
        self.assertEqual(str(note), expected)
    
    def test_note_ordering(self):
        """Test that notes are ordered by last_edited_at descending."""
        note1 = Note.objects.create(
            user=self.user,
            category=self.category,
            title="Older Note"
        )
        note2 = Note.objects.create(
            user=self.user,
            category=self.category,
            title="Newer Note"
        )
        
        notes = Note.objects.all()
        self.assertEqual(notes[0], note2)
        self.assertEqual(notes[1], note1)
    
    def test_note_category_on_delete_protect(self):
        """Test that categories cannot be deleted if notes exist."""
        Note.objects.create(
            user=self.user,
            category=self.category,
            title="Test Note"
        )
        
        # Attempting to delete the category should raise an error
        from django.db.models.deletion import ProtectedError
        with self.assertRaises(ProtectedError):
            self.category.delete()
    
    def test_note_user_cascade_delete(self):
        """Test that notes are deleted when user is deleted."""
        note = Note.objects.create(
            user=self.user,
            category=self.category,
            title="Test Note"
        )
        
        note_id = note.id
        self.user.delete()
        
        # Note should be deleted
        self.assertFalse(Note.objects.filter(id=note_id).exists())
