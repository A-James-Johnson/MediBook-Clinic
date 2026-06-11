from django.urls import path

from .views import PatientView
from .views import PatientDetailView


urlpatterns = [

    path("", PatientView.as_view(), name="patient-list-create"),

    path("<int:patient_id>/", PatientDetailView.as_view(), name="patient-detail"),

]