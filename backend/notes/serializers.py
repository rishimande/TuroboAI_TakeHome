from rest_framework import serializers

from .models import Category, Note


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model."""

    note_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "color", "sort_order", "note_count"]
        read_only_fields = ["id"]

    def get_note_count(self, obj):
        """Get the count of notes in this category for the current user."""
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return obj.notes.filter(user=request.user).count()
        return 0


class NoteListSerializer(serializers.ModelSerializer):
    """Serializer for Note list view (preview only)."""

    category_name = serializers.CharField(source="category.name", read_only=True)
    category_color = serializers.CharField(source="category.color", read_only=True)

    class Meta:
        model = Note
        fields = [
            "id",
            "title",
            "content",
            "category",
            "category_name",
            "category_color",
            "created_at",
            "last_edited_at",
        ]
        read_only_fields = ["id", "created_at", "last_edited_at"]


class NoteDetailSerializer(serializers.ModelSerializer):
    """Serializer for Note detail view (full content)."""

    category_name = serializers.CharField(source="category.name", read_only=True)
    category_color = serializers.CharField(source="category.color", read_only=True)

    class Meta:
        model = Note
        fields = [
            "id",
            "title",
            "content",
            "category",
            "category_name",
            "category_color",
            "created_at",
            "updated_at",
            "last_edited_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "last_edited_at"]

    def create(self, validated_data):
        """Create a new note with the current user."""
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)
