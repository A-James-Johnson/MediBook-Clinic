from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Doctor
from .models import DoctorAvailability

from .serializers import DoctorSerializer
from .serializers import DoctorAvailabilitySerializer


class DoctorView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        doctors = Doctor.objects.all()

        serializer = DoctorSerializer(
            doctors,
            many=True
        )

        return Response(serializer.data)

    def post(self, request):

        serializer = DoctorSerializer(
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


class DoctorDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, doctor_id):

        doctor = Doctor.objects.get(
            id=doctor_id
        )

        serializer = DoctorSerializer(
            doctor
        )

        return Response(serializer.data)

    def put(self, request, doctor_id):

        doctor = Doctor.objects.get(
            id=doctor_id
        )

        serializer = DoctorSerializer(
            doctor,
            data=request.data
        )

        if serializer.is_valid():

            serializer.save()

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, doctor_id):

        doctor = Doctor.objects.get(
            id=doctor_id
        )

        doctor.delete()

        return Response({
            "message": "Doctor deleted successfully"
        })


class DoctorAvailabilityView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        availability = DoctorAvailability.objects.all()

        serializer = DoctorAvailabilitySerializer(
            availability,
            many=True
        )

        return Response(serializer.data)

    def post(self, request):

        serializer = DoctorAvailabilitySerializer(
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


class DoctorAvailabilityDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, availability_id):

        availability = DoctorAvailability.objects.get(
            id=availability_id
        )

        serializer = DoctorAvailabilitySerializer(
            availability
        )

        return Response(serializer.data)

    def put(self, request, availability_id):

        availability = DoctorAvailability.objects.get(
            id=availability_id
        )

        serializer = DoctorAvailabilitySerializer(
            availability,
            data=request.data
        )

        if serializer.is_valid():

            serializer.save()

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, availability_id):

        availability = DoctorAvailability.objects.get(
            id=availability_id
        )

        availability.delete()

        return Response({
            "message": "Availability deleted successfully"
        })