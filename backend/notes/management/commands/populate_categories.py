from django.core.management.base import BaseCommand
from notes.models import Category


class Command(BaseCommand):
    """Management command to populate default categories."""

    help = "Populate default categories for the notes app"

    def handle(self, *args, **kwargs):
        """Create default categories."""
        default_categories = [
            {"name": "Random Thoughts", "color": "#78aba8", "sort_order": 1},
            {"name": "School", "color": "#a8a378", "sort_order": 2},
            {"name": "Personal", "color": "#a878ab", "sort_order": 3},
        ]

        for category_data in default_categories:
            category, created = Category.objects.get_or_create(
                name=category_data["name"],
                defaults={
                    "color": category_data["color"],
                    "sort_order": category_data["sort_order"],
                }
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f"Created category: {category.name}")
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f"Category already exists: {category.name}")
                )

        self.stdout.write(self.style.SUCCESS("Successfully populated categories"))
