from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import User
from .validators import validate_password_strength


class UserSignUpSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""

    password = serializers.CharField(write_only=True, style={"input_type": "password"})

    class Meta:
        model = User
        fields = ["id", "email", "password"]
        read_only_fields = ["id"]

    def validate_password(self, value):
        """Validate password strength."""
        validate_password_strength(value)
        return value

    def create(self, validated_data):
        """Create a new user with encrypted password."""
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"]
        )
        return user


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login."""

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={"input_type": "password"})

    def validate(self, data):
        """Validate user credentials."""
        email = data.get("email")
        password = data.get("password")

        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError("Invalid email or password.")
            if not user.is_active:
                raise serializers.ValidationError("User account is disabled.")
        else:
            raise serializers.ValidationError("Must include email and password.")

        data["user"] = user
        return data


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user data."""

    class Meta:
        model = User
        fields = ["id", "email", "created_at", "updated_at"]
        read_only_fields = ["id", "email", "created_at", "updated_at"]
