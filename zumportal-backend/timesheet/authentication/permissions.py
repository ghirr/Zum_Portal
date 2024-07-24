from rest_framework.permissions import BasePermission

class CanViewUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('view_user')

class CanAddUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('add_user')

class CanChangeUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('change_user')

class CanDeleteUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('delete_user')
    
class CanViewRole(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('view_role')
class CanChangeRole(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('change_role')
    

class CanViewUserAsset(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('view_userasset')

class CanAddUserAsset(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('add_userasset')

class CanChangeUserAsset(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('change_userasset')

class CanDeleteUserAsset(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('delete_userasset')
