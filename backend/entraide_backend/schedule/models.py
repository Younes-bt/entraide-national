from django.db import models
from centers.models import Room, Group
from programs.models import TrainingCourse
from accounts.models import User

# Create your models here.


class Schedule_session(models.Model):
    """Weekly recurring schedule template"""
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
    trainer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='scheduled_sessions')
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='schedules', blank=True, null=True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='schedules', blank=True, null=True)
    academic_year = models.CharField(max_length=10, help_text="e.g., 2024-2025")
    is_active = models.BooleanField(default=True, help_text="Set to False to disable this weekly session")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Weekly Schedule Template'
        verbose_name_plural = 'Weekly Schedule Templates'
        ordering = ['day', 'start_time']
        # Prevent double booking: same trainer/room at same time
        unique_together = [
            ['trainer', 'day', 'start_time', 'academic_year'],
            ['room', 'day', 'start_time', 'academic_year'],
        ]

    def __str__(self):
        return f"{self.training_course.program.name} - {self.trainer.first_name} {self.trainer.last_name} - {self.day} {self.start_time}-{self.end_time}"


class SessionInstance(models.Model):
    """Specific session instance for a particular date (for cancellations/modifications)"""
    schedule_template = models.ForeignKey(Schedule_session, on_delete=models.CASCADE, related_name='instances')
    specific_date = models.DateField()
    
    # Override fields (if different from template)
    custom_start_time = models.TimeField(blank=True, null=True)
    custom_end_time = models.TimeField(blank=True, null=True)
    custom_room = models.ForeignKey(Room, on_delete=models.CASCADE, blank=True, null=True)
    custom_trainer = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    
    status = models.CharField(max_length=20, choices=[
        ('scheduled', 'Scheduled'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
        ('rescheduled', 'Rescheduled'),
    ], default='scheduled')
    
    notes = models.TextField(blank=True, help_text="Reason for cancellation/changes")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Session Instance'
        verbose_name_plural = 'Session Instances'
        unique_together = ['schedule_template', 'specific_date']
        ordering = ['specific_date', 'schedule_template__start_time']

    def __str__(self):
        return f"{self.schedule_template.training_course.program.name} - {self.specific_date} - {self.status}"
    
    @property
    def effective_start_time(self):
        """Get the actual start time (custom or from template)"""
        return self.custom_start_time or self.schedule_template.start_time
    
    @property
    def effective_end_time(self):
        """Get the actual end time (custom or from template)"""
        return self.custom_end_time or self.schedule_template.end_time
    
    @property
    def effective_room(self):
        """Get the actual room (custom or from template)"""
        return self.custom_room or self.schedule_template.room
    
    @property
    def effective_trainer(self):
        """Get the actual trainer (custom or from template)"""
        return self.custom_trainer or self.schedule_template.trainer