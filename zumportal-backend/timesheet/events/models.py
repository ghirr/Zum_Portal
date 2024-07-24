from django.db import models
from authentication.models import User
# Create your models here.
class Events(models.Model):

    user=models.ForeignKey(User, on_delete=models.CASCADE,related_name="user_event",null=True,blank=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True,null=True)
    start_day = models.DateField(blank=True)
    end_day = models.DateField(blank=True)
    start_hour = models.TimeField(blank=True,null=True)
    end_hour= models.TimeField(blank=True,null=True)
