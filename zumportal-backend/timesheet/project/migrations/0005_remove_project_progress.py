# Generated by Django 4.1.13 on 2024-05-12 10:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0004_project_progress'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='project',
            name='progress',
        ),
    ]