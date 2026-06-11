from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="auth_provider",
            field=models.CharField(
                choices=[("PASSWORD", "Password"), ("GOOGLE", "Google")],
                default="PASSWORD",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="user",
            name="google_id",
            field=models.CharField(
                blank=True,
                max_length=255,
                null=True,
                unique=True,
            ),
        ),
        migrations.AlterField(
            model_name="user",
            name="phone_number",
            field=models.CharField(blank=True, default="", max_length=15),
        ),
    ]
