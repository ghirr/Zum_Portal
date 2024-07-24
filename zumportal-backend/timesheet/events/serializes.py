from rest_framework import serializers
from .models import Events
from authentication.serializers import userSerializer

class EventSerializer(serializers.ModelSerializer):
    user = userSerializer(read_only=True)
    start = serializers.SerializerMethodField()
    end = serializers.SerializerMethodField()

    class Meta:
        model = Events
        fields = ['id', 'user', 'description', 'title', 'start', 'end']

    def get_start(self, obj):
        if obj.start_hour:
            return f"{obj.start_day}T{obj.start_hour}"
        else:
            return f"{obj.start_day}T00:00:00"

    def get_end(self, obj):
        if obj.end_hour:
            return f"{obj.end_day}T{obj.end_hour}"
        else:
            return f"{obj.end_day}T23:59:59"
        

class VirtualEventSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    user = serializers.SerializerMethodField()
    description = serializers.CharField()
    title = serializers.CharField()
    start = serializers.CharField()
    end = serializers.CharField()
    recur = serializers.CharField()
    editable=serializers.BooleanField()
    def get_user(self, obj):
        return {
            "id": obj["user"].id,
            "firstname": obj["user"].firstname,
            "lastname": obj["user"].lastname,
            "email": obj["user"].email,
            "role": obj["user"].role.name if obj["user"].role else None,
            "profile_photo": self.context['request'].build_absolute_uri(obj["user"].profile_photo.url) if obj["user"].profile_photo else None,
        }
