from django.db import models
from accounts.models import User


class Patient(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )

    date_of_birth = models.DateField()

    gender = models.CharField(
        max_length=20
    )

    address = models.TextField()

    blood_group = models.CharField(
        max_length=10
    )

    allergies = models.TextField(
        blank=True
    )

    class Meta:
        db_table = "patients"