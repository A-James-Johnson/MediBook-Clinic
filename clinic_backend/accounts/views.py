from django.db import IntegrityError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from google.auth.exceptions import TransportError

from .google_auth import generate_google_username, verify_google_id_token
from .models import User
from .serializers import EmailOrUsernameTokenObtainPairSerializer, UserSerializer


class EmailOrUsernameTokenView(TokenObtainPairView):
    serializer_class = EmailOrUsernameTokenObtainPairSerializer


def jwt_response(user, message=None, status_code=status.HTTP_200_OK):
    refresh = RefreshToken.for_user(user)
    payload = {
        "id": user.id,
        "role": user.role,
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }
    if message:
        payload["message"] = message
    return Response(payload, status=status_code)


def register_user(request, role, success_message):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")
    phone_number = request.data.get("phone_number")

    missing = [
        field
        for field, value in {
            "username": username,
            "email": email,
            "password": password,
            "phone_number": phone_number,
        }.items()
        if not value
    ]

    if missing:
        return Response(
            {"error": f"Missing required fields: {', '.join(missing)}"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    existing = User.objects.filter(email__iexact=email).first()
    if existing and existing.auth_provider == User.AuthProvider.GOOGLE:
        return Response(
            {
                "error": (
                    "This email is registered with Google. "
                    "Please sign in with Continue with Google."
                )
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            role=role,
            phone_number=phone_number,
            auth_provider=User.AuthProvider.PASSWORD,
        )
    except IntegrityError:
        return Response(
            {"error": "Username or email already exists."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    return jwt_response(
        user,
        message=success_message,
        status_code=status.HTTP_201_CREATED,
    )


class MeView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        phone_number = request.data.get("phone_number")
        if phone_number:
            request.user.phone_number = phone_number
            request.user.save(update_fields=["phone_number", "updated_at"])

        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class GoogleAuthView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):
        id_token_str = request.data.get("id_token")
        action = request.data.get("action")
        role = request.data.get("role")

        if not id_token_str:
            return Response(
                {"error": "Missing Google ID token."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if action not in ("login", "register"):
            return Response(
                {"error": "Invalid action. Use 'login' or 'register'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            idinfo = verify_google_id_token(id_token_str)
        except TransportError:
            return Response(
                {
                    "error": (
                        "Unable to verify Google sign-in on the server. "
                        "Please try again in a moment."
                    )
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        if not idinfo:
            return Response(
                {"error": "Invalid or expired Google token."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        google_sub = idinfo["sub"]
        email = (idinfo.get("email") or "").lower()
        first_name = idinfo.get("given_name", "")
        last_name = idinfo.get("family_name", "")

        if not email:
            return Response(
                {"error": "Google account has no email address."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user_by_google = User.objects.filter(google_id=google_sub).first()
        user_by_email = User.objects.filter(email__iexact=email).first()

        if action == "login":
            if user_by_google:
                user = user_by_google
            elif user_by_email and user_by_email.auth_provider == User.AuthProvider.GOOGLE:
                user = user_by_email
                if not user.google_id:
                    user.google_id = google_sub
                    user.save(update_fields=["google_id", "updated_at"])
            elif user_by_email and user_by_email.auth_provider == User.AuthProvider.PASSWORD:
                return Response(
                    {
                        "error": (
                            "This account was registered with email and password. "
                            "Please sign in with your password."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            else:
                return Response(
                    {
                        "error": (
                            "No Google account found. "
                            "Please register first using Continue with Google."
                        )
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )

            return jwt_response(user, message="Signed in with Google.")

        if role not in ("PATIENT", "DOCTOR"):
            return Response(
                {"error": "Role is required for Google registration."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user_by_google or (
            user_by_email and user_by_email.auth_provider == User.AuthProvider.GOOGLE
        ):
            return Response(
                {
                    "error": (
                        "Account already exists. "
                        "Please sign in with Continue with Google."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user_by_email and user_by_email.auth_provider == User.AuthProvider.PASSWORD:
            return Response(
                {
                    "error": (
                        "This email is already registered with a password. "
                        "Sign in with your password instead."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        username = generate_google_username(email, google_sub)

        try:
            user = User.objects.create(
                username=username,
                email=email,
                first_name=first_name,
                last_name=last_name,
                role=role,
                phone_number="",
                auth_provider=User.AuthProvider.GOOGLE,
                google_id=google_sub,
            )
            user.set_unusable_password()
            user.save()
        except IntegrityError:
            return Response(
                {"error": "Unable to create account. Please try again."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return jwt_response(
            user,
            message=f"{role.title()} registered successfully with Google.",
            status_code=status.HTTP_201_CREATED,
        )


class PatientRegisterView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):
        return register_user(
            request,
            "PATIENT",
            "Patient registered successfully",
        )


class DoctorRegisterView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):
        return register_user(
            request,
            "DOCTOR",
            "Doctor registered successfully",
        )
