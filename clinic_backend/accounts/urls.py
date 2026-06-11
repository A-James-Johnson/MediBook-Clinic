from django.urls import path

from .views import (
    EmailOrUsernameTokenView,
    PatientRegisterView,
    DoctorRegisterView,
    GoogleAuthView,
    MeView,
)


urlpatterns = [

    path("login/", EmailOrUsernameTokenView.as_view()),
    path("me/", MeView.as_view()),
    path("register/patient/", PatientRegisterView.as_view()),
    path("register/doctor/", DoctorRegisterView.as_view()),
    path("auth/google/", GoogleAuthView.as_view()),

]
