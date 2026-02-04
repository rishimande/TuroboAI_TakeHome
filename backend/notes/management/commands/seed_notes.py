"""
Management command to seed sample notes for testing.
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from notes.models import Note
from categories.models import Category

User = get_user_model()


class Command(BaseCommand):
    """Seed sample notes into the database for testing."""
    
    help = "Seeds sample notes for a given user (creates test user if needed)"
    
    def add_arguments(self, parser):
        """Add command arguments."""
        parser.add_argument(
            "--email",
            type=str,
            default="test@example.com",
            help="Email of the user to create notes for (default: test@example.com)"
        )
        parser.add_argument(
            "--password",
            type=str,
            default="TestPass123",
            help="Password for the test user if it needs to be created"
        )
    
    def handle(self, *args, **options):
        """Execute the command."""
        
        email = options["email"]
        password = options["password"]
        
        # Get or create user
        user, user_created = User.objects.get_or_create(
            email=email,
            defaults={"password": password}
        )
        
        if user_created:
            user.set_password(password)
            user.save()
            self.stdout.write(
                self.style.SUCCESS(f"Created test user: {email}")
            )
        else:
            self.stdout.write(
                self.style.WARNING(f"Using existing user: {email}")
            )
        
        # Get categories
        try:
            random_thoughts = Category.objects.get(name="Random Thoughts")
            school = Category.objects.get(name="School")
            personal = Category.objects.get(name="Personal")
        except Category.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(
                    "Categories not found. Please run 'python manage.py seed_categories' first."
                )
            )
            return
        
        # Sample notes data
        now = timezone.now()
        sample_notes = [
            {
                "title": "Meeting Notes",
                "content": "Discussed project timeline and deliverables. Key points:\n- Launch date: End of Q2\n- Need to finalize design mockups\n- Schedule follow-up meeting next week",
                "category": random_thoughts,
                "hours_ago": 2,
            },
            {
                "title": "Weekend Plans",
                "content": "Things to do this weekend:\n1. Grocery shopping\n2. Finish reading that book\n3. Call mom\n4. Work on side project",
                "category": personal,
                "hours_ago": 5,
            },
            {
                "title": "Math Homework - Chapter 5",
                "content": "Problems to solve:\n- Page 142: Problems 1-15\n- Page 145: Word problems 1-5\n- Review examples from lecture\n\nDue: Friday",
                "category": school,
                "hours_ago": 24,
            },
            {
                "title": "Book Ideas",
                "content": "Random story ideas that came to mind:\n- A world where colors have disappeared\n- Time traveler stuck in a loop\n- AI that writes poetry\n\nNeed to develop these more...",
                "category": random_thoughts,
                "hours_ago": 48,
            },
            {
                "title": "Lecture Notes - Physics",
                "content": "Newton's Laws of Motion:\n1. Law of Inertia\n2. F = ma\n3. Action-Reaction\n\nImportant formulas:\n- Velocity: v = u + at\n- Distance: s = ut + 1/2at²",
                "category": school,
                "hours_ago": 72,
            },
            {
                "title": "Gift Ideas",
                "content": "Birthday gift ideas for Sarah:\n- That book series she mentioned\n- Art supplies\n- Coffee subscription\n- Concert tickets\n\nBudget: $50-75",
                "category": personal,
                "hours_ago": 96,
            },
            {
                "title": "App Feature Ideas",
                "content": "Cool features to add:\n- Dark mode\n- Search functionality\n- Tags in addition to categories\n- Export notes as PDF\n- Mobile app version",
                "category": random_thoughts,
                "hours_ago": 120,
            },
            {
                "title": "Study Schedule",
                "content": "Final exams prep schedule:\n\nMonday: Math & Physics\nTuesday: Chemistry\nWednesday: History & English\nThursday: Review day\nFriday: Mock tests\n\nStart at 9 AM each day!",
                "category": school,
                "hours_ago": 144,
            },
            {
                "title": "Health Goals",
                "content": "2026 wellness goals:\n- Exercise 3x per week\n- Drink more water\n- Sleep 8 hours\n- Meditate daily (even if just 5 min)\n- Cook more meals at home",
                "category": personal,
                "hours_ago": 168,
            },
            {
                "title": "Recipe to Try",
                "content": "Thai Green Curry Recipe:\n\nIngredients:\n- Green curry paste\n- Coconut milk\n- Vegetables (bell peppers, bamboo shoots)\n- Tofu or chicken\n- Thai basil\n- Fish sauce\n\nServe with jasmine rice. Looks delicious!",
                "category": personal,
                "hours_ago": 192,
            },
        ]
        
        created_count = 0
        
        for note_data in sample_notes:
            # Calculate the timestamp
            last_edited = now - timedelta(hours=note_data["hours_ago"])
            
            # Check if similar note exists (by title and user)
            existing_note = Note.objects.filter(
                user=user,
                title=note_data["title"]
            ).first()
            
            if existing_note:
                self.stdout.write(
                    self.style.WARNING(f"Note already exists: {note_data['title']}")
                )
                continue
            
            # Create the note
            note = Note.objects.create(
                user=user,
                category=note_data["category"],
                title=note_data["title"],
                content=note_data["content"],
            )
            
            # Update timestamps manually to reflect different creation times
            Note.objects.filter(pk=note.pk).update(
                created_at=last_edited,
                updated_at=last_edited,
                last_edited_at=last_edited
            )
            
            created_count += 1
            self.stdout.write(
                self.style.SUCCESS(
                    f"Created note: {note.title} ({note.category.name})"
                )
            )
        
        self.stdout.write(
            self.style.SUCCESS(
                f"\nSeeding complete! Created {created_count} sample notes for {email}"
            )
        )
