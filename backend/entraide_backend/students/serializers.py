from rest_framework import serializers
from django.db import transaction
from .models import Student
from accounts.models import User, UserRole
# If models like User, Center, etc. are needed for more complex serialization, they can be imported here.
# from accounts.models import User
# from centers.models import Center, Group
# from programs.models import TrainingCourse, TrainingPrograme

class StudentSerializer(serializers.ModelSerializer):
    """
    Serializer for the Student model.
    ForeignKey and OneToOneField fields (user, center, program, training_course, group)
    are represented by their string representation using StringRelatedField.
    """
    user = serializers.StringRelatedField(read_only=True)
    center = serializers.StringRelatedField(read_only=True)
    program = serializers.StringRelatedField(read_only=True)
    training_course = serializers.StringRelatedField(allow_null=True, read_only=True)
    group = serializers.StringRelatedField(allow_null=True, read_only=True)

    class Meta:
        model = Student
        fields = '__all__'
        # Example of explicitly listing fields if needed:
        # fields = [
        #     'id', 'user', 'exam_id', 'center_code', 'center', 'program',
        #     'academic_year', 'joining_date', 'training_course', 'group',
        #     'created_at', 'updated_at'
        # ]

class StudentCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating Student instances.
    Handles automatic creation of a linked User account with 'student' role upon Student creation.
    """
    # Fields for User creation, not on Student model directly
    first_name = serializers.CharField(write_only=True, required=True, help_text="Student's first name, used for account creation.")
    last_name = serializers.CharField(write_only=True, required=True, help_text="Student's last name, used for account creation.")

    # To display user information in the response after creation/update
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
            'user_info', # Read-only representation of the linked user
            'created_at',
            'updated_at',
            # first_name and last_name are defined as serializer fields, not Meta fields.
        ]
        read_only_fields = ['id', 'user_info', 'created_at', 'updated_at']
        # The 'user' field (ForeignKey on Student model) is not directly taken as input for creation.
        # It's populated internally after User creation. For updates, it's part of the instance.

    @transaction.atomic
    def create(self, validated_data):
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')

        # Generate email for the User account
        base_email_username = f"{first_name.lower().replace(' ', '')}.{last_name.lower().replace(' ', '')}"
        email_domain = "@entraide-larache.com" # Domain can be configured as needed
        email = f"{base_email_username}{email_domain}"
        
        counter = 1
        # Ensure User email uniqueness
        while User.objects.filter(email=email).exists():
            email = f"{base_email_username}{counter}{email_domain}"
            counter += 1
        
        # !!! WARNING: This is a placeholder password and is NOT secure. !!!
        # Replace with a secure password generation mechanism and a proper user setup flow.
        default_password = "defaultP@sswOrd123!" # FIXME: Highly insecure

        # Prepare data for User creation
        user_data_for_creation = {
            'first_name': first_name,
            'last_name': last_name,
            'role': UserRole.STUDENT,
        }
        
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

    def update(self, instance, validated_data):
        # If first_name/last_name are provided during an update, they are currently ignored
        # for modifying the associated User's name.
        # If User's name should be updatable via this endpoint, this logic needs to be added.
        validated_data.pop('first_name', None)
        validated_data.pop('last_name', None)

        # Handle other Student fields update
        student = super().update(instance, validated_data)
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