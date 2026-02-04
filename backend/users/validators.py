"""
Custom password validators for the users app.
"""
import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _


class CustomPasswordValidator:
    """
    Validates that the password contains:
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one number
    """

    def validate(self, password, user=None):
        if not re.search(r"[A-Z]", password):
            raise ValidationError(
                _("The password must contain at least one uppercase letter."),
                code="password_no_upper",
            )
        if not re.search(r"[a-z]", password):
            raise ValidationError(
                _("The password must contain at least one lowercase letter."),
                code="password_no_lower",
            )
        if not re.search(r"[0-9]", password):
            raise ValidationError(
                _("The password must contain at least one number."),
                code="password_no_digit",
            )

    def get_help_text(self):
        return _(
            "Your password must contain at least one uppercase letter, "
            "one lowercase letter, and one number."
        )
