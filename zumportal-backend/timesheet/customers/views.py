from django.forms import ValidationError
from rest_framework.decorators import APIView
from django.shortcuts import render
from rest_framework.response import Response

from project.models import Project
from .models import Customer, CustomerFiles
from .serializers import CustomerFileSerializer, CustomerSerilaizer,AddCustomerSerilaizer, FileSerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .permissions import CanAddCustomer,CanChangeCustomer,CanDeleteCustomer,CanViewCustomer

# Create your views here.

class CustomerAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None, *args, **kwargs):

        customer_id = self.kwargs.get('id')

        if customer_id:
            try:
                customer = Customer.objects.get(id=customer_id)
                customer.numOfProjects=Project.objects.filter(customer=customer.id).count()
                customer_serializer = CustomerSerilaizer(customer, context={'request': request})
                return Response(customer_serializer.data, status=status.HTTP_200_OK)
            except Customer.DoesNotExist:
                return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            customers = Customer.objects.all()
            for customer in customers:
                customer.numOfProjects=Project.objects.filter(customer=customer.id).count()
            serializer = CustomerSerilaizer(customers, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        
    def post(self, request, format=None):
        self.permission_classes = [CanAddCustomer]
        self.check_permissions(request)

        data = request.data
        serializer = AddCustomerSerilaizer(data=data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, id, format=None):
        self.permission_classes = [CanChangeCustomer]
        self.check_permissions(request)

        data = request.data
        try:
            customer_instance = Customer.objects.get(id=id)
        except Customer.DoesNotExist:
            return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = AddCustomerSerilaizer(customer_instance, data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, id, format=None):
        # Handle the request to delete a customer
        self.permission_classes = [CanDeleteCustomer]
        self.check_permissions(request)
        try:
            customer_instance = Customer.objects.get(id=id)
        except Customer.DoesNotExist:
            return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)
        # Delete related customer files
        customer_files = CustomerFiles.objects.filter(customer=customer_instance)
        for file_instance in customer_files:
            file_instance.file.delete()  # Delete the file from storage
            file_instance.delete()  # Delete the file record
        customer_instance.delete()
        return Response({'message': 'Customer deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

class CustomerFileAPI(APIView):
    def post(self, request, customer_id, format=None):
        self.permission_classes = [CanAddCustomer]
        self.check_permissions(request)
        
        try:
            customer = Customer.objects.get(id=customer_id)
        except Customer.DoesNotExist:
            return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)

        # Get list of uploaded files
        uploaded_files = request.FILES.getlist('file')

        # Create a list of dictionaries with customer and file
        data_list = [{'customer': customer.id, 'file': file} for file in uploaded_files]

        serializer = FileSerializer(data=data_list, many=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, file_id, format=None):
        self.permission_classes = [CanDeleteCustomer]
        self.check_permissions(request)

        try:
            customer_file = CustomerFiles.objects.get(pk=file_id)
        except CustomerFiles.DoesNotExist:
            return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)

        customer_file.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def get(self, request, customer_id, format=None):
        """
        get customer files.
        """
        try:
            customer_files = CustomerFiles.objects.filter(customer_id=customer_id)
            serializer = CustomerFileSerializer(customer_files, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except CustomerFiles.DoesNotExist:
            return Response({'error': 'Files not found'}, status=status.HTTP_404_NOT_FOUND)
