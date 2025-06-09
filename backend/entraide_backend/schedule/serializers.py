from rest_framework import serializers
from .models import Schedule_session, SessionInstance
from accounts.models import User
from centers.models import Room, Group
from programs.models import TrainingCourse, TrainingPrograme
from centers.serializers import RoomSerializer, GroupSerializer
from programs.serializers import TrainingCourseSerializer


class TrainerSerializer(serializers.ModelSerializer):
    """Lightweight trainer serializer for schedule"""
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'full_name']
        
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()


class ScheduleSessionSerializer(serializers.ModelSerializer):
    """Serializer for weekly schedule templates"""
    trainer_details = TrainerSerializer(source='trainer', read_only=True)
    room_details = RoomSerializer(source='room', read_only=True)
    group_details = GroupSerializer(source='group', read_only=True)
    training_course_details = TrainingCourseSerializer(source='training_course', read_only=True)
    
    class Meta:
        model = Schedule_session
        fields = [
            'id', 'day', 'start_time', 'end_time', 'academic_year', 'is_active',
            'trainer', 'trainer_details', 'room', 'room_details', 
            'group', 'group_details', 'training_course', 'training_course_details',
            'created_at', 'updated_at'
        ]
        
    def validate(self, data):
        """Custom validation for schedule conflicts"""
        trainer = data.get('trainer')
        day = data.get('day')
        start_time = data.get('start_time')
        end_time = data.get('end_time')
        academic_year = data.get('academic_year')
        room = data.get('room')
        
        # Check trainer conflicts
        if trainer and day and start_time and academic_year:
            conflicts = Schedule_session.objects.filter(
                trainer=trainer,
                day=day,
                start_time=start_time,
                academic_year=academic_year,
                is_active=True
            )
            
            # Exclude current instance during updates
            if self.instance:
                conflicts = conflicts.exclude(id=self.instance.id)
                
            if conflicts.exists():
                raise serializers.ValidationError(
                    f"Trainer {trainer.get_full_name()} already has a session on {day} at {start_time}"
                )
        
        # Check room conflicts
        if room and day and start_time and academic_year:
            room_conflicts = Schedule_session.objects.filter(
                room=room,
                day=day,
                start_time=start_time,
                academic_year=academic_year,
                is_active=True
            )
            
            if self.instance:
                room_conflicts = room_conflicts.exclude(id=self.instance.id)
                
            if room_conflicts.exists():
                raise serializers.ValidationError(
                    f"Room {room.name} is already booked on {day} at {start_time}"
                )
        
        # Validate time order
        if start_time and end_time and start_time >= end_time:
            raise serializers.ValidationError("End time must be after start time")
            
        return data


class SessionInstanceSerializer(serializers.ModelSerializer):
    """Serializer for specific session instances"""
    schedule_template_details = ScheduleSessionSerializer(source='schedule_template', read_only=True)
    custom_trainer_details = TrainerSerializer(source='custom_trainer', read_only=True)
    custom_room_details = RoomSerializer(source='custom_room', read_only=True)
    
    # Computed fields for effective values
    effective_start_time = serializers.ReadOnlyField()
    effective_end_time = serializers.ReadOnlyField()
    effective_trainer = serializers.SerializerMethodField()
    effective_room = serializers.SerializerMethodField()
    
    class Meta:
        model = SessionInstance
        fields = [
            'id', 'schedule_template', 'schedule_template_details',
            'specific_date', 'custom_start_time', 'custom_end_time',
            'custom_trainer', 'custom_trainer_details',
            'custom_room', 'custom_room_details',
            'status', 'notes',
            'effective_start_time', 'effective_end_time',
            'effective_trainer', 'effective_room',
            'created_at', 'updated_at'
        ]
        
    def get_effective_trainer(self, obj):
        trainer = obj.effective_trainer
        if trainer:
            return TrainerSerializer(trainer).data
        return None
        
    def get_effective_room(self, obj):
        room = obj.effective_room
        if room:
            return RoomSerializer(room).data
        return None


class CreateScheduleSessionSerializer(serializers.ModelSerializer):
    """Simplified serializer for creating schedule sessions"""
    
    class Meta:
        model = Schedule_session
        fields = [
            'day', 'start_time', 'end_time', 'academic_year',
            'trainer', 'room', 'group', 'training_course', 'is_active'
        ]
        
    def validate(self, data):
        """Same validation as main serializer"""
        return ScheduleSessionSerializer().validate(data)


class BulkSessionInstanceSerializer(serializers.Serializer):
    """Serializer for bulk creating session instances for a week/month"""
    start_date = serializers.DateField()
    end_date = serializers.DateField(required=False)
    academic_year = serializers.CharField(max_length=10)
    
    def validate(self, data):
        if data.get('end_date') and data['start_date'] > data['end_date']:
            raise serializers.ValidationError("End date must be after start date")
        return data 