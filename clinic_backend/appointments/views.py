from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from notifications.services import notify_appointment_booked, notify_status_change

from .models import Appointment
from .serializers import AppointmentSerializer


class AppointmentView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        appointments = Appointment.objects.all()

        serializer = AppointmentSerializer(
            appointments,
            many=True
        )

        return Response(serializer.data)

    def post(self, request):

        serializer = AppointmentSerializer(
            data=request.data
        )

        if serializer.is_valid():

            appointment = serializer.save()
            notify_appointment_booked(appointment)

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class AppointmentDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, appointment_id):

        appointment = Appointment.objects.get(
            id=appointment_id
        )

        serializer = AppointmentSerializer(
            appointment
        )

        return Response(serializer.data)

    def put(self, request, appointment_id):

        appointment = Appointment.objects.get(
            id=appointment_id
        )

        old_status = appointment.status

        serializer = AppointmentSerializer(
            appointment,
            data=request.data
        )

        if serializer.is_valid():

            updated = serializer.save()
            new_status = updated.status

            if old_status != new_status:
                notify_status_change(updated, new_status, request.user)

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, appointment_id):

        appointment = Appointment.objects.get(
            id=appointment_id
        )

        appointment.delete()

        return Response({
            "message": "Appointment deleted successfully"
        })
