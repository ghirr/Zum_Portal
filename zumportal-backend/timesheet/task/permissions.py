from rest_framework.permissions import BasePermission



class IsOwner(BasePermission):
    def has_permission(self, request, obj):
        print(obj)
        return (obj.creator__id==self.request.user.id or obj.affectedTo__id==self.user.id)
    


class CanViewTask(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('view_task')

class CanAddTask(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('add_task')

class CanChangeTask(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('change_task')

class CanDeletetask(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('delete_task')
