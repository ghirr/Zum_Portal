from django.db import models
from django.db import models
from authentication.models import User
from customers.models import Customer
# Create your models here.

class Project(models.Model):
    ETAT_ACTIVE = 'Active'
    ETAT_SUSPENDED = 'Suspended'
    ETAT_COMPLETED = 'Completed'
    ETAT_PAUSED = 'Paused'
    STATUS = [
        (ETAT_ACTIVE, 'Active'),
        (ETAT_SUSPENDED, 'Suspended'),
        (ETAT_COMPLETED, 'Completed'),
        (ETAT_PAUSED, 'Paused'),
    ]
    name = models.CharField(max_length=255, unique=True)
    description = models.CharField(max_length=500)
    status = models.CharField(max_length=50, choices=STATUS, default=ETAT_ACTIVE)
    starter_at = models.DateTimeField(null=True)
    project_manager = models.ForeignKey(User, on_delete=models.CASCADE, related_name="project_manager", null=True, blank=True)
    scrum_master = models.ForeignKey(User, on_delete=models.CASCADE, related_name="scrum_master", null=True, blank=True)
    assigned_to = models.ManyToManyField(User, related_name="users", blank=True)
    end_date = models.DateField(null=True)
    abbreviation = models.CharField(max_length=10, null=True, default='')
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="customers", default='')

class ProjectFiles(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE) 
    file = models.FileField(upload_to='uploadFiles', null=True, blank=True)