from django.urls import path
from project import views

urlpatterns = [
    path('add-project/',views.CreateProject.as_view(),name='add-project'),
    path('list-project/',views.ListProject.as_view(),name='list-project'),
    # path('update-project/<int:id>/',views.UpdateProject.as_view(),name='update-project'),
    path('delete-project/<int:id>',views.updateDestroyProjectApiView.as_view(),name='delete-project'),
    path('update-project/<int:id>',views.updateDestroyProjectApiView.as_view(),name='update-project'), # to update the status of project
    path('getproject/<int:id>',views.getProjectApiView.as_view(),name='get-project'),
    path('getprojectteam/<int:id>',views.getAllProjectTeamApiView.as_view(),name='get-project-team'),
    # path('listproject/',views.ListallProject.as_view(),name='listallproject'),
    # path('GetProjectByUser/<int:id>',views.GetProjectByUser.as_view(),name='GetProjectByUser'),
    # path('GetProjectByCreator/<int:id>',views.GetProjectByCreator.as_view(),name='GetProjectByCreator'),
    # path('GetProjectByCreatorWithaffectedTo/<int:id>',views.GetProjectByCreatorWithaffectedTo.as_view(),name='GetProjectByCreatorWithaffectedTo'),
    path('delete-file/<int:file_id>/', views.DeleteFileAPIView.as_view(), name='delete-file'),
    path('upload-file/<int:project_id>/', views.UploadFileAPIView.as_view(), name='upload-file'),
    path('update-manager/<int:id>/', views.UpdateProjectManagerAPIView.as_view(), name='update_manager'),
    path('update-scrum/<int:id>/', views.UpdateScrumMasterAPIView.as_view(), name='update_scrum'),
    path('update-team/<int:project_id>/', views.UpdateProjectTeamAPIView.as_view(), name='update-project-team'),
    path('delete-member/<int:project_id>/', views.DeleteProjectMemberAPIView.as_view(), name='delete-project-member'),
    path('<int:customer_id>',views.ListProjectByCustomer.as_view(),name='ListProjectByCustomer'),
    path('employee/<int:employee_id>',views.ProjectsByEmployeeView.as_view(),name='ListEmployeeProjects'),
    path('employees/<int:project_id>',views.ProjectEmployeesAPIView.as_view(),name='ListEmployeesofaProject'),
    path('list/',views.ListProjectWithCustomer.as_view(),name='ListProjectWithCustomer'),


    
]
