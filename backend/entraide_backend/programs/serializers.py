from rest_framework import serializers
from .models import TrainingPrograme, AnnualCourseDistribution, WeeklyCoursePlan, TrainingCourse
from accounts.serializers import UserSerializer
from centers.serializers import CenterSerializer

class TrainingProgrameSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingPrograme
        fields = '__all__'

class AnnualCourseDistributionSerializer(serializers.ModelSerializer):
    programe = TrainingProgrameSerializer(read_only=True)

    class Meta:
        model = AnnualCourseDistribution
        fields = '__all__'

class WeeklyCoursePlanSerializer(serializers.ModelSerializer):
    annual_distribution = AnnualCourseDistributionSerializer(read_only=True)

    class Meta:
        model = WeeklyCoursePlan
        fields = '__all__'

class TrainingCourseSerializer(serializers.ModelSerializer):
    program = TrainingProgrameSerializer(read_only=True)
    center = CenterSerializer(read_only=True)
    trainer = UserSerializer(read_only=True)

    class Meta:
        model = TrainingCourse
        fields = '__all__' 