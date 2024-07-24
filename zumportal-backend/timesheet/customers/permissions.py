from rest_framework.permissions import BasePermission

class CanViewCustomer(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('view_customer')

class CanAddCustomer(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('add_customer')

class CanChangeCustomer(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('change_customer')

class CanDeleteCustomer(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('delete_customer')
