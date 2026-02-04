from django.contrib.auth import login, logout
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .serializers import UserLoginSerializer, UserSerializer, UserSignUpSerializer


@api_view(["POST"])
@permission_classes([AllowAny])
@authentication_classes([])  # Disable authentication for this view
def signup_view(request):
    """Register a new user. CSRF exempt - applied in urls.py"""
    print(f"DEBUG: signup_view called")
    print(f"DEBUG: request.data = {request.data}")
    print(f"DEBUG: request.META['HTTP_ORIGIN'] = {request.META.get('HTTP_ORIGIN', 'None')}")
    
    serializer = UserSignUpSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        login(request, user)
        # Set CSRF token for subsequent authenticated requests
        get_token(request)
        user_data = UserSerializer(user).data
        return Response(user_data, status=status.HTTP_201_CREATED)
    
    print(f"DEBUG: Validation errors = {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
@authentication_classes([])  # Disable authentication for this view
def login_view(request):
    """Authenticate and log in a user. CSRF exempt - applied in urls.py"""
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data["user"]
        login(request, user)
        # Set CSRF token for subsequent authenticated requests
        get_token(request)
        user_data = UserSerializer(user).data
        return Response(user_data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Log out the current user."""
    logout(request)
    return Response(
        {"detail": "Successfully logged out."},
        status=status.HTTP_200_OK
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user_view(request):
    """Get the current authenticated user."""
    # Ensure CSRF token is set
    get_token(request)
    serializer = UserSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)


@ensure_csrf_cookie
@api_view(["GET"])
@permission_classes([AllowAny])
def csrf_token_view(request):
    """Get CSRF token - ensures cookie is set."""
    csrf_token = get_token(request)
    return Response({"csrfToken": csrf_token}, status=status.HTTP_200_OK)
