import datetime
import calendar
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.generics import RetrieveAPIView
from project.models import Project
from project.serializers import DashboardProjects
from authentication.models import Role, User,ROLES_CHOICES
from task.models import Task
from customers.models import Customer
from customers.serializers import CustomerSerilaizer2
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import APIView

from attendance.models import Attendance
from timesheets.models import Timesheet
from leaves.models import Leave,LeaveType
from django.db.models import Sum
# Create your views here.

class DashboardHeader(RetrieveAPIView):
   permission_classes = [IsAuthenticated]

   def retrieve(self, request):
        
        projects=Project.objects.all().count()
        employees=User.objects.all().count()
        tasks=Task.objects.all().count()
        customers=Customer.objects.all().count()

        data = {
            "projects":projects,
            "customers": customers,
            "employees": employees,
            "tasks":tasks
        }

        return Response(data, status=status.HTTP_200_OK)
   
class EmployeeRoleDistribution(APIView):
     permission_classes = [IsAuthenticated]

     def get(self, request):
        roles = ['Simple User', 'Scrum Master', 'Project Manager','General Manager','Talent Management']
        role_counts = {}

        for role_name in roles:
            try:
                role = Role.objects.get(name=role_name)
                role_counts[role_name] = User.objects.filter(role=role).count()
            except Role.DoesNotExist:
                role_counts[role_name] = 0

        return Response(role_counts)
     
class GenderDistribution(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        male_count = User.objects.filter(gender='Male').count()
        female_count = User.objects.filter(gender='Female').count()

        data = {
            'male': male_count,
            'female': female_count,
        }

        return Response(data)
    
class EmployeeWorkHours(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_year = datetime.datetime.now().year
        data = []

        for month in range(1, 13):
            start_date = datetime.date(current_year, month, 1)
            end_date = datetime.date(current_year, month, 28 if month == 2 else 30)
            billable_hours = Timesheet.objects.filter(date__range=(start_date, end_date)).aggregate(Sum('billablehours'))['billablehours__sum'] or 0
            not_billable_hours = Timesheet.objects.filter(date__range=(start_date, end_date)).aggregate(Sum('notbillablehours'))['notbillablehours__sum'] or 0
            total_hours = billable_hours + not_billable_hours
            month_name = calendar.month_name[month]  # Get the month name
            data.append({
                'month': month_name,
                'billable_hours': billable_hours,
                'not_billable_hours': not_billable_hours,
                'total_hours': total_hours
            })

        return Response(data)
    
class ProjectPerformance(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        projects = Project.objects.all()
        data = []

        for project in projects:
            data.append({
                'name': project.name,
                'status': project.status,
                'team_members': project.assigned_to.count()+2,
            })

        return Response(data)

class LeaveUsage(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print('****',request)
        leave_types = ['Annual leave', 'Personal leave', 'Recovery leave']
        current_year = datetime.datetime.now().year
        data = {leave_type: [] for leave_type in leave_types}

        for month in range(1, 13):
            start_date = datetime.date(current_year, month, 1)
            end_date = datetime.date(current_year, month, 28 if month == 2 else 30)
            for leave_type in leave_types:
                typo=LeaveType.objects.get(name=leave_type)
                leave_count = Leave.objects.filter(leave_start__range=(start_date, end_date), type=typo).count()
                month_name = calendar.month_name[month]
                data[leave_type].append({
                    'month': month_name,
                    'count': leave_count
                })

        return Response(data)
    
class TaskStatistics(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
            
            Total=Task.objects.all().count()
            completed=Task.objects.filter(status='Completed').count()
            inprogress=Task.objects.filter(status='InProgress').count()
            todo=Task.objects.filter(status='ToDo').count()
            canceled=Task.objects.filter(status='Canceled').count()
            onhold=Task.objects.filter(status='OnHold').count() 
            review=Task.objects.filter(status='Review').count()

            data = {
                "total":Total,
                "completed": completed,
                "inprogress": inprogress,
                "todo":todo,
                "canceled":canceled,
                "onhold":onhold,
                "review":review
            }

            return Response(data, status=status.HTTP_200_OK)
    

class LatestCustomersAndProjects(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):

        Customerserializer=Customer.objects.order_by('-id')[:5]
        customers=CustomerSerilaizer2(Customerserializer, many=True, context={'request': request})

        Projectserializer=Project.objects.order_by('-id')[:5]
        projects=DashboardProjects(Projectserializer, many=True, context={'request': request})

        data = {
            'customers':customers.data,
            'projects':projects.data
        }

        return Response(data, status=status.HTTP_200_OK)
    
class EmployeeProjectsProgress(APIView):
    def get(self,request, user_id):
        user = get_object_or_404(User, id=user_id)
        projects_as_manager = Project.objects.filter(project_manager=user)
        projects_as_scrum_master = Project.objects.filter(scrum_master=user)
        projects_as_assigned = Project.objects.filter(assigned_to=user)

        projects = projects_as_manager | projects_as_scrum_master | projects_as_assigned
        projects = projects.distinct()

        data = []
        for project in projects:
            data.append({
                'name': project.name,
                'description': project.description,
                'status': project.status,
                'starter_at': project.starter_at,
                'end_date': project.end_date,
                'abbreviation': project.abbreviation,
            })

        return JsonResponse(data, safe=False)

class UserOverview(APIView):
    def get(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        projects_as_team = Project.objects.filter(
            project_manager=user
        ).count()
        projects_as_team = Project.objects.filter(scrum_master=user).count()
        projects_as_assigned = Project.objects.filter(assigned_to=user).count()

        projects_count=projects_as_team+projects_as_team+projects_as_assigned

        completed_tasks_count = Task.objects.filter( status='Completed'
        ).count()

        other_tasks_count = Task.objects.filter().exclude(status='Completed').count()

        remaining_leaves = user.dayoffamount;
        remaining_TT = user.ttamount;
        remaining_Exit = user.exitamount;

        today = datetime.date.today()
        try:
            attendance = Attendance.objects.get(employee=user, date=today)
            status=attendance.status
        except Attendance.DoesNotExist:
            status='Present'


        data = {
            'projects_count': projects_count,
            'completed_tasks_count': completed_tasks_count,
            'other_tasks_count': other_tasks_count,
            'remaining_leaves': remaining_leaves,
            'remaining_TT':remaining_TT,
            'remaining_exit':remaining_Exit,
            'attendance_status': status
        }
        return JsonResponse(data)
