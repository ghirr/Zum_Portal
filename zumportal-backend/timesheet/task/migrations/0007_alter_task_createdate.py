# Generated by Django 4.1.13 on 2024-05-12 10:24

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('task', '0006_task_priority'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='createdate',
            field=models.DateField(default=django.utils.timezone.now),
        ),
    ]