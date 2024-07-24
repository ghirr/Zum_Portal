from rest_framework import serializers
from .models import LeaveType,Leave,LeaveApprover
from authentication.serializers import UserSerializer,userSerializerWithImage
from TT.serialzers import TTSerialzer

class LeaveTypeSerialzer(serializers.ModelSerializer):
    class Meta:
        model = LeaveType
        fields = ['id','name','description','minDays','maxDays']

class LeaveTypeUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveType
        fields = ['id','minDays', 'maxDays']

class LeaveTypo(serializers.ModelSerializer):
    class Meta:
        model = LeaveType
        fields = ['name']

class LeaveTypa(serializers.ModelSerializer):
    class Meta:
        model = LeaveType
        fields = ['id']

class LeaveSerialzer(serializers.ModelSerializer):
    type=LeaveTypo()
    process=serializers.SerializerMethodField()
    class Meta:
        model = Leave
        fields = ['id','user','type','leave_start','leave_end','number_of_days','status','Reason','process']

    def get_process(self, obj):
        approvers = LeaveApprover.objects.filter(leave=obj).order_by('approved')
        return ProcessSerilizer(approvers, many=True).data

class LeaveAdminSerialzer(serializers.ModelSerializer):
    type=LeaveTypo()
    user= UserSerializer(read_only=True)
    process = serializers.SerializerMethodField()
    class Meta:
        model = Leave
        fields = ['id','user','type','leave_start','leave_end','number_of_days','status','Reason','process']

    def get_process(self, obj):
        approvers = LeaveApprover.objects.filter(leave=obj).order_by('approved')
        return ProcessSerilizer(approvers, many=True).data

class CreateLeaveSerialzer(serializers.ModelSerializer):
    class Meta:
        model = Leave
        fields = ['user','type','leave_start','leave_end','number_of_days','status','Reason']

class LeaveApproverSerializer(serializers.ModelSerializer):
    image=serializers.SerializerMethodField()
    leave=LeaveSerialzer()
    class Meta:
        model = LeaveApprover
        fields = ['id','approved','leave','user','role','image']

    def get_image(self, obj):
        user = obj.leave.user
        return userSerializerWithImage(user).data

class ProcessSerilizer(serializers.ModelSerializer):
    user = userSerializerWithImage(read_only=True)
    class Meta:
        model = LeaveApprover
        fields = ['user', 'approved','role']
