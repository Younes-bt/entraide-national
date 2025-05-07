from rest_framework import serializers
from .models import Center, Room, Equipment, Group
from associations.models import Association # Assuming AssociationSerializer might be needed or for type hinting
# If you have an AssociationSerializer and want to use it for nested representation:
# from associations.serializers import AssociationSerializer

class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = '__all__'

class RoomSerializer(serializers.ModelSerializer):
    equipments = EquipmentSerializer(many=True, read_only=True) # Nested equipment for reads

    class Meta:
        model = Room
        fields = ['id', 'name', 'description', 'type', 'capacity', 'is_available', 'picture', 'center', 'equipments', 'created_at', 'updated_at']
        # 'center' will be a PK by default, which is good for writes.

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'

class CenterSerializer(serializers.ModelSerializer):
    rooms = RoomSerializer(many=True, read_only=True) # Nested rooms for reads
    groups = GroupSerializer(many=True, read_only=True) # Nested groups for reads
    
    # For the association field:
    # Option 1: PrimaryKeyRelatedField for writable FK (default if not specified and 'association' is in fields)
    # association = serializers.PrimaryKeyRelatedField(queryset=Association.objects.all(), allow_null=True, required=False)
    
    # Option 2: StringRelatedField for read-only string representation
    association_name = serializers.StringRelatedField(source='association', read_only=True)

    # Option 3: Nested Serializer for read-only (if AssociationSerializer is available and imported)
    # association = AssociationSerializer(read_only=True)

    supervisor_username = serializers.ReadOnlyField(source='supervisor.username')


    class Meta:
        model = Center
        fields = [
            'id', 'name', 'description', 'logo', 
            'phone_number', 'email', 'address', 'city', 'maps_link',
            'website', 'facebook_link', 'instagram_link', 'twitter_link',
            'association', # This will be a PrimaryKeyRelatedField by default for writing
            'association_name', # For reading the name
            'affiliated_to', 'other_affiliation',
            'is_active', 'is_verified', 
            'supervisor', # This will be a PrimaryKeyRelatedField for writing
            'supervisor_username', # For reading the username
            'rooms', 
            'groups',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['is_verified'] # Example: is_verified might be admin-only internal flag 