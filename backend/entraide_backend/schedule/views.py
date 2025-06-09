from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from datetime import datetime, timedelta
from django.utils import timezone
from django.db.models import Q

from .models import Schedule_session, SessionInstance
from .serializers import (
    ScheduleSessionSerializer, SessionInstanceSerializer,
    CreateScheduleSessionSerializer, BulkSessionInstanceSerializer,
    TrainerSerializer
)
from .utils import (
    generate_session_instances_for_week, 
    get_trainer_timetable, 
    get_group_timetable,
    cancel_session,
    reschedule_session,
    check_conflicts,
    get_weekly_schedule_summary
)
from accounts.models import User
from centers.models import Group
from centers.serializers import GroupSerializer


class ScheduleSessionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing weekly schedule templates
    """
    queryset = Schedule_session.objects.all()
    serializer_class = ScheduleSessionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['trainer', 'academic_year', 'day', 'group', 'room', 'training_course', 'is_active']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CreateScheduleSessionSerializer
        return ScheduleSessionSerializer
    
    @action(detail=False, methods=['get'])
    def by_trainer(self, request):
        """Get all schedules for a specific trainer"""
        trainer_id = request.query_params.get('trainer_id')
        academic_year = request.query_params.get('academic_year')
        
        if not trainer_id:
            return Response({'error': 'trainer_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        queryset = self.get_queryset().filter(trainer_id=trainer_id)
        if academic_year:
            queryset = queryset.filter(academic_year=academic_year)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_center(self, request):
        """Get all schedules for a specific center"""
        center_id = request.query_params.get('center_id')
        academic_year = request.query_params.get('academic_year')
        
        if not center_id:
            return Response({'error': 'center_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        queryset = self.get_queryset().filter(
            training_course__center_id=center_id
        )
        if academic_year:
            queryset = queryset.filter(academic_year=academic_year)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def trainers_by_center(self, request):
        """Get all trainers who have schedules in a specific center"""
        center_id = request.query_params.get('center_id')
        academic_year = request.query_params.get('academic_year')
        
        if not center_id:
            return Response({'error': 'center_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get distinct trainers who have schedules in this center
        schedule_query = Schedule_session.objects.filter(
            training_course__center_id=center_id,
            is_active=True
        )
        if academic_year:
            schedule_query = schedule_query.filter(academic_year=academic_year)
            
        trainer_ids = schedule_query.values_list('trainer', flat=True).distinct()
        trainers = User.objects.filter(id__in=trainer_ids)
        
        serializer = TrainerSerializer(trainers, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def groups_by_center(self, request):
        """Get all groups that belong to a specific center and have schedules"""
        center_id = request.query_params.get('center_id')
        academic_year = request.query_params.get('academic_year')
        
        if not center_id:
            return Response({'error': 'center_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get groups that have schedules in this center
        schedule_query = Schedule_session.objects.filter(
            training_course__center_id=center_id,
            group__isnull=False,
            is_active=True
        )
        if academic_year:
            schedule_query = schedule_query.filter(academic_year=academic_year)
            
        group_ids = schedule_query.values_list('group', flat=True).distinct()
        groups = Group.objects.filter(id__in=group_ids)
        
        serializer = GroupSerializer(groups, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def trainer_schedule(self, request):
        """Get schedule sessions for a specific trainer"""
        trainer_id = request.query_params.get('trainer_id')
        center_id = request.query_params.get('center_id')
        academic_year = request.query_params.get('academic_year')
        
        if not trainer_id:
            return Response({'error': 'trainer_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            trainer = get_object_or_404(User, id=trainer_id)
        except User.DoesNotExist:
            return Response({'error': 'Trainer not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        queryset = self.get_queryset().filter(trainer_id=trainer_id, is_active=True)
        
        if center_id:
            queryset = queryset.filter(training_course__center_id=center_id)
        if academic_year:
            queryset = queryset.filter(academic_year=academic_year)
            
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'trainer': TrainerSerializer(trainer).data,
            'schedules': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def group_schedule(self, request):
        """Get schedule sessions for a specific group"""
        group_id = request.query_params.get('group_id')
        center_id = request.query_params.get('center_id')
        academic_year = request.query_params.get('academic_year')
        
        if not group_id:
            return Response({'error': 'group_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            group = get_object_or_404(Group, id=group_id)
        except Group.DoesNotExist:
            return Response({'error': 'Group not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        queryset = self.get_queryset().filter(group_id=group_id, is_active=True)
        
        if center_id:
            queryset = queryset.filter(training_course__center_id=center_id)
        if academic_year:
            queryset = queryset.filter(academic_year=academic_year)
            
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'group': GroupSerializer(group).data,
            'schedules': serializer.data
        })

    @action(detail=False, methods=['get'])
    def by_group(self, request):
        """Get all schedules for a specific group"""
        group_id = request.query_params.get('group_id')
        academic_year = request.query_params.get('academic_year')
        
        if not group_id:
            return Response({'error': 'group_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        queryset = self.get_queryset().filter(group_id=group_id)
        if academic_year:
            queryset = queryset.filter(academic_year=academic_year)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def check_conflicts(self, request):
        """Check for scheduling conflicts"""
        trainer_id = request.data.get('trainer_id')
        day = request.data.get('day')
        start_time = request.data.get('start_time')
        end_time = request.data.get('end_time')
        academic_year = request.data.get('academic_year')
        room_id = request.data.get('room_id')
        exclude_id = request.data.get('exclude_id')  # For updates
        
        conflicts = []
        
        # Check trainer conflicts
        if trainer_id and day and start_time and academic_year:
            trainer_conflicts = Schedule_session.objects.filter(
                trainer_id=trainer_id,
                day=day,
                start_time=start_time,
                academic_year=academic_year,
                is_active=True
            )
            
            if exclude_id:
                trainer_conflicts = trainer_conflicts.exclude(id=exclude_id)
                
            if trainer_conflicts.exists():
                conflicts.append({
                    'type': 'trainer',
                    'message': f'Trainer already has a session on {day} at {start_time}'
                })
        
        # Check room conflicts
        if room_id and day and start_time and academic_year:
            room_conflicts = Schedule_session.objects.filter(
                room_id=room_id,
                day=day,
                start_time=start_time,
                academic_year=academic_year,
                is_active=True
            )
            
            if exclude_id:
                room_conflicts = room_conflicts.exclude(id=exclude_id)
                
            if room_conflicts.exists():
                conflicts.append({
                    'type': 'room',
                    'message': f'Room is already booked on {day} at {start_time}'
                })
        
        return Response({
            'has_conflicts': len(conflicts) > 0,
            'conflicts': conflicts
        })


class SessionInstanceViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing specific session instances
    """
    queryset = SessionInstance.objects.all()
    serializer_class = SessionInstanceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['schedule_template', 'specific_date', 'status']
    
    @action(detail=False, methods=['post'])
    def generate_for_week(self, request):
        """Generate session instances for a specific week"""
        serializer = BulkSessionInstanceSerializer(data=request.data)
        if serializer.is_valid():
            start_date = serializer.validated_data['start_date']
            academic_year = serializer.validated_data['academic_year']
            
            instances_created = generate_session_instances_for_week(start_date, academic_year)
            
            response_serializer = SessionInstanceSerializer(instances_created, many=True)
            return Response({
                'message': f'Created {len(instances_created)} session instances',
                'instances': response_serializer.data
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def trainer_timetable(self, request):
        """Get trainer's timetable for a date range"""
        trainer_id = request.query_params.get('trainer_id')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if not all([trainer_id, start_date, end_date]):
            return Response({
                'error': 'trainer_id, start_date, and end_date are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            trainer = get_object_or_404(User, id=trainer_id)
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
        except (ValueError, User.DoesNotExist) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        instances = get_trainer_timetable(trainer, start_date, end_date)
        serializer = SessionInstanceSerializer(instances, many=True)
        
        return Response({
            'trainer': {
                'id': trainer.id,
                'name': f"{trainer.first_name} {trainer.last_name}",
                'email': trainer.email
            },
            'period': {
                'start_date': start_date,
                'end_date': end_date
            },
            'sessions': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def group_timetable(self, request):
        """Get group's timetable for a date range"""
        group_id = request.query_params.get('group_id')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if not all([group_id, start_date, end_date]):
            return Response({
                'error': 'group_id, start_date, and end_date are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            group = get_object_or_404(Group, id=group_id)
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
        except (ValueError, Group.DoesNotExist) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        instances = get_group_timetable(group, start_date, end_date)
        serializer = SessionInstanceSerializer(instances, many=True)
        
        return Response({
            'group': {
                'id': group.id,
                'name': group.name,
                'center': group.center.name if group.center else None
            },
            'period': {
                'start_date': start_date,
                'end_date': end_date
            },
            'sessions': serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a session instance"""
        reason = request.data.get('reason', '')
        success, message = cancel_session(pk, reason)
        
        if success:
            return Response({'message': message})
        return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def reschedule(self, request, pk=None):
        """Reschedule a session instance"""
        new_date = request.data.get('new_date')
        new_start_time = request.data.get('new_start_time')
        new_room_id = request.data.get('new_room_id')
        
        if not new_date:
            return Response({'error': 'new_date is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            new_date = datetime.strptime(new_date, '%Y-%m-%d').date()
        except ValueError:
            return Response({'error': 'Invalid date format'}, status=status.HTTP_400_BAD_REQUEST)
        
        success, message = reschedule_session(pk, new_date, new_start_time, new_room_id)
        
        if success:
            return Response({'message': message})
        return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def weekly_summary(self, request):
        """Get weekly schedule summary"""
        week_start = request.query_params.get('week_start')
        academic_year = request.query_params.get('academic_year')
        
        if not all([week_start, academic_year]):
            return Response({
                'error': 'week_start and academic_year are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            week_start_date = datetime.strptime(week_start, '%Y-%m-%d').date()
        except ValueError:
            return Response({'error': 'Invalid date format'}, status=status.HTTP_400_BAD_REQUEST)
        
        instances = get_weekly_schedule_summary(academic_year, week_start_date)
        serializer = SessionInstanceSerializer(instances, many=True)
        
        return Response({
            'week_start': week_start_date,
            'academic_year': academic_year,
            'sessions': serializer.data
        })
