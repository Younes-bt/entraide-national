from rest_framework import serializers
from django.db import transaction
from .models import Teacher
from accounts.models import User, UserRole # Assuming UserRole.TEACHER exists
from accounts.serializers import UserProfileSerializer, UserIsActiveUpdateSerializer 
# from programs.models import TrainingPrograme # Import if explicit queryset needed for PrimaryKeyRelatedField
# from centers.models import Center # Import if explicit queryset needed for PrimaryKeyRelatedField

class TeacherSerializer(serializers.ModelSerializer):
    """
    Serializer for the Teacher model.
    Returns detailed information about related objects.
    """
    user = UserProfileSerializer(read_only=True)
    center = serializers.StringRelatedField(read_only=True)
    program_name = serializers.StringRelatedField(source='program', read_only=True)
    program = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Teacher
        fields = [
            'id', 'user', 'center', 'program', 'program_name', 'contarct_with', 
            'contract_start_date', 'contract_end_date', 
            'created_at', 'updated_at'
        ]

class TeacherCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating Teacher instances.
    Handles automatic creation of a linked User account with 'teacher' role.
    """
    # User fields for write operations (similar to StudentCreateUpdateSerializer)
    first_name = serializers.CharField(write_only=True, required=False)
    last_name = serializers.CharField(write_only=True, required=False)
    Arabic_first_name = serializers.CharField(write_only=True, required=False, allow_blank=True, allow_null=True)
    arabic_last_name = serializers.CharField(write_only=True, required=False, allow_blank=True, allow_null=True)
    CIN_id = serializers.CharField(write_only=True, required=False, allow_blank=True, allow_null=True)
    phone_number = serializers.CharField(write_only=True, required=False, allow_blank=True, allow_null=True)
    birth_date = serializers.DateField(write_only=True, required=False, allow_null=True)
    birth_city = serializers.CharField(write_only=True, required=False, allow_blank=True, allow_null=True)
    address = serializers.CharField(write_only=True, required=False, allow_blank=True, allow_null=True)
    city = serializers.CharField(write_only=True, required=False, allow_blank=True, allow_null=True)
    profile_picture = serializers.ImageField(write_only=True, required=False, allow_null=True)

    # Field for updating the user's is_active status (nested, from UserIsActiveUpdateSerializer)
    user = UserIsActiveUpdateSerializer(required=False, partial=True)

    # For display in response (read-only)
    user_info = UserProfileSerializer(source='user', read_only=True, help_text="Displays teacher's linked user account information.")

    class Meta:
        model = Teacher
        fields = [
            'id',
            'center',       # Expects Center ID for write
            'program',      # Expects TrainingPrograme ID for write
            'contarct_with',
            'contract_start_date',
            'contract_end_date',
            'user_info',    # Read-only object display
            'user',         # For writing user.is_active via UserIsActiveUpdateSerializer
            'created_at',
            'updated_at',
            # Top-level write_only fields for user creation/direct update
            'first_name',
            'last_name',
            'Arabic_first_name',
            'arabic_last_name',
            'CIN_id',
            'phone_number',
            'birth_date',
            'birth_city',
            'address',
            'city',
            'profile_picture',
        ]
        read_only_fields = ['id', 'user_info', 'created_at', 'updated_at']

    @transaction.atomic
    def create(self, validated_data):
        first_name = validated_data.pop('first_name', None)
        last_name = validated_data.pop('last_name', None)
        if not first_name or not last_name:
            raise serializers.ValidationError({"name_error": "First name and last name are required to create a new user for the teacher."})

        Arabic_first_name = validated_data.pop('Arabic_first_name', None)
        arabic_last_name = validated_data.pop('arabic_last_name', None)
        cin_id = validated_data.pop('CIN_id', None)
        phone_number = validated_data.pop('phone_number', None)
        birth_date = validated_data.pop('birth_date', None)
        birth_city = validated_data.pop('birth_city', None)
        address = validated_data.pop('address', None)
        city = validated_data.pop('city', None)
        profile_picture = validated_data.pop('profile_picture', None)

        # The 'user' field (UserIsActiveUpdateSerializer data) is not used for creation, remove if present.
        validated_data.pop('user', None) 

        base_email_username = f"{first_name.lower().replace(' ', '')}.{last_name.lower().replace(' ', '')}"
        email_domain = "@trainer.com"
        email = f"{base_email_username}{email_domain}"
        
        counter = 1
        while User.objects.filter(email=email).exists():
            email = f"{base_email_username}{counter}{email_domain}"
            counter += 1
        
        default_password = "Entraid2025Larache"

        user_data_for_creation = {
            'first_name': first_name,
            'last_name': last_name,
            'Arabic_first_name': Arabic_first_name,
            'arabic_last_name': arabic_last_name,
            'role': UserRole.TRAINER, # Corrected: Was UserRole.TEACHER
            'CIN_id': cin_id,
            'phone_number': phone_number,
            'birth_date': birth_date,
            'birth_city': birth_city,
            'address': address,
            'city': city,
            'profile_picture': profile_picture,
        }
        
        for field_key in ['Arabic_first_name', 'arabic_last_name', 'CIN_id', 'phone_number', 'birth_date', 'birth_city', 'address', 'city']:
            if user_data_for_creation.get(field_key) == '':
                user_data_for_creation[field_key] = None

        try:
            user_instance = User.objects.create_user(email=email, password=default_password, **user_data_for_creation)
        except Exception as e:
            raise serializers.ValidationError({"user_creation_error": f"Failed to create user account: {str(e)}"})

        validated_data['user'] = user_instance # Assign the created user to the teacher's user field
        
        try:
            teacher = super().create(validated_data)
        except Exception as e:
            # transaction.atomic ensures user creation is rolled back if teacher creation fails.
            raise serializers.ValidationError({"teacher_creation_error": f"Failed to create teacher profile: {str(e)}"})
            
        return teacher

    @transaction.atomic
    def update(self, instance, validated_data):
        print(f"TEACHER UPDATE - Original validated_data: {validated_data}")
        
        user_payload_for_update = validated_data.pop('user', None) # Data from UserIsActiveUpdateSerializer
        user_instance = instance.user
        user_was_modified = False

        if user_payload_for_update and 'is_active' in user_payload_for_update:
            print(f"TEACHER UPDATE - Found 'is_active' in user_payload_for_update: {user_payload_for_update['is_active']}")
            if isinstance(user_payload_for_update['is_active'], bool):
                user_instance.is_active = user_payload_for_update['is_active']
                user_was_modified = True
                print(f"TEACHER UPDATE - Set user_instance.is_active to: {user_instance.is_active}")
            else:
                print("TEACHER UPDATE - 'is_active' in user_payload_for_update is not a boolean (unexpected here).")
        else:
            print("TEACHER UPDATE - 'user' payload (for is_active) not found or 'is_active' key missing.")
        
        user_direct_update_fields = [
            'first_name', 'last_name', 'Arabic_first_name', 'arabic_last_name',
            'CIN_id', 'phone_number', 'birth_date', 'birth_city', 'address', 'city', 'profile_picture'
        ]
        for field_name in user_direct_update_fields:
            if field_name in validated_data:
                print(f"TEACHER UPDATE - Processing top-level user field: {field_name} = {validated_data[field_name]}")
                field_value = validated_data.pop(field_name)
                if field_name == 'birth_date' and not field_value: # Handle empty date string
                    setattr(user_instance, field_name, None)
                else:
                    setattr(user_instance, field_name, field_value)
                user_was_modified = True
        
        if user_was_modified:
            print(f"TEACHER UPDATE - Before saving user_instance: is_active={user_instance.is_active}, user_was_modified={user_was_modified}")
            user_instance.save()
            print("TEACHER UPDATE - user_instance saved.")
        else:
            print("TEACHER UPDATE - user_instance not saved as user_was_modified is False.")

        print(f"TEACHER UPDATE - Remaining validated_data for Teacher model: {validated_data}")
        teacher = super().update(instance, validated_data)
        print("TEACHER UPDATE - Teacher instance updated.")
        return teacher 