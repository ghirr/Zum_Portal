from django.utils import timezone
from django.db import models

from authentication.models import User
from project.models import Project



# Create your models here.
class Timesheet(models.Model):
    employee = models.ForeignKey(User,related_name="employee",null=False,blank=False,on_delete=models.CASCADE)
    project = models.ForeignKey(Project,null=False,blank=False,on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    site = models.CharField(max_length=50,default='TN')
    location = models.CharField(max_length=100,default='Zum-it Office')
    billablehours = models.IntegerField(default=8)
    notbillablehours = models.IntegerField(default=0)

    class Meta:
        permissions = [
                ('import_timesheet' ,'Can import timesheet'),
                ('export_timesheet','Can export timesheet'),
            ]
        unique_together = ['employee', 'project', 'date']

class Task(models.Model):
    ETAT_PENDING='Pending' 
    ETAT_COMPLETED='Completed' 
    ETAT_SUSPENDED = 'Suspended'
    STATUS=[ 
        (ETAT_PENDING,'Pending'), 
        (ETAT_COMPLETED,'Completed'), 
        (ETAT_SUSPENDED,'Suspended'), 
    ] 
    status=models.CharField(max_length=9,choices=STATUS,default=ETAT_PENDING)
    billable = models.BooleanField(default=True)
    timesheet = models.ForeignKey(Timesheet, on_delete=models.CASCADE, related_name='tasks') 
    task = models.TextField()