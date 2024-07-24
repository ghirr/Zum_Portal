from rest_framework.permissions import BasePermission

class CanViewTimesheet(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('view_timesheet')

class CanAddTimesheet(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('add_timesheet')

class CanChangeTimesheet(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('change_timesheet')

class CanDeleteTimesheet(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('delete_timesheet')
    
class CanImportTimesheet(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('import_timesheet')

class CanExportTimesheet(BasePermission):
    def has_permission(self, request, view):
        return request.user.role.has_permission('export_timesheet')

