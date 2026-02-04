"""
Admin configuration for Category model.
"""

from django.contrib import admin
from .models import Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Admin interface for Category model."""
    
    list_display = ["name", "color", "sort_order", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["name"]
    ordering = ["sort_order", "name"]
    readonly_fields = ["id", "created_at", "updated_at"]
