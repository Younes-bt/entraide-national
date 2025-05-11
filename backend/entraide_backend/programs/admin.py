from django.contrib import admin
from .models import TrainingPrograme, AnnualCourseDistribution, WeeklyCoursePlan, TrainingCourse

# Register your models here.
admin.site.register(TrainingPrograme)
admin.site.register(AnnualCourseDistribution)
admin.site.register(WeeklyCoursePlan)
admin.site.register(TrainingCourse)
