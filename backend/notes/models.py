"""
Note model for storing user notes.
"""

import uuid
from django.db import models
from django.conf import settings


class Note(models.Model):
    """Note model with relationships to User and Category."""
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notes",
        help_text="Owner of the note"
    )
    category = models.ForeignKey(
        "categories.Category",
        on_delete=models.PROTECT,
        related_name="notes",
        help_text="Category this note belongs to"
    )
    title = models.CharField(
        max_length=500,
        default="Note Title:",
        blank=True,
        help_text="Note title"
    )
    content = models.TextField(
        blank=True,
        default="",
        help_text="Note content/body"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_edited_at = models.DateTimeField(
        auto_now=True,
        help_text="Last time the note was edited"
    )
    
    class Meta:
        ordering = ["-last_edited_at"]
        verbose_name = "Note"
        verbose_name_plural = "Notes"
        indexes = [
            models.Index(fields=["user", "-last_edited_at"]),
            models.Index(fields=["category"]),
            models.Index(fields=["-last_edited_at"]),
        ]
    
    def __str__(self):
        return f"{self.title} ({self.user.email})"
