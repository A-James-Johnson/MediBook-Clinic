from django.urls import path

from .views import AppointmentView
from .views import AppointmentDetailView


urlpatterns = [

    path("", AppointmentView.as_view(), name="appointment-list-create"),

    path("<int:appointment_id>/", AppointmentDetailView.as_view(), name="appointment-detail"),

]