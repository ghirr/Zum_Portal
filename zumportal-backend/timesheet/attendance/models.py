from django.db import models
from authentication.models import User

class Attendance(models.Model):
    STATUS_CHOICES = [
        ('Present', 'Present'),
        ('Absent', 'Absent'),
        ('Half Day', 'Half Day'),
        ('Remote', 'Remote'),
        ('Permission', 'Permission'),
        ('Leave', 'Leave'),
    ]

    employee = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    comment = models.TextField(blank=True)
