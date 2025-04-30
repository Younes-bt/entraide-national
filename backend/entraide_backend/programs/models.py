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


class TrainingCourse(models.Model):
    program = models.ForeignKey(TrainingPrograme, on_delete=models.CASCADE, related_name='courses')
    center = models.ForeignKey(Center, on_delete=models.CASCADE, related_name='courses')
    trainer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='courses')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.program.name} - {self.center.name} - {self.trainer.first_name} {self.trainer.last_name}'