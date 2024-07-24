from rest_framework.permissions import BasePermission

class CanViewProject(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('view_project')

class CanAddProject(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('add_project')

class CanChangeProject(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('change_project')

class CanDeleteProject(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('delete_project')
