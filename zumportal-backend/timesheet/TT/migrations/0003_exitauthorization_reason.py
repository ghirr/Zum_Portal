# Generated by Django 4.1.13 on 2024-04-30 10:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('TT', '0002_exitauthorization'),
    ]

    operations = [
        migrations.AddField(
            model_name='exitauthorization',
            name='Reason',
            field=models.TextField(default=''),
        ),
    ]