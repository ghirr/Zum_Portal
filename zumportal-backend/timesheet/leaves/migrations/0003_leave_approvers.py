# Generated by Django 4.1.13 on 2024-05-14 09:06

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('leaves', '0002_leave_reason_alter_leave_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='leave',
            name='approvers',
            field=models.ManyToManyField(related_name='leave_approvers', to=settings.AUTH_USER_MODEL),
        ),
    ]