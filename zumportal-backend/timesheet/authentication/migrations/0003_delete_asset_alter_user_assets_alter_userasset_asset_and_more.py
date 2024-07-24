# Generated by Django 4.1.13 on 2024-05-08 08:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_alter_userasset_asset'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Asset',
        ),
        migrations.AlterField(
            model_name='user',
            name='assets',
            field=models.ManyToManyField(related_name='users', to='authentication.userasset'),
        ),
        migrations.AlterField(
            model_name='userasset',
            name='asset',
            field=models.CharField(choices=[('Laptop', 'Laptop'), ('Mouse', 'Mouse'), ('Phone', 'Phone'), ('Headset', 'Headset'), ('SIM Card', 'SIM Card'), ('Licence', 'Licence')], max_length=100),
        ),
        migrations.AlterUniqueTogether(
            name='userasset',
            unique_together={('asset', 'assigned_to')},
        ),
    ]