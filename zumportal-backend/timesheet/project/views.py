from rest_framework.generics import CreateAPIView,ListAPIView,RetrieveUpdateDestroyAPIView,UpdateAPIView
from .models import Project, ProjectFiles
from .serializers import GetProjectByUserSerilaizer, ProjectFileSerializer, ProjectSerilaizer,GetProjectSerilaizer,UpdateProjectSerilaizer,GetAllProjectSerilaizer,GetProjectBycreatorSerilaizer,GetProjectBycreatorWithAffectedToSerilaizer,UpdateProjectManagerSerializer,UpdateProjectTeamSerializer,UpdateScrumMasterSerializer,GetProjectAllTeamSerilaizer,GetProjectWithCustomerSerilaizer
from rest_framework.parsers import MultiPartParser, FormParser
from django.db import transaction
from django.db.models import Q
from authentication.models import User
from authentication.serializers import UserAssginedToProjectSerializer
from rest_framework.decorators import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .permissions import CanAddProject,CanChangeProject,CanDeleteProject,CanViewProject


# Create your views here.
class CreateProject(CreateAPIView):
    permission_classes = [IsAuthenticated,CanAddProject]
    parser_classes = [MultiPartParser, FormParser]
    serializer_class = ProjectSerilaizer
    queryset = Project.objects.all()

    def perform_create(self, serializer):
        # Ensure you don't directly pop from request.data
        # Instead, safely extract the assigned_to data
        assigned_to_ids = self.request.data.getlist('assigned_to', [])
        uploaded_files = self.request.FILES.getlist('uploaded_files')

        # Call serializer.save() to create the Project instance without modifying request.data
        project_instance = serializer.save()

        # After saving, if assigned_to_ids is not empty, proceed to assign the users
        if assigned_to_ids:
            # Convert assigned_to_ids to integers, assuming they are not already
            assigned_to_ids = [int(id) for id in assigned_to_ids]
            for user_id in assigned_to_ids:
                try:
                    user = User.objects.get(pk=user_id)
                    project_instance.assigned_to.add(user)
                except User.DoesNotExist:
                    # Handle the case where the user does not exist
                    # Depending on your requirements, you might log this or send a response indicating the issue
                    pass

        # Assuming handling of uploaded_files is done elsewhere or not needed to be modified here

class DeleteFileAPIView(APIView):
    permission_classes = [IsAuthenticated,CanDeleteProject]
    def delete(self, request, file_id):
        try:
            with transaction.atomic():
                file_to_delete = ProjectFiles.objects.get(id=file_id)
                file_to_delete.file.delete()  # Delete the file from storage
                file_to_delete.delete()  # Delete the file record from the database
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProjectFiles.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class UploadFileAPIView(APIView):
    permission_classes = [IsAuthenticated,CanAddProject]
    def post(self, request, project_id, format=None):
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)

        # Check if 'file' key exists in request.FILES
        if 'file' in request.FILES:
            uploaded_files = request.FILES.getlist('file')
        else:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)
        
        file_obj = request.data.get('file')

        # Create a list of dictionaries with customer and file
        data_list = [{'project': project.id, 'file': file} for file in uploaded_files]

        serializer = ProjectFileSerializer(data=data_list, many=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ListProject(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = GetProjectSerilaizer
    queryset = Project.objects.all()
    def get_queryset(self):
        return self.queryset.all()

class updateDestroyProjectApiView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated,CanChangeProject]
    queryset = Project.objects.all()
    serializer_class = UpdateProjectSerilaizer
    lookup_field = "id"

    # Handle PUT request to update the project status
    def put(self, request, *args, **kwargs):
        project_instance = self.get_object()
        serializer = self.get_serializer(project_instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        # Update the status only if it's present in the request data
        if 'status' in request.data:
            project_instance.status = request.data['status']
            project_instance.save()
        self.perform_update(serializer)
        return Response(serializer.data)

class UpdateProjectManagerAPIView(UpdateAPIView):
    permission_classes = [IsAuthenticated,CanChangeProject]
    queryset = Project.objects.all()
    serializer_class = UpdateProjectManagerSerializer
    lookup_field = "id"

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        # Extract the new project manager ID from the request data
        new_manager_id = serializer.validated_data.get('project_manager')

        # Update the project manager field with the new manager object
        instance.project_manager = new_manager_id
        instance.save()

        return Response(serializer.data)

class UpdateScrumMasterAPIView(UpdateAPIView):
    permission_classes = [IsAuthenticated,CanChangeProject]
    queryset = Project.objects.all()
    serializer_class = UpdateScrumMasterSerializer
    lookup_field = "id"

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        # Extract the new project manager ID from the request data
        new_scrum_id = serializer.validated_data.get('scrum_master')

        # Update the project manager field with the new manager object
        instance.scrum_master = new_scrum_id
        instance.save()

        return Response(serializer.data)


class UpdateProjectTeamAPIView(APIView):
    permission_classes = [IsAuthenticated,CanChangeProject]
    def put(self, request, project_id):
        try:
            project = Project.objects.get(pk=project_id)
            serializer = UpdateProjectTeamSerializer(data=request.data)
            if serializer.is_valid():
                team_members = serializer.validated_data.get('team_members', [])
                project.assigned_to.set(team_members)
                return Response({'message': 'Project team updated successfully'}, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Project.DoesNotExist:
            return Response({"message": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

class DeleteProjectMemberAPIView(APIView):
    permission_classes = [IsAuthenticated,CanChangeProject]
    def delete(self, request, project_id):
        try:
            project = Project.objects.get(pk=project_id)
            member_id = request.query_params.get('member_id')  # Get member_id from query parameters
            # Check if the member is assigned to the project
            if project.assigned_to.filter(id=member_id).exists():
                project.assigned_to.remove(member_id)
                # Serialize the updated project data
                serializer = ProjectSerilaizer(project)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Member is not assigned to this project'}, status=status.HTTP_400_BAD_REQUEST)
        except Project.DoesNotExist:
            return Response({"message": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

class getProjectApiView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset=Project.objects.all()
    serializer_class = GetProjectSerilaizer
    lookup_field="id"
    def get_queryset(self):
        return self.queryset

class getAllProjectTeamApiView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset=Project.objects.all()
    serializer_class = GetProjectAllTeamSerilaizer
    lookup_field="id"
    def get_queryset(self):
        return self.queryset

# class ListallProject(ListAPIView):
#     authentication_classes=[]
#     serializer_class = GetAllProjectSerilaizer
#     queryset = Project.objects.all()
#     def get_queryset(self):
#         return self.queryset.all()
        
# class GetProjectByUser(ListAPIView):
#     authentication_classes=[]
#     serializer_class = GetProjectByUserSerilaizer
    
#     def get_queryset(self):
#         user_id = self.kwargs['id']  # Assuming you pass the user ID in the URL
#         user = User.objects.get(pk=user_id)

#         # Filter projects where the user is either assigned_to or manager
#         queryset = Project.objects.filter(Q(assigned_to=user) | Q(project_manager=user)| Q(scrum_master=user))
#         return queryset


# class GetProjectByCreator(ListAPIView):
#     authentication_classes=[]
#     serializer_class = GetProjectBycreatorSerilaizer
#     def get_queryset(self):
#         return Project.objects.values().filter(manager = self.kwargs['id'])



class GetProjectByCreatorWithaffectedTo(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = GetProjectBycreatorWithAffectedToSerilaizer
    
    def get_queryset(self):
        q = Project.objects.values().filter(manager = self.kwargs['id'])
        t=q['assigned_to']      
        return q     

class ListProjectByCustomer(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = GetProjectSerilaizer

    def get_queryset(self):
        customer_id = self.kwargs.get('customer_id')
        return Project.objects.filter(customer_id=customer_id)  
    
class ListProjectWithCustomer(ListAPIView):
    authentication_classes = []
    serializer_class = GetProjectWithCustomerSerilaizer

    def get_queryset(self):
        return Project.objects.all() 

class ProjectsByEmployeeView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, employee_id, format=None):
        """
        Get projects by employee ID.
        """
        try:
            employee = User.objects.get(id=employee_id)
        except User.DoesNotExist:
            return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)

        # Retrieve projects where the employee is the creator (created_by)
        manager_projects = Project.objects.filter(project_manager=employee)

        # Retrieve projects where the employee is assigned
        assigned_projects = Project.objects.filter(assigned_to=employee)

        # Retrieve projects where the employee is assigned
        scrum_projects = Project.objects.filter(scrum_master=employee)

        # Combine and remove duplicates
        all_projects = (manager_projects | assigned_projects | scrum_projects).distinct()

        serializer = GetProjectByUserSerilaizer(all_projects, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ProjectEmployeesAPIView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request, project_id):
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response({"message": "Project does not exist"}, status=status.HTTP_404_NOT_FOUND)

        # Get all users associated with the project
        users = project.assigned_to.all()
        if project.project_manager:
            users = users | User.objects.filter(id=project.scrum_master.id)

        serializer = UserAssginedToProjectSerializer(users, many=True)
        return Response(serializer.data)