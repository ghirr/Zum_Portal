from django.conf import settings
from rest_framework import serializers
from authentication.models import User,Role
from django.contrib import auth
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken,TokenError
from .models import User
from .models import User, UserAsset

class RoleSerializer(serializers.ModelSerializer): 
    class Meta:
        model = Role
        fields =['name'] 

class AllRoleSerializer(serializers.ModelSerializer): 
    permissions=serializers.SerializerMethodField()
    class Meta:
        model = Role
        fields =['id','name','permissions'] 
    
    def get_permissions(self, obj):
        permissions = obj.permissions.all()
        return [permission.codename for permission in permissions]

class RegisterUserSerializer(serializers.ModelSerializer):
    role = serializers.CharField()
    class Meta:
        model = User
        fields = ['id', 'email', 'role', 'firstname', 'lastname']

    def create(self, validated_data):
        role_name = validated_data.pop('role')
        try:
            role = Role.objects.get(name=role_name)
        except Role.DoesNotExist:
            raise serializers.ValidationError({"role": "Role with this name does not exist."})

        user = User.objects.create(role=role, **validated_data)
        return user


class Registerserilaizer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=120, min_length=6, write_only=True)

    class Meta:
        model = User
        fields = ('firstname', 'lastname', 'password', 'id',)

    def update(self, instance, validated_data):
        instance.firstname = validated_data.pop('firstname', instance.firstname)
        instance.lastname = validated_data.pop('lastname', instance.lastname)
        instance.set_password(validated_data.pop('password'))
        instance.save()
        return instance


class UserAssginedToProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'firstname', 'lastname', 'role', 'profile_photo',)

class userSerializer(serializers.ModelSerializer): 
    #user_permissions=serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields =('id','firstname','email', 'lastname','role', 'profile_photo')  
    # def get_user_permissions(self, obj):
    #     permissions = obj.user_permissions.all()
    #     return [permission.codename for permission in permissions]
    def get_role(self, obj):
        return obj.role.name if obj.role else None

 
class userSerializerWithImage(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'firstname', 'email', 'lastname', 'role', 'profile_photo')


class UserSerializerWithImage(serializers.ModelSerializer):
    profile_photo = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ('id', 'firstname', 'email', 'lastname', 'role', 'profile_photo',)

    def get_role(self, obj):
        return obj.role.name if obj.role else None
    def get_profile_photo(self, user):
        if user.profile_photo:
            return self.context['request'].build_absolute_uri(user.profile_photo.url)
        else:
            return None

class LoginSerializer(serializers.ModelSerializer): 
    email=serializers.EmailField(max_length=255,min_length=3)
    password=serializers.CharField(max_length=68,min_length=6,write_only=True)
    # firstname=serializers.CharField(max_length=68,min_length=6,read_only=True)
    # lastname=serializers.CharField(max_length=68,min_length=6,read_only=True)
    tokens=serializers.SerializerMethodField()
    profile_photo= serializers.ImageField(required=False)

    
    # user_profile = User.objects.get(user=request.user)
    # context = {'user_profile': user_profile}
    
    def get_tokens(self,obj):
        # 1/ get the real user from obj
        user =User.objects.get(email=obj['email'])
        return{
            'tokens' :user.tokens(),
          #  'access':user.tokens()['access'],
          #  'refresh':user.tokens()['refresh'], 
 
        }
    def get_profile_photo(self, user):
        if user.profile_photo:
            # Assuming MEDIA_URL is set correctly in your Django settings
            return self.context['request'].build_absolute_uri(user.profile_photo.url)
        else:
            return None
    class Meta: 
        model =User 
        fields=['id','email','password','tokens','profile_photo']
    
    def validate(self,attrs):
        email=attrs.get('email','')
        password=attrs.get('password','')

class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255, min_length=3)
    password = serializers.CharField(max_length=68, min_length=6, write_only=True)
    tokens = serializers.SerializerMethodField()
    profile_photo= serializers.ImageField(required=False)
    role = RoleSerializer(read_only=True)
    permissions=serializers.ListField(read_only=True)

    def get_tokens(self, obj):
        user = User.objects.get(email=obj['email'])
        return {'tokens': user.tokens()}

    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'tokens','profile_photo','role','permissions','firstname','lastname']

    def validate(self, attrs):
        email = attrs.get('email', '')
        password = attrs.get('password', '')

        user = auth.authenticate(email=email, password=password)

        if not user:
            raise AuthenticationFailed('Invalid credentials, try again ')

        return {
            'id': user.id,
            'role': user.role,
            'permissions': [perm.codename for perm in user.role.permissions.all()],
            'email': user.email,
            'tel': user.tel,
            'position': user.position,
            'lastname': user.lastname,
            'firstname': user.firstname,
            'ttamount':user.ttamount,
            'dayoffamount':user.dayoffamount,
            'profile_photo':user.profile_photo,
            'tokens': user.tokens(),
        }


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    default_error_messages = {'bad_token': ('Token is expired or invalid')}

    def validate(self, attrs):
        self.token = attrs['refresh']
        return attrs

    def save(self, **kwargs):
        try:
            RefreshToken(self.token).blacklist()
        except TokenError:
            self.fail('bad_token')


class UpdateUserSerilaizer(serializers.ModelSerializer):
    role = serializers.CharField()

    class Meta:
        model = User
        fields = ['id', 'firstname', 'lastname', 'email', 'role']

    def update(self, instance, validated_data):
        instance.firstname = validated_data.get('firstname', instance.firstname)
        instance.lastname = validated_data.get('lastname', instance.lastname)
        instance.email = validated_data.get('email', instance.email)

        role_name = validated_data.get('role')
        if role_name:
            try:
                role = Role.objects.get(name=role_name)
            except Role.DoesNotExist:
                raise serializers.ValidationError({"role": "Role with this name does not exist."})
            instance.role = role

        instance.save()
        return instance


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255, min_length=3)

    def validate_email(self, value):
        return value


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['profile_photo']
        
class ProfileSerializer(serializers.ModelSerializer):
    manager = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)
    profile_photo= serializers.ImageField(required=False)
    # manager = serializers.SerializerMethodField()
    # profile_photo = serializers.ImageField(required=False)
    asset_assignments = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    class Meta:
        model = User
        exclude = ('password', 'assets',)

    def get_role(self, obj):
        return obj.role.name if obj.role else None
    def to_representation(self, instance):
        data = super().to_representation(instance)
        manager_id = data.get('manager')
        if manager_id:
            manager = User.objects.filter(id=manager_id).values('id', 'firstname', 'lastname', 'email', 'profile_photo').first()
            if manager:
                profile_photo = manager.get('profile_photo')
                if profile_photo:
                    base_url = getattr(settings, 'BASE_URL', 'http://localhost:8000/')
                    manager['profile_photo'] = f"{base_url}media/{profile_photo}"  # Add 'media/' to the path
            data['manager'] = manager
        return data

    def get_asset_assignments(self, obj):
        asset_assignments = obj.user_assets.all()
        return AssetAssignmentSerializer(asset_assignments, many=True).data

    def get_manager(self, obj):
        return obj.manager_id
    
class UserDataBaseSerializer(serializers.ModelSerializer):
    user_permissions=serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id','profile_photo','firstname', 'lastname','position','birthday_date','joining_date','id_card','seniority','current_type_of_contract','social_security_number','marital_status','gender','current_salary','status','departure_date','departure_reason','email','role','user_permissions']
    def get_user_permissions(self, obj):
        permissions = obj.user_permissions.all()
        return [permission.codename for permission in permissions]
    def get_asset_assignments(self, obj):
        asset_assignments = obj.user_assets.all()
        return AssetAssignmentSerializer(asset_assignments, many=True).data

    def get_manager(self, obj):
        return obj.manager_id




class UserDataBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'profile_photo', 'firstname', 'lastname', 'position', 'birthday_date',
                  'joining_date', 'id_card', 'seniority', 'current_type_of_contract',
                  'social_security_number', 'marital_status', 'gender', 'current_salary',
                  'status', 'departure_date', 'departure_reason', 'email', 'role']


class ChangePasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=120, min_length=6, write_only=True)

    class Meta:
        model = User
        fields = ['password']

    def update(self, instance, validated_data):
        instance.set_password(validated_data['password'])
        instance.save()
        return instance


class UserSerializer(serializers.ModelSerializer):
    assets = serializers.PrimaryKeyRelatedField(many=True, queryset=UserAsset.objects.all())

    class Meta:
        model = User
        fields = ['id', 'firstname', 'lastname', 'profile_photo','ttamount','dayoffamount','exitamount','assets']  # Add other fields as needed
        # fields = ['id', 'firstname', 'lastname', 'profile_photo', 'assets']

    def create(self, validated_data):
        assets_data = validated_data.pop('assets', [])
        user = User.objects.create(**validated_data)
        user.assets.set(assets_data)
        return user

    def update(self, instance, validated_data):
        assets_data = validated_data.pop('assets', [])
        instance = super().update(instance, validated_data)
        instance.assets.set(assets_data)
        return instance


#                          ASSETS Serializes                            #

class UserAssetSerializer(serializers.ModelSerializer):
    asset = UserAsset.ASSET_TYPES
    class Meta:
        model = UserAsset
        fields = ['id', 'asset', 'assigned_to', 'serial_number', 'cost', 'brand', 'vendor', 'warranty', 'assigned_date']

class UserAssetUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAsset
        fields = ['serial_number', 'brand', 'vendor', 'cost']

class AssetAssignmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserAsset
        fields = ['id', 'asset', 'assigned_date', 'warranty', 'serial_number', 'cost', 'brand', 'vendor']

class AddAssetToUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAsset
        fields = ['asset', 'serial_number', 'brand', 'vendor', 'cost']

class AssetAssignmentSerializer(serializers.ModelSerializer):
    asset = UserAsset.ASSET_TYPES  # Nested serializer for Asset model

    class Meta:
        model = UserAsset
        fields = ['id', 'asset', 'assigned_date', 'warranty', 'serial_number', 'cost', 'brand', 'vendor']