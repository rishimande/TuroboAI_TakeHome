"""
API views for Notes.
"""

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Note
from .serializers import NoteListSerializer, NoteSerializer


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def note_list(request):
    """
    List all notes for the authenticated user, with optional category filtering.
    Or create a new note.
    
    GET:
        Query Parameters:
            categoryId (uuid, optional): Filter notes by category ID
        
        Returns:
            200: List of notes (using lightweight serializer for preview)
    
    POST:
        Request Body:
            category (uuid, required): Category ID for the note
            title (string, optional): Note title (defaults to "Note Title:")
            content (string, optional): Note content (defaults to empty string)
        
        Returns:
            201: Created note with full details
            400: Validation errors
    """
    if request.method == "POST":
        serializer = NoteSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            note = serializer.save()
            return Response(NoteSerializer(note).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # GET request
    notes = Note.objects.filter(user=request.user).select_related("category")
    
    # Filter by category if categoryId is provided
    category_id = request.query_params.get("categoryId")
    if category_id:
        notes = notes.filter(category_id=category_id)
    
    serializer = NoteListSerializer(notes, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def note_detail(request, pk):
    """
    Retrieve a single note by ID.
    
    Args:
        pk (uuid): Note ID
    
    Returns:
        200: Full note details
        404: Note not found
    """
    note = get_object_or_404(Note, pk=pk, user=request.user)
    serializer = NoteSerializer(note)
    return Response(serializer.data)
