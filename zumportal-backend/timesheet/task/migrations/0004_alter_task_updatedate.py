# Generated by Django 4.1.13 on 2024-05-11 13:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('task', '0003_alter_task_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='updatedate',
            field=models.DateField(blank=True, null=True),
        ),
    ]
