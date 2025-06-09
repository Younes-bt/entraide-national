from rest_framework import serializers
from .models import Attendance_record
from students.models import Student
from schedule.models import Schedule_session, SessionInstance
from schedule.serializers import ScheduleSessionSerializer, SessionInstanceSerializer
from students.serializers import StudentSerializer


class AttendanceRecordSerializer(serializers.ModelSerializer):
    """Main serializer for attendance records"""
    student_details = StudentSerializer(source='student', read_only=True)
    session_template_details = ScheduleSessionSerializer(source='session_template', read_only=True)
    session_instance_details = SessionInstanceSerializer(source='session_instance', read_only=True)
    effective_session = serializers.SerializerMethodField()
    
    class Meta:
        model = Attendance_record
        fields = [
            'id', 'date', 'student', 'student_details',
            'session_template', 'session_template_details',
            'session_instance', 'session_instance_details',
            'status', 'notes', 'effective_session',
            'created_at', 'edited_at'
        ]
        
    def get_effective_session(self, obj):
        """Get the effective session (instance or template)"""
        effective = obj.effective_session
        if isinstance(effective, SessionInstance):
            return SessionInstanceSerializer(effective).data
        elif isinstance(effective, Schedule_session):
            return ScheduleSessionSerializer(effective).data
        return None
    
    def validate(self, data):
        """Custom validation for attendance records"""
        session_template = data.get('session_template')
        session_instance = data.get('session_instance')
        
        # Ensure either session_template or session_instance is provided, not both
        if not session_template and not session_instance:
            raise serializers.ValidationError(
                "Either session_template or session_instance must be provided"
            )
        
        if session_template and session_instance:
            raise serializers.ValidationError(
                "Cannot have both session_template and session_instance"
            )
        
        return data


class CreateAttendanceRecordSerializer(serializers.ModelSerializer):
    """Simplified serializer for creating attendance records"""
    
    class Meta:
        model = Attendance_record
        fields = [
            'date', 'student', 'session_template', 'session_instance',
            'status', 'notes'
        ]
        
    def validate(self, data):
        return AttendanceRecordSerializer().validate(data)


class BulkAttendanceSerializer(serializers.Serializer):
    """Serializer for bulk attendance operations"""
    session_instance_id = serializers.IntegerField(required=False)
    session_template_id = serializers.IntegerField(required=False)
    date = serializers.DateField()
    attendance_records = serializers.ListField(
        child=serializers.DictField(child=serializers.CharField()),
        allow_empty=False
    )
    
    def validate(self, data):
        session_instance_id = data.get('session_instance_id')
        session_template_id = data.get('session_template_id')
        
        if not session_instance_id and not session_template_id:
            raise serializers.ValidationError(
                "Either session_instance_id or session_template_id must be provided"
            )
        
        if session_instance_id and session_template_id:
            raise serializers.ValidationError(
                "Cannot have both session_instance_id and session_template_id"
            )
        
        # Validate attendance records structure
        attendance_records = data.get('attendance_records', [])
        for record in attendance_records:
            if 'student_id' not in record or 'status' not in record:
                raise serializers.ValidationError(
                    "Each attendance record must have 'student_id' and 'status'"
                )
            
            if record['status'] not in ['present', 'absent', 'late']:
                raise serializers.ValidationError(
                    "Status must be one of: 'present', 'absent', 'late'"
                )
        
        return data


class AttendanceReportSerializer(serializers.Serializer):
    """Serializer for attendance reports"""
    student_id = serializers.IntegerField(required=False)
    group_id = serializers.IntegerField(required=False)
    trainer_id = serializers.IntegerField(required=False)
    start_date = serializers.DateField()
    end_date = serializers.DateField()
    
    def validate(self, data):
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError("End date must be after start date")
        return data


class AttendanceStatsSerializer(serializers.Serializer):
    """Serializer for attendance statistics"""
    total_sessions = serializers.IntegerField()
    present_count = serializers.IntegerField()
    absent_count = serializers.IntegerField()
    late_count = serializers.IntegerField()
    attendance_rate = serializers.FloatField()
    
    
class StudentAttendanceStatsSerializer(serializers.Serializer):
    """Detailed attendance stats for a student"""
    student = StudentSerializer()
    stats = AttendanceStatsSerializer()
    recent_attendance = AttendanceRecordSerializer(many=True) 