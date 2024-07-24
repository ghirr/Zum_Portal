from authentication.serializers import userSerializerWithImage
from .models import Timesheet,Task
from rest_framework import serializers
from authentication.models import User 
from project.models import Project
from django.conf import settings


class UserSerializer(serializers.ModelSerializer):
    profile_photo = serializers.SerializerMethodField()
    def get_profile_photo(self, user):
        if user.profile_photo:
            return settings.MEDIA_URL + user.profile_photo.url
        return None
    class Meta:
        model = User
        fields = ['id', 'firstname', 'lastname', 'profile_photo', 'position']

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'abbreviation','starter_at', 'end_date']

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ['timesheet']

class TimesheetSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True,required=False)
    employee= userSerializerWithImage()
    class Meta:
        model = Timesheet
        fields = '__all__'

    def create(self, validated_data):
        tasks_data = validated_data.pop('tasks', [])
        timesheet = Timesheet.objects.create(**validated_data)
        
        for task_data in tasks_data:
            Task.objects.create(timesheet=timesheet, **task_data)
        
        return timesheet

class AddTimesheetSerialzer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True,required=False)
    class Meta:
        model = Timesheet
        fields = '__all__'
    def create(self, validated_data):
        tasks_data = validated_data.pop('tasks', [])
        timesheet = Timesheet.objects.create(**validated_data)
        
        for task_data in tasks_data:
            Task.objects.create(timesheet=timesheet, **task_data)
        
        return timesheet

    def update(self, instance, validated_data):
        tasks_data = validated_data.pop('tasks', [])
        
        # Update the fields of the existing timesheet instance
        instance.date = validated_data.get('date', instance.date)
        instance.site = validated_data.get('site', instance.site)
        instance.location = validated_data.get('location', instance.location)
        instance.billablehours = validated_data.get('billablehours', instance.billablehours)
        instance.notbillablehours = validated_data.get('notbillablehours', instance.notbillablehours)
        instance.save()

        # Delete existing tasks related to the timesheet
        instance.tasks.all().delete()

        # Create new task objects and associate them with the timesheet
        for task_data in tasks_data:
            Task.objects.create(timesheet=instance, **task_data)

        return instance

   