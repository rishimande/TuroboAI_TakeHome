from django.urls import path

from .views import (
    category_list_view,
    note_create_view,
    note_detail_view,
    note_list_view,
    note_update_view,
)

app_name = "notes"

urlpatterns = [
    path("categories/", category_list_view, name="category-list"),
    path("notes/", note_list_view, name="note-list"),
    path("notes/create/", note_create_view, name="note-create"),
    path("notes/<uuid:note_id>/", note_detail_view, name="note-detail"),
    path("notes/<uuid:note_id>/update/", note_update_view, name="note-update"),
]
