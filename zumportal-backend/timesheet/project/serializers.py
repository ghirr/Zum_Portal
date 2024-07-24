import os
from requests import Response
from rest_framework import serializers

from customers.serializers import CustomerPhotoSerilaizer
from .models import Project, ProjectFiles
from authentication.serializers import Registerserilaizer,UserAssginedToProjectSerializer,userSerializer,userSerializerWithImage,UserSerializer
from authentication.models import User
from customers.models import Customer
from customers.serializers import CustomerSerilaizer,CustomerSerilaizer2
from datetime import datetime
from task.models import Task

class ProjectFileSerializer(serializers.ModelSerializer):
    file_size = serializers.SerializerMethodField()  # Define a SerializerMethodField for file size

    class Meta:
        model = ProjectFiles
        fields = ['id', 'file', 'project', 'file_size']  # Include file_size field

    def get_file_size(self, obj):
        if obj.file:
            return os.path.getsize(obj.file.path)
        return None

class CustomPrimaryKeyRelatedField(serializers.PrimaryKeyRelatedField):
    def to_internal_value(self, data):
        try:
            return super().to_internal_value(data)
        except (TypeError, ValueError):
            queryset = self.get_queryset()
            try:
                return queryset.get(pk=data)
            except queryset.model.DoesNotExist:
                self.fail('does_not_exist', pk_value=data)

class ProjectSerilaizer(serializers.ModelSerializer):
    files = ProjectFileSerializer(many=True, read_only=True)
    uploaded_files = serializers.ListField(child=serializers.FileField(), allow_empty=True, required=False)
    
    assigned_to = CustomPrimaryKeyRelatedField(queryset=User.objects.all(), many=True)
    customer = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all())

    class Meta:
        model = Project
        fields = ['name', 'description', 'starter_at', 'project_manager','scrum_master', 'assigned_to', 'end_date', 'id', 'customer', 'files', 'uploaded_files', 'abbreviation']

    def create(self, validated_data):
        uploaded_files = validated_data.pop("uploaded_files", [])
        assigned_to = validated_data.pop("assigned_to", [])
        project = Project.objects.create(**validated_data)

        for file in uploaded_files:
            ProjectFiles.objects.create(project=project, file=file)

        project.assigned_to.set(assigned_to)
        return project

class GetProjectSerilaizer(serializers.ModelSerializer):
    project_manager = userSerializerWithImage(required = True)
    scrum_master = userSerializerWithImage(required = True)
    assigned_to = userSerializerWithImage(many=True)
    customer = CustomerSerilaizer2(required = True)
    files = serializers.SerializerMethodField()
    progress=serializers.SerializerMethodField()
    
    def get_files(self, project):
        files = ProjectFiles.objects.filter(project=project)
        return ProjectFileSerializer(files, many=True).data
    
    def get_progress(self, obj):
        # Get all tasks related to this project
        tasks = Task.objects.filter(project=obj)

        # Count the completed tasks
        completed_tasks = tasks.filter(status='Completed').count()

        # Calculate progress
        total_tasks = tasks.count()
        if total_tasks > 0:
            progress = (completed_tasks / total_tasks) * 100
            progress=round(progress) 
        else:
            progress = 0

        return progress

    class Meta:
        model = Project
        fields = ['name','description','status','starter_at','project_manager','scrum_master','assigned_to','end_date','id', 'customer', 'abbreviation','files','progress']
        depth = 1

class GetProjectAllTeamSerilaizer(serializers.ModelSerializer):
    project_manager = userSerializerWithImage(required = True)
    scrum_master = userSerializerWithImage(required = True)
    assigned_to = userSerializerWithImage(many=True)
    progress=serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ['name','project_manager','scrum_master','assigned_to','progress']

    def get_progress(self, obj):
        # Get all tasks related to this project
        tasks = Task.objects.filter(project=obj)

        # Count the completed tasks
        completed_tasks = tasks.filter(status='Completed').count()

        # Calculate progress
        total_tasks = tasks.count()
        if total_tasks > 0:
            progress = (completed_tasks / total_tasks) * 100
            progress=round(progress) 
        else:
            progress = 0

        return progress


class GetAllProjectSerilaizer(serializers.ModelSerializer):
    assigned_to = userSerializerWithImage(many=True)
    project_manager = userSerializerWithImage(required = True)
    scrum_master = userSerializerWithImage(required = True)
    customer = CustomerSerilaizer(required = True)

    class Meta:
        model = Project
        fields = ['id','name','description','status','starter_at','project_manager','scrum_master', 'customer','assigned_to','end_date', 'abbreviation']

    

        
class UpdateProjectSerilaizer(serializers.ModelSerializer):
    #assigned_to = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True, required=False)
    #customer = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all(), required=False)

    class Meta:
        model = Project
        fields = ('id', 'name', 'description', 'status', 'starter_at', 'end_date', 'abbreviation',)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.status = validated_data.get('status', instance.status)
        #instance.manager = validated_data.get('manager', instance.manager)
        instance.abbreviation = validated_data.get('abbreviation' , instance.abbreviation)
        #instance.customer = validated_data.get('customer', instance.customer)

        # Convert datetime.datetime objects to strings
        starter_at = validated_data.get('starter_at')
        if starter_at:
            instance.starter_at = datetime.strftime(starter_at, '%Y-%m-%dT%H:%M:%S%z')

        end_date = validated_data.get('end_date')
        if end_date:
            instance.end_date = datetime.strftime(end_date, '%Y-%m-%d')

        #if 'assigned_to' in validated_data:
            #assigned_to_data = validated_data.pop('assigned_to')
            #instance.assigned_to.set(assigned_to_data)

        instance.save()
        return instance


class GetProjectByUserSerilaizer(serializers.ModelSerializer):
    project_manager = UserSerializer()
    scrum_master = UserSerializer()
    assigned_to = UserSerializer(many=True)
    progress=serializers.SerializerMethodField()
    customer = CustomerPhotoSerilaizer()
    class Meta:
        model = Project
        fields = ['id','name','starter_at','description','status','end_date', 'customer','project_manager','scrum_master','abbreviation','assigned_to','progress']

    def get_progress(self, obj):
        # Get all tasks related to this project
        tasks = Task.objects.filter(project=obj)

        # Count the completed tasks
        completed_tasks = tasks.filter(status='Completed').count()

        # Calculate progress
        total_tasks = tasks.count()
        if total_tasks > 0:
            progress = (completed_tasks / total_tasks) * 100
            progress=round(progress) 
        else:
            progress = 0

        return progress

class GetProjectBycreatorSerilaizer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id','name','starter_at','description','status','end_date','abbreviation']  

class GetProjectWithCustomerSerilaizer(serializers.ModelSerializer):
    customer = CustomerPhotoSerilaizer()

    class Meta:
        model = Project
        fields = ['id', 'name', 'starter_at', 'description', 'status', 'end_date', 'abbreviation', 'customer']      

   

class GetProjectBycreatorWithAffectedToSerilaizer(serializers.ModelSerializer):
    # assigned_to = Registerserilaizer
    assigned_to = UserAssginedToProjectSerializer(many=True)
    class Meta:
        model = Project
        fields = ['id','name','starter_at','description','status','end_date', 'customer','assigned_to','abbreviation']    

class UpdateProjectManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['project_manager']
    # def update(self, instance, validated_data):
    #     manager_id = validated_data.get('project_manager')
    #     if manager_id:
    #         try:
    #             manager = User.objects.get(pk=manager_id)
    #             instance.project_manager = manager
    #             instance.save()
    #             return instance
    #         except User.DoesNotExist:
    #             raise serializers.ValidationError("Manager does not exist")
    #     else:
    #         raise serializers.ValidationError("Manager ID is required")
        
class UpdateScrumMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['scrum_master']

class UpdateProjectTeamSerializer(serializers.Serializer):
    team_members = serializers.ListField(child=serializers.IntegerField(), required=False)

    def update(self, instance, validated_data):
        team_members = validated_data.get('team_members', [])
        for member_id in team_members:
            instance.assigned_to.add(member_id)
        return instance

# class GetProjectBycreatorSerilaizer(serializers.ModelSerializer):
#     # assigned_to = Registerserilaizer
#     assigned_to = UserAssginedToProjectSerializer(many=True)
#     class Meta:
#         model = Project
#         fields = ['id','name','starter_at','description','status','end_date','assigned_to',]    
#         depth=1        

#     def get_assigned_to(self,obj):
#         if not hasattr(obj,'name'):
#             return None
#         if not isinstance(obj,Project):
#             return None
#         return  Project.objects.get(assigned_to=obj['assigned_to'])  


class DashboardProjects(serializers.ModelSerializer):
    progress = serializers.SerializerMethodField()
    completed_tasks = serializers.SerializerMethodField()
    inprogress_tasks = serializers.SerializerMethodField()
    project_manager = UserSerializer()

    class Meta:
        model = Project
        fields = ['id', 'name', 'progress', 'completed_tasks', 'inprogress_tasks','project_manager']

    def get_progress(self, obj):
        tasks = Task.objects.filter(project=obj)
        completed_tasks = tasks.filter(status='Completed').count()
        total_tasks = tasks.count()

        if total_tasks > 0:
            progress = (completed_tasks / total_tasks) * 100
            progress = round(progress)
        else:
            progress = 0

        return progress

    def get_completed_tasks(self, obj):
        tasks = Task.objects.filter(project=obj)
        completed_tasks = tasks.filter(status='Completed').count()
        return completed_tasks

    def get_inprogress_tasks(self, obj):
        tasks = Task.objects.filter(project=obj)
        inprogress_tasks = tasks.filter(status='InProgress').count()
        return inprogress_tasks


  
