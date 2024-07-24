from django.urls import path
from .views import EventsListView,EventUpdateView,EventEditDetailsView

urlpatterns = [
    path('', EventsListView.as_view(), name='events_list'),
    path('<event_id>', EventUpdateView.as_view(), name='events_edit'),
    path('details/<event_id>', EventEditDetailsView.as_view(), name='event_details_edit'),
]