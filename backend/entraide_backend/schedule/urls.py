from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ScheduleSessionViewSet, SessionInstanceViewSet

router = DefaultRouter()
router.register(r'sessions', ScheduleSessionViewSet, basename='schedule-sessions')
router.register(r'instances', SessionInstanceViewSet, basename='session-instances')

urlpatterns = [
    path('api/', include(router.urls)),
] 