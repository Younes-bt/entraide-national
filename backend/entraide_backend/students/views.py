from django.shortcuts import render
from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Student
from .serializers import StudentSerializer, StudentCreateUpdateSerializer
from api.permissions import IsAdminOrCenterSupervisor 

# Create your views here.

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

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return StudentCreateUpdateSerializer
        return StudentSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAdminOrCenterSupervisor]
        elif self.action in ['list', 'retrieve']:
            self.permission_classes = [permissions.IsAuthenticated]
        else:
            self.permission_classes = [permissions.IsAdminUser] # Default to admin for any other actions
        return super().get_permissions()

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
                else:
                    # For any other authenticated user (e.g., student, trainer),
                    # return their own student record if it exists.
                    # The Student model has a OneToOneField to User named 'user'.
                    return Student.objects.select_related('user', 'center', 'program', 'training_course', 'group').filter(user=user)
            else:
                # If user has no role attribute, return their own student record if exists
                return Student.objects.select_related('user', 'center', 'program', 'training_course', 'group').filter(user=user)
        return Student.objects.none() # No students for unauthenticated users
