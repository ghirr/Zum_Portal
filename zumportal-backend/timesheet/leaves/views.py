from datetime import date
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from leaves.serialzers import LeaveTypeSerialzer,LeaveSerialzer,CreateLeaveSerialzer,LeaveAdminSerialzer,LeaveApproverSerializer,LeaveTypeUpdateSerializer
from .models import LeaveType,Leave,LeaveApprover,ETAT_APPROVED,ETAT_DECLINED
from authentication.models import User,ProjectMANAGER,SCRUM_MASTER,TALENT_MANAGEMENT,General_Manger
from authentication.serializers import userSerializer
from rest_framework.generics import ListAPIView,RetrieveAPIView,DestroyAPIView,UpdateAPIView
from rest_framework.decorators import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q,Count,F
from rest_framework.permissions import IsAuthenticated
from .permissions import CanAddLeave,CanChangeLeave,CanDeleteLeave
from TT.permissions import CanViewRequests
from TT.models import TT,ExitAuthorization
from attendance.models import Attendance
from datetime import timedelta

class LeaveTypeListView(ListAPIView):
    serializer_class=LeaveTypeSerialzer
    def get_queryset(self):
        return LeaveType.objects.all().order_by('id')

class UpdateLeaveTypeView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request, type_id):
        self.permission_classes = [CanChangeLeave]
        self.check_permissions(request)  

        leave_type = get_object_or_404(LeaveType, id=type_id)
        serializer = LeaveTypeUpdateSerializer(leave_type, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Leave type updated successfully"}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LeaveListByUserView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class=LeaveSerialzer
    def get_queryset(self):
        user_id = self.kwargs['user_id']   
        return Leave.objects.filter(user_id=user_id).order_by('-leave_start','-status')  

class LeaveList(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class=LeaveAdminSerialzer
    def get_queryset(self):
        return Leave.objects.order_by('-leave_start','-status') 
    
class RemainingLeaves(RetrieveAPIView):
   permission_classes = [IsAuthenticated]

   def retrieve(self, request, *args, **kwargs):
        user_id = self.kwargs['user_id']  # Get the user ID from the request
        try:
            user = User.objects.get(id=user_id)  # Filter queryset by user ID
        except User.DoesNotExist:
            return Response({"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)

        data = {
            "remaining_leaves": user.dayoffamount,
            "remaining_TT": user.ttamount,
            "remaining_exit": user.exitamount,
        }

        return Response(data, status=status.HTTP_200_OK)
       
class LeaveRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        self.permission_classes = [CanAddLeave]
        self.check_permissions(request)  

        serializer = CreateLeaveSerialzer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Validate user and leave type existence
        user_id = serializer.validated_data.get('user')
        leave_type_id = serializer.validated_data.get('type').id
        try:
            user = User.objects.get(email=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            leave_type = LeaveType.objects.get(id=leave_type_id)
        except LeaveType.DoesNotExist:
            return Response({'error': 'Leave type does not exist'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate leave dates and number of days
        leave_start = serializer.validated_data['leave_start']
        leave_end = serializer.validated_data['leave_end']

        if leave_end < leave_start:
            return Response({'error': 'End date cannot be before start date'}, status=status.HTTP_400_BAD_REQUEST)

        number_of_days = serializer.validated_data['number_of_days']
        print(number_of_days)
        if number_of_days < leave_type.minDays:
            return Response({'error': f'Minimum leave duration for {leave_type.name} is {leave_type.minDays} days'}, status=status.HTTP_400_BAD_REQUEST)
        
        if number_of_days > leave_type.maxDays:
            return Response({'error': f'Maximum leave duration for {leave_type.name} is {leave_type.maxDays} days'}, status=status.HTTP_400_BAD_REQUEST)

        # Save leave request with pending status
        leave = serializer.save(status=Leave.ETAT_PENDING)  # Assuming Leave.ETAT_PENDING is correctly defined
        leave.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class LeaveDeleteView(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Leave.objects.all()
    serializer_class = LeaveSerialzer  # Use the serializer that corresponds to your Leave model
    lookup_field = 'id'

    def destroy(self, request, *args, **kwargs):
        self.permission_classes = [CanDeleteLeave]
        self.check_permissions(request)  

        instance = self.get_object()

        # Check if the leave is in a deletable state, for example, only allow deletion of Pending leaves
        if instance.status != Leave.ETAT_PENDING:  # Assuming Leave.ETAT_PENDING is the status for pending leaves
            return Response({'error': 'Cannot delete leave request in current state'}, status=status.HTTP_400_BAD_REQUEST)

        self.perform_destroy(instance)
        return Response({'success': 'Leave request deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    
class LeaveUpdateView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Leave.objects.all()
    serializer_class = CreateLeaveSerialzer  # Use the serializer that corresponds to your Leave model
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        self.permission_classes = [CanChangeLeave]
        self.check_permissions(request) 

        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        # Check if the leave is in an editable state, for example, only allow editing of Pending leaves
        if instance.status != Leave.ETAT_PENDING:  # Assuming Leave.ETAT_PENDING is the status for pending leaves
            return Response({'error': 'Cannot edit leave request in current state'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)
    

#               Leave Approvel              #

class LeaveApproverView(APIView):
    permission_classes = [IsAuthenticated,CanViewRequests]

    def get(self, request,user_id):
        jas=User.objects.get(id=user_id)
        user=userSerializer(jas).data
        role = user['role']

        if role in [SCRUM_MASTER, ProjectMANAGER]:
            # Return pending LeaveApprovers for Scrum Master
            leave_approvers = LeaveApprover.objects.filter(user=user['id'], approved=LeaveApprover.ETAT_PENDING).distinct()
        # elif role == TALENT_MANAGEMENT:
        #     leave_approvers = LeaveApprover.objects.filter(
        #         Q(user=user_id) &
        #         Q(role=TALENT_MANAGEMENT) &
        #         Q(approved=LeaveApprover.ETAT_PENDING) &
        #         Q(leave__approvers__role='Project Manager') &
        #         ~Q(leave__approvers__approved=LeaveApprover.ETAT_DECLINED)
        #     ).annotate(
        #         project_manager_count=Count('leave__approvers', filter=Q(leave__approvers__role='Project Manager')),
        #         project_manager_approved_count=Count('leave__approvers', filter=Q(leave__approvers__role='Project Manager', leave__approvers__approved=LeaveApprover.ETAT_APPROVED))
        #     ).filter(
        #         project_manager_count=F('project_manager_approved_count')
        #     ).distinct()
        elif role == TALENT_MANAGEMENT:
            # Fetch pending leave requests for Talent Management approval
            leave_approvers = LeaveApprover.objects.filter(
                Q(user=user_id) &
                Q(role=TALENT_MANAGEMENT) &
                Q(approved=LeaveApprover.ETAT_PENDING)
            ).annotate(
                project_manager_count=Count('leave__approvers', filter=Q(leave__approvers__role='Project Manager')),
                project_manager_approved_count=Count('leave__approvers', filter=Q(leave__approvers__role='Project Manager', leave__approvers__approved=LeaveApprover.ETAT_APPROVED)),
                scrum_master_count=Count('leave__approvers', filter=Q(leave__approvers__role=SCRUM_MASTER)),
                scrum_master_approved_count=Count('leave__approvers', filter=Q(leave__approvers__role=SCRUM_MASTER, leave__approvers__approved=LeaveApprover.ETAT_APPROVED))
            ).filter(
                # Either no Project Managers or Scrum Masters are assigned
                Q(project_manager_count=0, scrum_master_count=0) |
                # Or all assigned Project Managers have approved
                (Q(project_manager_count__gt=0) & Q(project_manager_count=F('project_manager_approved_count'))) |
                # Or all assigned Scrum Masters have approved
                (Q(scrum_master_count__gt=0) & Q(scrum_master_count=F('scrum_master_approved_count')))
            ).distinct()
        elif role == 'General Manager':
            leave_approvers = LeaveApprover.objects.filter(
                Q(user=user_id) &
                Q(role='General Manager') &
                Q(approved=LeaveApprover.ETAT_PENDING) &
                Q(leave__approvers__role='Talent Management') &
                ~Q(leave__approvers__approved=LeaveApprover.ETAT_DECLINED)
            ).annotate(
                talent_management_count=Count('leave__approvers', filter=Q(leave__approvers__role='Talent Management')),
                talent_management_approved_count=Count('leave__approvers', filter=Q(leave__approvers__role='Talent Management', leave__approvers__approved=LeaveApprover.ETAT_APPROVED))
            ).filter(
                talent_management_count=F('talent_management_approved_count')
            ).distinct()

        else:
            return Response({'error': 'Invalid role'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = LeaveApproverSerializer(leave_approvers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request,user_id):
        jas=User.objects.get(id=user_id)
        user=userSerializer(jas).data
        role = user['role']
        leave = Leave.objects.get(pk=request.data['leave'])
        leave_approver = LeaveApprover.objects.get(pk=request.data['id'])

        if role in [SCRUM_MASTER,ProjectMANAGER]:
            if(request.data['status']==ETAT_APPROVED):
                leave_approver.approved = ETAT_APPROVED
                leave_approver.save()

            elif(request.data['status']==ETAT_DECLINED):
                leave_approver.approved = ETAT_DECLINED
                leave_approver.save()
                leave.status=ETAT_DECLINED
                leave.save()
        
        elif(role==TALENT_MANAGEMENT):
            if(request.data['status']==ETAT_DECLINED):
                leave_approver.approved = ETAT_DECLINED
                leave_approver.save()
                leave.status=ETAT_DECLINED
                leave.save()
            
            elif(request.data['status']==ETAT_APPROVED):
                if(leave.type.name!='Annual leave'):
                    leaveUser=User.objects.get(email=leave.user)
                    if(leaveUser.dayoffamount>=leave.number_of_days):
                        leave_approver.approved = ETAT_APPROVED
                        leave_approver.save()
                        leaveUser.dayoffamount-=leave.number_of_days
                        leaveUser.save()
                        leave.status=ETAT_APPROVED
                        leave.save()
                        current_date = leave.leave_start
                        while current_date <= leave.leave_end:
                            Attendance.objects.create(
                                employee=leave.user,
                                date=current_date,
                                status='Leave'
                            )
                            current_date += timedelta(days=1)
                    else:
                        leave_approver.approved = ETAT_DECLINED
                        leave_approver.save()
                        leave.status=ETAT_DECLINED
                        leave.save()
                
                else:
                    leave_approver.approved = ETAT_APPROVED
                    leave_approver.save()
        
        elif(role==General_Manger):
            if(request.data['status']==ETAT_DECLINED):
                leave_approver.approved = ETAT_DECLINED
                leave_approver.save()
                leave.status=ETAT_DECLINED
                leave.save()

            elif(request.data['status']==ETAT_APPROVED):
                leaveUser=User.objects.get(email=leave.user)
                if(leaveUser.dayoffamount>=leave.number_of_days):
                    leave_approver.approved = ETAT_APPROVED
                    leave_approver.save()
                    leaveUser.dayoffamount-=leave.number_of_days
                    leaveUser.save()
                    leave.status=ETAT_APPROVED
                    leave.save()
                    current_date = leave.leave_start
                    while current_date <= leave.leave_end:
                        Attendance.objects.create(
                        employee=leave.user,
                        date=current_date,
                        status='Leave'
                            )
                        current_date += timedelta(days=1)
                else:
                    leave_approver.approved = ETAT_DECLINED
                    leave_approver.save()
                    leave.status=ETAT_DECLINED
                    leave.save()
        else:
            return Response({'error': 'Invalid role'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({'Message':'Status Changed'}, status=status.HTTP_200_OK)
            
class LeaveAdminHeader(APIView):
    def get(self, request):
        today = date.today()  # Define 'today' here
        
        pending_Leaves = Leave.objects.filter(status='Pending').count()
        pending_TT = TT.objects.filter(status='Pending').count()
        pending_Exit = ExitAuthorization.objects.filter(status='Pending').count()

        planed_Leaves = Leave.objects.filter(status='Approved', leave_start__lte=today, leave_end__gte=today).count()

        Pending_requests = pending_Leaves + pending_TT + pending_Exit
        
        Unplanned_Leaves = Attendance.objects.filter(status='Absent', date=today).count()

        notPresentToday = Attendance.objects.filter(date=today).exclude(status='Present').count()
        users = User.objects.filter(role__in=[1, 2, 3]).count()

        presents = f"{users - notPresentToday} / {users}"

        data = {
            "presents": presents,
            "planned": planed_Leaves,
            "unplanned": Unplanned_Leaves,
            "pending": Pending_requests
        }

        return JsonResponse(data)