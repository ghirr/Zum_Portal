from rest_framework import serializers
from .models import Meetingroom,MeetingroomReservation
from authentication.serializers import userSerializerWithImage

class MeetingroomSerilaizer(serializers.ModelSerializer):
    class Meta:
        model = Meetingroom
        fields = ['name','Absorption_capacity','id']

class MeetingroomReservationSerilaizer(serializers.ModelSerializer):
    class Meta:
        model = MeetingroomReservation
        fields = ['room','creator','date','reservation_start','reservation_end','purpose','status']

class MeetingroomReservationRequestsSerilaizer(serializers.ModelSerializer):
    id=serializers.IntegerField();
    room=MeetingroomSerilaizer()
    creator= userSerializerWithImage(read_only=True)
    class Meta:
        model = MeetingroomReservation
        fields = ['room','creator','date','reservation_start','reservation_end','purpose','status','id']
  