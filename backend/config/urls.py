"""
URL Configuration for notes app backend.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/", include("users.urls")),
    path("categories/", include("categories.urls")),
    path("notes/", include("notes.urls")),
]
