from django.contrib import admin

from .models import Category, Note


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Admin configuration for Category model."""

    list_display = ["name", "color", "sort_order"]
    list_editable = ["sort_order"]
    search_fields = ["name"]
    ordering = ["sort_order", "name"]


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    """Admin configuration for Note model."""

    list_display = ["title", "user", "category", "last_edited_at", "created_at"]
    list_filter = ["category", "created_at", "last_edited_at"]
    search_fields = ["title", "content", "user__email"]
    readonly_fields = ["created_at", "updated_at", "last_edited_at"]
    ordering = ["-last_edited_at"]

    fieldsets = (
        (None, {"fields": ("user", "category", "title", "content")}),
        ("Timestamps", {"fields": ("created_at", "updated_at", "last_edited_at")}),
    )
