from rest_framework.permissions import BasePermission

class CanViewEvent(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('view_events')

class CanAddEvent(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('add_events')

class CanChangeEvent(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('change_events')

class CanDeleteEvent(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('delete_events')
