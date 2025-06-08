from django.shortcuts import render
from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Teacher
from .serializers import TeacherSerializer, TeacherCreateUpdateSerializer
from api.permissions import IsAdminOrCenterSupervisor # Assuming this permission class is appropriate

class TeacherViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows teachers to be viewed or edited.
    """
    queryset = Teacher.objects.select_related('user', 'center', 'program').prefetch_related('groups').all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['center', 'program', 'contarct_with', 'user']
    search_fields = ['user__first_name', 'user__last_name', 'user__email', 'center__name', 'program__name']
    ordering_fields = ['user__first_name', 'user__last_name', 'contract_start_date', 'created_at']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return TeacherCreateUpdateSerializer
        return TeacherSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            # Allow Admin or CenterSupervisor to modify
            self.permission_classes = [IsAdminOrCenterSupervisor]
        elif self.action in ['list', 'retrieve']:
            # Allow any authenticated user to view (queryset will restrict further)
            self.permission_classes = [permissions.IsAuthenticated]
        else:
            # Default to admin for any other actions
            self.permission_classes = [permissions.IsAdminUser]
        return super().get_permissions()

    def get_queryset(self):
        """
        This view should return a list of all teachers for admin,
        teachers from the supervised center(s) for center_supervisor,
        or only the teacher associated with the currently authenticated user (if they are a teacher).
        """
        user = self.request.user
        if not user.is_authenticated:
            return Teacher.objects.none()

        # Optimized queryset base
        qs = Teacher.objects.select_related('user', 'center', 'program').prefetch_related('groups')

        if hasattr(user, 'role'):
            if user.role == 'admin':
                return qs.all()
            elif user.role == 'center_supervisor':
                # Assuming 'supervised_centers' is the related_name from User to Center
                # or that the Center model has a supervisor field that links back to user.
                # This logic needs to align with your User-Center-Supervisor relationship.
                if hasattr(user, 'supervised_centers'): # From StudentViewSet example
                    supervised_centers = user.supervised_centers.all()
                    if supervised_centers.exists():
                        return qs.filter(center__in=supervised_centers)
                # Fallback or alternative: if center has a direct supervisor link
                # elif hasattr(user, 'center_set'): # if User is a FK in Center as supervisor
                #     return qs.filter(center__supervisor=user) # Example, adjust field name
                return Teacher.objects.none() # No centers supervised, no teachers to show
            elif user.role == 'trainer':
                # A trainer sees their own profile
                return qs.filter(user=user)
            else:
                # Other authenticated roles (e.g. student, association_supervisor) might not see any teachers by default
                # or you might want them to see all teachers. For now, restricting.
                return Teacher.objects.none()
        else:
            # If user has no role attribute, behavior might be undefined or restricted.
            # For safety, returning none, but this case should ideally not happen with a well-defined User model.
            return Teacher.objects.none()
