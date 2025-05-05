from django.db import models
from accounts.models import User
from centers.models import Center


class TrainingPrograme(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    duration_years = models.PositiveSmallIntegerField() # Duration in years eg. 1, 2
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class AnnualCourseDistribution(models.Model):
    programe = models.ForeignKey(TrainingPrograme, on_delete=models.CASCADE, related_name='annual_distributions')
    academic_year = models.CharField(max_length=10)  # e.g., "2023-2024"
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Annual Course Distribution for {self.programe.name} - {self.academic_year}"

class WeeklyCoursePlan(models.Model):
    annual_distribution = models.ForeignKey(AnnualCourseDistribution, on_delete=models.CASCADE, related_name='weekly_plans')
    month = models.PositiveSmallIntegerField()  # e.g., "1"
    week_number = models.PositiveSmallIntegerField()  # Week number in the academic year (1-52)
    title = models.CharField(max_length=255)
    description = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Weekly Course Plan for {self.annual_distribution.course.program.name} - Week {self.week_number}"
    

class TrainingCourse(models.Model):
    program = models.ForeignKey(TrainingPrograme, on_delete=models.CASCADE, related_name='courses')
    center = models.ForeignKey(Center, on_delete=models.CASCADE, related_name='courses')
    trainer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='courses')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.program.name} - {self.center.name} - {self.trainer.first_name} {self.trainer.last_name}'