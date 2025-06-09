from django.contrib import admin
from django.db.models import Count, Q
from django.utils.html import format_html
from .models import Attendance_record


@admin.register(Attendance_record)
class AttendanceRecordAdmin(admin.ModelAdmin):
    """Admin interface for attendance records"""
    list_display = [
        'student_info', 'session_info', 'date', 'status_colored', 
        'effective_trainer', 'notes_preview', 'created_at'
    ]
    list_filter = [
        'status', 'date', 'session_template__trainer', 'session_template__academic_year',
        'session_template__training_course__center', 'session_template__training_course__program',
        'student__group', 'created_at'
    ]
    search_fields = [
        'student__user__first_name', 'student__user__last_name', 'student__exam_id',
        'session_template__trainer__first_name', 'session_template__trainer__last_name',
        'session_template__training_course__program__name',
        'session_instance__schedule_template__trainer__first_name',
        'session_instance__schedule_template__trainer__last_name',
        'notes'
    ]
    readonly_fields = ['created_at', 'edited_at', 'effective_session_info']
    ordering = ['-date', '-created_at']
    date_hierarchy = 'date'
    actions = ['mark_as_present', 'mark_as_absent', 'mark_as_late']
    
    fieldsets = (
        ('Attendance Information', {
            'fields': ('student', 'date', 'status')
        }),
        ('Session Reference', {
            'fields': ('session_template', 'session_instance', 'effective_session_info'),
            'description': 'Either session_template OR session_instance should be selected, not both.'
        }),
        ('Additional Information', {
            'fields': ('notes',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'edited_at'),
            'classes': ('collapse',)
        }),
    )
    
    def student_info(self, obj):
        """Display student name and exam ID"""
        return f"{obj.student.user.first_name} {obj.student.user.last_name} ({obj.student.exam_id})"
    student_info.short_description = 'Student'
    student_info.admin_order_field = 'student__user__last_name'
    
    def session_info(self, obj):
        """Display session information"""
        session = obj.effective_session
        if hasattr(session, 'training_course'):  # Schedule_session
            return f"{session.training_course.program.name} - {session.day} {session.start_time}"
        elif hasattr(session, 'schedule_template'):  # SessionInstance
            template = session.schedule_template
            return f"{template.training_course.program.name} - {session.specific_date}"
        return "No session"
    session_info.short_description = 'Session'
    
    def effective_trainer(self, obj):
        """Display the effective trainer"""
        session = obj.effective_session
        if hasattr(session, 'trainer'):  # Schedule_session
            trainer = session.trainer
        elif hasattr(session, 'effective_trainer'):  # SessionInstance
            trainer = session.effective_trainer
        else:
            return '-'
        return f"{trainer.first_name} {trainer.last_name}" if trainer else '-'
    effective_trainer.short_description = 'Trainer'
    
    def status_colored(self, obj):
        """Display status with color coding"""
        colors = {
            'present': '#28a745',  # Green
            'absent': '#dc3545',   # Red
            'late': '#ffc107'      # Yellow
        }
        color = colors.get(obj.status, '#6c757d')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_colored.short_description = 'Status'
    status_colored.admin_order_field = 'status'
    
    def notes_preview(self, obj):
        """Display first 50 characters of notes"""
        if obj.notes:
            return obj.notes[:50] + ('...' if len(obj.notes) > 50 else '')
        return '-'
    notes_preview.short_description = 'Notes'
    
    def effective_session_info(self, obj):
        """Read-only field showing effective session details"""
        session = obj.effective_session
        if hasattr(session, 'training_course'):  # Schedule_session
            return f"Template: {session.training_course.program.name} - {session.day} {session.start_time}-{session.end_time}"
        elif hasattr(session, 'schedule_template'):  # SessionInstance
            template = session.schedule_template
            return f"Instance: {template.training_course.program.name} - {session.specific_date} {session.effective_start_time}-{session.effective_end_time}"
        return "No session linked"
    effective_session_info.short_description = 'Effective Session'
    
    def get_queryset(self, request):
        """Optimize queryset with select_related and prefetch_related"""
        return super().get_queryset(request).select_related(
            'student__user', 'student__group', 'student__center', 'student__program',
            'session_template__trainer', 'session_template__training_course__program',
            'session_template__training_course__center', 'session_template__group',
            'session_instance__schedule_template__trainer',
            'session_instance__schedule_template__training_course__program',
            'session_instance__schedule_template__training_course__center'
        )
    
    # Admin Actions
    def mark_as_present(self, request, queryset):
        """Mark selected attendance records as present"""
        updated = queryset.update(status='present')
        self.message_user(request, f'{updated} attendance records marked as present.')
    mark_as_present.short_description = "Mark selected records as Present"
    
    def mark_as_absent(self, request, queryset):
        """Mark selected attendance records as absent"""
        updated = queryset.update(status='absent')
        self.message_user(request, f'{updated} attendance records marked as absent.')
    mark_as_absent.short_description = "Mark selected records as Absent"
    
    def mark_as_late(self, request, queryset):
        """Mark selected attendance records as late"""
        updated = queryset.update(status='late')
        self.message_user(request, f'{updated} attendance records marked as late.')
    mark_as_late.short_description = "Mark selected records as Late"
    
    def changelist_view(self, request, extra_context=None):
        """Add statistics to the changelist view"""
        extra_context = extra_context or {}
        
        # Get attendance statistics
        total_records = self.get_queryset(request).count()
        present_count = self.get_queryset(request).filter(status='present').count()
        absent_count = self.get_queryset(request).filter(status='absent').count()
        late_count = self.get_queryset(request).filter(status='late').count()
        
        attendance_rate = (present_count + late_count) / total_records * 100 if total_records > 0 else 0
        
        extra_context['attendance_stats'] = {
            'total_records': total_records,
            'present_count': present_count,
            'absent_count': absent_count,
            'late_count': late_count,
            'attendance_rate': round(attendance_rate, 2)
        }
        
        return super().changelist_view(request, extra_context=extra_context)
