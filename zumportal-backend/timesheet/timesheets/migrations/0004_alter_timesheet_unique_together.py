# Generated by Django 4.1.13 on 2024-03-13 10:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('timesheets', '0003_alter_task_timesheet_alter_timesheet_billable'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='timesheet',
            unique_together=set(),
        ),
    ]