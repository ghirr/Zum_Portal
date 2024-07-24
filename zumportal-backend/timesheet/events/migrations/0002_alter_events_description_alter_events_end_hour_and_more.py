# Generated by Django 4.1.13 on 2024-05-23 09:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='events',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='events',
            name='end_hour',
            field=models.TimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='events',
            name='start_hour',
            field=models.TimeField(blank=True, null=True),
        ),
    ]
