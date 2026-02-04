import re
from django.core.exceptions import ValidationError


def validate_password_strength(password):
    """
    Validate password strength according to requirements:
    - At least one capital letter
    - At least one lowercase letter
    - At least one number
    """
    if not re.search(r"[A-Z]", password):
        raise ValidationError("Password must contain at least one capital letter.")
    if not re.search(r"[a-z]", password):
        raise ValidationError("Password must contain at least one lowercase letter.")
    if not re.search(r"\d", password):
        raise ValidationError("Password must contain at least one number.")
