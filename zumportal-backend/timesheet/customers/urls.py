from django.urls import path
from customers import views

urlpatterns = [
    path('<int:id>/',views.CustomerAPI.as_view(),name='customer_api'),
    path('',views.CustomerAPI.as_view(),name='customer_api'),
    path('files/<int:customer_id>/', views.CustomerFileAPI.as_view(), name='customer_file_api'),
    path('files/delete/<int:file_id>', views.CustomerFileAPI.as_view(), name='customer_file_api'),

]