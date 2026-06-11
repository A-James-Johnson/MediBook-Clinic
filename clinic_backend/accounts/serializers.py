from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = [
            "id",
            "username",
            "email",
            "role",
            "phone_number",
            "auth_provider",
            "created_at",
        ]


class EmailOrUsernameTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        login = attrs.get("username")
        user = User.objects.filter(username=login).first()

        if user is None:
            user = User.objects.filter(email__iexact=login).first()

        if user is not None:
            if user.auth_provider == User.AuthProvider.GOOGLE:
                raise AuthenticationFailed(
                    "This account uses Google sign-in. "
                    "Please continue with Google.",
                    code="google_account",
                )
            attrs["username"] = user.username

        return super().validate(attrs)
