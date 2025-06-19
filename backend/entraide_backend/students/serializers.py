from rest_framework import serializers
from django.db import transaction
import datetime # Added import for datetime
from .models import Student
from accounts.models import User, UserRole
from accounts.serializers import UserProfileSerializer, UserIsActiveUpdateSerializer # Import UserProfileSerializer and UserIsActiveUpdateSerializer
# If models like User, Center, etc. are needed for more complex serialization, they can be imported here.
# from accounts.models import User
# from centers.models import Center, Group
# from programs.models import TrainingCourse, TrainingPrograme

class StudentSerializer(serializers.ModelSerializer):
    """
    Serializer for the Student model.
    Returns detailed information about related objects for better frontend display.
    """
    user = UserProfileSerializer(read_only=True) # Use UserProfileSerializer for the user field
    center = serializers.StringRelatedField(read_only=True)
    program = serializers.PrimaryKeyRelatedField(read_only=True)
    program_name = serializers.StringRelatedField(source='program', read_only=True)
    training_course = serializers.PrimaryKeyRelatedField(read_only=True, allow_null=True)
    group = serializers.PrimaryKeyRelatedField(read_only=True, allow_null=True)

    class Meta:
        model = Student
        fields = '__all__'

class StudentCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating Student instances.
    Handles automatic creation of a linked User account with 'student' role upon Student creation.
    """
    # User fields for write operations (defined as write_only=True)
    first_name = serializers.CharField(write_only=True, required=False)
    last_name = serializers.CharField(write_only=True, required=False)
    Arabic_first_name = serializers.CharField(write_only=True, required=False)
    arabic_last_name = serializers.CharField(write_only=True, required=False)
    CIN_id = serializers.CharField(write_only=True, required=False, allow_blank=True, allow_null=True)
    phone_number = serializers.CharField(write_only=True, required=False, allow_blank=True, allow_null=True)
    birth_date = serializers.DateField(write_only=True, required=False, allow_null=True)
    birth_city = serializers.CharField(write_only=True, required=False, allow_blank=True, allow_null=True)
    address = serializers.CharField(write_only=True, required=False, allow_blank=True, allow_null=True)
    city = serializers.CharField(write_only=True, required=False, allow_blank=True, allow_null=True)

    # Explicitly define exam_id and center_code to make them not required from frontend
    exam_id = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    center_code = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    # Field for updating the user's is_active status (nested)
    user = UserIsActiveUpdateSerializer(required=False, partial=True)

    # For display in response (read-only)
    user_info = serializers.StringRelatedField(source='user', read_only=True, help_text="Displays student's linked user account information.")

    class Meta:
        model = Student
        fields = [
            'id',
            'exam_id',      
            'center_code',  
            'center',
            'program',
            'academic_year',
            'joining_date',
            'training_course',
            'group',
            'user_info', 
            'user', # This is our UserIsActiveUpdateSerializer field for writes
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
        ]
        read_only_fields = ['id', 'user_info', 'created_at', 'updated_at', 'exam_id', 'center_code']
        # Ensure write_only fields are NOT in read_only_fields

    @transaction.atomic
    def create(self, validated_data):
        # Pop user-specific fields first as they are not part of the Student model directly
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')
        Arabic_first_name = validated_data.pop('Arabic_first_name')
        arabic_last_name = validated_data.pop('arabic_last_name')

        # Pop additional user profile fields if they exist
        cin_id = validated_data.pop('CIN_id', None)
        phone_number = validated_data.pop('phone_number', None)
        birth_date = validated_data.pop('birth_date', None)
        birth_city = validated_data.pop('birth_city', None)
        address = validated_data.pop('address', None)
        city = validated_data.pop('city', None)

        # Get the center instance for ID
        center_instance = validated_data.get('center')
        if not center_instance:
            raise serializers.ValidationError({"center": "Center is required and was not provided correctly."})

        # 1. Generate center_code
        generated_center_code = f"C-{center_instance.id}"
        validated_data['center_code'] = generated_center_code

        # 2. Determine student_sequence_in_center (for exam_id)
        student_count_in_center = Student.objects.filter(center=center_instance).count()
        student_sequence_value = student_count_in_center + 1
        formatted_student_sequence = "{:03d}".format(student_sequence_value) # Format as 001, 002, etc.

        # 3. Generate exam_id
        current_year_short = datetime.date.today().strftime('%y')
        generated_exam_id = f"C{center_instance.id}/{formatted_student_sequence}/{current_year_short}"
        validated_data['exam_id'] = generated_exam_id
        
        # Ensure the generated exam_id is unique before proceeding
        if Student.objects.filter(exam_id=generated_exam_id).exists():
            # This case should be rare if sequence logic is correct but handles potential race conditions or manual exam_id entries
            raise serializers.ValidationError({"exam_id": f"Generated exam ID {generated_exam_id} already exists. Please try again."})

        # Generate email for the User account
        base_email_username = f"{first_name.lower().replace(' ', '')}.{last_name.lower().replace(' ', '')}"
        email_domain = "@student.com" # Domain for students
        email = f"{base_email_username}{email_domain}"
        
        counter = 1
        # Ensure User email uniqueness
        while User.objects.filter(email=email).exists():
            email = f"{base_email_username}{counter}{email_domain}"
            counter += 1
        
        # Set default password for students
        default_password = "Entraid2025Larache"

        # Prepare data for User creation
        user_data_for_creation = {
            'first_name': first_name,
            'last_name': last_name,
            'Arabic_first_name': Arabic_first_name,
            'arabic_last_name': arabic_last_name,
            'role': UserRole.STUDENT,
            # Add other user profile fields here
            'CIN_id': cin_id,
            'phone_number': phone_number,
            'birth_date': birth_date,
            'birth_city': birth_city,
            'address': address,
            'city': city,
        }
        
        # Ensure that None is passed for optional fields if they are empty strings from frontend
        for field in ['CIN_id', 'phone_number', 'birth_date', 'birth_city', 'address', 'city']:
            if user_data_for_creation[field] == '':
                user_data_for_creation[field] = None

        try:
            # Use UserManager's create_user for proper handling (e.g., username generation)
            user_instance = User.objects.create_user(email=email, password=default_password, **user_data_for_creation)
        except Exception as e:
            # Catch potential errors during user creation (e.g., validation from User model/manager)
            raise serializers.ValidationError({"user_creation_error": f"Failed to create user account: {str(e)}"})

        # Assign the created user to the student profile
        validated_data['user'] = user_instance
        
        try:
            # Create the Student instance with the linked user
            student = super().create(validated_data)
        except Exception as e:
            # If student creation fails, the transaction.atomic decorator ensures the user creation is rolled back.
            raise serializers.ValidationError({"student_creation_error": f"Failed to create student profile: {str(e)}"})
            
        return student

    @transaction.atomic
    def update(self, instance, validated_data):
        print(f"STUDENT UPDATE - Original validated_data: {validated_data}")
        
        user_payload_for_update = validated_data.pop('user', None) 
        user_instance = instance.user
        user_was_modified = False

        if user_payload_for_update and 'is_active' in user_payload_for_update:
            print(f"STUDENT UPDATE - Found 'is_active' in user_payload_for_update: {user_payload_for_update['is_active']}")
            if isinstance(user_payload_for_update['is_active'], bool):
                # UserIsActiveUpdateSerializer should have validated this data already
                user_instance.is_active = user_payload_for_update['is_active']
                user_was_modified = True
                print(f"STUDENT UPDATE - Set user_instance.is_active to: {user_instance.is_active}")
            else:
                # This case should ideally be caught by UserIsActiveUpdateSerializer if is_active is not bool
                print("STUDENT UPDATE - 'is_active' in user_payload_for_update is not a boolean (unexpected here).")
        else:
            print("STUDENT UPDATE - 'user' payload (for is_active) not found or 'is_active' key missing.")

        # Handle other User fields passed at the top level (e.g., for student profile edit form)
        user_direct_update_fields = [
            'first_name', 'last_name', 'Arabic_first_name', 'arabic_last_name',
            'CIN_id', 'phone_number', 'birth_date', 'birth_city', 'address', 'city'
        ]
        for field_name in user_direct_update_fields:
            if field_name in validated_data:
                print(f"STUDENT UPDATE - Processing top-level user field: {field_name} = {validated_data[field_name]}")
                field_value = validated_data.pop(field_name)
                if isinstance(self.fields[field_name], serializers.DateField) and not field_value:
                    setattr(user_instance, field_name, None)
                else:
                    setattr(user_instance, field_name, field_value)
                user_was_modified = True
        
        if user_was_modified:
            print(f"STUDENT UPDATE - Before saving user_instance: is_active={user_instance.is_active}, user_was_modified={user_was_modified}")
            user_instance.save()
            print("STUDENT UPDATE - user_instance saved.")
        else:
            print("STUDENT UPDATE - user_instance not saved as user_was_modified is False.")

        print(f"STUDENT UPDATE - Remaining validated_data for Student model: {validated_data}")
        student = super().update(instance, validated_data)
        print("STUDENT UPDATE - Student instance updated.")
        return student

# Example of how the old StudentCreateUpdateSerializer might have looked for context (will be replaced):
# class StudentCreateUpdateSerializer(serializers.ModelSerializer):
#     """
#     Serializer for creating and updating Student instances.
#     Uses PrimaryKeyRelatedField for writable related fields.
#     """
#     class Meta:
#         model = Student
#         # Exclude fields that are read-only or automatically set
#         exclude = ['created_at', 'updated_at'] 
#         # Or, explicitly list writable fields:
#         # fields = [
#         # 'user', 'exam_id', 'center_code', 'center', 'program',
#         # 'academic_year', 'joining_date', 'training_course', 'group'
#         # ] 