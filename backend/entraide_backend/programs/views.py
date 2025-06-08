from django.shortcuts import render
from rest_framework import viewsets
from .models import TrainingPrograme, AnnualCourseDistribution, WeeklyCoursePlan, TrainingCourse
from .serializers import (
    TrainingProgrameSerializer, 
    AnnualCourseDistributionSerializer, 
    WeeklyCoursePlanSerializer, 
    TrainingCourseSerializer,
    TrainingCourseCreateUpdateSerializer
)

# Create your views here.

class TrainingProgrameViewSet(viewsets.ModelViewSet):
    queryset = TrainingPrograme.objects.all()
    serializer_class = TrainingProgrameSerializer

class AnnualCourseDistributionViewSet(viewsets.ModelViewSet):
    queryset = AnnualCourseDistribution.objects.all()
    serializer_class = AnnualCourseDistributionSerializer

class WeeklyCoursePlanViewSet(viewsets.ModelViewSet):
    queryset = WeeklyCoursePlan.objects.all()
    serializer_class = WeeklyCoursePlanSerializer

class TrainingCourseViewSet(viewsets.ModelViewSet):
    queryset = TrainingCourse.objects.all()
    serializer_class = TrainingCourseSerializer

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return TrainingCourseCreateUpdateSerializer
        return TrainingCourseSerializer
