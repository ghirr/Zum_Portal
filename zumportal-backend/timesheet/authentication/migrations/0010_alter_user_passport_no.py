# Generated by Django 4.1.13 on 2024-05-29 12:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0009_alter_user_passport_no'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='passport_no',
            field=models.CharField(blank=True, default='', max_length=32, null=True),
        ),
    ]
