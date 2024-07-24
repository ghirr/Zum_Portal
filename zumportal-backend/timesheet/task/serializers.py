from authentication.serializers import userSerializer,RegisterUserSerializer,Registerserilaizer,userSerializerWithImage
from project.serializers import GetAllProjectSerilaizer
from timesheet.settings import TIME_ZONE
from task.models import Task
from rest_framework import serializers
from datetime import datetime 



class Taskserilaizer(serializers.ModelSerializer):
    # createdate=serializers.SerializerMethodField(read_only=False)
    
    class Meta:
        model = Task
        fields = ('id','description','name','status','creator','project','affectedTo','startdate','enddate','priority')
    # def get_createdate(self,obj):
    #     if not hasattr(obj,'name'):
    #         return None
    #     if not isinstance(obj,Task):
    #         return None
    #     return datetime.now()
 
class UpdateTaskserilaizer(serializers.ModelSerializer):
    #  datetime.now()
    # updatedate=serializers.SerializerMethodField(read_only=False)
    class Meta:
        model = Task
        fields = ('id','description','name','status','creator','project','affectedTo','startdate','updatedate','enddate','priority')
    # def get_updatedate(self,obj):
    #     if not hasattr(obj,'name'):
    #         return None
    #     if not isinstance(obj,Task):
    #         return None
    #     return datetime.now()   
class GetTasksUsers(serializers.ModelSerializer):
    creator = userSerializer(required = True)
    affectedTo = userSerializer(required = True)
    project=GetAllProjectSerilaizer(required = True)
    class Meta:
        model = Task
        fields = ('id','description','name','status','creator','project','affectedTo','startdate','updatedate','enddate','createdate',)
        depth=2


class TaskProjectSerializer(serializers.ModelSerializer):
    creator = userSerializerWithImage(required=True)
    affectedTo = userSerializerWithImage(required=True)
    class Meta:
        model = Task
        fields = ['id', 'description','priority', 'name', 'status', 'creator', 'affectedTo', 'startdate', 'updatedate', 'enddate', 'createdate']



        
class TaskOwnerSerializer(serializers.ModelSerializer):
    project_id = Registerserilaizer
    affectedTo_id = Registerserilaizer

    class Meta:
        model = Task
        fields=['id','description','name','status','project_id', 'affectedTo_id' ,'startdate','updatedate','enddate','createdate','priority']


        
class TaskAffectedToSerializer(serializers.ModelSerializer):
    project_id = Registerserilaizer
    creator_id = Registerserilaizer

    class Meta:
        model = Task
        fields=['id','description','name','status','project_id', 'creator_id' ,'startdate','updatedate','enddate','createdate',]

   
class GetTaskByUserSerilaizer(serializers.ModelSerializer):
    creator=serializers.SerializerMethodField(read_only=False)
    class Meta:
        model = Task
        fields = ['id','creator','name','status','description','startdate','updatedate','enddate','createdate',]
    
    def get_creator(self,obj):
        creatort=Task.objects.get(id=obj['creator'])

        return{
             'creator' :creatort,
     
        } 
