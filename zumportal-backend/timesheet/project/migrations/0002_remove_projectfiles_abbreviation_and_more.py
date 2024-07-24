
from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings



class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('project', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='projectfiles',
            name='abbreviation',
        ),
        migrations.RemoveField(
            model_name='projectfiles',
            name='assigned_to',
        ),
        migrations.AddField(
            model_name='project',
            name='manager',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='project_manager', to=settings.AUTH_USER_MODEL),
        ),
        
    ]
