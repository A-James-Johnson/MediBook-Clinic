from django.db import models
from patients.models import Patient
from doctors.models import Doctor


class Appointment(models.Model):

    STATUS_CHOICES = (
        ("PENDING", "Pending"),
        ("CONFIRMED", "Confirmed"),
        ("CANCELLED", "Cancelled"),
        ("COMPLETED", "Completed"),
    )

    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE
    )

    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.CASCADE
    )

    appointment_date = models.DateField()

    start_time = models.TimeField()

    end_time = models.TimeField()

    reason = models.TextField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    reminder_sent = models.BooleanField(
        default=False
    )

    class Meta:
        db_table = "appointments"