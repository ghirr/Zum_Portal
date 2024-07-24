from rest_framework import serializers
from .models import Contract
from authentication.models import User

class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    contracts = ContractSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['name', 'position', 'joining_date', 'contracts']
