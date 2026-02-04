"""
URL patterns for notes API.
"""

from django.urls import path
from . import views

urlpatterns = [
    path("", views.note_list, name="note-list"),
    path("<uuid:pk>/", views.note_detail, name="note-detail"),
]
