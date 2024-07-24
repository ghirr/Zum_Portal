# from django.db import models
from django.utils import timezone
from email.policy import default
from typing_extensions import Required
from django.db import models
from authentication.models import User
from authentication.serializers import userSerializer

from project.models import Project 
class Task(models.Model):
        
    STATUS_OPTIONS=[
        ('Completed','Completed'),
        ('InProgress','InProgress'),
        ('ToDo','ToDo'),
        ('Canceled','Canceled'),
        ('OnHold','OnHold'),
        ('Review','Review'),
    ]
    STATUS_Priority=[
        ('High','High'),
        ('Medium','Medium'),
        ('Low','Low')
    ]
    status=models.CharField(choices=STATUS_OPTIONS,max_length=255,default='ToDo')
    description=models.TextField()
    name=models.TextField(default="")
    creator=models.ForeignKey(User,on_delete=models.CASCADE,related_name='creator')
    enddate= models.DateField(null=False,blank=False)
    updatedate= models.DateField(null=True,blank=True)
    createdate= models.DateField(null=False,blank=False,default=timezone.now)
    startdate=models.DateField(null=False,blank=False)
    affectedTo=models.ForeignKey(User,on_delete=models.CASCADE,related_name='affectedTo')
    priority=models.CharField(choices=STATUS_Priority,max_length=255,default='Medium')
    project=models.ForeignKey(Project,on_delete=models.CASCADE,related_name='project')



