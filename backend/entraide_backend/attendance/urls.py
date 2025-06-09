from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AttendanceRecordViewSet

router = DefaultRouter()
router.register(r'records', AttendanceRecordViewSet, basename='attendance-records')

urlpatterns = [
    path('api/', include(router.urls)),
] 