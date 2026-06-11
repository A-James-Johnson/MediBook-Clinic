from django.contrib import admin

from .models import Doctor
from .models import DoctorAvailability

admin.site.register(Doctor)
admin.site.register(DoctorAvailability)