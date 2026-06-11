from django.urls import path

from .views import DoctorView
from .views import DoctorDetailView
from .views import DoctorAvailabilityView
from .views import DoctorAvailabilityDetailView


urlpatterns = [

    path("", DoctorView.as_view()),

    path("<int:doctor_id>/", DoctorDetailView.as_view()),

    path("availability/", DoctorAvailabilityView.as_view()),

    path("availability/<int:availability_id>/", DoctorAvailabilityDetailView.as_view()),

]