from rest_framework.permissions import BasePermission
from authentication.models import SIMPLE_USER

class CanViewExitAuthorization(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('view_exitauthorization')

class CanAddExitAuthorization(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('add_exitauthorization')

class CanChangeExitAuthorization(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('change_exitauthorization')

class CanDeleteExitAuthorization(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('delete_exitauthorization')
    
class CanViewTT(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('view_tt')

class CanAddTT(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('add_tt')

class CanChangeTT(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('change_tt')

class CanDeleteTT(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('delete_tt')
    
class CanViewRequests(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.name!=SIMPLE_USER

