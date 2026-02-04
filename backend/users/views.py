"""
Views for the users app authentication endpoints.
"""
import logging
from django.contrib.auth import login, logout
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .serializers import SignUpSerializer, LoginSerializer, UserSerializer

logger = logging.getLogger(__name__)


@api_view(["POST"])
@permission_classes([AllowAny])
def signup_view(request):
    """
    Handle user registration.
    POST /auth/signup/
    """
    serializer = SignUpSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        # Automatically log in the user after successful registration
        login(request, user)
        logger.info(f"New user registered: {user.email}")
        
        return Response(
            {
                "message": "User created successfully",
                "user": UserSerializer(user).data
            },
            status=status.HTTP_201_CREATED
        )
    
    logger.warning(f"Signup failed: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    """
    Handle user login.
    POST /auth/login/
    """
    serializer = LoginSerializer(data=request.data, context={"request": request})
    
    if serializer.is_valid():
        user = serializer.validated_data["user"]
        login(request, user)
        logger.info(f"User logged in: {user.email}")
        
        return Response(
            {
                "message": "Login successful",
                "user": UserSerializer(user).data
            },
            status=status.HTTP_200_OK
        )
    
    logger.warning(f"Login failed: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    Handle user logout.
    POST /auth/logout/
    """
    user_email = request.user.email
    logout(request)
    logger.info(f"User logged out: {user_email}")
    
    return Response(
        {"message": "Logout successful"},
        status=status.HTTP_200_OK
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user_view(request):
    """
    Get current authenticated user details.
    GET /auth/me/
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)
