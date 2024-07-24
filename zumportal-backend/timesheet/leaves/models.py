from django.db import models

from authentication.models import User,SCRUM_MASTER,General_Manger,ProjectMANAGER,TALENT_MANAGEMENT,Role
from authentication.serializers import userSerializer

from project.models import Project
from django.db.models import Q

ETAT_APPROVED ='Approved' 
ETAT_DECLINED='Declined' 
ETAT_PENDING='Pending' 
# Create your models here.
class LeaveType(models.Model):
    name = models.CharField(max_length=255,unique=True)
    description = models.CharField(max_length=500,default='')
    minDays=models.IntegerField(default=1)
    maxDays=models.IntegerField(default=1)



class Leave(models.Model):
    ETAT_APPROVED ='Approved' 
    ETAT_DECLINED='Declined' 
    ETAT_PENDING='Pending' 
    STATUS= [ 
        (ETAT_APPROVED,'Approved'), 
        (ETAT_DECLINED,'Declined'), 
        (ETAT_PENDING ,'Pending')
    ]
    user=models.ForeignKey(User, on_delete=models.CASCADE,related_name="user_request",null=True,blank=True)
    type=models.ForeignKey(LeaveType, on_delete=models.CASCADE)
    leave_start = models.DateField(blank=True)
    leave_end= models.DateField(blank=True)
    number_of_days=models.IntegerField(default=1)
    status= models.CharField(max_length=10,choices=STATUS, null=True)
    Reason = models.TextField(default='')

    def save(self, *args, **kwargs):
        super(Leave, self).save(*args, **kwargs)
        if not self.approvers.exists():
            default_approvers = set()
            user = User.objects.get(email=self.user.email)
            employee = userSerializer(user).data

            if employee['role'] == ProjectMANAGER:
                talent_management = User.objects.filter(role=4).first()
                if talent_management:
                    default_approvers.add(talent_management)
                if self.type.name == 'Annual leave':
                    general_manager = User.objects.filter(role=5).first()
                    if general_manager:
                        default_approvers.add(general_manager)

            elif employee['role'] == SCRUM_MASTER:
                talent_management = User.objects.filter(role=4).first()
                if talent_management:
                    default_approvers.add(talent_management)
                if self.type.name == 'Annual leave':
                    allocated_projects = Project.objects.filter(scrum_master=employee['id'])
                    for project in allocated_projects:
                        project_managers = User.objects.filter(role=3, project_manager__in=[project])
                        default_approvers.update(project_managers)
                    general_manager = User.objects.filter(role=5).first()
                    if general_manager:
                        default_approvers.add(general_manager)

            else:
                allocated_projects = Project.objects.filter(assigned_to=employee['id'])
                if self.type.name != 'Annual leave':
                    for project in allocated_projects:
                        scrum_masters = User.objects.filter(role=2, scrum_master__in=[project])
                        default_approvers.update(scrum_masters)
                talent_management = User.objects.filter(role=4).first()
                if talent_management:
                    default_approvers.add(talent_management)
                if self.type.name == 'Annual leave':
                    project_managers = User.objects.filter(role=3, project_manager__in=allocated_projects)
                    default_approvers.update(project_managers)
                    general_manager = User.objects.filter(role=5).first()
                    if general_manager:
                        default_approvers.add(general_manager)

            for approver in default_approvers:
                if not LeaveApprover.objects.filter(leave=self, user=approver).exists():
                    LeaveApprover.objects.create(leave=self, user=approver, role=approver.role.name)

class LeaveApprover(models.Model):
    ETAT_APPROVED ='Approved' 
    ETAT_DECLINED='Declined' 
    ETAT_PENDING='Pending' 
    STATUS= [ 
        (ETAT_APPROVED,'Approved'), 
        (ETAT_DECLINED,'Declined'), 
        (ETAT_PENDING ,'Pending')
    ]
    leave = models.ForeignKey(Leave, on_delete=models.CASCADE, related_name='approvers')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=100)  
    approved = models.CharField(max_length=10,choices=STATUS, default=ETAT_PENDING)
    