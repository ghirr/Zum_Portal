
from django.db import models
from authentication.models import User

class Meetingroom(models.Model):
    name=models.TextField(default="",unique=True)
    Absorption_capacity=models.IntegerField(default=10)

class MeetingroomReservation(models.Model):

    STATUS_OPTIONS=[
        ('Approved','Approved'),
        ('Declined','Declined'),
        ('Pending','Pending'),
    ]

    room=models.ForeignKey(Meetingroom, on_delete=models.CASCADE, related_name='Meeringroom')
    purpose=models.TextField(max_length=255)
    creator=models.ForeignKey(to=User,on_delete=models.CASCADE,default=3)
    date= models.DateField(null=False,blank=False)
    reservation_start = models.TimeField(blank=True)
    reservation_end= models.TimeField(blank=True)
    status=models.CharField(choices=STATUS_OPTIONS,max_length=255,null=True)





