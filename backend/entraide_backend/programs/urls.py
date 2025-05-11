from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TrainingProgrameViewSet,
    AnnualCourseDistributionViewSet,
    WeeklyCoursePlanViewSet,
    TrainingCourseViewSet
)

router = DefaultRouter()
router.register(r'trainingprogrames', TrainingProgrameViewSet, basename='trainingprograme')
router.register(r'annualcoursedistributions', AnnualCourseDistributionViewSet, basename='annualcoursedistribution')
router.register(r'weeklycourseplans', WeeklyCoursePlanViewSet, basename='weeklycourseplan')
router.register(r'trainingcourses', TrainingCourseViewSet, basename='trainingcourse')

urlpatterns = [
    path('', include(router.urls)),
] 