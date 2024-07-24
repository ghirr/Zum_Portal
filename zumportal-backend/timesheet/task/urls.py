from django.urls import path
from task import views

urlpatterns=[
     path('addTask',views.CreateTaskApiView.as_view(),name='addTask'),
     path('addTask/<int:id>',views.CreateTaskApiView.as_view(),name='addTask'),
     # path('gettasks',views.GetTaskUsersApiView.as_view(),name='gettask'),
     # path('all/',views.TaskListcreatorAPIView.as_view(),name="tasks"),
     # path('getTask/<int:id>',views.getTaskApiView.as_view(),name='gettask'),
     # path('update/<int:id>',views.updateDestroyTaskApiView.as_view(),name='updatetask'),
     # path('delete/<int:id>',views.DestroyTaskApiView.as_view(),name='deletetask'),
     # path('TaskByUser/<int:id>',views.GetTaskByUser.as_view(),name='ProjectByCreator'),
     # path('TaskByCreator/<int:id>',views.GetTaskByCreator.as_view(),name='TaskByCreator'),
     path('TaskByProject/<int:id>',views.GetTaskByProject.as_view(),name='TaskByProject'),
     path('change-status/<int:task_id>', views.ChangeTaskStatusAPIView.as_view(), name='change_task_status_api'),

]