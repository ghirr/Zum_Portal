from django.db import models
from authentication.models import User,Role
from authentication.serializers import userSerializer
from django.db.models import Q
from project.models import Project
from authentication.models import User,ProjectMANAGER,SCRUM_MASTER,TALENT_MANAGEMENT,General_Manger,SIMPLE_USER

ETAT_APPROVED ='Approved' 
ETAT_DECLINED='Declined' 
ETAT_PENDING='Pending' 

STATUS= [ 
        (ETAT_APPROVED,'Approved'), 
        (ETAT_DECLINED,'Declined'), 
        (ETAT_PENDING ,'Pending')
    ]
class TT(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE,related_name="user_tt",null=True,blank=True)
    tt_start = models.DateField(blank=True)
    tt_end= models.DateField(blank=True)
    number_of_days=models.IntegerField(default=1)
    status= models.CharField(max_length=10,choices=STATUS, null=True)

    def save(self, *args, **kwargs):
        super(TT, self).save(*args, **kwargs)
        if not self.approvers.exists():
            # Assign default approvers based on user role
            default_approvers = set()
            user = User.objects.get(email=self.user)
            employee = userSerializer(user).data

            talent_management = User.objects.filter(role=4).first()
            if talent_management:
                default_approvers.add(talent_management)

            if employee['role'] == SCRUM_MASTER:
                if self.number_of_days > 5:
                    allocated_projects = Project.objects.filter(scrum_master=employee['id'])
                    for project in allocated_projects:
                        project_managers = User.objects.filter(role=3, project_manager__in=[project])
                        default_approvers.update(project_managers)

            if employee['role'] == SIMPLE_USER:
                if self.number_of_days > 5:
                    allocated_projects = Project.objects.filter(assigned_to=employee['id'])
                    for project in allocated_projects:
                        project_approvers = User.objects.filter(role=3, project_manager__in=[project])
                        default_approvers.update(project_approvers)

            if self.number_of_days >= 5:
                general_manager = User.objects.filter(role=5).first()
                if general_manager:
                    default_approvers.add(general_manager)

            # Create TTApprover instances for each unique approver
            for approver in default_approvers:
                TTApprover.objects.create(tt=self, user=approver, role=approver.role.name)
class TTApprover(models.Model):
    tt = models.ForeignKey(TT, on_delete=models.CASCADE, related_name='approvers')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=100)  
    approved = models.CharField(max_length=10,choices=STATUS, default=ETAT_PENDING)



class ExitAuthorization(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE,related_name="user_exit_permission",null=True,blank=True)
    exit_day = models.DateField(blank=True)
    exit_start = models.TimeField(blank=True)
    exit_end= models.TimeField(blank=True)
    number_of_hours=models.IntegerField(default=1)
    Reason = models.TextField(default='')
    status= models.CharField(max_length=10,choices=STATUS, null=True)

    def save(self, *args, **kwargs):
        super(ExitAuthorization, self).save(*args, **kwargs)
        if not self.approvers.exists():
            # Assign default approvers based on user role
            default_approvers = []
            
            talent_management = User.objects.filter(role=4).first()
            if talent_management:
                default_approvers.append(talent_management)
                
            ExitApprover.objects.create(exit=self, user=talent_management, role=TALENT_MANAGEMENT)


class ExitApprover(models.Model):
    exit = models.ForeignKey(ExitAuthorization, on_delete=models.CASCADE, related_name='approvers')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=100)  
    approved = models.CharField(max_length=10,choices=STATUS, default=ETAT_PENDING)