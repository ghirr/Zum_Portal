# Generated by Django 4.1.13 on 2024-05-11 15:00

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('task', '0004_alter_task_updatedate'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='affectedTo',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='affectedTo', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='task',
            name='creator',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='creator', to=settings.AUTH_USER_MODEL),
        ),
    ]
