from .serialzers import TTSerialzer,CreateTTSerialzer,TTAdminSerialzer,ExitSerialzer,CreateExitSerialzer,ExitAdminSerialzer,TTApproverSerializer,ExitApproverSerializer
from .models import TT,ExitAuthorization,ETAT_PENDING,TTApprover,ETAT_APPROVED,ETAT_DECLINED,ExitApprover
from rest_framework.generics import ListAPIView,RetrieveAPIView,UpdateAPIView,DestroyAPIView
from rest_framework.decorators import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum
from authentication.models import User,ProjectMANAGER,SCRUM_MASTER,TALENT_MANAGEMENT,General_Manger
from authentication.serializers import userSerializer
from django.db.models import Q,Count,F
from rest_framework.permissions import IsAuthenticated
from .permissions import CanAddTT,CanAddExitAuthorization,CanChangeExitAuthorization,CanChangeTT,CanDeleteExitAuthorization,CanDeleteTT,CanViewExitAuthorization,CanViewTT,CanViewRequests
from attendance.models import Attendance
from datetime import timedelta
# Create your views here.
class TTListByUserView(ListAPIView):
    permission_classes=[IsAuthenticated]
    serializer_class=TTSerialzer
    def get_queryset(self):
        user_id = self.kwargs['user_id']   
        return TT.objects.filter(user_id=user_id).order_by('-tt_start','-status')  
    
class RemainingTT(RetrieveAPIView):
   permission_classes=[IsAuthenticated]

   def retrieve(self, request, *args, **kwargs):
        user_id = self.kwargs['user_id']  
        try:
            user = User.objects.get(id=user_id)  
        except User.DoesNotExist:
            return Response({"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)

        all_tt = TT.objects.filter(user=user, status='Approved').aggregate(total=Sum('number_of_days'))['total'] or 0

        data = {
            "remaining_tt": user.tt_number,
            "token_tt": all_tt,
        }

        return Response(data, status=status.HTTP_200_OK)
   
class TTRequestView(APIView):
    permission_classes=[IsAuthenticated,CanAddTT]
    def post(self, request):
        serializer = CreateTTSerialzer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_id = serializer.validated_data.get('user')
        try:
            user = User.objects.get(email=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        

        tt_start = serializer.validated_data['tt_start']
        tt_end = serializer.validated_data['tt_end']

        if tt_end < tt_start:
            return Response({'error': 'End date cannot be before start date'}, status=status.HTTP_400_BAD_REQUEST)

        tt=serializer.save(status=ETAT_PENDING) 
        tt.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class TTUpdateView(UpdateAPIView):
    permission_classes=[IsAuthenticated,CanChangeTT]
    queryset = TT.objects.all()
    serializer_class = CreateTTSerialzer 
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        if instance.status != ETAT_PENDING:  
            return Response({'error': 'Cannot edit leave request in current state'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)
    
class TTDeleteView(DestroyAPIView):
    permission_classes=[IsAuthenticated,CanDeleteTT]
    queryset = TT.objects.all()
    serializer_class = TTSerialzer  
    lookup_field = 'id'

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.status != ETAT_PENDING:  
            return Response({'error': 'Cannot delete leave request in current state'}, status=status.HTTP_400_BAD_REQUEST)

        self.perform_destroy(instance)
        return Response({'success': 'Leave request deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

class TTList(ListAPIView):
    permission_classes=[IsAuthenticated]
    serializer_class=TTAdminSerialzer
    def get_queryset(self):
        return TT.objects.order_by('-tt_start','-status') 
    
class TTApproverView(APIView):
    permission_classes=[IsAuthenticated,CanViewRequests]

    def get(self, request,user_id):
        jas=User.objects.get(id=user_id)
        user=userSerializer(jas).data
        role = user['role']

        if role == ProjectMANAGER:
            tt_approvers = TTApprover.objects.filter(user=user['id'], approved=ETAT_PENDING).distinct()
        elif role == 'Talent Management':
            tt_approvers = TTApprover.objects.filter(
                Q(user=user_id) &
                Q(role='Talent Management') &
                Q(approved=ETAT_PENDING)
            ).annotate(
                project_manager_count=Count('tt__approvers', filter=Q(tt__approvers__role='Project Manager')),
                project_manager_approved_count=Count('tt__approvers', filter=Q(tt__approvers__role='Project Manager', tt__approvers__approved=ETAT_APPROVED))
            ).filter(
                #5555
                Q(project_manager_count=0) |
                # Or all assigned Project Managers have approved
                (Q(project_manager_count__gt=0) & Q(project_manager_count=F('project_manager_approved_count'))) 
            ).distinct()

        elif role == 'General Manager':
            tt_approvers = TTApprover.objects.filter(
                Q(user=user_id) &
                Q(role='General Manager') &
                Q(approved=ETAT_PENDING) &
                Q(tt__approvers__role='Talent Management') &
                ~Q(tt__approvers__approved=ETAT_DECLINED)
            ).annotate(
                talent_management_count=Count('tt__approvers', filter=Q(tt__approvers__role='Talent Management')),
                talent_management_approved_count=Count('tt__approvers', filter=Q(tt__approvers__role='Talent Management', tt__approvers__approved=ETAT_APPROVED))
            ).filter(
                talent_management_count=F('talent_management_approved_count')
            ).distinct()

        else:
            return Response({'error': 'Invalid role'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = TTApproverSerializer(tt_approvers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request,user_id):
        jas=User.objects.get(id=user_id)
        user=userSerializer(jas).data
        role = user['role']
        tt = TT.objects.get(pk=request.data['tt'])
        tt_approver = TTApprover.objects.get(pk=request.data['id'])

        if role == ProjectMANAGER:
            if(request.data['status']==ETAT_APPROVED):
                tt_approver.approved = ETAT_APPROVED
                tt_approver.save()

            elif(request.data['status']==ETAT_DECLINED):
                tt_approver.approved = ETAT_DECLINED
                tt_approver.save()
                tt.status=ETAT_DECLINED
                tt.save()
        
        elif(role==TALENT_MANAGEMENT):
            if(request.data['status']==ETAT_DECLINED):
                tt_approver.approved = ETAT_DECLINED
                tt_approver.save()
                tt.status=ETAT_DECLINED
                tt.save()
            
            elif(request.data['status']==ETAT_APPROVED):
                if tt.number_of_days<=5:
                    ttUser=User.objects.get(email=tt.user)
                    if(ttUser.ttamount>=tt.number_of_days):
                        tt_approver.approved = ETAT_APPROVED
                        tt_approver.save()
                        ttUser.ttamount-=tt.number_of_days
                        ttUser.save()
                        tt.status=ETAT_APPROVED
                        tt.save()
                        current_date = tt.tt_start
                        while current_date <= tt.tt_end:
                            Attendance.objects.create(
                            employee=tt.user,
                            date=current_date,
                            status='Remote'
                                )
                            current_date += timedelta(days=1)
                    else:
                        tt_approver.approved = ETAT_DECLINED
                        tt_approver.save()
                        tt.status=ETAT_DECLINED
                        tt.save()
                
                else:
                    tt_approver.approved = ETAT_APPROVED
                    tt_approver.save()
        
        elif(role==General_Manger):
            if(request.data['status']==ETAT_DECLINED):
                tt_approver.approved = ETAT_DECLINED
                tt_approver.save()
                tt.status=ETAT_DECLINED
                tt.save()
            
            elif(request.data['status']==ETAT_APPROVED):
                ttUser=User.objects.get(email=tt.user)
                if(ttUser.ttamount>=tt.number_of_days):
                    tt_approver.approved = ETAT_APPROVED
                    tt_approver.save()
                    ttUser.ttamount-=tt.number_of_days
                    ttUser.save()
                    tt.status=ETAT_APPROVED
                    tt.save()
                else:
                    tt_approver.approved = ETAT_DECLINED
                    tt_approver.save()
                    tt.status=ETAT_DECLINED
                    tt.save()

        else:
            return Response({'error': 'Invalid role'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({'Message':'Status Changed'}, status=status.HTTP_200_OK)



#                  Exit                #

class ExitListByUserView(ListAPIView):
    permission_classes=[IsAuthenticated]
    serializer_class=ExitSerialzer
    def get_queryset(self):
        user_id = self.kwargs['user_id']   
        return ExitAuthorization.objects.filter(user_id=user_id).order_by('-exit_day','-status')  

class ExitRequestView(APIView):
    permission_classes=[IsAuthenticated,CanAddExitAuthorization]
    def post(self, request):
        serializer = CreateExitSerialzer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_id = serializer.validated_data.get('user')
        print(user_id)
        try:
            user = User.objects.get(email=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        

        exit_start = serializer.validated_data['exit_start']
        exit_end = serializer.validated_data['exit_end']

        if exit_end < exit_start:
            return Response({'error': 'End date cannot be before start date'}, status=status.HTTP_400_BAD_REQUEST)

        
        serializer.save(status=ETAT_PENDING)  

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class ExitUpdateView(UpdateAPIView):
    permission_classes=[IsAuthenticated,CanChangeExitAuthorization]
    queryset = ExitAuthorization.objects.all()
    serializer_class = CreateExitSerialzer 
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        if instance.status != ETAT_PENDING:  
            return Response({'error': 'Cannot edit leave request in current state'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)
    
class ExitDeleteView(DestroyAPIView):
    permission_classes=[IsAuthenticated,CanDeleteExitAuthorization]
    queryset = ExitAuthorization.objects.all()
    serializer_class = CreateExitSerialzer  
    lookup_field = 'id'

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.status != ETAT_PENDING:  
            return Response({'error': 'Cannot delete leave request in current state'}, status=status.HTTP_400_BAD_REQUEST)

        self.perform_destroy(instance)
        return Response({'success': 'Leave request deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    
class ExitList(ListAPIView):
    permission_classes=[IsAuthenticated]
    serializer_class=ExitAdminSerialzer
    def get_queryset(self):
        return ExitAuthorization.objects.order_by('-exit_day','-status') 
    
class ExitApproverView(APIView):
    permission_classes=[IsAuthenticated,CanViewRequests]

    def get(self, request,user_id):
        jas=User.objects.get(id=user_id)
        user=userSerializer(jas).data

        exit_approvers = ExitApprover.objects.filter(user=user['id'], approved=ETAT_PENDING).distinct()

        serializer = ExitApproverSerializer(exit_approvers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request,user_id):
        jas=User.objects.get(id=user_id)
        user=userSerializer(jas).data
        role = user['role']
        exit = ExitAuthorization.objects.get(pk=request.data['exit'])
        exit_approver = ExitApprover.objects.get(pk=request.data['id'])

        if(role==TALENT_MANAGEMENT):
            if(request.data['status']==ETAT_DECLINED):
                exit_approver.approved = ETAT_DECLINED
                exit_approver.save()
                exit.status=ETAT_DECLINED
                exit.save()
            
            elif(request.data['status']==ETAT_APPROVED):
                exitUser=User.objects.get(email=exit.user)
                if(exitUser.exitamount>=exit.number_of_hours):
                    exit_approver.approved = ETAT_APPROVED
                    exit_approver.save()
                    exitUser.exitamount-=exit.number_of_hours
                    exitUser.save()
                    exit.status=ETAT_APPROVED
                    exit.save()
                    Attendance.objects.create(employee=exit.user,date=exit.exit_day,status='Half Day')
                else:
                    exit_approver.approved = ETAT_DECLINED
                    exit_approver.save()
                    exit.status=ETAT_DECLINED
                    exit.save()
                

        else:
            return Response({'error': 'Invalid role'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({'Message':'Status Changed'}, status=status.HTTP_200_OK)

