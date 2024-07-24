from django.contrib.auth.models import Permission
from django.db import IntegrityError
from django.shortcuts import get_object_or_404
from rest_framework.generics import GenericAPIView,UpdateAPIView,ListAPIView,RetrieveUpdateDestroyAPIView
from django.views.generic import View
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import generics,status
from .serializers import  AssetAssignmentSerializer, LoginSerializer,LogoutSerializer, ResetPasswordSerializer, UpdateUserSerilaizer, UserAssetSerializer, UserAssetUpdateSerializer, UserDataBaseSerializer, UserProfileSerializer,userSerializer,RegisterUserSerializer,Registerserilaizer,ChangePasswordSerializer,UserSerializerWithImage,ProfileSerializer,AddAssetToUserSerializer,AllRoleSerializer
from rest_framework.response import Response
from django.contrib.auth.tokens import default_token_generator
from .models import  User, UserAsset,ROLES_CHOICES,Role
from django.core.mail import EmailMultiAlternatives
from django.http import JsonResponse
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from .permissions import CanChangeUser,CanDeleteUser,CanViewUser,CanChangeRole,CanViewRole,CanAddUser,CanAddUserAsset,CanChangeUserAsset,CanDeleteUserAsset

#region           Users      #

class updateDestroyUserApiView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UpdateUserSerilaizer
    lookup_field = "id"
    def update(self, request, *args, **kwargs):
        self.permission_classes = [CanChangeUser]
        self.check_permissions(request)

        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    def delete(self, request, *args, **kwargs):
        self.permission_classes = [CanDeleteUser]
        self.check_permissions(request)

        user = self.get_object()
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class ChangePassword(UpdateAPIView):
    authentication_classes = []
    serializer_class = ChangePasswordSerializer
    lookup_field = "id"
    queryset = User.objects.all()
    
    
class GetAllUser(ListAPIView):
    permission_classes = [IsAuthenticated,CanViewUser]
    serializer_class = userSerializer
    queryset = User.objects.all()
    
    def get_queryset(self):
        return self.queryset.all()


class GetAllRoles(ListAPIView):
    queryset = Role.objects.all().order_by('id')
    serializer_class = AllRoleSerializer


class UpdateRolePermissionsView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, role_id):

        self.permission_classes = [CanChangeRole]
        self.check_permissions(request)
        
        permission_codenames = request.data

        try:
            role = Role.objects.get(id=role_id)
        except Role.DoesNotExist:
            return Response({'error': 'Role does not exist'}, status=status.HTTP_404_NOT_FOUND)

        # Fetch permissions based on codenames
        permissions = Permission.objects.filter(codename__in=permission_codenames)
        
        # Check if all provided codenames are valid
        valid_permission_codenames = set(permissions.values_list('codename', flat=True))
        invalid_codenames = set(permission_codenames) - valid_permission_codenames
        
        if invalid_codenames:
            return Response({'error': f'Invalid permission codenames: {", ".join(invalid_codenames)}'}, status=status.HTTP_400_BAD_REQUEST)
        
        role.permissions.set(permissions)
        role.save()
        
        return Response({'status': 'permissions updated', 'role': role.name}, status=status.HTTP_200_OK)
    

class RoleListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):

        roles = ROLES_CHOICES  # Fetch roles from your User model
        return Response(roles)

class FetchAllUserByRole(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializerWithImage
    def get_queryset(self):
        return User.objects.all()

class GetAllUsers(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserDataBaseSerializer
    queryset = User.objects.all().order_by('id')
    def get_queryset(self):
        return self.queryset.all()
    
class getUserApiView(RetrieveUpdateDestroyAPIView):
    permission_classes=[IsAuthenticated]
    queryset=User.objects.all()
    serializer_class = userSerializer
    lookup_field="id"
    def get_queryset(self):
        return self.queryset
    
# class UpdateAfterRegister(UpdateAPIView):
#     authentication_classes = []
#     serializer_class = Registerserilaizer
#     lookup_field = "id"
#     queryset = User.objects.all()


class RegisterUserViaEmail(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RegisterUserSerializer

    def post(self, request):
        self.permission_classes = [CanAddUser]
        self.check_permissions(request)

        user_data = request.data
        serializer = self.serializer_class(data=user_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user_data = serializer.data
        user = User.objects.get(id=user_data['id'])
        current_site = 'localhost:4200'
        relativelink = '/authentication/reset-password/'+str(user.id)
        absurl = 'http://'+current_site + relativelink
        email_body = "<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /></head><body><div class=''><div style='background:#f9f9f9'><div style='margin:0px auto;max-width:640px;background:transparent'><table role='presentation' cellpadding='0' cellspacing='0'style='font-size:0px;width:100%;background:transparent' align='center' border='0'><tbody><tr><td style='text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 0px'><div aria-labelledby='mj-column-per-100' class='m_4819380286727024960mj-column-per-100'style='vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%'><table role='presentation' cellpadding='0' cellspacing='0' width='100%'border='0'><tbody><tr><td style='word-break:break-word;font-size:0px;padding:0px'align='center'><table role='presentation' cellpadding='0' cellspacing='0'style='border-collapse:collapse;border-spacing:0px'align='center' border='0'><tbody><tr><td style='width:138px'></td></tr></tbody></table></td></tr></tbody></table></div></td></tr></tbody></table></div><div style='max-width:640px;margin:0 auto;border-radius:4px;overflow:hidden'><div style='margin:0px auto;max-width:640px;background:#ffffff'><table role='presentation' cellpadding='0' cellspacing='0'style='font-size:0px;width:100%;background:#ffffff' align='center' border='0'><tbody><tr><td style='text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 50px'><table role='presentation' cellpadding='0' cellspacing='0' width='100%' border='0'><tbody><tr><td style='word-break:break-word;font-size:0px;padding:0px'><div style='color:#737f8d;font-family:Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;font-size:16px;line-height:24px;text-align:left'><h2 style='font-family:Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;font-weight:500;font-size:20px;color:#4f545c;letter-spacing:0.27px'align='center'><b>Welcome to ZUM PORTAL</b></h2></div></td></tr><tr><td style='word-break:break-word;font-size:0px;padding:30px 0px'><p style='font-size:1px;margin:0px auto;border-top:1px solid #dcddde;width:100%'></p></td></tr><tr><td style='word-break:break-word;font-size:0px;padding:0px'><div style='color:#737f8d;font-family:Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;font-size:16px;line-height:24px;text-align:left' ><p align='center'>Click on this button to complete your registration</p></div></td></tr><tr><td style='word-break:break-word;font-size:0px;padding:10px 25px;padding-top:20px'align='center'><table role='presentation' cellpadding='0' cellspacing='0' style='border-collapse:separate'align='center' border='0'><tbody><tr><td style='border:none;border-radius:3px;color:white;padding:15px 19px' align='center' valign='middle'><form action="+absurl+"><input value='Register'type='submit' align='center' style='padding:12px 24px;color:#ffffff;font-weight:400;display:inline-block;text-decoration:none;font-size:16px;line-height:1.25em;border-color:#0a66c2;background-color:#4b71ed;border-radius:34px;border-width:1px;border-style:solid'></form></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div></div><div style='margin:0px auto;max-width:640px;background:transparent'><table role='presentation' cellpadding='0' cellspacing='0' style='font-size:0px;width:100%;background:transparent' align='center' border='0'><tbody><tr><td style='text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:20px 0px'><div aria-labelledby='mj-column-per-100' class='m_4819380286727024960mj-column-per-100' style='vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%'><table role='presentation' cellpadding='0' cellspacing='0' width='100%' border='0'><tbody><tr><td style='word-break:break-word;font-size:0px;padding:0px'align='center' ><div style='color:#99aab5;font-family:Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;font-size:12px;line-height:24px;text-align:center'><strong>Copyright &copy; ZUM-IT</strong><br>Sent with &#10084; from ZUM-PORTAL.</div></td></tr></tbody></table></div></td></tr></tbody></table></div></div></div></body></html>"
        data = {'email_body': email_body, 'email_to': user.email,'email_subject': 'Continue your registration'}
        email = EmailMultiAlternatives(subject = data['email_subject'], body = 'email_body', to =[data['email_to']])
        email.attach_alternative(email_body, "text/html")
        email.send()
        return Response(user_data, status = status.HTTP_201_CREATED)

class LoginAPIView(generics.GenericAPIView):
    serializer_class=LoginSerializer
    def post(self,request):
        serializer= self.serializer_class(data=request.data,context={'request': request})
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

# class AuthUserAPIView(generics.GenericAPIView):
#     permission_classes=(permissions.IsAuthenticated,)

#     def get(self,request):
#         user=User.objects.get(pk=request.user.pk)
#         serializer=userSerializer(user)
#         return Response(serializer.data)       

# class LogoutAPIView(generics.GenericAPIView):
#     serializer_class=LogoutSerializer
#     permission_classes=(permissions.IsAuthenticated,)
#     def post(self,request):
#         serializer=self.serializer_class(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(status=status.HTTP_204_NO_CONTENT)

# class UserProfilePhotoUploadView(generics.UpdateAPIView):
#     authentication_classes = []
#     queryset = User.objects.all()
#     serializer_class = UserProfileSerializer
#     lookup_field = "id"
#     def get_queryset(self):
#         return self.queryset


# class ResetPasswordViaEmailView(GenericAPIView):
#     authentication_classes = []
#     serializer_class = ResetPasswordSerializer

#     def post(self, request):
#         # Validate user input
#         serializer = self.serializer_class(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         email = serializer.validated_data.get('email')

#         # Find the user with the provided email
#         try:
#             user = User.objects.get(email=email)
#         except User.DoesNotExist:
#             return Response({'detail': 'User with this email does not exist.'}, status=status.HTTP_404_NOT_FOUND)

#         # Generate a password reset token
#         token = default_token_generator.make_token(user)
#         random_password = User.objects.make_random_password()

#         user.set_password(random_password)
#         user.save()

#         # Create a password reset link
#         # current_site = get_current_site(request)
#         # reset_url = reverse('password_reset_confirm', args=[user.id, token])
#         # absurl = 'http://' + current_site.domain + reset_url
#         absurl = 'http://localhost:4200/account/auth/login/'

#         # Compose the email
#         email_body = f"Hello,\n You have requested to reset your password for your zum portal account.Your new password is: {random_password}\n Click on this link to log in: {absurl}\n Best regards."
#         data = {
#             'email_body': email_body,
#             'email_to': email,
#             'email_subject': 'Password Reset Request',
#         }

#         # Send the email
#         email = EmailMultiAlternatives(
#             subject=data['email_subject'],
#             body=data['email_body'],
#             to=[data['email_to']],
#         )
#         email.send()

#         return Response({'detail': 'Password reset email sent successfully.'}, status=status.HTTP_200_OK)


class ResetPasswordViaEmailView2(GenericAPIView):
    authentication_classes = []
    serializer_class = ResetPasswordSerializer

    def post(self, request):
        # Validate user input
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data.get('email')

        # Find the user with the provided email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'detail': 'User with this email does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        # Generate a password reset token
        token = default_token_generator.make_token(user)
        # random_password = User.objects.make_random_password()

        #user.set_password(random_password)
        #user.save()

        # Create a password reset link
        current_site = 'localhost:4200'
        relativelink = '/authentication/reset-password/'+str(user.id)
        absurl = 'http://'+current_site + relativelink

        # Compose the email
        email_body = "<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /></head><body><div class=''><div style='background:#f9f9f9'><div style='margin:0px auto;max-width:640px;background:transparent'><table role='presentation' cellpadding='0' cellspacing='0'style='font-size:0px;width:100%;background:transparent' align='center' border='0'><tbody><tr><td style='text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 0px'><div aria-labelledby='mj-column-per-100' class='m_4819380286727024960mj-column-per-100'style='vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%'><table role='presentation' cellpadding='0' cellspacing='0' width='100%'border='0'><tbody><tr><td style='word-break:break-word;font-size:0px;padding:0px'align='center'><table role='presentation' cellpadding='0' cellspacing='0'style='border-collapse:collapse;border-spacing:0px'align='center' border='0'><tbody><tr><td style='width:138px'></td></tr></tbody></table></td></tr></tbody></table></div></td></tr></tbody></table></div><div style='max-width:640px;margin:0 auto;border-radius:4px;overflow:hidden'><div style='margin:0px auto;max-width:640px;background:#ffffff'><table role='presentation' cellpadding='0' cellspacing='0'style='font-size:0px;width:100%;background:#ffffff' align='center' border='0'><tbody><tr><td style='text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 50px'><table role='presentation' cellpadding='0' cellspacing='0' width='100%' border='0'><tbody><tr><td style='word-break:break-word;font-size:0px;padding:0px'><div style='color:#737f8d;font-family:Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;font-size:16px;line-height:24px;text-align:left'><h2 style='font-family:Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;font-weight:500;font-size:20px;color:#4f545c;letter-spacing:0.27px'align='center'><b>Welcome to ZUM PORTAL</b></h2></div></td></tr><tr><td style='word-break:break-word;font-size:0px;padding:30px 0px'><p style='font-size:1px;margin:0px auto;border-top:1px solid #dcddde;width:100%'></p></td></tr><tr><td style='word-break:break-word;font-size:0px;padding:0px'><div style='color:#737f8d;font-family:Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;font-size:16px;line-height:24px;text-align:left' ><p align='center'>Click on this button to reset your password</p></div></td></tr><tr><td style='word-break:break-word;font-size:0px;padding:10px 25px;padding-top:20px'align='center'><table role='presentation' cellpadding='0' cellspacing='0' style='border-collapse:separate'align='center' border='0'><tbody><tr><td style='border:none;border-radius:3px;color:white;padding:15px 19px' align='center' valign='middle'><form action="+absurl+"><input value='Reset'type='submit' align='center' style='padding:12px 24px;color:#ffffff;font-weight:400;display:inline-block;text-decoration:none;font-size:16px;line-height:1.25em;border-color:#0a66c2;background-color:#4b71ed;border-radius:34px;border-width:1px;border-style:solid;cursor: pointer;'></form></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div></div><div style='margin:0px auto;max-width:640px;background:transparent'><table role='presentation' cellpadding='0' cellspacing='0' style='font-size:0px;width:100%;background:transparent' align='center' border='0'><tbody><tr><td style='text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:20px 0px'><div aria-labelledby='mj-column-per-100' class='m_4819380286727024960mj-column-per-100' style='vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%'><table role='presentation' cellpadding='0' cellspacing='0' width='100%' border='0'><tbody><tr><td style='word-break:break-word;font-size:0px;padding:0px'align='center' ><div style='color:#99aab5;font-family:Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;font-size:12px;line-height:24px;text-align:center'><strong>Copyright &copy; ZUM-IT</strong><br>Sent with &#10084; from ZUM-PORTAL.</div></td></tr></tbody></table></div></td></tr></tbody></table></div></div></div></body></html>"

        data = {
            'email_body': email_body,
            'email_to': email,
            'email_subject': 'Password Reset Request',
        }

        # Send the email
        email = EmailMultiAlternatives(
            subject=data['email_subject'],
            body=data['email_body'],
            to=[data['email_to']],
        )
        email.attach_alternative(email_body, "text/html")
        email.send()

        return Response({'detail': 'Password reset email sent successfully.'}, status=status.HTTP_200_OK)    


# class RegisterUserViaEmail2(GenericAPIView):
#     authentication_classes = []
#     serializer_class = RegisterUserSerializer

#     def post(self, request):
#         user = request.data
#         serilaizer = self.serializer_class(data=user)
#         serilaizer.is_valid(raise_exception=True)
#         serilaizer.save()
#         user_data = serilaizer.data
#         print(user_data)
#         user = User.objects.get(id=user_data['id'])
#         current_site = 'localhost:4200'
#         relativelink = '/account/auth/signup/'+str(user_data['id'])
#         absurl = 'http://'+current_site + relativelink
#         # absurl = 'http://localhost:4200/account/auth/signup/'+str(user_data['id'])
#         email_body = """
#         <html>
#         <head>
#         <meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
#         </head>
#         <body>
#         <div class=''>
#         <div style='background:#f9f9f9'>
#         <div style='margin:0px auto;max-width:640px;background:transparent'>
#         <table role='presentation' cellpadding='0' cellspacing='0'style='font-size:0px;width:100%;background:transparent' align='center' border='0'>
#         <tbody>
#         <tr>
#         <td style='text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 0px'>
#         <div aria-labelledby='mj-column-per-100' class='m_4819380286727024960mj-column-per-100'style='vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%'>
#         <table role='presentation' cellpadding='0' cellspacing='0' width='100%'border='0'>
#         <tbody>
#         <tr>
#         <td style='word-break:break-word;font-size:0px;padding:0px'align='center'>
#         <table role='presentation' cellpadding='0' cellspacing='0'style='border-collapse:collapse;border-spacing:0px'align='center' border='0'>
#         <tbody>
#         <tr>
#         <td style='width:138px'>
#         </td>
#         </tr>
#         </tbody>
#         </table>
#         </td>
#         </tr>
#         </tbody>
#         </table>
#         </div>
#         </td>
#         </tr>
#         </tbody>
#         </table>
#         </div>
#         <div style='max-width:640px;margin:0 auto;border-radius:4px;overflow:hidden'>
#         <div style='margin:0px auto;max-width:640px;background:#ffffff'><table role='presentation' cellpadding='0' cellspacing='0'style='font-size:0px;width:100%;background:#ffffff' align='center' border='0'>
#         <tbody><tr><td style='text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 50px'>
#         <table role='presentation' cellpadding='0' cellspacing='0' width='100%' border='0'>
#         <tbody><tr><td style='word-break:break-word;font-size:0px;padding:0px'>
#         <div style='color:#737f8d;font-family:Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;font-size:16px;line-height:24px;text-align:left'>
#         <h2 style='font-family:Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;font-weight:500;font-size:20px;color:#4f545c;letter-spacing:0.27px'align='center'>
#         <b>Welcome to ZUM PORTAL</b>
#         </h2>
#         </div>
#         </td>
#         </tr>
#         <tr>
#         <td style='word-break:break-word;font-size:0px;padding:30px 0px'>
#         <p style='font-size:1px;margin:0px auto;border-top:1px solid #dcddde;width:100%'></p>
#         </td>
#         </tr>
#         <tr>
#         <td style='word-break:break-word;font-size:0px;padding:0px'><div style='color:#737f8d;font-family:Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;font-size:16px;line-height:24px;text-align:left' >
#         <p align='center'>Click on this button to complete your registration</p>
#         </div>
#         </td>
#         </tr>
#         <tr>
#         <td style='word-break:break-word;font-size:0px;padding:10px 25px;padding-top:20px'align='center'>
#         <table role='presentation' cellpadding='0' cellspacing='0' style='border-collapse:separate'align='center' border='0'>
#         <tbody>
#         <tr>
#         <td style='border:none;border-radius:3px;color:white;padding:15px 19px' align='center' valign='middle'>
#         <form action="+absurl+">
#         <input value='Register'type='submit' align='center' style='padding:12px 24px;color:#ffffff;font-weight:400;display:inline-block;text-decoration:none;font-size:16px;line-height:1.25em;border-color:#0a66c2;background-color:#4b71ed;border-radius:34px;border-width:1px;border-style:solid'>
#         </form>
#         </td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div></div>
#         <div style='margin:0px auto;max-width:640px;background:transparent'><table role='presentation' cellpadding='0' cellspacing='0' style='font-size:0px;width:100%;background:transparent' align='center' border='0'>
#         <tbody>
#         <tr>
#         <td style='text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:20px 0px'><div aria-labelledby='mj-column-per-100' class='m_4819380286727024960mj-column-per-100' style='vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%'>
#         <table role='presentation' cellpadding='0' cellspacing='0' width='100%' border='0'>
#         <tbody>
#         <tr>
#         <td style='word-break:break-word;font-size:0px;padding:0px'align='center' >
#         <div style='color:#99aab5;font-family:Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;font-size:12px;line-height:24px;text-align:center'>
#         <strong>Copyright &copy; ZUM-IT</strong><br>Sent with &#10084; from ZUM-PORTAL.</div></td></tr></tbody></table></div></td></tr></tbody></table></div></div></div></body></html>"""
#         data = {'email_body': email_body, 'email_to': user.email,'email_subject': 'Continue your registration'}
#         email = EmailMultiAlternatives(subject = data['email_subject'], body = 'email_body', to =[data['email_to']])
#         email.attach_alternative(email_body, "text/html")
#         email.send()
#         return Response(user_data, status = status.HTTP_201_CREATED)

# class UserProfileListView(generics.ListAPIView):
#     queryset = User.objects.all()
#     serializer_class = ProfileSerializer


class UserProfileDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = ProfileSerializer


class UserProfileUpdateView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = ProfileSerializer


class ManagerListView(View):
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        managers = User.objects.filter(role='Manager').values('id', 'firstname', 'lastname', 'profile_photo')

        # Adjust profile photo URLs
        for manager in managers:
            if manager['profile_photo']:
                manager['profile_photo'] = request.build_absolute_uri(settings.MEDIA_URL + manager['profile_photo'])

        return JsonResponse(list(managers), safe=False)

#endregion           Users      #

#region                   Permissions               #


class AllPermissionsView(View):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # Get all permissions
        permissions = Permission.objects.all()

        # Get unique model names
        #models = set(permission.content_type.model for permission in permissions)
        target_models = ['timesheet', 'project', 'user', 'customer','events','leave','tt','exitauthorization','attendance','userasset','task','meetingroomreservation','meetingroom']
        models = set(permission.content_type.model for permission in permissions if permission.content_type.model in target_models)
        # Return model names as JSON response
        return JsonResponse({'models': list(models)})
    #  def get(self, request):
    #     # Get all permissions
    #     permissions = Permission.objects.all()

    #     # Group permissions by model
    #     permissions_by_model = {}
    #     for permission in permissions:
    #         content_type = permission.content_type
    #         model_name = content_type.model
    #         if model_name not in permissions_by_model:
    #             permissions_by_model[model_name] = []
    #         permissions_by_model[model_name].append({
    #             'name': permission.name,
    #             'codename': permission.codename,
    #         })

    #     # Serialize permissions data
    #     serialized_permissions = [{'model': model, 'permissions': perms}
    #                                for model, perms in permissions_by_model.items()]

    #     # Return permissions data as JSON response
    #     return JsonResponse({'permissions': serialized_permissions})


#endregion                   Permissions               # 

#region                    Assets               #
class AssetTypesAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        asset_types = UserAsset.ASSET_TYPES
        return Response(asset_types)

class AssetAssignmentCreateView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, user_id):
        self.permission_classes = [CanAddUserAsset]
        self.check_permissions(request)
    
        serializer = AddAssetToUserSerializer(data=request.data)
        if serializer.is_valid():
            asset = serializer.validated_data.get('asset')
            serial_number = serializer.validated_data.get('serial_number')
            brand = serializer.validated_data.get('brand')
            vendor = serializer.validated_data.get('vendor')
            cost = serializer.validated_data.get('cost')

            user = get_object_or_404(User, id=user_id)

            try:
                user_asset = UserAsset.objects.create(
                    asset=asset,
                    serial_number=serial_number,
                    brand=brand,
                    vendor=vendor,
                    cost=cost,
                    assigned_to=user
                )
                return Response({'status': 'asset added'}, status=status.HTTP_201_CREATED)
            except IntegrityError:
                return Response({'error': 'This asset has already been assigned to this user.'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserAssetsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, user_id):
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        user_assets = UserAsset.objects.filter(assigned_to=user)
        serializer = AssetAssignmentSerializer(user_assets, many=True)
        return Response(serializer.data)

# class AssetAssignmentDetailsView(APIView):
#     def get(self, request, asset_assignment_id):
#         try:
#             asset_assignment = UserAsset.objects.get(id=asset_assignment_id)
#             serializer = UserAssetSerializer(asset_assignment)
#             return Response(serializer.data)
#         except UserAsset.DoesNotExist:
#             return Response({"error": "Asset assignment not found"}, status=404)
        
class UserAssetDetailView(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self, request, user_id, asset_id):
        self.permission_classes = [CanDeleteUserAsset]
        self.check_permissions(request)

        user_asset = get_object_or_404(UserAsset, assigned_to=user_id, id=asset_id)
        user_asset.delete()
        return Response({"message": "User asset deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

    def put(self, request, user_id, asset_id):
        self.permission_classes = [CanChangeUserAsset]
        self.check_permissions(request)

        user_asset = get_object_or_404(UserAsset, assigned_to=user_id, id=asset_id)
        serializer = UserAssetUpdateSerializer(user_asset, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#endregion                   Assets               #

def get_status_choices(request):
    choices = [status[0] for status in User.STATUS_CHOICES]
    return JsonResponse(choices, safe=False)

def get_marital_status_choices(request):
    choices = [status[0] for status in User.MARITAL_STATUS_CHOICES]
    return JsonResponse(choices, safe=False)