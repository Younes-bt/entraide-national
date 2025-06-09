from datetime import datetime, timedelta
from django.utils import timezone
from .models import Schedule_session, SessionInstance
from attendance.models import Attendance_record


def generate_session_instances_for_week(start_date, academic_year):
    """
    Generate SessionInstance objects for a specific week based on templates
    
    Args:
        start_date: Monday of the week (datetime.date)
        academic_year: e.g., "2024-2025"
    """
    # Map day names to numbers (Monday = 0)
    day_mapping = {
        'Monday': 0, 'Tuesday': 1, 'Wednesday': 2, 'Thursday': 3,
        'Friday': 4, 'Saturday': 5, 'Sunday': 6
    }
    
    # Get all active schedule templates for this academic year
    templates = Schedule_session.objects.filter(
        academic_year=academic_year,
        is_active=True
    )
    
    instances_created = []
    
    for template in templates:
        # Calculate the specific date for this day
        day_offset = day_mapping[template.day]
        session_date = start_date + timedelta(days=day_offset)
        
        # Check if instance already exists
        instance, created = SessionInstance.objects.get_or_create(
            schedule_template=template,
            specific_date=session_date,
            defaults={'status': 'scheduled'}
        )
        
        if created:
            instances_created.append(instance)
    
    return instances_created


def get_trainer_timetable(trainer, start_date, end_date):
    """
    Get all sessions for a trainer within a date range
    
    Returns both template-based and instance-based sessions
    """
    # Get session instances
    instances = SessionInstance.objects.filter(
        schedule_template__trainer=trainer,
        specific_date__range=[start_date, end_date],
        status__in=['scheduled', 'completed']
    ).select_related('schedule_template', 'custom_room', 'custom_trainer')
    
    return instances


def get_group_timetable(group, start_date, end_date):
    """
    Get all sessions for a group within a date range
    """
    instances = SessionInstance.objects.filter(
        schedule_template__group=group,
        specific_date__range=[start_date, end_date],
        status__in=['scheduled', 'completed']
    ).select_related('schedule_template', 'custom_room', 'custom_trainer')
    
    return instances


def cancel_session(session_instance_id, reason=""):
    """
    Cancel a specific session instance
    """
    try:
        instance = SessionInstance.objects.get(id=session_instance_id)
        instance.status = 'cancelled'
        instance.notes = reason
        instance.save()
        return True, "Session cancelled successfully"
    except SessionInstance.DoesNotExist:
        return False, "Session not found"


def reschedule_session(session_instance_id, new_date, new_start_time=None, new_room=None):
    """
    Reschedule a session to a different date/time/room
    """
    try:
        instance = SessionInstance.objects.get(id=session_instance_id)
        instance.specific_date = new_date
        if new_start_time:
            instance.custom_start_time = new_start_time
        if new_room:
            instance.custom_room = new_room
        instance.status = 'rescheduled'
        instance.save()
        return True, "Session rescheduled successfully"
    except SessionInstance.DoesNotExist:
        return False, "Session not found"


def check_conflicts(trainer, date, start_time, end_time, exclude_instance=None):
    """
    Check if a trainer has conflicting sessions
    """
    conflicts = SessionInstance.objects.filter(
        schedule_template__trainer=trainer,
        specific_date=date,
        status='scheduled'
    ).exclude(id=exclude_instance.id if exclude_instance else None)
    
    for conflict in conflicts:
        conflict_start = conflict.effective_start_time
        conflict_end = conflict.effective_end_time
        
        # Check for time overlap
        if (start_time < conflict_end and end_time > conflict_start):
            return True, f"Conflict with {conflict}"
    
    return False, "No conflicts found"


def get_weekly_schedule_summary(academic_year, week_start_date):
    """
    Get a summary of all sessions for a specific week
    Useful for dashboard views
    """
    week_end_date = week_start_date + timedelta(days=6)
    
    instances = SessionInstance.objects.filter(
        schedule_template__academic_year=academic_year,
        specific_date__range=[week_start_date, week_end_date]
    ).select_related(
        'schedule_template__trainer',
        'schedule_template__group',
        'schedule_template__room',
        'schedule_template__training_course__program'
    ).order_by('specific_date', 'schedule_template__start_time')
    
    return instances 