# Generated by Django 4.1.13 on 2024-05-12 10:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0003_rename_manager_project_project_manager_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='progress',
            field=models.FloatField(default=0),
        ),
    ]
