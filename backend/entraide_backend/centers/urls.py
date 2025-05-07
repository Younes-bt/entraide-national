from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CenterViewSet, RoomViewSet, EquipmentViewSet, GroupViewSet

router = DefaultRouter()
router.register(r'centers', CenterViewSet, basename='center')
router.register(r'rooms', RoomViewSet, basename='room')
router.register(r'equipment', EquipmentViewSet, basename='equipment') # Changed from 'equipments' to singular 'equipment' for consistency
router.register(r'groups', GroupViewSet, basename='group')

urlpatterns = [
    path('', include(router.urls)),
] 