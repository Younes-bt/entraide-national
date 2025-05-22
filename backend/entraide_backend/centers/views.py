from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Center, Room, Equipment, Group
from .serializers import CenterSerializer, RoomSerializer, EquipmentSerializer, GroupSerializer
from django_filters.rest_framework import DjangoFilterBackend # For filtering
from rest_framework.filters import SearchFilter, OrderingFilter
from .filters import CenterFilter # Added import

# Create your views here.

# Custom Permissions
class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admin users to edit an object.
    Read-only for other authenticated users.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_staff # is_staff typically denotes admin

class IsAdminOrCenterSupervisor(permissions.BasePermission):
    """
    Allows access to Admin users or users who are supervisors of the center 
    associated with the object (Room, Equipment, Group).
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff: # Admin can do anything
            return True
        
        # For Room, Equipment, Group, check if user is supervisor of the parent center
        center = None
        if isinstance(obj, Center):
            return obj.supervisor == request.user
        elif isinstance(obj, Room):
            center = obj.center
        elif isinstance(obj, Equipment):
            center = obj.center # Equipment is directly linked to a center as per models.py
        elif isinstance(obj, Group):
            center = obj.center
        
        if center:
            return center.supervisor == request.user
        return False

class CenterViewSet(viewsets.ModelViewSet):
    queryset = Center.objects.prefetch_related(
        'rooms__equipments', # For RoomSerializer nesting and room_equipment_condition filter
        'groups', 
        'association', 
        'supervisor',
        'equipments' # For potential center_equipment_condition filter
    ).all()
    serializer_class = CenterSerializer
    permission_classes = [IsAdminOrCenterSupervisor] # <-- MODIFIED THIS LINE
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = CenterFilter # Use the custom FilterSet class
    # filterset_fields can be removed if all fields are handled by CenterFilter or are not needed for simple lookup
    # filterset_fields = {
    #     'city': ['exact', 'icontains'],
    #     'affiliated_to': ['exact'],
    #     'association__name': ['exact', 'icontains'], 
    #     'is_active': ['exact'],
    #     'is_verified': ['exact'],
    # }
    search_fields = ['name', 'description', 'city', 'association__name', 'rooms__name', 'groups__name'] # Expanded search
    ordering_fields = ['name', 'city', 'created_at', 'updated_at']

    def get_queryset(self): # <-- ADDED THIS METHOD
        user = self.request.user
        base_queryset = Center.objects.prefetch_related(
            'rooms__equipments',
            'groups',
            'association',
            'supervisor',
            'equipments'
        )
        if user.is_staff:
            return base_queryset.all()
        # Ensure the user object might have supervised_centers (e.g., they are not an AnonymousUser)
        # and the related manager exists.
        if hasattr(user, 'supervised_centers') and user.supervised_centers is not None:
            return user.supervised_centers.prefetch_related(
                'rooms__equipments',
                'groups',
                'association',
                # 'supervisor' is already part of the user.supervised_centers context
                'equipments'
            ).all()
        return Center.objects.none()

    # To implement filtering for centers based on room types or equipment conditions,
    # we'll likely need a custom FilterSet class. I'll add a placeholder for now.
    # We can create a filters.py file for this.

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [IsAdminOrCenterSupervisor]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = {
        'center__id': ['exact'], # Filter rooms by center ID
        'type': ['exact'],
        'capacity': ['exact', 'gte', 'lte'],
        'is_available': ['exact'],
    }
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'capacity', 'type']

    def get_queryset(self):
        user = self.request.user
        if user.is_staff: # Admin sees all
            return Room.objects.all()
        # Center supervisor sees rooms in their supervised centers
        if hasattr(user, 'supervised_centers'):
             return Room.objects.filter(center__in=user.supervised_centers.all())
        return Room.objects.none() # No access if not admin or supervisor of any center

class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [IsAdminOrCenterSupervisor]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = {
        'center__id': ['exact'], # Filter equipment by center ID
        'room__id': ['exact'], # Filter equipment by room ID
        'condition': ['exact'],
        'quantity': ['exact', 'gte', 'lte'],
    }
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'condition', 'quantity']

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Equipment.objects.all()
        if hasattr(user, 'supervised_centers'):
            return Equipment.objects.filter(center__in=user.supervised_centers.all())
        return Equipment.objects.none()

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAdminOrCenterSupervisor]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = {
        'center__id': ['exact'], # Filter groups by center ID
    }
    search_fields = ['name', 'description']
    ordering_fields = ['name']

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Group.objects.all()
        if hasattr(user, 'supervised_centers'):
            return Group.objects.filter(center__in=user.supervised_centers.all())
        return Group.objects.none()
