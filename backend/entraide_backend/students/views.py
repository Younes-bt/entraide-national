from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Student
from .serializers import StudentSerializer, StudentCreateUpdateSerializer
from api.permissions import IsAdminOrCenterSupervisor 

# Create your views here.

class StudentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows students to be viewed or edited.
    """
    queryset = Student.objects.all() # Default queryset

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
        This view should return a list of all students for admin/center_supervisor
        or only the student associated with the currently authenticated user.
        """
        user = self.request.user
        if user.is_authenticated:
            # Assuming User model has a 'role' attribute
            if hasattr(user, 'role') and (user.role == 'admin' or user.role == 'center_supervisor'):
                return Student.objects.all()
            else:
                # For any other authenticated user (e.g., student, trainer),
                # return their own student record if it exists.
                # The Student model has a OneToOneField to User named 'user'.
                return Student.objects.filter(user=user)
        return Student.objects.none() # No students for unauthenticated users
