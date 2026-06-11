from datetime import datetime, timedelta

from django.utils import timezone

from appointments.models import Appointment
from .email import send_notification_email
from .models import Notification


def create_notification(user, title, message, notification_type="BOOKING"):
    notification = Notification.objects.create(
        user=user,
        title=title,
        message=message,
        notification_type=notification_type,
    )
    send_notification_email(user, title, message)
    return notification


def _format_appointment_datetime(appointment):
    date_str = appointment.appointment_date.strftime("%B %d, %Y")
    time_str = appointment.start_time.strftime("%I:%M %p")
    return date_str, time_str


def notify_appointment_booked(appointment):
    patient_name = appointment.patient.user.get_full_name() or appointment.patient.user.username
    date_str, time_str = _format_appointment_datetime(appointment)

    create_notification(
        user=appointment.doctor.user,
        title="New Appointment Request",
        message=(
            f"{patient_name} requested an appointment on {date_str} at {time_str}. "
            f"Reason: {appointment.reason}"
        ),
        notification_type="BOOKING",
    )


def notify_status_change(appointment, new_status, changed_by_user):
    patient_user = appointment.patient.user
    doctor_user = appointment.doctor.user
    date_str, time_str = _format_appointment_datetime(appointment)

    if new_status == "CANCELLED" and changed_by_user == patient_user:
        create_notification(
            user=doctor_user,
            title="Appointment Cancelled by Patient",
            message=(
                f"A patient cancelled their appointment scheduled for "
                f"{date_str} at {time_str}."
            ),
            notification_type="CANCELLATION",
        )
        return

    if changed_by_user != doctor_user:
        return

    status_messages = {
        "CONFIRMED": (
            "Appointment Confirmed",
            f"Your appointment on {date_str} at {time_str} has been confirmed by the doctor.",
            "STATUS_UPDATE",
        ),
        "CANCELLED": (
            "Appointment Cancelled",
            f"Your appointment on {date_str} at {time_str} was cancelled by the doctor.",
            "CANCELLATION",
        ),
        "COMPLETED": (
            "Appointment Completed",
            f"Your appointment on {date_str} at {time_str} has been marked as completed.",
            "STATUS_UPDATE",
        ),
    }

    if new_status in status_messages:
        title, message, ntype = status_messages[new_status]
        create_notification(
            user=patient_user,
            title=title,
            message=message,
            notification_type=ntype,
        )


def send_appointment_reminders():
    now = timezone.now()
    reminder_window = timedelta(hours=24)
    sent_count = 0

    appointments = Appointment.objects.filter(
        status__in=["PENDING", "CONFIRMED"],
        reminder_sent=False,
    ).select_related("patient__user", "doctor__user")

    for appointment in appointments:
        appt_dt = timezone.make_aware(
            datetime.combine(appointment.appointment_date, appointment.start_time),
            timezone.get_current_timezone(),
        )

        if not (now < appt_dt <= now + reminder_window):
            continue

        date_str, time_str = _format_appointment_datetime(appointment)
        patient_name = (
            appointment.patient.user.get_full_name()
            or appointment.patient.user.username
        )
        doctor_name = (
            appointment.doctor.user.get_full_name()
            or appointment.doctor.user.username
        )

        create_notification(
            user=appointment.patient.user,
            title="Appointment Reminder",
            message=(
                f"Reminder: You have an appointment on {date_str} at {time_str} "
                f"with Dr. {doctor_name}."
            ),
            notification_type="REMINDER",
        )

        create_notification(
            user=appointment.doctor.user,
            title="Upcoming Appointment",
            message=(
                f"Reminder: You have an appointment with {patient_name} on "
                f"{date_str} at {time_str}."
            ),
            notification_type="REMINDER",
        )

        appointment.reminder_sent = True
        appointment.save(update_fields=["reminder_sent"])
        sent_count += 1

    return sent_count
