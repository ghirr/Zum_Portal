from django.urls import path
from authentication import views
from rest_framework_simplejwt.views import TokenRefreshView



urlpatterns=[
    path('login/',views.LoginAPIView.as_view(),name="login"),
    # path('logout/',views.LogoutAPIView.as_view(),name="logout"),
    # path('user/',views.AuthUserAPIView.as_view(),name="auth-user"),
    path('listuser/',views.GetAllUsers.as_view(),name="list-user"), # this oneeeeeeeeeee
    path('list-user/', views.GetAllUser.as_view(), name='list-user'), 
    path('register-user/',views.RegisterUserViaEmail.as_view(),name='register-user'),
    # path('updateafterregister/<int:id>', views.UpdateAfterRegister.as_view(), name='UpdateAfterRegister'),
    path('resetpassword/', views.ResetPasswordViaEmailView2.as_view(), name='ResetPasswordViaEmail'),
    path('updateUser/<str:id>',views.updateDestroyUserApiView.as_view(),name='updateuser'),
    path('updateUserPassword/<str:id>',views.ChangePassword.as_view(),name='updateuserpassword'),
    path('deleteUser/<str:id>',views.updateDestroyUserApiView.as_view(),name='deleteuser'),
    # path('updateUserPhoto/<str:id>', views.UserProfilePhotoUploadView.as_view(), name='upload-profile-photo'),
    path('fetchUsersByRole/', views.FetchAllUserByRole.as_view(), name='fetch-by-role'), 
    path('getAllRoles/', views.RoleListView.as_view(), name='get-roles'),
    path('getUser/<str:id>', views.getUserApiView.as_view(), name='get-user'),
    # path('profiles/', views.UserProfileListView.as_view(), name='profile-list'),
    path('profiles/<int:pk>/', views.UserProfileDetailView.as_view(), name='profile-detail'),
    path('profiles/update/<int:pk>/', views.UserProfileUpdateView.as_view(), name='profile-update'),
    path('managers/', views.ManagerListView.as_view(), name='manager-list'),
    path('permissions/', views.AllPermissionsView.as_view(), name='get_all_permissions'),
    path('roles/', views.GetAllRoles.as_view(), name='get_all_roles_with_permissions'),
    path('roles/permissions/<int:role_id>', views.UpdateRolePermissionsView.as_view(), name='get_all_roles_with_permissions'),
    

    path('assetsTypes/', views.AssetTypesAPIView.as_view(), name='asset-list-create'),
    path('users/<int:user_id>/add-assets/', views.AssetAssignmentCreateView.as_view(), name='add_asset_to_user'),
    path('users/<int:user_id>/assets/', views.UserAssetsView.as_view(), name='user_assets'),
    # path('asset-assignments/<int:asset_assignment_id>/', views.AssetAssignmentDetailsView.as_view(), name='asset_assignment_details'),
    path('users/<int:user_id>/assets/<int:asset_id>/', views.UserAssetDetailView.as_view(), name='user_asset_detail'),
    path('status-choices/', views.get_status_choices, name='status-choices'),
    path('marital-status-choices/', views.get_marital_status_choices, name='marital-status-choices'),
]