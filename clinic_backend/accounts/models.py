from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):

    class AuthProvider(models.TextChoices):
        PASSWORD = "PASSWORD", "Password"
        GOOGLE = "GOOGLE", "Google"

    ROLE_CHOICES = (
        ("PATIENT", "Patient"),
        ("DOCTOR", "Doctor"),
        ("ADMIN", "Admin"),
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES
    )

    phone_number = models.CharField(
        max_length=15,
        blank=True,
        default="",
    )

    auth_provider = models.CharField(
        max_length=20,
        choices=AuthProvider.choices,
        default=AuthProvider.PASSWORD,
    )

    google_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        unique=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        db_table = "users"
