from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Contract
from .serializers import ContractSerializer, UserSerializer
from authentication.models import User

class EmployeeList(APIView):
    def get(self, request):
        employees = User.objects.filter(role__in=[1,2,3])
        data = []
        for employee in employees:
            contracts = Contract.objects.filter(user=employee)
            contract_serializer = ContractSerializer(contracts, many=True)
            employee_data = {
                'name': f'{employee.firstname} {employee.lastname}',
                'position': employee.position,
                'hiring_date': employee.joining_date,
                'contracts': contract_serializer.data
            }
            data.append(employee_data)
        return Response(data)

class ContractList(APIView):
    def post(self, request):
        user = get_object_or_404(User, id=request.data['user'])
        serializer = ContractSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ContractDetail(APIView):

    def put(self, request, pk):
        contract = get_object_or_404(Contract, id=pk)
        serializer = ContractSerializer(contract, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):

        contract = get_object_or_404(Contract, id=pk)
        contract.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
