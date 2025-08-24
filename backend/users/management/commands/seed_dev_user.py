from django.core.management.base import BaseCommand
import os

from users.models import User


class Command(BaseCommand):
    help = "Create a simple dev user (defaults: test@example.com / password)"

    def handle(self, *args, **options):
        email = os.environ.get("DEV_USER_EMAIL", "test@example.com")
        password = os.environ.get("DEV_USER_PASSWORD", "password")
        if User.objects.filter(email=email).exists():
            self.stdout.write(self.style.NOTICE(f"User {email} already exists"))
            return
        user = User.objects.create_user(email=email, password=password)
        self.stdout.write(self.style.SUCCESS(f"Created user {email} (id={user.id})"))
