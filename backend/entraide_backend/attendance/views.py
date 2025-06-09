from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count, Case, When, IntegerField
from datetime import datetime, timedelta

from .models import Attendance_record
from .serializers import (
    AttendanceRecordSerializer, CreateAttendanceRecordSerializer,
    BulkAttendanceSerializer, AttendanceReportSerializer,
    AttendanceStatsSerializer, StudentAttendanceStatsSerializer
)
from students.models import Student
from schedule.models import SessionInstance, Schedule_session
from centers.models import Group
from accounts.models import User


class AttendanceRecordViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing attendance records
    """
    queryset = Attendance_record.objects.all()
    serializer_class = AttendanceRecordSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['student', 'date', 'status', 'session_template', 'session_instance']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CreateAttendanceRecordSerializer
        return AttendanceRecordSerializer
    
    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        """Bulk create attendance records for a session"""
        serializer = BulkAttendanceSerializer(data=request.data)
        if serializer.is_valid():
            session_instance_id = serializer.validated_data.get('session_instance_id')
            session_template_id = serializer.validated_data.get('session_template_id')
            date = serializer.validated_data['date']
            attendance_records = serializer.validated_data['attendance_records']
            
            created_records = []
            errors = []
            
            for record_data in attendance_records:
                try:
                    student = get_object_or_404(Student, id=record_data['student_id'])
                    
                    # Create or update attendance record
                    attendance_record, created = Attendance_record.objects.update_or_create(
                        student=student,
                        date=date,
                        session_instance_id=session_instance_id,
                        session_template_id=session_template_id,
                        defaults={
                            'status': record_data['status'],
                            'notes': record_data.get('notes', '')
                        }
                    )
                    
                    created_records.append(attendance_record)
                    
                except Exception as e:
                    errors.append({
                        'student_id': record_data['student_id'],
                        'error': str(e)
                    })
            
            response_serializer = AttendanceRecordSerializer(created_records, many=True)
            
            return Response({
                'message': f'Processed {len(created_records)} attendance records',
                'created': len(created_records),
                'errors': errors,
                'records': response_serializer.data
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def by_session(self, request):
        """Get attendance records for a specific session"""
        session_instance_id = request.query_params.get('session_instance_id')
        session_template_id = request.query_params.get('session_template_id')
        date = request.query_params.get('date')
        
        if not date:
            return Response({'error': 'date is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        queryset = self.get_queryset().filter(date=date)
        
        if session_instance_id:
            queryset = queryset.filter(session_instance_id=session_instance_id)
        elif session_template_id:
            queryset = queryset.filter(session_template_id=session_template_id)
        else:
            return Response({
                'error': 'Either session_instance_id or session_template_id is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_student(self, request):
        """Get attendance records for a specific student"""
        student_id = request.query_params.get('student_id')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if not student_id:
            return Response({'error': 'student_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        queryset = self.get_queryset().filter(student_id=student_id)
        
        if start_date and end_date:
            try:
                start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
                end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
                queryset = queryset.filter(date__range=[start_date, end_date])
            except ValueError:
                return Response({'error': 'Invalid date format'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_group(self, request):
        """Get attendance records for all students in a group"""
        group_id = request.query_params.get('group_id')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if not group_id:
            return Response({'error': 'group_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get all students in the group
        students = Student.objects.filter(group_id=group_id)
        student_ids = students.values_list('id', flat=True)
        
        queryset = self.get_queryset().filter(student_id__in=student_ids)
        
        if start_date and end_date:
            try:
                start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
                end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
                queryset = queryset.filter(date__range=[start_date, end_date])
            except ValueError:
                return Response({'error': 'Invalid date format'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get attendance statistics"""
        student_id = request.query_params.get('student_id')
        group_id = request.query_params.get('group_id')
        trainer_id = request.query_params.get('trainer_id')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if not start_date or not end_date:
            return Response({
                'error': 'start_date and end_date are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
        except ValueError:
            return Response({'error': 'Invalid date format'}, status=status.HTTP_400_BAD_REQUEST)
        
        queryset = self.get_queryset().filter(date__range=[start_date, end_date])
        
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        elif group_id:
            students = Student.objects.filter(group_id=group_id)
            queryset = queryset.filter(student__in=students)
        elif trainer_id:
            # Get sessions for this trainer
            queryset = queryset.filter(
                Q(session_template__trainer_id=trainer_id) |
                Q(session_instance__schedule_template__trainer_id=trainer_id)
            )
        
        # Calculate statistics
        stats = queryset.aggregate(
            total_sessions=Count('id'),
            present_count=Count(Case(When(status='present', then=1), output_field=IntegerField())),
            absent_count=Count(Case(When(status='absent', then=1), output_field=IntegerField())),
            late_count=Count(Case(When(status='late', then=1), output_field=IntegerField()))
        )
        
        total = stats['total_sessions']
        if total > 0:
            stats['attendance_rate'] = round((stats['present_count'] + stats['late_count']) / total * 100, 2)
        else:
            stats['attendance_rate'] = 0.0
        
        return Response(stats)
    
    @action(detail=False, methods=['get'])
    def student_stats(self, request):
        """Get detailed attendance stats for students"""
        group_id = request.query_params.get('group_id')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if not all([group_id, start_date, end_date]):
            return Response({
                'error': 'group_id, start_date, and end_date are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
        except ValueError:
            return Response({'error': 'Invalid date format'}, status=status.HTTP_400_BAD_REQUEST)
        
        students = Student.objects.filter(group_id=group_id)
        results = []
        
        for student in students:
            # Get attendance records for this student in the date range
            attendance_records = self.get_queryset().filter(
                student=student,
                date__range=[start_date, end_date]
            )
            
            # Calculate stats
            stats = attendance_records.aggregate(
                total_sessions=Count('id'),
                present_count=Count(Case(When(status='present', then=1), output_field=IntegerField())),
                absent_count=Count(Case(When(status='absent', then=1), output_field=IntegerField())),
                late_count=Count(Case(When(status='late', then=1), output_field=IntegerField()))
            )
            
            total = stats['total_sessions']
            if total > 0:
                stats['attendance_rate'] = round((stats['present_count'] + stats['late_count']) / total * 100, 2)
            else:
                stats['attendance_rate'] = 0.0
            
            # Get recent attendance (last 10 records)
            recent_attendance = attendance_records.order_by('-date')[:10]
            
            results.append({
                'student': student,
                'stats': stats,
                'recent_attendance': recent_attendance
            })
        
        serializer = StudentAttendanceStatsSerializer(results, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def report(self, request):
        """Generate attendance report"""
        serializer = AttendanceReportSerializer(data=request.query_params)
        if serializer.is_valid():
            data = serializer.validated_data
            
            queryset = self.get_queryset().filter(
                date__range=[data['start_date'], data['end_date']]
            )
            
            if data.get('student_id'):
                queryset = queryset.filter(student_id=data['student_id'])
            elif data.get('group_id'):
                students = Student.objects.filter(group_id=data['group_id'])
                queryset = queryset.filter(student__in=students)
            elif data.get('trainer_id'):
                queryset = queryset.filter(
                    Q(session_template__trainer_id=data['trainer_id']) |
                    Q(session_instance__schedule_template__trainer_id=data['trainer_id'])
                )
            
            # Group by date and status for the report
            report_data = []
            dates = queryset.values_list('date', flat=True).distinct().order_by('date')
            
            for date in dates:
                daily_records = queryset.filter(date=date)
                daily_stats = daily_records.aggregate(
                    total=Count('id'),
                    present=Count(Case(When(status='present', then=1), output_field=IntegerField())),
                    absent=Count(Case(When(status='absent', then=1), output_field=IntegerField())),
                    late=Count(Case(When(status='late', then=1), output_field=IntegerField()))
                )
                
                report_data.append({
                    'date': date,
                    'statistics': daily_stats,
                    'records': AttendanceRecordSerializer(daily_records, many=True).data
                })
            
            return Response({
                'period': {
                    'start_date': data['start_date'],
                    'end_date': data['end_date']
                },
                'report': report_data
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
