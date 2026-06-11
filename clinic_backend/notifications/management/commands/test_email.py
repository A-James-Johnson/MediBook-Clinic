from django.conf import settings
from django.core.management.base import BaseCommand
from django.core.mail import send_mail


class Command(BaseCommand):
    help = "Send a test email to verify SMTP settings"

    def add_arguments(self, parser):
        parser.add_argument(
            "recipient",
            nargs="?",
            default=settings.EMAIL_HOST_USER,
            help="Email address to send the test to (defaults to EMAIL_HOST_USER)",
        )

    def handle(self, *args, **options):
        recipient = options["recipient"]

        self.stdout.write(f"Backend:  {settings.EMAIL_BACKEND}")
        self.stdout.write(f"Host:     {settings.EMAIL_HOST}:{settings.EMAIL_PORT}")
        self.stdout.write(f"From:     {settings.DEFAULT_FROM_EMAIL}")
        self.stdout.write(f"Sending test email to: {recipient}")

        try:
            send_mail(
                subject="MediBook Clinic - Email Test",
                message=(
                    "If you received this, your SMTP settings are working correctly."
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[recipient],
                fail_silently=False,
            )
            self.stdout.write(self.style.SUCCESS(f"Test email sent to {recipient}"))
            self.stdout.write("Check your inbox and spam folder.")
        except Exception as exc:
            self.stdout.write(self.style.ERROR(f"Failed: {exc}"))
            self.stdout.write(
                "Tips: use a Gmail App Password (not your login password), "
                "remove spaces from the app password, and restart runserver after .env changes."
            )
