from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AssociationViewSet

router = DefaultRouter()
router.register(r'associations', AssociationViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 