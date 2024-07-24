from .models import Customer,CustomerFiles
from project.models import Project
from rest_framework import serializers

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerFiles
        fields = ['id','file','customer']
class CustomerFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerFiles
        fields = ['id','file']
class CustomerSerilaizer(serializers.ModelSerializer):
    numOfProjects=serializers.IntegerField()
    class Meta:
        model = Customer
        fields = ['id','name','description','adress','email','tel','joining_Date', 'numOfProjects','customer_photo']

class CustomerSerilaizer2(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id','name','description','adress','email','tel','joining_Date','customer_photo']

# class CustomerWithFileSerilaizer(serializers.ModelSerializer):
#     files = CustomerFileSerializer(many=True, read_only=True)
#     class Meta:
#         model = Customer
#         numOfProjects = serializers.IntegerField(read_only=True)
#         fields = ['id', 'name', 'description', 'adress', 'email', 'tel', 'joining_Date', 'customer_photo', 'files',]

#     def __init__(self, *args, files=None, **kwargs):
#         super().__init__(*args, **kwargs)
#         self.fields['files'] = CustomerFileSerializer(many=True, read_only=True, instance=files)
class AddCustomerSerilaizer(serializers.ModelSerializer):
    uploaded_files = serializers.ListField(
        child=serializers.FileField(allow_empty_file=False, use_url=False),
        write_only=True,
        required=False  # Set required to False to make it optional
    )

    class Meta:
        model = Customer
        fields = ['name', 'description', 'adress', 'email', 'tel', 'joining_Date', 'customer_photo', 'uploaded_files']

    def create(self, validated_data):
        uploaded_files = validated_data.pop("uploaded_files", [])

        # Create the customer without files
        customer = Customer.objects.create(**validated_data)

        # Create files associated with the customer
        for file in uploaded_files:
            CustomerFiles.objects.create(customer=customer, file=file)

        return customer

class CustomerPhotoSerilaizer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id','name','customer_photo']