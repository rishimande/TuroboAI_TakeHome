"""
Management command to seed default categories.
"""

from django.core.management.base import BaseCommand
from categories.models import Category


class Command(BaseCommand):
    """Seed default categories into the database."""
    
    help = "Seeds default categories (Random Thoughts, School, Personal)"
    
    def handle(self, *args, **options):
        """Execute the command."""
        
        default_categories = [
            {
                "name": "Random Thoughts",
                "color": "#FFA07A",  # Light Salmon
                "sort_order": 1
            },
            {
                "name": "School",
                "color": "#87CEEB",  # Sky Blue
                "sort_order": 2
            },
            {
                "name": "Personal",
                "color": "#98FB98",  # Pale Green
                "sort_order": 3
            },
        ]
        
        created_count = 0
        existing_count = 0
        
        for category_data in default_categories:
            category, created = Category.objects.get_or_create(
                name=category_data["name"],
                defaults={
                    "color": category_data["color"],
                    "sort_order": category_data["sort_order"]
                }
            )
            
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Created category: {category.name} ({category.color})"
                    )
                )
            else:
                existing_count += 1
                self.stdout.write(
                    self.style.WARNING(
                        f"Category already exists: {category.name}"
                    )
                )
        
        self.stdout.write(
            self.style.SUCCESS(
                f"\nSeeding complete! Created: {created_count}, Already existed: {existing_count}"
            )
        )
