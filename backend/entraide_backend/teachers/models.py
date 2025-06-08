from django.db import models
from accounts.models import User
from programs.models import WeeklyCoursePlan, TrainingPrograme
from centers.models import Center

CONTRACT_WITH_CHOICES = [
    ('entraide', 'Entraide'),
    ('association', 'Association'),
]

class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='teacher')

    center = models.ForeignKey(Center, on_delete=models.CASCADE, related_name='teachers')
    program = models.ForeignKey(TrainingPrograme, on_delete=models.CASCADE, related_name='teachers')
    groups = models.ManyToManyField('centers.Group', related_name='teachers', blank=True)
    contarct_with = models.CharField(choices=CONTRACT_WITH_CHOICES, max_length=20)
    contract_start_date = models.DateField()
    contract_end_date = models.DateField()


    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - {self.center.name} - {self.program.name}"



class TeachingSession(models.Model):
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='teaching_sessions')
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    weekly_course_plan = models.ForeignKey(WeeklyCoursePlan, on_delete=models.CASCADE, related_name='teaching_sessions')

    # session information
    title = models.CharField(max_length=255)
    description = models.TextField()

    # timeslap
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Teaching Session on {self.date} at {self.start_time} to {self.end_time} by {self.teacher.first_name} {self.teacher.last_name}"