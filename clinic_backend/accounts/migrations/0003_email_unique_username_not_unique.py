from django.db import migrations, models
from django.core.validators import RegexValidator


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0002_user_auth_provider_google_id_phone_optional"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="username",
            field=models.CharField(
                max_length=150,
                unique=False,
                validators=[
                    RegexValidator(
                        regex=r"^[\w.@+-]+$",
                        message="Enter a valid username. This value may contain only letters, numbers, and @/./+/-/_ characters.",
                    )
                ],
                help_text="Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.",
                verbose_name="username",
            ),
        ),
        migrations.AlterField(
            model_name="user",
            name="email",
            field=models.EmailField(unique=True, max_length=254, verbose_name="email address"),
        ),
    ]
