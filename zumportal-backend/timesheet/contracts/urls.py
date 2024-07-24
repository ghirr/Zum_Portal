from django.urls import path
from .views import ContractList, ContractDetail, EmployeeList

urlpatterns = [
    path('employees/', EmployeeList.as_view(), name='employee-list'),
    path('add/', ContractList.as_view(), name='contract-list'),
    path('edit/<int:pk>/', ContractDetail.as_view(), name='contract-detail'),
]
