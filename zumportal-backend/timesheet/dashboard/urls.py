from django.urls import path
from .views import DashboardHeader,EmployeeRoleDistribution,GenderDistribution,EmployeeWorkHours,ProjectPerformance,LeaveUsage,TaskStatistics,LatestCustomersAndProjects,EmployeeProjectsProgress,UserOverview

urlpatterns = [
    path('admin/header', DashboardHeader.as_view(), name='dashboard_header'),
    path('admin/employee-role-distribution/', EmployeeRoleDistribution.as_view(), name='employee_role_distribution'),
    path('admin/gender-distribution/', GenderDistribution.as_view(), name='gender_distribution'),
    path('admin/employee-work-hours/', EmployeeWorkHours.as_view(), name='employee_work_hours'),
    path('admin/project-performance/', ProjectPerformance.as_view(), name='project_performance'),
    path('admin/leave-usage/', LeaveUsage.as_view(), name='leave_usage'),
    path('admin/task_statistics/', TaskStatistics.as_view(), name='Task_Statistics'),
    path('admin/projectsandcustomers/', LatestCustomersAndProjects.as_view(), name='LatestCustomersAndProjects'),
    path('employee/projectstatus/<int:user_id>', EmployeeProjectsProgress.as_view(), name='LatestCustomersAndProjects'),
    path('employee/userOverview/<int:user_id>', UserOverview.as_view(), name='LatestCustomersAndProjects'),
]
