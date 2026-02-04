import uuid
from django.conf import settings
from django.db import models


class Category(models.Model):
    """Category model for organizing notes."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    color = models.CharField(max_length=7, help_text="Hex color code (e.g., #78aba8)")
    sort_order = models.IntegerField(default=0)

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        ordering = ["sort_order", "name"]

    def __str__(self):
        return self.name


class Note(models.Model):
    """Note model for storing user notes."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notes"
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="notes"
    )
    title = models.CharField(max_length=500, default="Note Title:")
    content = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_edited_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Note"
        verbose_name_plural = "Notes"
        ordering = ["-last_edited_at"]
        indexes = [
            models.Index(fields=["user", "-last_edited_at"]),
            models.Index(fields=["category", "-last_edited_at"]),
        ]

    def __str__(self):
        return f"{self.title} ({self.user.email})"
