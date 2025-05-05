from django.db import models
from centers.models import Room, Group
from programs.models import TrainingCourse

# Create your models here.


class Schedule_session(models.Model):
    day = models.CharField(max_length=20, choices=[
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
        ('Sunday', 'Sunday'),
    ])
    start_time = models.TimeField()
    end_time = models.TimeField()
    training_course = models.ForeignKey(TrainingCourse, on_delete=models.CASCADE, related_name='schedules')
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='schedules', blank=True, null=True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='schedules', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Schedule'
        verbose_name_plural = 'Schedules'
        ordering = ['day', 'start_time']

    def __str__(self):
        return f"{self.training_course.program.name} - {self.day} {self.start_time} to {self.end_time}"