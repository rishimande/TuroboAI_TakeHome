"""
API views for Category management.
"""

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Category
from .serializers import CategorySerializer


class CategoryListView(generics.ListAPIView):
    """
    GET /categories
    Returns list of all categories ordered by sort_order.
    """
    
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
