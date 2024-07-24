# Generated by Django 4.1.13 on 2024-03-12 07:20

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('project', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('COMPLETED', 'COMPLETED'), ('INPROGRESS', 'INPROGRESS'), ('UNSTARTED', 'UNSTARTED'), ('CANCEL', 'CANCEL')], max_length=255)),
                ('description', models.TextField()),
                ('name', models.TextField(default='')),
                ('enddate', models.DateField()),
                ('updatedate', models.DateField()),
                ('createdate', models.DateField()),
                ('startdate', models.DateField()),
                ('affectedTo', models.ForeignKey(default=3, on_delete=django.db.models.deletion.CASCADE, related_name='affectedTo', to=settings.AUTH_USER_MODEL)),
                ('creator', models.ForeignKey(default=3, on_delete=django.db.models.deletion.CASCADE, related_name='creator', to=settings.AUTH_USER_MODEL)),
                ('project', models.ForeignKey(default=3, on_delete=django.db.models.deletion.CASCADE, related_name='project', to='project.project')),
            ],
        ),
    ]
