from django.urls import path
from timesheets import views

urlpatterns = [
    path('<int:id>/',views.TimesheetAPI.as_view(),name='timesheet_api'),
    path('',views.TimesheetAPI.as_view(),name='timesheet_api'),
    path('projectid/<int:project_id>',views.TimesheetListAPIView.as_view(),name='GetTimesheetByProject'),
    path('csv',views.CSVAPI.as_view(),name='TimesheetCSV'),
    path('excel/<int:year>/<str:month>/<int:employee_id>',views.ExcelAPI.as_view(),name='TimesheetEXCEL'),
    path('excel',views.ExcelAPI.as_view(),name='TimesheetEXCEL'),
    path('employee-timesheets/', views.EmployeeTimesheetsAPI.as_view(), name='employee-timesheets'),
    path('timesheets/', views.AllTimesheetsAPI.as_view(), name='all_timesheets'),

]