from django.contrib import admin
from django.urls import path, include

from rest_framework_simplejwt.views import TokenRefreshView

from accounts.views import EmailOrUsernameTokenView

urlpatterns = [

    path("admin/", admin.site.urls),

    path("api/token/", EmailOrUsernameTokenView.as_view()),
    path("api/token/refresh/", TokenRefreshView.as_view()),

    path("api/accounts/", include("accounts.urls")),
    path("api/patients/", include("patients.urls")),
    path("api/doctors/", include("doctors.urls")),
    path("api/appointments/", include("appointments.urls")),
    path("api/reviews/", include("reviews.urls")),
    path("api/notifications/", include("notifications.urls")),

]