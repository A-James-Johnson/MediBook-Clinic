import os
import re

import certifi
import requests as py_requests
import urllib3
from django.conf import settings
from google.auth.exceptions import TransportError
from google.auth.transport.requests import Request
from google.oauth2 import id_token

from .models import User


def _google_request(verify_ssl=True):
    session = py_requests.Session()
    if verify_ssl:
        session.verify = certifi.where()
    else:
        session.verify = False
        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    return Request(session=session)


def verify_google_id_token(token):
    client_id = (settings.GOOGLE_CLIENT_ID or "").strip()
    if not client_id:
        return None

    force_insecure = os.getenv("GOOGLE_SSL_VERIFY", "true").lower() == "false"
    attempts = [False] if force_insecure else [True, False]

    last_transport_error = None

    for verify_ssl in attempts:
        try:
            return id_token.verify_oauth2_token(
                token,
                _google_request(verify_ssl=verify_ssl),
                client_id,
            )
        except TransportError as exc:
            last_transport_error = exc
            if verify_ssl and len(attempts) > 1:
                continue
            raise
        except ValueError:
            return None

    if last_transport_error:
        raise last_transport_error

    return None


def generate_google_username(email, google_sub):
    base = re.sub(r"[^\w.@+-]", "", email.split("@")[0])[:100] or f"user_{google_sub[:8]}"
    username = base
    counter = 1

    while User.objects.filter(username=username).exists():
        username = f"{base}_{counter}"
        counter += 1

    return username
