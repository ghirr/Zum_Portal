from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.response import Response
from .models import Attendance
from .serializers import AttendanceSerializer, GetAttendanceSerializer
from leaves.models import Leave
from TT.models import TT

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = GetAttendanceSerializer

    def getAllAttendance(self, request):
        # Extract the date from the query parameters
        date = request.query_params.get('date')
        if not date:
            return Response({'error': 'Date is required'}, status=status.HTTP_400_BAD_reply)

        # Fetch normal attendances
        attendances = Attendance.objects.filter(date=date)
        # Fetch leaves and TTs (remote work) that are approved and start on the specified date
        leave_attendances = Leave.objects.filter(leave_start=date, status='Approved')
        tt_attendances = TT.objects.filter(tt_start=date, status='Approved')

        # Serialize the data
        attendance_data = GetAttendanceSerializer(attendances, many=True).data
        leave_data = [{'employee': leave.user.id, 'status': 'Leave', 'date': leave.leave_start} for leave in leave_attendances]
        tt_data = [{'employee': tt.user.id, 'status': 'Remote', 'date': tt.tt_start} for tt in tt_attendances]

        # Combine all data into a single list
        combined_data = attendance_data + leave_data + tt_data

        # Return the combined data as a response
        return Response(combined_data)

    def updateEmployeeStatus(self, request, employee_id=None):
        # Handling POST data to update or create an attendance record
        date = request.data.get('date')
        if not date:
            return Response({'error': 'Date is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Try fetching an existing attendance record
            attendance = Attendance.objects.get(employee__id=employee_id, date=date)
        except Attendance.DoesNotExist:
            # If not found, create a new record
            attendance = Attendance(employee_id=employee_id, date=date)

        # Serialize the attendance data
        serializer = AttendanceSerializer(attendance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def get_status_choices(request):
    choices = [status[0] for status in Attendance.STATUS_CHOICES]
    return JsonResponse(choices, safe=False)
