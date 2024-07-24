from datetime import datetime, timezone
from django.shortcuts import render
from rest_framework.generics import GenericAPIView,ListAPIView,RetrieveUpdateDestroyAPIView
import authentication
from authentication.models import User
from task.models import Task
from rest_framework.permissions import IsAuthenticated
from .permissions import CanAddTask,CanChangeTask,CanDeletetask,CanViewTask,IsOwner
from rest_framework.decorators import APIView

from task.serializers import GetTasksUsers, Taskserilaizer,TaskOwnerSerializer,UpdateTaskserilaizer,TaskAffectedToSerializer,TaskProjectSerializer,TaskOwnerSerializer
from rest_framework import status,response
from rest_framework.response import Response
from rest_framework import viewsets

# Create your views here.
class CreateTaskApiView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = Taskserilaizer
    def post(self,request):
        self.permission_classes = [CanAddTask]
        self.check_permissions(request)

        serilaizer = self.serializer_class(data=request.data)
        if serilaizer.is_valid():
            serilaizer.save()
            return response.Response(serilaizer.data,status=status.HTTP_201_CREATED)
        return response.Response(serilaizer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, id):
        try:
            task = Task.objects.get(pk=id)
            self.permission_classes = [CanChangeTask]
            self.check_permissions(request,task)
        except Task.DoesNotExist:
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(task, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, id):
        self.permission_classes = [CanDeletetask]
        self.check_permissions(request)
        try:
            task = Task.objects.get(pk=id)
        except Task.DoesNotExist:
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)

        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# class getTaskApiView(RetrieveUpdateDestroyAPIView):
#     authentication_classes = []
#     queryset=Task.objects.all()
#     serializer_class = GetTasksUsers
#     lookup_field="id"
#     def get_queryset(self):
#         return self.queryset



# class updateDestroyTaskApiView(RetrieveUpdateDestroyAPIView):
#     authentication_classes = []
#     queryset=Task.objects.all()
#     serializer_class = UpdateTaskserilaizer
#     lookup_field="id"
#     def get_queryset(self):
#         return self.queryset

# class DestroyTaskApiView(RetrieveUpdateDestroyAPIView):
#     authentication_classes = []
#     queryset=Task.objects.all()
#     #  serializer_class = UpdateTaskserilaizer

#     lookup_field="id"
#     def get_queryset(self):
#         return self.queryset



# class GetTaskUsersApiView(GenericAPIView):
#     authentication_classes = []
#     serializer_class=GetTasksUsers
#     queryset = Task.objects.all()

#     def get(self,request):
#         queryset = self.get_queryset()
#         serializer = GetTasksUsers(queryset, many=True)
#         return response.Response(serializer.data)



# class GetTaskByUser(ListAPIView):
#     authentication_classes=[]
#     serializer_class = TaskAffectedToSerializer
#     pagination_class = None

#     def get_queryset(self):
#         return Task.objects.values().filter(affectedTo = self.kwargs['id'])



# class GetTaskByCreator(ListAPIView):
#     authentication_classes=[]
#     serializer_class = TaskOwnerSerializer
#     pagination_class = None

#     def get_queryset(self):
#         return Task.objects.values().filter(creator = self.kwargs['id'])

class GetTaskByProject(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TaskProjectSerializer
    pagination_class = None
    def get_queryset(self):
        
        return Task.objects.filter(project = self.kwargs['id']).order_by('-createdate')

class ChangeTaskStatusAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request, task_id):
        task = Task.objects.get(id=task_id)
        new_status = request.data.get('status')

        if new_status in dict(Task.STATUS_OPTIONS):
            task.status = new_status
            task.save()
            return Response({"message": "process went good"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid status option."}, status=status.HTTP_400_BAD_REQUEST)
              


#  get task by creator (with access token)
# class TaskListcreatorAPIView(ListAPIView):
#     # authentication_classes = [authentication,]
#     permission_classes=(permissions.IsAuthenticated,)
#     serializer_class=TaskOwnerSerializer 
#     lookup_field="id"
#     pagination_class = None

#     queryset= Task.objects.all()
#     # def get_queryset(self):
#     #     return self.queryset.filter(creator=self.request.user)  
#     def get_queryset(self):
#       return super().get_queryset().filter(creator__id=self.request.user.id)     

# """ class ExpenseDetailAPIView(RetrieveUpdateDestroyAPIView):
#     permission_classes=(permissions.IsAuthenticated,IsOwner,)
#     serializer_class=ExpenseSerializer 

#     queryset= Expense.objects.all()
#     lookup_field="id"
#     # def perform_create(self, serializer):return serializer.save(owner=self.request.user) 
#     def get_queryset(self):
#         return self.queryset.filter(owner=self.request.user)  """       
