from django.contrib import admin
from .models import Schedule_session, SessionInstance


@admin.register(Schedule_session)
class ScheduleSessionAdmin(admin.ModelAdmin):
    """Admin interface for weekly schedule templates"""
    list_display = [
        'training_course_name', 'trainer_name', 'day', 'start_time', 'end_time',
        'group_name', 'room_name', 'academic_year', 'is_active', 'created_at'
    ]
    list_filter = [
        'day', 'academic_year', 'is_active', 'trainer', 'training_course__center',
        'training_course__program', 'created_at'
    ]
    search_fields = [
        'trainer__first_name', 'trainer__last_name', 'trainer__email',
        'training_course__program__name', 'group__name', 'room__name',
        'academic_year'
    ]
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['day', 'start_time', 'trainer__last_name']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Schedule Information', {
            'fields': ('day', 'start_time', 'end_time', 'academic_year', 'is_active')
        }),
        ('Assignment', {
            'fields': ('trainer', 'training_course', 'group', 'room')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def training_course_name(self, obj):
        return f"{obj.training_course.program.name} - {obj.training_course.center.name}"
    training_course_name.short_description = 'Training Course'
    training_course_name.admin_order_field = 'training_course__program__name'
    
    def trainer_name(self, obj):
        return f"{obj.trainer.first_name} {obj.trainer.last_name}"
    trainer_name.short_description = 'Trainer'
    trainer_name.admin_order_field = 'trainer__last_name'
    
    def group_name(self, obj):
        return obj.group.name if obj.group else '-'
    group_name.short_description = 'Group'
    group_name.admin_order_field = 'group__name'
    
    def room_name(self, obj):
        return obj.room.name if obj.room else '-'
    room_name.short_description = 'Room'
    room_name.admin_order_field = 'room__name'
    
    def get_queryset(self, request):
        """Optimize queryset with select_related"""
        return super().get_queryset(request).select_related(
            'trainer', 'training_course__program', 'training_course__center',
            'group', 'room'
        )


@admin.register(SessionInstance)
class SessionInstanceAdmin(admin.ModelAdmin):
    """Admin interface for specific session instances"""
    list_display = [
        'session_info', 'specific_date', 'effective_start_time', 'effective_end_time',
        'effective_trainer_name', 'effective_room_name', 'status', 'created_at'
    ]
    list_filter = [
        'status', 'specific_date', 'schedule_template__trainer',
        'schedule_template__training_course__center', 'schedule_template__academic_year',
        'created_at'
    ]
    search_fields = [
        'schedule_template__trainer__first_name', 'schedule_template__trainer__last_name',
        'schedule_template__training_course__program__name',
        'schedule_template__group__name', 'notes'
    ]
    readonly_fields = ['created_at', 'updated_at', 'effective_start_time', 'effective_end_time']
    ordering = ['-specific_date', 'schedule_template__start_time']
    date_hierarchy = 'specific_date'
    
    fieldsets = (
        ('Session Information', {
            'fields': ('schedule_template', 'specific_date', 'status')
        }),
        ('Custom Overrides', {
            'fields': ('custom_start_time', 'custom_end_time', 'custom_trainer', 'custom_room'),
            'classes': ('collapse',)
        }),
        ('Notes', {
            'fields': ('notes',)
        }),
        ('Effective Values (Read-only)', {
            'fields': ('effective_start_time', 'effective_end_time'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def session_info(self, obj):
        return f"{obj.schedule_template.training_course.program.name} - {obj.schedule_template.day}"
    session_info.short_description = 'Session'
    session_info.admin_order_field = 'schedule_template__training_course__program__name'
    
    def effective_trainer_name(self, obj):
        trainer = obj.effective_trainer
        return f"{trainer.first_name} {trainer.last_name}" if trainer else '-'
    effective_trainer_name.short_description = 'Trainer'
    
    def effective_room_name(self, obj):
        room = obj.effective_room
        return room.name if room else '-'
    effective_room_name.short_description = 'Room'
    
    def get_queryset(self, request):
        """Optimize queryset with select_related"""
        return super().get_queryset(request).select_related(
            'schedule_template__trainer', 'schedule_template__training_course__program',
            'schedule_template__training_course__center', 'schedule_template__group',
            'schedule_template__room', 'custom_trainer', 'custom_room'
        )
