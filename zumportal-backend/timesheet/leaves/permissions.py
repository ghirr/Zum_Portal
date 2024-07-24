from rest_framework.permissions import BasePermission

class CanViewLeave(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('view_leave')

class CanAddLeave(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('add_leave')

class CanChangeLeave(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('change_leave')

class CanDeleteLeave(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('delete_leave')
