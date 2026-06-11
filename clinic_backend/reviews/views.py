from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Review
from .serializers import ReviewSerializer


class ReviewView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        reviews = Review.objects.all()

        serializer = ReviewSerializer(
            reviews,
            many=True
        )

        return Response(serializer.data)

    def post(self, request):

        serializer = ReviewSerializer(
            data=request.data
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class ReviewDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, review_id):

        review = Review.objects.get(
            id=review_id
        )

        serializer = ReviewSerializer(review)

        return Response(serializer.data)

    def put(self, request, review_id):

        review = Review.objects.get(
            id=review_id
        )

        serializer = ReviewSerializer(
            review,
            data=request.data
        )

        if serializer.is_valid():

            serializer.save()

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, review_id):

        review = Review.objects.get(
            id=review_id
        )

        review.delete()

        return Response(
            {
                "message": "Review deleted successfully"
            }
        )