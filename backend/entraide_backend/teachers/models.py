from django.db import models
from accounts.models import User

class AnnualDistribution(models.Model):
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='annual_distributions')
    academic_year = models.CharField(max_length=10)  # e.g., "2023-2024"
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"Annual Distribution for {self.teacher.first_name} {self.teacher.last_name} - {self.academic_year}"


class WeeklyPlan(models.Model):
    annual_distribution = models.ForeignKey(AnnualDistribution, on_delete=models.CASCADE, related_name='weekly_plans')
    month = models.PositiveSmallIntegerField()  # e.g., "1"
    week_number = models.PositiveSmallIntegerField()  # Week number in the academic year (1-52)
    title = models.CharField(max_length=255)
    description = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Weekly Plan for {self.annual_distribution.teacher.first_name} {self.annual_distribution.teacher.last_name} - Week {self.week_number}"
    

class TeachingSession(models.Model):
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='teaching_sessions')
    weekly_plan = models.ForeignKey(WeeklyPlan, on_delete=models.CASCADE, related_name='teaching_sessions')
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    title = models.CharField(max_length=255)
    description = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Teaching Session for {self.weekly_plan.title} on {self.date}"