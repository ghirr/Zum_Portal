# Generated by Django 4.1.13 on 2024-05-17 08:37

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('TT', '0004_ttapprover'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExitApprover',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role', models.CharField(max_length=100)),
                ('approved', models.CharField(choices=[('Approved', 'Approved'), ('Declined', 'Declined'), ('Pending', 'Pending')], default='Pending', max_length=10)),
                ('exit', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='approvers', to='TT.exitauthorization')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]