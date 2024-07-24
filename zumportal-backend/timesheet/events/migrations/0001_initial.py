# Generated by Django 4.1.13 on 2024-05-23 09:15

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Events',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField(blank=True)),
                ('start_day', models.DateField(blank=True)),
                ('end_day', models.DateField(blank=True)),
                ('start_hour', models.TimeField(blank=True)),
                ('end_hour', models.TimeField(blank=True)),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user_event', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]