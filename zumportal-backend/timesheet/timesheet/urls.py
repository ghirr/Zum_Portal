"""timesheet URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls.static import static
from django.conf import settings
from django.contrib import admin
from django.urls import path,include
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static






urlpatterns = [
    # path('admin/', admin.site.urls),
    path('auth/', include('authentication.urls')),
    path('project/', include('project.urls')),
    path('task/', include('task.urls')),
    path('meetingroom/', include('meetingroom.urls')),
    path('customer/', include('customers.urls')),
    path('timesheet/', include('timesheets.urls')),
    # path('api_auth/', include('rest_framework.urls')),
    path('leaves/', include('leaves.urls')),
    path('tt/', include('TT.urls')),
    path('attendance/', include('attendance.urls')),
    path('events/', include('events.urls')),
    path('dashboard/', include('dashboard.urls')),
    path('contracts/', include('contracts.urls')),
]
   

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
