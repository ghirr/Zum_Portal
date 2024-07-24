from django.db import models 
from django.contrib.auth.models import(AbstractBaseUser,BaseUserManager,) 
from rest_framework_simplejwt.tokens import RefreshToken 
from django.contrib.auth.models import Permission
from django.utils import timezone
from django.contrib.auth.models import(AbstractBaseUser,BaseUserManager,PermissionsMixin)
from email.policy import default
from typing_extensions import Required
from django.db import models , transaction
from rest_framework_simplejwt.tokens import RefreshToken 
import jwt 
from django.conf import settings
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone
from datetime import timedelta

ProjectMANAGER = 'Project Manager'
TALENT_MANAGEMENT = 'Talent Management'
SIMPLE_USER = 'Simple User'
ADMIN = 'Admin'
SCRUM_MASTER = 'Scrum Master'
General_Manger='General Manager'
ROLES_CHOICES = [
        (ProjectMANAGER, 'Project Manager'),
        (SIMPLE_USER, 'Simple User'),
        (ADMIN, 'Admin'),
        (TALENT_MANAGEMENT, 'Talent Management'),
        (SCRUM_MASTER, 'Scrum Master'),
        (General_Manger, 'General Manager'),
    ]

class UserManager(BaseUserManager):
    def create_user(self, email, role, password=None):
        if email is None:
            raise TypeError('Users should have an email')
        user = self.model(role=role, email=self.normalize_email(email))
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None):
        if password is None:
            raise TypeError('Password should not be None')
        user = self.create_user(email, 'Admin', password)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user

class Role(models.Model):
    name = models.CharField(max_length=255,choices=ROLES_CHOICES,default=SIMPLE_USER) 
    permissions = models.ManyToManyField(Permission, blank=True)

    def has_permission(self, perm):
        return self.permissions.filter(codename=perm).exists()

class User(AbstractBaseUser):
    ACTIVE = 'Active'
    INACTIVE = 'Inactive'
    STATUS_CHOICES = [
        (INACTIVE, "Inactive"),
        (ACTIVE, "Active")
    ]
    MARRIED = 'Married'
    SINGLE = 'Single'
    DIVORCED = 'Divorced'
    MARITAL_STATUS_CHOICES = [
        (SINGLE, "Single"),
        (MARRIED, "Married"),
        (DIVORCED, "Divorced")
    ]
    MALE = 'Male'
    FEMALE = 'Female'
    GENDER_CHOICES = [
        (FEMALE, "Female"),
        (MALE, "Male")
    ]
    firstname=models.CharField(max_length=255,null=True)  
    lastname=models.CharField(max_length=255,null=True)  
    role= models.ForeignKey(Role, on_delete=models.SET_NULL, null=True,blank=True)
    email=models.EmailField(max_length=255,unique=True)
    ttamount=models.FloatField(null=False,blank=False,default=30)
    dayoffamount=models.FloatField(null=False,blank=False,default=24)
    exitamount=models.FloatField(null=False,blank=False,default=22)
    tel=models.CharField(max_length=255,null=True, blank=True,default='')
    position=models.CharField(max_length=255,null=True, blank=True,default='')
    profile_photo = models.ImageField(upload_to='profile_photos/')
    joining_date = models.DateField(default=timezone.now)
    birthday_date = models.DateField(null=True, blank=True) 
    address = models.CharField(max_length=255, null=True, blank=True,default='') 
    gender = models.CharField(max_length=10,choices=GENDER_CHOICES, null=True)
    id_card = models.CharField(max_length=8 ,null=True, blank=True,default='')
    seniority = models.FloatField(null=False,blank=False,default=0)
    current_type_of_contract = models.CharField(max_length=255,null=True, blank=True,default='')
    social_security_number = models.CharField(max_length=32 ,null=True, blank=True,default='')
    marital_status = models.CharField(max_length=255,choices=MARITAL_STATUS_CHOICES,null=True)
    current_salary = models.FloatField(null=False,blank=False,default=0)
    status = models.CharField(max_length=255,choices=STATUS_CHOICES,null=True,default=ACTIVE)
    departure_date =  models.DateField(null=True, blank=True)
    departure_reason = models.CharField(max_length=255,null=True)
    bank_name = models.CharField(max_length=64, default='', null=False,blank=True)
    rib = models.CharField(max_length=20, default='', null=False,blank=True)
    passport_no = models.CharField(max_length=32, default='', null=True,blank=True)
    passport_exp_date = models.DateField(null=True, blank=True)
    nationality = models.CharField(max_length=32, default="Tunisian", null=True)
    manager = models.ForeignKey('self', on_delete=models.CASCADE, related_name="subordinates", null=True,blank=True)
    assets = models.ManyToManyField('UserAsset', related_name='users')

    USERNAME_FIELD ='email'  
    REQUIRED_FIELDS =['role',] 
    objects = UserManager() 
    
    def __str__(self): 
        return self.email 
    def tokens(self): 
        refresh=RefreshToken.for_user(self) 
        return {
            'refresh':str(refresh),  
            'access':str(refresh.access_token) 
        }  





def default_warranty():
    return timezone.now() + timedelta(days=365)


class UserAsset(models.Model):
    ASSET_TYPES = [
        ('Laptop', 'Laptop'),
        ('Mouse', 'Mouse'),
        ('Phone', 'Phone'),
        ('Headset', 'Headset'),
        ('SIM Card', 'SIM Card'),
        ('Licence', 'Licence'),
    ]

    asset = models.CharField(max_length=100, choices=ASSET_TYPES)
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_assets")
    serial_number = models.CharField(max_length=14, default='')
    brand = models.CharField(max_length=100, default='')
    vendor = models.CharField(max_length=100, default='')
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    assigned_date = models.DateTimeField(default=timezone.now)
    warranty = models.DateField(default=default_warranty)
    class Meta:
        unique_together = ['asset', 'assigned_to']

    def save(self, *args, **kwargs):
        if not self.pk:
            self.assigned_date = timezone.now()
            self.warranty = default_warranty()
        super().save(*args, **kwargs)
