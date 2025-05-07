import django_filters
from .models import Center, Room, Equipment

class CenterFilter(django_filters.FilterSet):
    # Filter by rooms of a specific type
    room_type = django_filters.CharFilter(field_name='rooms__type', lookup_expr='exact', distinct=True)
    
    # Filter by equipment of a specific condition (equipment is directly related to center as well as room)
    # If you want to filter by equipment directly under the center:
    # center_equipment_condition = django_filters.CharFilter(field_name='equipments__condition', lookup_expr='exact', distinct=True)
    # If you want to filter by equipment within the center's rooms:
    room_equipment_condition = django_filters.CharFilter(field_name='rooms__equipments__condition', lookup_expr='exact', distinct=True)
    
    association_name = django_filters.CharFilter(field_name='association__name', lookup_expr='icontains')

    class Meta:
        model = Center
        fields = {
            'city': ['exact', 'icontains'],
            'affiliated_to': ['exact'],
            'is_active': ['exact'],
            'is_verified': ['exact'],
            'association': ['exact'], # Filter by association ID
        } 