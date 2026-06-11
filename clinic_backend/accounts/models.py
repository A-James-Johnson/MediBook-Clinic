from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.validators import UnicodeUsernameValidator


class User(AbstractUser):
    username = models.CharField(
        max_length=150,
        unique=False,
        validators=[UnicodeUsernameValidator()],
        help_text="Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.",
        verbose_name="username",
    )
    email = models.EmailField(unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

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
