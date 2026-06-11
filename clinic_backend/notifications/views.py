from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Notification
from .serializers import NotificationSerializer
from .services import send_appointment_reminders


class NotificationView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        send_appointment_reminders()

        notifications = Notification.objects.filter(
            user=request.user
        ).order_by("-created_at")

        serializer = NotificationSerializer(
            notifications,
            many=True
        )

        return Response(serializer.data)

    def post(self, request):

        serializer = NotificationSerializer(
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


class NotificationMarkAllReadView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        updated = Notification.objects.filter(
            user=request.user,
            is_read=False,
        ).update(is_read=True)

        return Response({
            "message": f"{updated} notification(s) marked as read.",
        })


class NotificationDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, notification_id):

        notification = Notification.objects.get(
            id=notification_id,
            user=request.user,
        )

        serializer = NotificationSerializer(
            notification
        )

        return Response(serializer.data)

    def put(self, request, notification_id):

        notification = Notification.objects.get(
            id=notification_id,
            user=request.user,
        )

        serializer = NotificationSerializer(
            notification,
            data=request.data
        )

        if serializer.is_valid():

            serializer.save()

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, notification_id):

        notification = Notification.objects.get(
            id=notification_id,
            user=request.user,
        )

        notification.delete()

        return Response({
            "message": "Notification deleted successfully"
        })
