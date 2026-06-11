from django.db import models
from accounts.models import User


class Notification(models.Model):

    TYPE_CHOICES = (
        ("BOOKING", "Booking"),
        ("STATUS_UPDATE", "Status Update"),
        ("CANCELLATION", "Cancellation"),
        ("REMINDER", "Reminder"),
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    title = models.CharField(
        max_length=100
    )

    message = models.TextField()

    notification_type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        default="BOOKING",
    )

    is_read = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        db_table = "notifications"