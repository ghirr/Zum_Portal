from django.urls import path
from meetingroom import views

urlpatterns = [
    path('add-meetingroom/',views.CreateMeetingroom.as_view(),name='add-meetingroom'),
    path('list-meetingroom/',views.ListMeetingroom.as_view(),name='list-meetingroom'),
    path('delete-meetingroom/<int:id>',views.updateDestroyMeetingroomApiView.as_view(),name='delete-meetingroom'),
    path('update-meetingroom/<int:id>',views.updateDestroyMeetingroomApiView.as_view(),name='update-meetingroom'),

    path('book-room/',views.MeetingRoomReservationRequestView.as_view(),name='book-meetingroom'),
    path('requests/<int:user_id>',views.getMeetingroomReservationView.as_view(),name='requests_book-meetingroom'),
     

    # path('getmeetingroom/<int:id>',views.getMeetingroomApiView.as_view(),name='get-meetingroom'),
    # path('listmeetingroom/',views.ListallMeetingroom.as_view(),name='listallmeetingroom'),
    # path('GetmeetingroomByUser/<int:id>',views.GetmeetingroomByUser.as_view(),name='GetmeetingroomByUser'),
    # path('GetmeetingroomByCreator/<int:id>',views.GetmeetingroomByCreator.as_view(),name='GetmeetingroomByCreator'),
    # path('GetmeetingroomByCreatorWithaffectedTo/<int:id>',views.GetmeetingroomByCreatorWithaffectedTo.as_view(),name='GetmeetingroomByCreatorWithaffectedTo'),

    
]