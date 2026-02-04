"""
App configuration for notes.
"""

from django.apps import AppConfig


class NotesConfig(AppConfig):
    """Configuration for notes app."""
    
    default_auto_field = "django.db.models.BigAutoField"
    name = "notes"
    verbose_name = "Notes"
