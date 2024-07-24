from rest_framework.generics import CreateAPIView,ListAPIView,RetrieveUpdateDestroyAPIView
from .models import Meetingroom,MeetingroomReservation
from .serializers import MeetingroomSerilaizer,MeetingroomReservationSerilaizer,MeetingroomReservationRequestsSerilaizer
from rest_framework.decorators import APIView
from rest_framework.response import Response
from rest_framework import status
from authentication.models import TALENT_MANAGEMENT, User
from authentication.serializers import userSerializer
from rest_framework.permissions import IsAuthenticated
from .permissions import CanAddMeetingroom,CanChangeMeetingroom,CanDeleteMeetingroom
# Create your views here.
class CreateMeetingroom(CreateAPIView):
    permission_classes = [IsAuthenticated,CanAddMeetingroom]
    serializer_class = MeetingroomSerilaizer
    queryset = Meetingroom.objects.all()

    def perform_create(self,serializer):
        return serializer.save()

class ListMeetingroom(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MeetingroomSerilaizer
    queryset = Meetingroom.objects.all()
    def get_queryset(self):
        return self.queryset.all()

class updateDestroyMeetingroomApiView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated,CanChangeMeetingroom,CanDeleteMeetingroom]
    queryset=Meetingroom.objects.all()
    serializer_class = MeetingroomSerilaizer
    lookup_field="id"
    def get_queryset(self):
        return self.queryset
    
class MeetingRoomReservationRequestView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = MeetingroomReservationSerilaizer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Validate user and leave type existence
        user_id = serializer.validated_data.get('creator')
        try:
            user = User.objects.get(email=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)

        reservation = serializer.save(status='Pending')  
        reservation.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class getMeetingroomReservationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request,user_id):
        jas=User.objects.get(id=user_id)
        user=userSerializer(jas).data
        role = user['role']

        
        if role == TALENT_MANAGEMENT:
            requests = MeetingroomReservation.objects.filter(status='Pending')
        else:
            requests = []

        serializer = MeetingroomReservationRequestsSerilaizer(requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request,user_id):
        jas=User.objects.get(id=user_id)
        user=userSerializer(jas).data
        role = user['role']
        reservation = MeetingroomReservation.objects.get(id=request.data['id'])
        if(role==TALENT_MANAGEMENT):
            if(request.data['status']=='Declined'):
                reservation.status = 'Declined'
                reservation.save()
            
            elif(request.data['status']=='Approved'):
                reservation.status = 'Approved'
                reservation.save()
        else:
            return Response({'error': 'Invalid role'}, status=status.HTTP_403_FORBIDDEN)
        
        return Response({'Message':'Status Changed'}, status=status.HTTP_200_OK)


# class ListallMeetingroom(ListAPIView):
#     authentication_classes=[]
#     serializer_class = GetAllMeetingroomSerilaizer
#     queryset = Meetingroom.objects.all()
#     def get_queryset(self):
#         return self.queryset.all()
        
# class GetMeetingroomByUser(ListAPIView):
#     authentication_classes=[]
#     serializer_class = GetMeetingroomByUserSerilaizer
#     def get_queryset(self):
#         return Meetingroom.objects.values().filter(assigned_to = self.kwargs['id'])



# class GetMeetingroomByCreator(ListAPIView):
#     authentication_classes=[]
#     serializer_class = GetMeetingroomBycreatorSerilaizer
#     def get_queryset(self):
#         return Meetingroom.objects.values().filter(created_by = self.kwargs['id'])



# class GetMeetingroomByCreatorWithaffectedTo(ListAPIView):
#     authentication_classes=[]
#     serializer_class = GetMeetingroomBycreatorWithAffectedToSerilaizer
    
#     def get_queryset(self):
#         q = Meetingroom.objects.values().filter(created_by = self.kwargs['id'])
#         t=q['assigned_to']      
#         return q       