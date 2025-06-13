from rest_framework import serializers
from .models import TrainingPrograme, AnnualCourseDistribution, WeeklyCoursePlan, TrainingCourse
from accounts.serializers import UserSerializer
from centers.serializers import CenterSerializer

class TrainingProgrameSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingPrograme
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Check if the logo exists and has a URL attribute
        if instance.logo and hasattr(instance.logo, 'url'):
            representation['logo'] = instance.logo.url
        elif 'logo' in representation: # Ensure 'logo' key exists even if no logo
            representation['logo'] = None
        return representation

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
    # Read-only nested serializers for detailed output
    program = TrainingProgrameSerializer(read_only=True)
    center = CenterSerializer(read_only=True)
    trainer = UserSerializer(read_only=True)

    class Meta:
        model = TrainingCourse
        fields = '__all__'

class TrainingCourseCreateUpdateSerializer(serializers.ModelSerializer):
    # Write-only fields for create/update operations
    class Meta:
        model = TrainingCourse
        fields = ['program', 'center', 'trainer', 'academic_year'] 