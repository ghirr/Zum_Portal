# Generated by Django 5.0.2 on 2024-05-06 15:06

import authentication.models
import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Asset',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('asset_type', models.CharField(choices=[('Laptop', 'Laptop'), ('Mouse', 'Mouse'), ('Phone', 'Phone'), ('Headset', 'Headset'), ('SIM Card', 'SIM Card'), ('Licence', 'Licence')], max_length=100, unique=True)),
                ('asset_id', models.CharField(blank=True, max_length=100, null=True, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('firstname', models.CharField(max_length=255, null=True)),
                ('lastname', models.CharField(max_length=255, null=True)),
                ('role', models.CharField(choices=[('Manager', 'Manager'), ('Simple User', 'Simple User'), ('Admin', 'Admin'), ('Talent Management', 'Talent Management'), ('Scrum Master', 'Scrum Master')], default='Simple User', max_length=255)),
                ('email', models.EmailField(max_length=255, unique=True)),
                ('ttamount', models.FloatField(default=30)),
                ('dayoffamount', models.FloatField(default=24)),
                ('exitamount', models.FloatField(default=22)),
                ('tel', models.CharField(blank=True, default='', max_length=255, null=True)),
                ('position', models.CharField(blank=True, default='', max_length=255, null=True)),
                ('profile_photo', models.ImageField(upload_to='profile_photos/')),
                ('joining_date', models.DateField(default=django.utils.timezone.now)),
                ('birthday_date', models.DateField(blank=True, null=True)),
                ('address', models.CharField(blank=True, default='', max_length=255, null=True)),
                ('gender', models.CharField(choices=[('Female', 'Female'), ('Male', 'Male')], max_length=10, null=True)),
                ('id_card', models.CharField(blank=True, default='', max_length=8, null=True)),
                ('seniority', models.FloatField(default=0)),
                ('current_type_of_contract', models.CharField(blank=True, default='', max_length=255, null=True)),
                ('social_security_number', models.CharField(blank=True, default='', max_length=32, null=True)),
                ('marital_status', models.CharField(choices=[('Single', 'Single'), ('Married', 'Married'), ('Divorced', 'Divorced')], max_length=255, null=True)),
                ('current_salary', models.FloatField(default=0)),
                ('status', models.CharField(choices=[('Inactive', 'Inactive'), ('Active', 'Active')], default='Active', max_length=255, null=True)),
                ('departure_date', models.DateField(blank=True, null=True)),
                ('departure_reason', models.CharField(max_length=255, null=True)),
                ('bank_name', models.CharField(default='', max_length=64, null=True)),
                ('rib', models.CharField(default='', max_length=20, null=True)),
                ('passport_no', models.CharField(default='', max_length=32, null=True)),
                ('passport_exp_date', models.DateField(blank=True, null=True)),
                ('nationality', models.CharField(default='Tunisian', max_length=32, null=True)),
                ('manager', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='subordinates', to=settings.AUTH_USER_MODEL)),
                ('user_permissions', models.ManyToManyField(blank=True, to='auth.permission')),
                ('assets', models.ManyToManyField(related_name='users', to='authentication.asset')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='UserAsset',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('serial_number', models.CharField(default='', max_length=14)),
                ('brand', models.CharField(default='', max_length=100)),
                ('vendor', models.CharField(default='', max_length=100)),
                ('category', models.CharField(default='', max_length=100)),
                ('cost', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('assigned_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('warranty', models.DateField(default=authentication.models.default_warranty)),
                ('asset', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='authentication.asset')),
                ('assigned_to', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_assets', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]