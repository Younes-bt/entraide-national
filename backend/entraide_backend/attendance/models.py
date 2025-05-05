from django.db import models
from programs.models import TrainingCourse
from schedule.models import Schedule_session
from students.models import Student

# Create your models here.

class Attendance_record(models.Model):
    date = models.DateField()
    session = models.ForeignKey(Schedule_session, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendance_records')
    status = models.CharField(max_length=10, choices=[
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('late', 'Late'),
    ], default='absent')
    created_at = models.DateTimeField(auto_now_add=True) 
    edited_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Attendance Record'
        verbose_name_plural = 'Attendance Records'
        ordering = ['date', 'session']

    def __str__(self):
        return f"{self.student.user.first_name} {self.student.user.last_name} - {self.date} - {self.status}"  
