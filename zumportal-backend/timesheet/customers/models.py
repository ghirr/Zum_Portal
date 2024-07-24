from django.db import models
from django.utils import timezone

# Create your models here.
class Customer(models.Model):
    name = models.CharField(max_length=255,unique=True)
    description = models.CharField(max_length=500,default='')
    adress = models.CharField(max_length=500,default='')
    email= models.EmailField(max_length=255,unique=True,default='')
    tel=models.CharField(max_length=255,null=True,default='',unique=True)
    joining_Date=models.DateField(default=timezone.now)
    customer_photo=models.ImageField(upload_to='customer_photos/',default='customer_photos/')


class CustomerFiles(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE) 
    file = models.FileField(upload_to='customer_files', null=True, blank=True)