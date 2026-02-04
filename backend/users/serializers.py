"""
Serializers for the users app.
"""
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import User


class SignUpSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""

    password = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"}
    )

    class Meta:
        model = User
        fields = ["id", "email", "password", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_email(self, value):
        """Validate email format and uniqueness."""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value.lower()

    def validate_password(self, value):
        """Validate password using Django's password validators."""
        validate_password(value)
        return value

    def create(self, validated_data):
        """Create a new user with encrypted password."""
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"]
        )
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""

    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"}
    )

    def validate(self, attrs):
        """Validate credentials and authenticate user."""
        email = attrs.get("email").lower()
        password = attrs.get("password")

        if email and password:
            user = authenticate(
                request=self.context.get("request"),
                username=email,
                password=password
            )
            if not user:
                raise serializers.ValidationError(
                    "Unable to log in with provided credentials.",
                    code="authorization"
                )
            if not user.is_active:
                raise serializers.ValidationError(
                    "User account is disabled.",
                    code="authorization"
                )
        else:
            raise serializers.ValidationError(
                "Must include 'email' and 'password'.",
                code="authorization"
            )

        attrs["user"] = user
        return attrs


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user details."""

    class Meta:
        model = User
        fields = ["id", "email", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]
