from django.db import models
from accounts.models import User


class Doctor(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )

    employee_id = models.CharField(
        max_length=30,
        unique=True
    )

    qualification = models.CharField(
        max_length=100
    )

    specialization = models.CharField(
        max_length=100
    )

    experience_years = models.IntegerField()

    consultation_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    bio = models.TextField()

    class Meta:
        db_table = "doctors"

class DoctorAvailability(models.Model):

    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.CASCADE
    )

    day_of_week = models.CharField(
        max_length=20
    )

    start_time = models.TimeField()

    end_time = models.TimeField()

    is_available = models.BooleanField(
        default=True
    )

    class Meta:
        db_table = "doctor_availability"