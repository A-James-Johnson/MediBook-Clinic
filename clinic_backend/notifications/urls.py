from django.urls import path

from .views import (
    NotificationView,
    NotificationDetailView,
    NotificationMarkAllReadView,
)


urlpatterns = [

    path("", NotificationView.as_view(), name="notification-list-create"),
    path("mark-all-read/", NotificationMarkAllReadView.as_view(), name="notification-mark-all-read"),
    path("<int:notification_id>/", NotificationDetailView.as_view(), name="notification-detail"),

]