from rest_framework import serializers
from .models import Association
from accounts.models import User # Make sure User model is imported
from centers.models import Center # Import Center model directly

# Serializer for representing supervisor details
class SupervisorRepresentationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email'] # Remove arabic fields that don't exist

# Serializer for representing center details within association
class CenterRepresentationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Center # Use the imported model directly
        fields = ['id', 'name', 'city', 'phone_number', 'is_active', 'is_verified']

class AssociationSerializer(serializers.ModelSerializer):
    supervisor = SupervisorRepresentationSerializer(read_only=True)
    centers = CenterRepresentationSerializer(many=True, read_only=True) # Add centers relationship
    logo_url = serializers.SerializerMethodField()
    
    def get_logo_url(self, obj):
        """Convert Cloudinary field to proper URL"""
        if obj.logo:
            return obj.logo.url
        return None
    
    # supervisor_id = serializers.PrimaryKeyRelatedField(
    #     queryset=User.objects.all(), source='supervisor', write_only=True, allow_null=True, required=False
    # ) # This line would be for explicit write control if needed, but default behavior might be sufficient.

    class Meta:
        model = Association
        fields = [
            'id', 'name', 'description', 'logo', 'logo_url', 'phone_number', 'email', 
            'address', 'city', 'maps_link', 'website', 'facebook_link', 
            'instagram_link', 'twitter_link', 'is_active', 'is_verified', 
            'supervisor', # This will use the nested serializer for reads
            'centers', # Add the centers relationship
            'contract_start_date', 'contract_end_date', 'registration_number',
            'created_at', 'updated_at'
        ]
        # If you were using supervisor_id for writes, you'd add it to fields and make 'supervisor' read_only.
        # However, DRF's default behavior with a nested read_only serializer on a FK field
        # is to still allow writing the FK by its ID to the field name 'supervisor'.
        # Explicitly listing fields is generally better than '__all__' when customizing. 