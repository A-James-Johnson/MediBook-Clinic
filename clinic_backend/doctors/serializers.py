from rest_framework import serializers

from .models import Doctor
from .models import DoctorAvailability


class DoctorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Doctor

        fields = "__all__"


class DoctorAvailabilitySerializer(serializers.ModelSerializer):

    class Meta:
        model = DoctorAvailability

        fields = "__all__"