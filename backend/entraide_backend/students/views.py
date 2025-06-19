from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db import transaction
import pandas as pd
import io
from .models import Student
from .serializers import StudentSerializer, StudentCreateUpdateSerializer
from api.permissions import IsAdminOrCenterSupervisor
from rest_framework.pagination import PageNumberPagination
from teachers.models import Teacher

# Create your views here.

class StudentPagination(PageNumberPagination):
    """Allow client to set page_size via ?page_size while keeping sane limits."""
    page_size_query_param = 'page_size'
    max_page_size = 1000

class StudentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows students to be viewed or edited.
    """
    queryset = Student.objects.select_related('user', 'center', 'program', 'training_course', 'group').all() # Default queryset with optimized queries
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['center', 'program', 'group', 'academic_year']
    search_fields = ['user__first_name', 'user__last_name', 'user__email', 'exam_id']
    ordering_fields = ['created_at', 'joining_date', 'user__first_name', 'user__last_name']
    ordering = ['-created_at']
    pagination_class = StudentPagination

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return StudentCreateUpdateSerializer
        return StudentSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'bulk_import']:
            self.permission_classes = [IsAdminOrCenterSupervisor]
        elif self.action in ['list', 'retrieve']:
            self.permission_classes = [permissions.IsAuthenticated]
        else:
            self.permission_classes = [permissions.IsAdminUser] # Default to admin for any other actions
        return super().get_permissions()

    @action(detail=False, methods=['post'])
    def bulk_import(self, request):
        """
        Bulk import students from Excel file.
        
        Form data (from frontend dropdowns):
        - program_id (required): ID of training program to assign to all students
        - group_id (optional): ID of group to assign to all students
        - training_course_id (optional): ID of training course to assign to all students
        
        Expected Excel columns:
        - first_name (required)
        - last_name (required)  
        - arabic_first_name (optional)
        - arabic_last_name (optional)
        - academic_year (required)
        - joining_date (optional, format: YYYY-MM-DD)
        - cin_id (optional)
        - phone_number (optional)
        - birth_date (optional, format: YYYY-MM-DD)
        - birth_city (optional)
        - address (optional)
        - city (optional)
        """
        if 'file' not in request.FILES:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        file = request.FILES['file']
        
        # Validate file type
        if not file.name.endswith(('.xlsx', '.xls')):
            return Response({'error': 'File must be an Excel file (.xlsx or .xls)'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get assignment data from form
        program_id = request.data.get('program_id')
        group_id = request.data.get('group_id')  # Optional
        training_course_id = request.data.get('training_course_id')  # Optional
        
        # Validate required assignment data
        if not program_id:
            return Response({'error': 'Program ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Read Excel file
            df = pd.read_excel(file)
            
            # Get current user's supervised center (for center supervisors)
            user = request.user
            current_center = None
            
            if user.role == 'center_supervisor':
                if hasattr(user, 'supervised_centers'):
                    supervised_centers = user.supervised_centers.all()
                    if supervised_centers.exists():
                        current_center = supervised_centers.first()
                    else:
                        return Response({'error': 'No center assigned to this supervisor'}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({'error': 'Center supervisor has no centers assigned'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Utility to safely fetch a value considering headers that may end with '*',
            # then convert to a cleaned string
            def _safe_str_from_row(row_obj, base_col):
                """Return trimmed string for column or column* ."""
                raw_val = row_obj.get(base_col)
                if raw_val is None:
                    raw_val = row_obj.get(f"{base_col}*")
                return str(raw_val).strip() if pd.notna(raw_val) else ''

            # Process rows
            results = {
                'total_rows': len(df),
                'successful': 0,
                'failed': 0,
                'errors': []
            }
            
            with transaction.atomic():
                for index, row in df.iterrows():
                    try:
                        # Prepare data for student creation
                        student_data = {
                            'first_name': _safe_str_from_row(row, 'first_name'),  # required
                            'last_name': _safe_str_from_row(row, 'last_name'),    # required
                            'Arabic_first_name': _safe_str_from_row(row, 'arabic_first_name') or None,
                            'arabic_last_name': _safe_str_from_row(row, 'arabic_last_name') or None,
                            'academic_year': _safe_str_from_row(row, 'academic_year'),  # required
                            'joining_date': row.get('joining_date') if pd.notna(row.get('joining_date')) else None,
                            'program': program_id,  # From form data
                            'training_course': training_course_id if training_course_id else None,  # From form data
                            'group': group_id if group_id else None,  # From form data
                            'CIN_id': _safe_str_from_row(row, 'cin_id') or None,
                            'phone_number': _safe_str_from_row(row, 'phone_number') or None,
                            'birth_date': row.get('birth_date') if pd.notna(row.get('birth_date')) else None,
                            'birth_city': _safe_str_from_row(row, 'birth_city') or None,
                            'address': _safe_str_from_row(row, 'address') or None,
                            'city': _safe_str_from_row(row, 'city') or None,
                        }
                        
                        # Add center for center supervisors
                        if current_center:
                            student_data['center'] = current_center.id
                        elif 'center' in row and pd.notna(row.get('center')):
                            student_data['center'] = row.get('center')
                        else:
                            raise ValueError("Center is required but not provided")
                        
                        # Validate required fields
                        if not student_data['first_name'] or not student_data['last_name']:
                            raise ValueError("First name and last name are required")
                        
                        if not student_data['academic_year']:
                            raise ValueError("Academic year is required")
                        
                        # Create student using existing serializer
                        serializer = StudentCreateUpdateSerializer(data=student_data)
                        if serializer.is_valid():
                            serializer.save()
                            results['successful'] += 1
                        else:
                            error_msg = f"Row {index + 2}: {serializer.errors}"
                            results['errors'].append(error_msg)
                            results['failed'] += 1
                            
                    except Exception as e:
                        error_msg = f"Row {index + 2}: {str(e)}"
                        results['errors'].append(error_msg)
                        results['failed'] += 1
            
            return Response(results, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': f'Failed to process file: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        """
        This view should return a list of all students for admin,
        students from the supervised center for center_supervisor,
        or only the student associated with the currently authenticated user.
        """
        user = self.request.user
        if user.is_authenticated:
            # Assuming User model has a 'role' attribute
            if hasattr(user, 'role'):
                if user.role == 'admin':
                    # Admin can see all students
                    return Student.objects.select_related('user', 'center', 'program', 'training_course', 'group').all()
                elif user.role == 'center_supervisor':
                    # Center supervisor can only see students from their supervised centers
                    # Use the related_name 'supervised_centers' from the Center model
                    if hasattr(user, 'supervised_centers'):
                        supervised_centers = user.supervised_centers.all()
                        if supervised_centers.exists():
                            return Student.objects.select_related('user', 'center', 'program', 'training_course', 'group').filter(center__in=supervised_centers)
                    # If supervisor has no centers assigned, return empty queryset
                    return Student.objects.none()
                elif user.role == 'trainer':
                    # Trainer can see students belonging to the groups they teach
                    try:
                        teacher_profile = user.teacher  # OneToOne relation from Teacher to User
                        teacher_groups = teacher_profile.groups.all()
                        if teacher_groups.exists():
                            return Student.objects.select_related('user', 'center', 'program', 'training_course', 'group').filter(group__in=teacher_groups)
                        # If trainer has no groups assigned, return empty queryset
                        return Student.objects.none()
                    except Teacher.DoesNotExist:
                        # If no Teacher profile linked, return empty queryset
                        return Student.objects.none()
                else:
                    # For any other authenticated user (e.g., student, trainer),
                    # return their own student record if it exists.
                    # The Student model has a OneToOneField to User named 'user'.
                    return Student.objects.select_related('user', 'center', 'program', 'training_course', 'group').filter(user=user)
            else:
                # If user has no role attribute, return their own student record if exists
                return Student.objects.select_related('user', 'center', 'program', 'training_course', 'group').filter(user=user)
        return Student.objects.none() # No students for unauthenticated users
