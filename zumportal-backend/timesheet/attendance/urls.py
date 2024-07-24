from django.urls import path
from .views import AttendanceViewSet, get_status_choices
from attendance import views

attendance_list = AttendanceViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

attendance_detail = AttendanceViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'delete': 'destroy'
})

attendance_update_by_employee = AttendanceViewSet.as_view({
    'put': 'updateEmployeeStatus'
})

# Custom method view for getting all attendance
attendance_get_all = AttendanceViewSet.as_view({
    'get': 'getAllAttendance'
})

urlpatterns = [
    path('attendances/', attendance_list, name='attendance-list'),
    path('attendances/<int:pk>/', attendance_detail, name='attendance-detail'),
    path('employee/<int:employee_id>/', attendance_update_by_employee, name='attendance-update-by-employee'),
    path('status-choices/', get_status_choices, name='status-choices'),
    path('attendances/getAllAttendance/', attendance_get_all, name='attendance-get-all'),
]
