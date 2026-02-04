"""
Admin configuration for Note model.
"""

from django.contrib import admin
from .models import Note


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    """Admin interface for Note model."""
    
    list_display = ["title", "user", "category", "last_edited_at", "created_at"]
    list_filter = ["category", "created_at", "last_edited_at"]
    search_fields = ["title", "content", "user__email"]
    readonly_fields = ["id", "created_at", "updated_at", "last_edited_at"]
    ordering = ["-last_edited_at"]
    
    fieldsets = (
        ("Content", {
            "fields": ("title", "content")
        }),
        ("Relationships", {
            "fields": ("user", "category")
        }),
        ("Metadata", {
            "fields": ("id", "created_at", "updated_at", "last_edited_at"),
            "classes": ("collapse",)
        }),
    )
