from django.db import models
from accounts.models import User
from centers.models import Center
from programs.models import TrainingCourse, TrainingPrograme


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    exam_id = models.CharField(max_length=20, unique=True)
    center = models.ForeignKey(Center, on_delete=models.CASCADE, related_name='students')
    program = models.ForeignKey(TrainingPrograme, on_delete=models.CASCADE, related_name='students')
    accademic_year = models.CharField(max_length=10)  # e.g., "2023-2024"
    joinding_date = models.DateField()
    center_id = models.CharField(max_length=20, blank=True, null=True)  # Center ID

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.user.first_name} {self.user.last_name} - {self.exam_id}'

