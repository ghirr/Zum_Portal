from django.http import JsonResponse
from authentication.models import User
from .models import Events
from .serializes import EventSerializer,VirtualEventSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from meetingroom.models import MeetingroomReservation
from meetingroom.serializers import MeetingroomReservationRequestsSerilaizer
from rest_framework.permissions import IsAuthenticated
from .permissions import CanAddEvent,CanChangeEvent,CanDeleteEvent

class EventsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        events = Events.objects.all()
        event_serializer = EventSerializer(events, many=True, context={'request': request})
        events_data = event_serializer.data

        users = User.objects.all()
        virtual_events = []

        for user in users:
            if user.birthday_date:
                virtual_events.append({
                    "id":user.id*2100,
                    "user": user,
                    "description": f"{user.firstname} {user.lastname}'s Birthday",
                    "title": "Birthday",
                    "start": f"{user.birthday_date}T16:00:00",
                    "end": f"{user.birthday_date}T17:00:00",
                    "recur":"yearly",
                    "editable":False,
                })

            if user.joining_date:
                virtual_events.append({
                    "id":user.id*2100,
                    "user": user,
                    "description": f"{user.firstname} {user.lastname}'s Joining Date",
                    "title": "Joining Date",
                    "start": f"{user.joining_date}T16:00:00",
                    "end": f"{user.joining_date}T17:00:00",
                    "recur":"yearly",
                    "editable":False
                })

        virtual_event_serializer = VirtualEventSerializer(virtual_events, many=True, context={'request': request})
        virtual_events_data = virtual_event_serializer.data

        reservations = []
        jassa= MeetingroomReservation.objects.filter(status='Approved')
        approved_reservations = MeetingroomReservationRequestsSerilaizer(jassa, many=True, context={'request': request})
        for app in approved_reservations.data:
            reservations.append(
                {
                    "id": app['creator']['id']*2144,
                    "user": app['creator'],
                    "description": app['purpose'],
                    "title": f"Reservation {app['room']['name']}",  # Access nested 'name' correctly
                    "start": f"{app['date']}T{app['reservation_start']}",  # Access dictionary values
                    "end": f"{app['date']}T{app['reservation_end']}",      # Access dictionary values
                    "editable": False
                }
            )

        combined_data = events_data + virtual_events_data + reservations

        return Response(combined_data, status=status.HTTP_200_OK)
    def post(self, request):
        self.permission_classes = [CanAddEvent]
        self.check_permissions(request)   

        data = request.data
        user=User.objects.get(id=data.get('user'))
        title = data.get('title')
        description = data.get('description', '')
        start_day = data.get('start_day')
        end_day = data.get('end_day')
        start_hour = data.get('start_hour')
        end_hour = data.get('end_hour')

        if title and start_day and end_day:
            event = Events.objects.create(
                user=user,
                title=title,
                description=description,
                start_day=start_day,
                end_day=end_day,
                start_hour=start_hour,
                end_hour=end_hour
            )
            return JsonResponse({'message': 'Event created successfully', 'event_id': event.id}, status=201)
        else:
            return JsonResponse({'error': 'Missing required fields'}, status=400)
        
class EventUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, event_id):
        self.permission_classes = [CanChangeEvent]
        self.check_permissions(request)   
        try:
            data = request.data
            event = Events.objects.get(id=event_id)
            event.start_day = data['start']
            event.end_day = data['end']
            if(data['start_hour'] and data['end_hour']):
                event.start_hour=data['start_hour'];
                event.end_hour=data['end_hour']
            event.save()
            return JsonResponse({'status': 'success'})
        except Events.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Event not found'}, status=404)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


    def delete(self, request, event_id, *args, **kwargs):
        self.permission_classes = [CanDeleteEvent]
        self.check_permissions(request)   
        try:
            event = Events.objects.get(id=event_id)
        except Events.DoesNotExist:
            return JsonResponse({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)
        # Delete related customer files
        event.delete()
        return JsonResponse({'message': 'Customer deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    

class EventEditDetailsView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request, event_id):
        self.permission_classes = [CanChangeEvent]
        self.check_permissions(request) 

        try:
            data = request.data
            event = Events.objects.get(id=event_id)
            event.title = data['title']
            event.description = data['description']
            event.save()
            return JsonResponse({'status': 'success'})
        except Events.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Event not found'}, status=404)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


