from authentication.serializers import UserSerializer,userSerializerWithImage
from .models import TT,ExitAuthorization,TTApprover,ExitApprover
from rest_framework import serializers

class TTSerialzer(serializers.ModelSerializer):
    process = serializers.SerializerMethodField()
    class Meta:
        model = TT
        fields = ['id','user','tt_start','tt_end','number_of_days','status','process']
    
    def get_process(self, obj):
        approvers = TTApprover.objects.filter(tt=obj).order_by('approved')
        return TTProcessSerilizer(approvers, many=True).data


class TTAdminSerialzer(serializers.ModelSerializer):
    user= UserSerializer(read_only=True)
    process = serializers.SerializerMethodField()
    class Meta:
        model = TT
        fields = ['id','user','tt_start','tt_end','number_of_days','status','process']
    
    def get_process(self, obj):
        approvers = TTApprover.objects.filter(tt=obj).order_by('approved')
        return TTProcessSerilizer(approvers, many=True).data


class CreateTTSerialzer(serializers.ModelSerializer):
    class Meta:
        model = TT
        fields = ['user','tt_start','tt_end','number_of_days','status']

class TTApproverSerializer(serializers.ModelSerializer):
    image=serializers.SerializerMethodField()
    tt=TTSerialzer()
    class Meta:
        model = TTApprover
        fields = ['id','approved','tt','user','role','image']

    def get_image(self, obj):
        user = obj.tt.user
        return userSerializerWithImage(user).data
    
class TTProcessSerilizer(serializers.ModelSerializer):
    user = userSerializerWithImage(read_only=True)
    class Meta:
        model = TTApprover
        fields = ['user', 'approved','role']


#                Exit_authorization                         #

class ExitSerialzer(serializers.ModelSerializer):
    process= serializers.SerializerMethodField()
    class Meta:
        model = ExitAuthorization
        fields = ['id','user','exit_day','exit_start','exit_end','number_of_hours','status','Reason','process']

    def get_process(self, obj):
        approvers = ExitApprover.objects.filter(exit=obj).order_by('approved')
        return ExitProcessSerilizer(approvers, many=True).data

class CreateExitSerialzer(serializers.ModelSerializer):
    class Meta:
        model = ExitAuthorization
        fields = ['user','exit_day','exit_start','exit_end','number_of_hours','status','Reason']

class ExitAdminSerialzer(serializers.ModelSerializer):
    user= UserSerializer(read_only=True)
    process= serializers.SerializerMethodField()
    class Meta:
        model = ExitAuthorization
        fields = ['id','user','exit_day','exit_start','exit_end','number_of_hours','status','Reason','process']
    
    def get_process(self, obj):
        approvers = ExitApprover.objects.filter(exit=obj).order_by('approved')
        return ExitProcessSerilizer(approvers, many=True).data



class ExitApproverSerializer(serializers.ModelSerializer):
    image=serializers.SerializerMethodField()
    exit=ExitSerialzer()
    class Meta:
        model = ExitApprover
        fields = ['id','approved','exit','user','role','image']

    def get_image(self, obj):
        user = obj.exit.user
        return userSerializerWithImage(user).data
    
class ExitProcessSerilizer(serializers.ModelSerializer):
    user = userSerializerWithImage(read_only=True)
    class Meta:
        model = ExitApprover
        fields = ['user', 'approved','role']
