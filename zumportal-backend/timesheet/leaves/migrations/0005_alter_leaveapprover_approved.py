# Generated by Django 4.1.13 on 2024-05-14 10:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leaves', '0004_remove_leave_approvers_leaveapprover'),
    ]

    operations = [
        migrations.AlterField(
            model_name='leaveapprover',
            name='approved',
            field=models.CharField(choices=[('Approved', 'Approved'), ('Declined', 'Declined')], default='', max_length=10),
        ),
    ]
