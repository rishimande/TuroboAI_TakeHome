"""
Category model for organizing notes.
"""

import uuid
from django.db import models


class Category(models.Model):
    """Category model for note organization."""
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    name = models.CharField(
        max_length=100,
        unique=True,
        help_text="Category name"
    )
    color = models.CharField(
        max_length=7,
        help_text="Hex color code (e.g., #FF5733)"
    )
    sort_order = models.IntegerField(
        default=0,
        help_text="Display order (lower values appear first)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ["sort_order", "name"]
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        indexes = [
            models.Index(fields=["sort_order"]),
        ]
    
    def __str__(self):
        return self.name
