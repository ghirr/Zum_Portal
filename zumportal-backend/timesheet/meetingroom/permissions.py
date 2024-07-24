from rest_framework.permissions import BasePermission

class CanViewMeetingroom(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('view_meetingroom')

class CanAddMeetingroom(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('add_meetingroom')

class CanChangeMeetingroom(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('change_meetingroom')

class CanDeleteMeetingroom(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('delete_meetingroom')
