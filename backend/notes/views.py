from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Category, Note
from .serializers import CategorySerializer, NoteDetailSerializer, NoteListSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def category_list_view(request):
    """Get all categories with note counts for the current user."""
    categories = Category.objects.all()
    serializer = CategorySerializer(
        categories,
        many=True,
        context={"request": request}
    )
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def note_list_view(request):
    """
    Get all notes for the current user.
    Optional query parameter: categoryId to filter by category.
    """
    notes = Note.objects.filter(user=request.user)
    
    category_id = request.query_params.get("categoryId")
    if category_id:
        notes = notes.filter(category_id=category_id)
    
    serializer = NoteListSerializer(notes, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def note_detail_view(request, note_id):
    """Get full details of a specific note."""
    note = get_object_or_404(Note, id=note_id, user=request.user)
    serializer = NoteDetailSerializer(note)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def note_create_view(request):
    """Create a new note."""
    serializer = NoteDetailSerializer(
        data=request.data,
        context={"request": request}
    )
    if serializer.is_valid():
        note = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def note_update_view(request, note_id):
    """Update an existing note (partial update)."""
    note = get_object_or_404(Note, id=note_id, user=request.user)
    serializer = NoteDetailSerializer(
        note,
        data=request.data,
        partial=True,
        context={"request": request}
    )
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
