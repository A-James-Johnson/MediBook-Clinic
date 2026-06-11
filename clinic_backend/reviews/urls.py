from django.urls import path

from .views import ReviewView
from .views import ReviewDetailView


urlpatterns = [

    path("", ReviewView.as_view(), name="review-list-create"),

    path("<int:review_id>/", ReviewDetailView.as_view(), name="review-detail"),

]