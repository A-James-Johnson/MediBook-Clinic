from django.core.management.base import BaseCommand

from notifications.services import send_appointment_reminders


class Command(BaseCommand):
    help = "Send reminder notifications for appointments in the next 24 hours"

    def handle(self, *args, **options):
        sent_count = send_appointment_reminders()
        self.stdout.write(
            self.style.SUCCESS(
                f"Sent reminders for {sent_count} appointment(s)."
            )
        )
