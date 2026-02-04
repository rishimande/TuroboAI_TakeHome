"""
Serializers for Note model.
"""

from rest_framework import serializers
from .models import Note


class NoteSerializer(serializers.ModelSerializer):
    """Serializer for Note model."""
    
    category_name = serializers.CharField(source="category.name", read_only=True)
    category_color = serializers.CharField(source="category.color", read_only=True)
    title = serializers.CharField(max_length=500, required=False, allow_blank=True)
    content = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = Note
        fields = [
            "id",
            "user",
            "category",
            "category_name",
            "category_color",
            "title",
            "content",
            "created_at",
            "updated_at",
            "last_edited_at",
        ]
        read_only_fields = ["id", "user", "created_at", "updated_at", "last_edited_at"]
    
    def create(self, validated_data):
        """Create a note with the authenticated user."""
        user = self.context["request"].user
        validated_data["user"] = user
        return super().create(validated_data)


class NoteListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing notes (preview mode)."""
    
    category_name = serializers.CharField(source="category.name", read_only=True)
    category_color = serializers.CharField(source="category.color", read_only=True)
    
    class Meta:
        model = Note
        fields = [
            "id",
            "category",
            "category_name",
            "category_color",
            "title",
            "content",
            "created_at",
            "last_edited_at",
        ]
