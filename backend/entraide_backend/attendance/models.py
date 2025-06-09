from django.db import models
from programs.models import TrainingCourse
from schedule.models import Schedule_session, SessionInstance
from students.models import Student

# Create your models here.

class Attendance_record(models.Model):
    date = models.DateField()
    # Keep both for flexibility - either track against template or specific instance
    session_template = models.ForeignKey(Schedule_session, on_delete=models.CASCADE, blank=True, null=True)
    session_instance = models.ForeignKey(SessionInstance, on_delete=models.CASCADE, blank=True, null=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendance_records')
    status = models.CharField(max_length=10, choices=[
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('late', 'Late'),
    ], default='absent')
    notes = models.TextField(blank=True, help_text="Additional notes about attendance")
    created_at = models.DateTimeField(auto_now_add=True) 
    edited_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Attendance Record'
        verbose_name_plural = 'Attendance Records'
        ordering = ['date', 'session_template__start_time']
        # Ensure one attendance record per student per session
        unique_together = [
            ['student', 'session_instance', 'date'],
            ['student', 'session_template', 'date'],
        ]

    def clean(self):
        """Ensure either session_template or session_instance is provided, not both"""
        from django.core.exceptions import ValidationError
        if not self.session_template and not self.session_instance:
            raise ValidationError("Either session_template or session_instance must be provided")
        if self.session_template and self.session_instance:
            raise ValidationError("Cannot have both session_template and session_instance")

    @property
    def effective_session(self):
        """Get the effective session (instance or template)"""
        return self.session_instance or self.session_template

    def __str__(self):
        session_info = self.session_instance or self.session_template
        return f"{self.student.user.first_name} {self.student.user.last_name} - {self.date} - {self.status}"  
