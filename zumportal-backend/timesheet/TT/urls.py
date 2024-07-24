from django.urls import path
from .views import TTListByUserView,RemainingTT,TTRequestView,TTUpdateView,TTDeleteView,TTList,ExitListByUserView,ExitRequestView,ExitUpdateView,ExitDeleteView,ExitList,TTApproverView,ExitApproverView

urlpatterns = [
    path('<int:user_id>', TTListByUserView.as_view(), name='tt_list_by_user'),
    path('remain/<int:user_id>', RemainingTT.as_view(), name='tt_user'),
    path('create/', TTRequestView.as_view(), name='create_tt'),
    path('edit/<int:id>', TTUpdateView.as_view(), name='update_tt'),
    path('delete/<int:id>', TTDeleteView.as_view(), name='delete_tt'),
    path('', TTList.as_view(), name='tt_list'),
    path('ttapprovers/<user_id>',  TTApproverView.as_view(), name='aprovels_tt'),

    path('exit/<int:user_id>', ExitListByUserView.as_view(), name='exit_list_by_user'),
    path('exit/create/', ExitRequestView.as_view(), name='create_exit'),
    path('exit/edit/<int:id>', ExitUpdateView.as_view(), name='update_exit'),
    path('exit/delete/<int:id>', ExitDeleteView.as_view(), name='delete_exit'),
    path('exit', ExitList.as_view(), name='exit_list'),
    path('exit/exitapprovers/<user_id>',  ExitApproverView.as_view(), name='aprovels_tt'),


]