from django.urls import path
from .views import LeaveTypeListView,LeaveListByUserView,LeaveRequestView,RemainingLeaves,LeaveList,LeaveDeleteView,LeaveUpdateView,LeaveApproverView,UpdateLeaveTypeView,LeaveAdminHeader

urlpatterns = [
    path('leave-types/', LeaveTypeListView.as_view(), name='leave_type_list'),
     path('leave-types/<int:type_id>', UpdateLeaveTypeView.as_view(), name='update-leave-type'),
    path('<int:user_id>', LeaveListByUserView.as_view(), name='leaves_list_by_user'),
    path('', LeaveList.as_view(), name='leaves_list'),
    path('remain/<int:user_id>', RemainingLeaves.as_view(), name='leaves_user'),
    path('create/', LeaveRequestView.as_view(), name='create_Leave'),
    path('delete/<int:id>', LeaveDeleteView.as_view(), name='delete_Leave'),
    path('edit/<int:id>', LeaveUpdateView.as_view(), name='update_Leave'),
    path('leaveapprovers/<user_id>',  LeaveApproverView.as_view(), name='aprovels_leaves'),
    path('header', LeaveAdminHeader.as_view(),name="admin_header")



]