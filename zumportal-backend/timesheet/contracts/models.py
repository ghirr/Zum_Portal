from django.db import models
from django.conf import settings
from authentication.models import User

class Contract(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField(null=True,blank=True)
    contract_type = models.CharField(max_length=255)
    salary = models.DecimalField(max_digits=10, decimal_places=2)
