import logging

from django.conf import settings
from django.core.mail import EmailMessage

logger = logging.getLogger(__name__)


def send_notification_email(user, title, message):
    if not user.email:
        msg = f"[Email] Skipped — no email for user '{user.username}'"
        logger.warning(msg)
        if settings.DEBUG:
            print(msg)
        return False

    subject = f"MediBook Clinic - {title}"
    body = (
        f"Hello {user.get_full_name() or user.username},\n\n"
        f"{message}\n\n"
        f"- MediBook Clinic\n"
        f"View your notifications in the app dashboard."
    )

    from_email = getattr(settings, "EMAIL_FROM_NAME", None)
    if from_email:
        from_email = f"{from_email} <{settings.DEFAULT_FROM_EMAIL}>"
    else:
        from_email = settings.DEFAULT_FROM_EMAIL

    try:
        email = EmailMessage(
            subject=subject,
            body=body,
            from_email=from_email,
            to=[user.email],
        )
        email.send(fail_silently=False)
        success_msg = f"[Email] Sent '{title}' to {user.email}"
        logger.info(success_msg)
        if settings.DEBUG:
            print(success_msg)
        return True
    except Exception as exc:
        error_msg = f"[Email] FAILED to {user.email}: {exc}"
        logger.exception(error_msg)
        if settings.DEBUG:
            print(error_msg)
        return False
