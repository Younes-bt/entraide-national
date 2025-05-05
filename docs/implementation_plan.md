# Entraide National Management System: Detailed Implementation Plan

## Phase 1: Project Setup and Planning (Days 1-3)

### Day 1: Environment Setup & Project Initialization DONE

#### Backend Setup
1. **Create Virtual Environment** DONE
   ```bash
   # Create and activate virtual environment
   mkdir entraide-project
   cd entraide-project
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # Install dependencies
   pip install django djangorestframework django-cors-headers psycopg2-binary python-dotenv Pillow djangorestframework-simplejwt dj-rest-auth django-cloudinary-storage
   pip freeze > requirements.txt
   ```

2. **Initialize Django Project** DONE
   ```bash
   django-admin startproject entraide_backend .
   ```

3. **Create Core Apps** DONE
   ```bash
   python manage.py startapp accounts
   python manage.py startapp centers
   python manage.py startapp associations
   python manage.py startapp programs
   python manage.py startapp students
   python manage.py startapp exams
   python manage.py startapp api
   python manage.py startapp attendance
   ```

4. **Configure PostgreSQL Database** DONE
   - Create `.env` file for secrets
   ```python
   # filepath: entraide_backend/settings.py
   import os
   from pathlib import Path
   from dotenv import load_dotenv

   load_dotenv()

   # Database settings
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': os.environ.get('DB_NAME', 'entraide_db'),
           'USER': os.environ.get('DB_USER', 'postgres'),
           'PASSWORD': os.environ.get('DB_PASSWORD', ''),
           'HOST': os.environ.get('DB_HOST', 'localhost'),
           'PORT': os.environ.get('DB_PORT', '5432'),
       }
   }

   # Add apps to INSTALLED_APPS
   INSTALLED_APPS = [
       # Django apps
       'django.contrib.admin',
       'django.contrib.auth',
       'django.contrib.contenttypes',
       'django.contrib.sessions',
       'django.contrib.messages',
       'django.contrib.staticfiles',
       
       # Third-party apps
       'rest_framework',
       'corsheaders',
       'rest_framework_simplejwt',
       'cloudinary_storage',
       'cloudinary',
       'drf_yasg',
       
       # Local apps
       'accounts',
       'centers',
       'associations',
       'programs',
       'students',
       'exams',
       'api',
       'attendance',
   ]
   ```

#### Frontend Setup DONE
1. **Initialize React Project**
   ```bash
   npx create-react-app entraide-frontend
   cd entraide-frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install axios react-router-dom i18next react-i18next @reduxjs/toolkit react-redux recharts
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

3. **Setup Tailwind CSS**
   ```javascript
   // filepath: tailwind.config.js
   module.exports = {
     content: [
       "./src/**/*.{js,jsx,ts,tsx}",
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

4. **Initialize Shadcn UI**
   ```bash
   npx shadcn-ui@latest init
   ```

### Day 2: Database Schema Design & User Authentication

#### Data Model Design

1. **User & Authentication Models** DONE
   ```python
    from django.db import models
    from django.contrib.auth.models import AbstractUser, BaseUserManager
    from cloudinary.models import CloudinaryField


    class UserManager(BaseUserManager):
        def create_user(self, email, password=None, **extra_fields):
            if not email:
                raise ValueError("The Email field must be set")
            email = self.normalize_email(email)
            user = self.model(email=email, **extra_fields)
            user.set_password(password)
            user.save(using=self._db)
            return user

        def create_superuser(self, email, password=None, **extra_fields):
            extra_fields.setdefault('is_staff', True)
            extra_fields.setdefault('is_superuser', True)
            extra_fields.setdefault('is_active', True)

            return self.create_user(email, password, **extra_fields)

    class UserRole(models.TextChoices):
        ADMIN = 'admin', 'Administrator'
        CENTER_SUPERVISOR = 'center_supervisor', 'Center Supervisor'
        ASSOCIATION_SUPERVISOR = 'association_supervisor', 'Association Supervisor'
        TRAINER = 'trainer', 'Trainer'
        STUDENT = 'student', 'Student'

    class User(AbstractUser):
        email = models.EmailField(unique=True) # Ensure email is unique
        role = models.CharField(max_length=50, choices=UserRole.choices, default=UserRole.STUDENT)
        # Profile fields
        first_name = models.CharField(max_length=30, blank=True)
        last_name = models.CharField(max_length=30, blank=True)
        profile_picture = models.CloudinaryField('image', blank=True, null=True)
        birth_date = models.DateField(blank=True, null=True)
        birth_city = models.CharField(max_length=100, blank=True, null=True)
        CIN_id = models.CharField(max_length=20, blank=True, null=True)  # National ID

        # contact information
        phone_number = models.CharField(max_length=15, blank=True, null=True)
        address = models.CharField(max_length=255, blank=True, null=True)
        city = models.CharField(max_length=100, blank=True, null=True)

        # timestamps
        created_at = models.DateTimeField(auto_now_add=True)
        updated_at = models.DateTimeField(auto_now=True)

        # set email as the username field
        USERNAME_FIELD = 'email'
        REQUIRED_FIELDS = ['first_name', 'last_name', 'role']  # required fields

        # use custom user manager
        objects = UserManager()

        def __str__(self):
            return f'{self.first_name} {self.last_name} - ({self.get_role_display()})'
   ```

2. **Core Models** DONE
   ```python DONE
   # filepath: associations/models.py
   from django.db import models
   from accounts.models import User

   class Association(models.Model):
       name = models.CharField(max_length=255)
       president = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='led_associations')
       address = models.TextField()
       phone = models.CharField(max_length=15)
       email = models.EmailField()
       registration_number = models.CharField(max_length=50, unique=True)
       contract_start_date = models.DateField()
       contract_end_date = models.DateField()
       supervisors = models.ManyToManyField(User, related_name='supervised_associations')
       
       created_at = models.DateTimeField(auto_now_add=True)
       updated_at = models.DateTimeField(auto_now=True)
       
       def __str__(self):
           return self.name
   ```

   ```python DONE
   # filepath: centers/models.py
   from django.db import models
   from associations.models import Association
   from accounts.models import User

   class Center(models.Model):
       name = models.CharField(max_length=255)
       address = models.TextField()
       city = models.CharField(max_length=100)
       phone = models.CharField(max_length=15)
       email = models.EmailField(blank=True, null=True)
       capacity = models.PositiveIntegerField(default=0)
       association = models.ForeignKey(Association, on_delete=models.CASCADE, related_name='centers')
       supervisor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='supervised_centers')
       
       created_at = models.DateTimeField(auto_now_add=True)
       updated_at = models.DateTimeField(auto_now=True)
       
       def __str__(self):
           return f"{self.name} ({self.city})"
   ```

3. **Program & Training Models**
   ```python DONE
   # filepath: programs/models.py
   from django.db import models
   from centers.models import Center
   from accounts.models import User

   class TrainingProgram(models.Model):
       name = models.CharField(max_length=255)
       description = models.TextField()
       duration_months = models.PositiveIntegerField()
       
       def __str__(self):
           return self.name

   class TrainingCourse(models.Model):
       program = models.ForeignKey(TrainingProgram, on_delete=models.CASCADE, related_name='courses')
       center = models.ForeignKey(Center, on_delete=models.CASCADE, related_name='courses')
       trainer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='courses')
       start_date = models.DateField()
       end_date = models.DateField()
       capacity = models.PositiveIntegerField()
       
       created_at = models.DateTimeField(auto_now_add=True)
       updated_at = models.DateTimeField(auto_now=True)
       
       def __str__(self):
           return f"{self.program.name} at {self.center.name}"
   ```

4. **Student Models** DONE
   ```python
   # filepath: students/models.py
   from django.db import models
   from accounts.models import User
   from programs.models import TrainingCourse

   class Student(models.Model):
       user = models.OneToOneField(User, on_delete=models.CASCADE)
       national_id = models.CharField(max_length=20, unique=True)
       birth_date = models.DateField()
       address = models.TextField()
       education_level = models.CharField(max_length=100)
       
       def __str__(self):
           return f"{self.user.get_full_name()} ({self.national_id})"

   class Enrollment(models.Model):
       student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='enrollments')
       course = models.ForeignKey(TrainingCourse, on_delete=models.CASCADE, related_name='enrollments')
       enrollment_date = models.DateField(auto_now_add=True)
       STATUS_CHOICES = [
           ('active', 'Active'),
           ('graduated', 'Graduated'),
           ('dropped', 'Dropped'),
           ('failed', 'Failed'),
       ]
       status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
       
       class Meta:
           unique_together = ['student', 'course']
           
       def __str__(self):
           return f"{self.student.user.get_full_name()} - {self.course.program.name}"
   ```

5. **Exam Models** DONE
   ```python
   # filepath: exams/models.py
   from django.db import models
   from programs.models import TrainingCourse
   from students.models import Student, Enrollment
   from accounts.models import User
   from django.contrib.postgres.fields import JSONField

   class Question(models.Model):
       training = models.ForeignKey('programs.TrainingProgram', on_delete=models.CASCADE, related_name='questions')
       week = models.ForeignKey('programs.TrainingProgramWeek', on_delete=models.CASCADE, related_name='questions', null=True, blank=True)
       TERM_CHOICES = [
           ('term1', 'First Term'),
           ('term2', 'Second Term'),
       ]
       term = models.CharField(max_length=10, choices=TERM_CHOICES)
       TYPE_CHOICES = [
           ('Theory', 'Theory'),
           ('Practical', 'Practical'),
       ]
       type = models.CharField(max_length=20, choices=TYPE_CHOICES)
       text = models.TextField()
       correct_answer = models.CharField(max_length=255)
       options = JSONField()  # Stores multiple choice options
       points = models.PositiveIntegerField(default=1)
       added_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_questions')
       created_at = models.DateTimeField(auto_now_add=True)
       edited_at = models.DateTimeField(auto_now=True)
       
       def __str__(self):
           return f"{self.training.name} - {self.get_term_display()} - {self.get_type_display()} - {self.text[:50]}"

   class Exam(models.Model):
       EXAM_TYPE_CHOICES = [
           ('term1_theory', 'First Term Theory'),
           ('term1_practical', 'First Term Practical'),
           ('term2_theory', 'Second Term Theory'),
           ('term2_practical', 'Second Term Practical'),
       ]
       exam_type = models.CharField(max_length=20, choices=EXAM_TYPE_CHOICES)
       student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='exams')
       training = models.ForeignKey('programs.TrainingProgram', on_delete=models.CASCADE, related_name='exams')
       questions = models.ManyToManyField(Question, related_name='exams')
       score = models.IntegerField(default=0)
       created_at = models.DateTimeField(auto_now_add=True)
       edited_at = models.DateTimeField(auto_now=True)
       
       def __str__(self):
           return f"{self.get_exam_type_display()} - {self.student.get_full_name()} - {self.training.name}"
           
       def calculate_score(self):
           """Calculate the total score based on submitted answers"""
           submissions = self.submissions.all()
           total_points = sum(submission.points for submission in submissions)
           self.score = total_points
           self.save()
           return total_points

   class Submission(models.Model):
       student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submissions')
       exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='submissions')
       question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='submissions')
       student_answer = JSONField()  # Stores student's selected answers
       points = models.PositiveIntegerField(default=0)  # Points earned for this question
       created_at = models.DateTimeField(auto_now_add=True)
       edited_at = models.DateTimeField(auto_now=True)
       
       class Meta:
           unique_together = ['exam', 'question', 'student']
           
       def __str__(self):
           return f"{self.student.get_full_name()} - {self.question.text[:30]}"
           
       def check_answer(self):
           """Verify if the student answer matches the correct answer and assign points"""
           # Logic to check answers and assign points
           # This would depend on question type (multiple choice, single choice, etc.)
           if str(self.student_answer) == str(self.question.correct_answer):
               self.points = self.question.points
           else:
               self.points = 0
           self.save()
           return self.points
   ```

6. **Attendance Models**
   ```python
   # filepath: attendance/models.py
   from django.db import models
   from programs.models import TrainingCourse
   from students.models import Enrollment

   class AttendanceSession(models.Model):
       course = models.ForeignKey(TrainingCourse, on_delete=models.CASCADE, related_name='attendance_sessions')
       session_date = models.DateField()
       title = models.CharField(max_length=255)
       description = models.TextField(blank=True)
       
       created_at = models.DateTimeField(auto_now_add=True)
       updated_at = models.DateTimeField(auto_now=True)
       
       class Meta:
           unique_together = ['course', 'session_date']
           
       def __str__(self):
           return f"{self.title} - {self.session_date}"
           
   class AttendanceRecord(models.Model):
       session = models.ForeignKey(AttendanceSession, on_delete=models.CASCADE, related_name='records')
       enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name='attendance_records')
       STATUS_CHOICES = [
           ('present', 'Present'),
           ('absent', 'Absent'),
           ('late', 'Late'),
           ('excused', 'Excused'),
       ]
       status = models.CharField(max_length=10, choices=STATUS_CHOICES)
       remarks = models.TextField(blank=True)
       
       created_at = models.DateTimeField(auto_now_add=True)
       updated_at = models.DateTimeField(auto_now=True)
       
       class Meta:
           unique_together = ['session', 'enrollment']
           
       def __str__(self):
           return f"{self.enrollment.student.user.get_full_name()} - {self.session.session_date} - {self.get_status_display()}"
   ```

#### JWT Authentication Setup
```python
# Add JWT settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': False,
}
```

### Day 3: API & Routes Planning

1. **Define API Endpoints Structure**
   ```python
   # filepath: api/urls.py
   from django.urls import path, include
   from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

   urlpatterns = [
       # Auth endpoints
       path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
       path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
       
       # Account management
       path('accounts/', include('accounts.urls')),
       
       # Center management
       path('centers/', include('centers.urls')),
       
       # Association management
       path('associations/', include('associations.urls')),
       
       # Program management
       path('programs/', include('programs.urls')),
       
       # Student management
       path('students/', include('students.urls')),
       
       # Exam management
       path('exams/', include('exams.urls')),
       
       # Attendance management
       path('attendance/', include('attendance.urls')),
       
       # Analytics endpoints
       path('analytics/', include('analytics.urls')),
   ]
   ```

2. **Create Frontend Routes Planning**
   ```javascript
   // filepath: entraide-frontend/src/App.js
   import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
   import PrivateRoute from './components/PrivateRoute';
   
   // Layouts
   import MainLayout from './layouts/MainLayout';
   import DashboardLayout from './layouts/DashboardLayout';
   
   // Public pages
   import HomePage from './pages/HomePage';
   import LoginPage from './pages/auth/LoginPage';
   
   // Dashboard pages
   import AdminDashboard from './pages/dashboards/admin/AdminDashboard';
   import CenterDashboard from './pages/dashboards/center/CenterDashboard';
   import AssociationDashboard from './pages/dashboards/association/AssociationDashboard';
   import TrainerDashboard from './pages/dashboards/trainer/TrainerDashboard';
   import StudentDashboard from './pages/dashboards/student/StudentDashboard';
   
   function App() {
     return (
       <Router>
         <Routes>
           {/* Public routes */}
           <Route element={<MainLayout />}>
             <Route path="/" element={<HomePage />} />
             <Route path="/login" element={<LoginPage />} />
           </Route>
           
           {/* Protected dashboard routes */}
           <Route element={<PrivateRoute role="admin"><DashboardLayout /></PrivateRoute>}>
             <Route path="/admin/*" element={<AdminDashboard />} />
           </Route>
           
           <Route element={<PrivateRoute role="center_supervisor"><DashboardLayout /></PrivateRoute>}>
             <Route path="/center/*" element={<CenterDashboard />} />
           </Route>
           
           <Route element={<PrivateRoute role="association_supervisor"><DashboardLayout /></PrivateRoute>}>
             <Route path="/association/*" element={<AssociationDashboard />} />
           </Route>
           
           <Route element={<PrivateRoute role="trainer"><DashboardLayout /></PrivateRoute>}>
             <Route path="/trainer/*" element={<TrainerDashboard />} />
           </Route>
           
           <Route element={<PrivateRoute role="student"><DashboardLayout /></PrivateRoute>}>
             <Route path="/student/*" element={<StudentDashboard />} />
           </Route>
         </Routes>
       </Router>
     );
   }
   
   export default App;
   ```

## Phase 2: Backend Development (Days 4-7)

### Day 4: User Authentication & Authorization

1. **Implement Custom Authentication**
   ```python
   # filepath: accounts/serializers.py
   from rest_framework import serializers
   from django.contrib.auth import get_user_model
   
   User = get_user_model()
   
   class UserSerializer(serializers.ModelSerializer):
       password = serializers.CharField(write_only=True)
       
       class Meta:
           model = User
           fields = ('id', 'username', 'email', 'first_name', 'last_name', 
                     'role', 'phone', 'profile_pic', 'password')
           extra_kwargs = {'password': {'write_only': True}}
           
       def create(self, validated_data):
           password = validated_data.pop('password')
           user = User(**validated_data)
           user.set_password(password)
           user.save()
           return user
   ```

2. **Create Permission Classes**
   ```python
   # filepath: api/permissions.py
   from rest_framework import permissions
   
   class IsAdmin(permissions.BasePermission):
       def has_permission(self, request, view):
           return request.user.is_authenticated and request.user.role == 'admin'
           
   class IsCenterSupervisor(permissions.BasePermission):
       def has_permission(self, request, view):
           return request.user.is_authenticated and request.user.role == 'center_supervisor'
           
   class IsAssociationSupervisor(permissions.BasePermission):
       def has_permission(self, request, view):
           return request.user.is_authenticated and request.user.role == 'association_supervisor'
           
   class IsTrainer(permissions.BasePermission):
       def has_permission(self, request, view):
           return request.user.is_authenticated and request.user.role == 'trainer'
           
   class IsStudent(permissions.BasePermission):
       def has_permission(self, request, view):
           return request.user.is_authenticated and request.user.role == 'student'
   ```

3. **Implement Two-Factor Authentication**
   ```python
   # filepath: accounts/twofa.py
   from django.conf import settings
   import pyotp
   from django.core.mail import send_mail
   
   def generate_totp_code(user):
       """Generate a time-based one-time password for the user"""
       totp = pyotp.TOTP(pyotp.random_base32())
       code = totp.now()
       
       # Store the secret temporarily in the session or a short-lived cache
       # In a real implementation, you'd use Django's cache framework
       user.totp_secret = totp.secret
       user.save()
       
       return code
   
   def verify_totp_code(user, code):
       """Verify a submitted TOTP code against the user's secret"""
       if not hasattr(user, 'totp_secret'):
           return False
           
       totp = pyotp.TOTP(user.totp_secret)
       return totp.verify(code)
   
   def send_verification_email(user, code):
       """Send the verification code to the user's email"""
       send_mail(
           'Your Verification Code',
           f'Your verification code is: {code}',
           settings.DEFAULT_FROM_EMAIL,
           [user.email],
           fail_silently=False,
       )
   ```

### Day 5: Core API Endpoints Implementation

1. **Association API Implementation**
   ```python
   # filepath: associations/views.py
   from rest_framework import viewsets, permissions
   from .models import Association
   from .serializers import AssociationSerializer
   from api.permissions import IsAdmin, IsAssociationSupervisor
   
   class AssociationViewSet(viewsets.ModelViewSet):
       queryset = Association.objects.all()
       serializer_class = AssociationSerializer
       
       def get_permissions(self):
           if self.action in ['create', 'update', 'partial_update', 'destroy']:
               permission_classes = [IsAdmin]
           elif self.action in ['list', 'retrieve']:
               permission_classes = [permissions.IsAuthenticated]
           else:
               permission_classes = [permissions.IsAdminUser]
           return [permission() for permission in permission_classes]
       
       def get_queryset(self):
           user = self.request.user
           if user.role == 'admin':
               return Association.objects.all()
           elif user.role == 'association_supervisor':
               return Association.objects.filter(supervisors=user)
           return Association.objects.none()
   ```

2. **Center API Implementation**
   ```python
   # filepath: centers/views.py
   from rest_framework import viewsets, permissions
   from .models import Center
   from .serializers import CenterSerializer
   from api.permissions import IsAdmin, IsAssociationSupervisor, IsCenterSupervisor
   
   class CenterViewSet(viewsets.ModelViewSet):
       queryset = Center.objects.all()
       serializer_class = CenterSerializer
       
       def get_permissions(self):
           if self.action in ['create', 'destroy']:
               permission_classes = [IsAdmin]
           elif self.action in ['update', 'partial_update']:
               permission_classes = [IsAdmin | IsAssociationSupervisor]
           else:
               permission_classes = [permissions.IsAuthenticated]
           return [permission() for permission in permission_classes]
       
       def get_queryset(self):
           user = self.request.user
           if user.role == 'admin':
               return Center.objects.all()
           elif user.role == 'association_supervisor':
               return Center.objects.filter(association__supervisors=user)
           elif user.role == 'center_supervisor':
               return Center.objects.filter(supervisor=user)
           return Center.objects.none()
   ```

### Day 6: Student, Program, and Enrollment APIs

1. **Student API Implementation**
   ```python
   # filepath: students/views.py
   from rest_framework import viewsets, permissions, status
   from rest_framework.decorators import action
   from rest_framework.response import Response
   from .models import Student, Enrollment
   from .serializers import StudentSerializer, EnrollmentSerializer
   from api.permissions import IsAdmin, IsCenterSupervisor, IsTrainer
   
   class StudentViewSet(viewsets.ModelViewSet):
       queryset = Student.objects.all()
       serializer_class = StudentSerializer
       
       def get_permissions(self):
           if self.action in ['create', 'destroy']:
               permission_classes = [IsAdmin | IsCenterSupervisor]
           elif self.action in ['update', 'partial_update']:
               permission_classes = [IsAdmin | IsCenterSupervisor]
           else:
               permission_classes = [permissions.IsAuthenticated]
           return [permission() for permission in permission_classes]
   
   class EnrollmentViewSet(viewsets.ModelViewSet):
       queryset = Enrollment.objects.all()
       serializer_class = EnrollmentSerializer
       
       @action(detail=False, methods=['get'])
       def my_enrollments(self, request):
           if request.user.role != 'student':
               return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
               
           student = request.user.student
           enrollments = Enrollment.objects.filter(student=student)
           serializer = self.get_serializer(enrollments, many=True)
           return Response(serializer.data)
   ```

2. **Program & Training API Implementation**
   ```python
   # filepath: programs/views.py
   from rest_framework import viewsets
   from .models import TrainingProgram, TrainingCourse
   from .serializers import TrainingProgramSerializer, TrainingCourseSerializer
   from api.permissions import IsAdmin, IsCenterSupervisor, IsAssociationSupervisor
   
   class TrainingProgramViewSet(viewsets.ModelViewSet):
       queryset = TrainingProgram.objects.all()
       serializer_class = TrainingProgramSerializer
       
       def get_permissions(self):
           if self.action in ['create', 'update', 'partial_update', 'destroy']:
               permission_classes = [IsAdmin]
           else:
               permission_classes = [permissions.IsAuthenticated]
           return [permission() for permission in permission_classes]
   
   class TrainingCourseViewSet(viewsets.ModelViewSet):
       queryset = TrainingCourse.objects.all()
       serializer_class = TrainingCourseSerializer
       
       def get_queryset(self):
           user = self.request.user
           if user.role == 'admin':
               return TrainingCourse.objects.all()
           elif user.role == 'association_supervisor':
               return TrainingCourse.objects.filter(center__association__supervisors=user)
           elif user.role == 'center_supervisor':
               return TrainingCourse.objects.filter(center__supervisor=user)
           elif user.role == 'trainer':
               return TrainingCourse.objects.filter(trainer=user)
           return TrainingCourse.objects.none()
   ```

### Day 7: Exam API & Attendance API

1. **Exam Management API**
   ```python
   # filepath: exams/views.py
   from rest_framework import viewsets, permissions, status
   from rest_framework.decorators import action
   from rest_framework.response import Response
   from .models import Exam, ExamResult
   from .serializers import ExamSerializer, ExamResultSerializer
   from api.permissions import IsAdmin, IsTrainer
   
   class ExamViewSet(viewsets.ModelViewSet):
       queryset = Exam.objects.all()
       serializer_class = ExamSerializer
       
       def get_permissions(self):
           if self.action in ['create', 'update', 'partial_update', 'destroy']:
               permission_classes = [IsAdmin | IsTrainer]
           else:
               permission_classes = [permissions.IsAuthenticated]
           return [permission() for permission in permission_classes]
           
       def get_queryset(self):
           user = self.request.user
           if user.role == 'admin':
               return Exam.objects.all()
           elif user.role == 'trainer':
               return Exam.objects.filter(course__trainer=user)
           elif user.role == 'student':
               return Exam.objects.filter(course__enrollments__student__user=user)
           return Exam.objects.none()
   
   class ExamResultViewSet(viewsets.ModelViewSet):
       queryset = ExamResult.objects.all()
       serializer_class = ExamResultSerializer
       
       @action(detail=False, methods=['get'])
       def my_results(self, request):
           if request.user.role != 'student':
               return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
               
           results = ExamResult.objects.filter(enrollment__student__user=request.user)
           serializer = self.get_serializer(results, many=True)
           return Response(serializer.data)
   ```

2. **Attendance Management API**
   ```python
   # filepath: attendance/views.py
   from rest_framework import viewsets, permissions, status
   from rest_framework.decorators import action
   from rest_framework.response import Response
   from .models import AttendanceSession, AttendanceRecord
   from .serializers import AttendanceSessionSerializer, AttendanceRecordSerializer
   from api.permissions import IsAdmin, IsTrainer, IsCenterSupervisor
   
   class AttendanceSessionViewSet(viewsets.ModelViewSet):
       queryset = AttendanceSession.objects.all()
       serializer_class = AttendanceSessionSerializer
       
       def get_permissions(self):
           if self.action in ['create', 'update', 'partial_update', 'destroy']:
               permission_classes = [IsAdmin | IsTrainer | IsCenterSupervisor]
           else:
               permission_classes = [permissions.IsAuthenticated]
           return [permission() for permission in permission_classes]
           
       def get_queryset(self):
           user = self.request.user
           if user.role == 'admin':
               return AttendanceSession.objects.all()
           elif user.role == 'trainer':
               return AttendanceSession.objects.filter(course__trainer=user)
           elif user.role == 'center_supervisor':
               return AttendanceSession.objects.filter(course__center__supervisor=user)
           elif user.role == 'student':
               return AttendanceSession.objects.filter(course__enrollments__student__user=user)
           return AttendanceSession.objects.none()
   
   class AttendanceRecordViewSet(viewsets.ModelViewSet):
       queryset = AttendanceRecord.objects.all()
       serializer_class = AttendanceRecordSerializer
       
       @action(detail=False, methods=['post'])
       def bulk_create(self, request):
           """Create multiple attendance records at once for a session"""
           session_id = request.data.get('session_id')
           records_data = request.data.get('records', [])
           
           if not session_id or not records_data:
               return Response({"detail": "Missing required data"}, status=status.HTTP_400_BAD_REQUEST)
           
           try:
               session = AttendanceSession.objects.get(pk=session_id)
           except AttendanceSession.DoesNotExist:
               return Response({"detail": "Session not found"}, status=status.HTTP_404_NOT_FOUND)
               
           # Check permission
           if request.user.role not in ['admin', 'trainer'] and session.course.trainer != request.user:
               return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
               
           # Process and create records
           created_records = []
           for record_data in records_data:
               record_data['session'] = session.id
               serializer = self.get_serializer(data=record_data)
               if serializer.is_valid():
                   serializer.save()
                   created_records.append(serializer.data)
               else:
                   return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
           
           return Response(created_records, status=status.HTTP_201_CREATED)
       
       @action(detail=False, methods=['get'])
       def my_attendance(self, request):
           """Get attendance records for the requesting student"""
           if request.user.role != 'student':
               return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
               
           records = AttendanceRecord.objects.filter(enrollment__student__user=request.user)
           serializer = self.get_serializer(records, many=True)
           return Response(serializer.data)
   ```

3. **Implement Internationalization**
   ```python
   # filepath: entraide_backend/settings.py
   from django.utils.translation import gettext_lazy as _
   
   MIDDLEWARE = [
       # ... other middleware
       'django.middleware.locale.LocaleMiddleware',
   ]
   
   # Internationalization
   LANGUAGE_CODE = 'en-us'
   
   LANGUAGES = [
       ('en', _('English')),
       ('fr', _('French')),
       ('ar', _('Arabic')),
       ('ber', _('Amazigh')),
   ]
   
   LOCALE_PATHS = [
       BASE_DIR / 'locale',
   ]
   ```

## Phase 3: Frontend Development (Days 8-12)

### Day 8: Frontend Authentication & Core Components

1. **Setup Authentication Context**
   ```javascript
   // filepath: entraide-frontend/src/context/AuthContext.js
   import React, { createContext, useState, useEffect } from 'react';
   import axios from 'axios';
   import { useNavigate } from 'react-router-dom';
   
   export const AuthContext = createContext();
   
   export const AuthProvider = ({ children }) => {
     const [currentUser, setCurrentUser] = useState(null);
     const [loading, setLoading] = useState(true);
     const [twoFactorPending, setTwoFactorPending] = useState(false);
     const [tempToken, setTempToken] = useState(null);
     const navigate = useNavigate();
     
     useEffect(() => {
       const token = localStorage.getItem('token');
       if (token) {
         fetchUserData(token);
       } else {
         setLoading(false);
       }
     }, []);
     
     const fetchUserData = async (token) => {
       try {
         // Set default authorization header
         axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
         
         const response = await axios.get('/api/accounts/profile/');
         setCurrentUser(response.data);
         setLoading(false);
       } catch (error) {
         logout();
       }
     };
     
     const login = async (credentials) => {
       try {
         const response = await axios.post('/api/auth/token/', credentials);
         
         if (response.data.requires_2fa) {
           // Handle 2FA flow
           setTwoFactorPending(true);
           setTempToken(response.data.temp_token);
           return { success: true, requires2FA: true };
         }
         
         const { access, refresh } = response.data;
         
         localStorage.setItem('token', access);
         localStorage.setItem('refreshToken', refresh);
         
         axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
         
         await fetchUserData(access);
         
         // Redirect based on role
         redirectBasedOnRole();
         
         return { success: true };
       } catch (error) {
         return { 
           success: false, 
           message: error.response?.data?.detail || 'Login failed' 
         };
       }
     };
     
     const verifyTwoFactorCode = async (code) => {
       try {
         const response = await axios.post('/api/auth/verify-2fa/', {
           token: tempToken,
           code: code
         });
         
         const { access, refresh } = response.data;
         
         localStorage.setItem('token', access);
         localStorage.setItem('refreshToken', refresh);
         
         axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
         
         await fetchUserData(access);
         
         setTwoFactorPending(false);
         setTempToken(null);
         
         // Redirect based on role
         redirectBasedOnRole();
         
         return { success: true };
       } catch (error) {
         return {
           success: false,
           message: error.response?.data?.detail || 'Invalid verification code'
         };
       }
     };
     
     const logout = () => {
       localStorage.removeItem('token');
       localStorage.removeItem('refreshToken');
       setCurrentUser(null);
       delete axios.defaults.headers.common['Authorization'];
       navigate('/login');
     };
     
     const redirectBasedOnRole = () => {
       if (!currentUser) return;
       
       switch(currentUser.role) {
         case 'admin':
           navigate('/admin/dashboard');
           break;
         case 'center_supervisor':
           navigate('/center/dashboard');
           break;
         case 'association_supervisor':
           navigate('/association/dashboard');
           break;
         case 'trainer':
           navigate('/trainer/dashboard');
           break;
         case 'student':
           navigate('/student/dashboard');
           break;
         default:
           navigate('/');
       }
     };
     
     return (
       <AuthContext.Provider value={{ 
         currentUser, 
         loading, 
         login, 
         logout,
         twoFactorPending,
         verifyTwoFactorCode,
         isAuthenticated: !!currentUser,
       }}>
         {children}
       </AuthContext.Provider>
     );
   };
   ```

2. **Create Login Page**
   ```javascript
   // filepath: entraide-frontend/src/pages/auth/LoginPage.js
   import React, { useState, useContext } from 'react';
   import { AuthContext } from '../../context/AuthContext';
   import { Button } from '../../components/ui/button';
   import { Input } from '../../components/ui/input';
   import { useTranslation } from 'react-i18next';
   
   const LoginPage = () => {
     const { t } = useTranslation();
     const { login, twoFactorPending, verifyTwoFactorCode } = useContext(AuthContext);
     const [credentials, setCredentials] = useState({ username: '', password: '' });
     const [verificationCode, setVerificationCode] = useState('');
     const [error, setError] = useState('');
     const [loading, setLoading] = useState(false);
     
     const handleChange = (e) => {
       setCredentials({
         ...credentials,
         [e.target.name]: e.target.value
       });
     };
     
     const handleSubmit = async (e) => {
       e.preventDefault();
       setLoading(true);
       setError('');
       
       const result = await login(credentials);
       
       if (!result.success && !result.requires2FA) {
         setError(result.message);
       }
       
       setLoading(false);
     };
     
     const handleTwoFactorSubmit = async (e) => {
       e.preventDefault();
       setLoading(true);
       setError('');
       
       const result = await verifyTwoFactorCode(verificationCode);
       
       if (!result.success) {
         setError(result.message);
       }
       
       setLoading(false);
     };
     
     if (twoFactorPending) {
       return (
         <div className="flex items-center justify-center min-h-screen bg-gray-100">
           <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
             <div className="text-center">
               <h1 className="text-2xl font-bold">{t('login.verificationTitle')}</h1>
               <p className="text-gray-600">{t('login.verificationSubtitle')}</p>
             </div>
             
             {error && (
               <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
                 {error}
               </div>
             )}
             
             <form onSubmit={handleTwoFactorSubmit} className="space-y-6">
               <div>
                 <label className="block text-sm font-medium text-gray-700">
                   {t('login.verificationCode')}
                 </label>
                 <Input
                   name="code"
                   value={verificationCode}
                   onChange={(e) => setVerificationCode(e.target.value)}
                   required
                 />
               </div>
               
               <Button
                 type="submit"
                 className="w-full"
                 disabled={loading}
               >
                 {loading ? t('login.verifying') : t('login.verifyButton')}
               </Button>
             </form>
           </div>
         </div>
       );
     }
     
     return (
       <div className="flex items-center justify-center min-h-screen bg-gray-100">
         <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
           <div className="text-center">
             <h1 className="text-2xl font-bold">{t('login.title')}</h1>
             <p className="text-gray-600">{t('login.subtitle')}</p>
           </div>
           
           {error && (
             <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
               {error}
             </div>
           )}
           
           <form onSubmit={handleSubmit} className="space-y-6">
             <div>
               <label className="block text-sm font-medium text-gray-700">
                 {t('login.username')}
               </label>
               <Input
                 name="username"
                 value={credentials.username}
                 onChange={handleChange}
                 required
               />
             </div>
             
             <div>
               <label className="block text-sm font-medium text-gray-700">
                 {t('login.password')}
               </label>
               <Input
                 type="password"
                 name="password"
                 value={credentials.password}
                 onChange={handleChange}
                 required
               />
             </div>
             
             <Button
               type="submit"
               className="w-full"
               disabled={loading}
             >
               {loading ? t('login.loggingIn') : t('login.loginButton')}
             </Button>
           </form>
         </div>
       </div>
     );
   };
   
   export default LoginPage;
   ```

### Day 9: Dashboard Layouts & Navigation

1. **Create Dashboard Layout**
   ```javascript
   // filepath: entraide-frontend/src/layouts/DashboardLayout.js
   import React, { useContext } from 'react';
   import { Outlet } from 'react-router-dom';
   import { AuthContext } from '../context/AuthContext';
   import Sidebar from '../components/navigation/Sidebar';
   import Header from '../components/navigation/Header';
   
   const DashboardLayout = () => {
     const { currentUser } = useContext(AuthContext);
     
     if (!currentUser) {
       return <div>Loading...</div>;
     }
     
     return (
       <div className="flex h-screen bg-gray-100">
         <Sidebar userRole={currentUser.role} />
         
         <div className="flex flex-col flex-1 overflow-hidden">
           <Header />
           
           <main className="flex-1 overflow-y-auto p-5">
             <Outlet />
           </main>
         </div>
       </div>
     );
   };
   
   export default DashboardLayout;
   ```

2. **Create Role-Based Sidebar Navigation**
   ```javascript
   // filepath: entraide-frontend/src/components/navigation/Sidebar.js
   import React from 'react';
   import { NavLink } from 'react-router-dom';
   import { useTranslation } from 'react-i18next';
   
   const Sidebar = ({ userRole }) => {
     const { t } = useTranslation();
     
     // Define navigation items based on role
     const getNavItems = () => {
       switch (userRole) {
         case 'admin':
           return [
             { to: '/admin/dashboard', label: t('nav.dashboard') },
             { to: '/admin/associations', label: t('nav.associations') },
             { to: '/admin/centers', label: t('nav.centers') },
             { to: '/admin/programs', label: t('nav.programs') },
             { to: '/admin/users', label: t('nav.users') },
             { to: '/admin/reports', label: t('nav.reports') },
             { to: '/admin/analytics', label: t('nav.analytics') },
           ];
         case 'center_supervisor':
           return [
             { to: '/center/dashboard', label: t('nav.dashboard') },
             { to: '/center/students', label: t('nav.students') },
             { to: '/center/trainers', label: t('nav.trainers') },
             { to: '/center/courses', label: t('nav.courses') },
             { to: '/center/attendance', label: t('nav.attendance') },
             { to: '/center/analytics', label: t('nav.analytics') },
           ];
         case 'association_supervisor':
           return [
             { to: '/association/dashboard', label: t('nav.dashboard') },
             { to: '/association/centers', label: t('nav.centers') },
             { to: '/association/reports', label: t('nav.reports') },
             { to: '/association/analytics', label: t('nav.analytics') },
           ];
         case 'trainer':
           return [
             { to: '/trainer/dashboard', label: t('nav.dashboard') },
             { to: '/trainer/courses', label: t('nav.myCourses') },
             { to: '/trainer/students', label: t('nav.myStudents') },
             { to: '/trainer/exams', label: t('nav.exams') },
             { to: '/trainer/attendance', label: t('nav.attendance') },
             { to: '/trainer/resources', label: t('nav.resources') },
           ];
         case 'student':
           return [
             { to: '/student/dashboard', label: t('nav.dashboard') },
             { to: '/student/courses', label: t('nav.myCourses') },
             { to: '/student/exams', label: t('nav.myExams') },
             { to: '/student/results', label: t('nav.results') },
             { to: '/student/attendance', label: t('nav.attendance') },
             { to: '/student/resources', label: t('nav.resources') },
           ];
         default:
           return [];
       }
     };
     
     const navItems = getNavItems();
     
     return (
       <div className="w-64 bg-gray-800 h-full flex flex-col">
         <div className="p-4 text-white">
           <h1 className="text-2xl font-bold">Entraide National</h1>
         </div>
         
         <nav className="mt-8">
           <ul className="space-y-2">
             {navItems.map((item, index) => (
               <li key={index}>
                 <NavLink
                   to={item.to}
                   className={({ isActive }) =>
                     `flex items-center px-4 py-2 ${
                       isActive
                         ? 'bg-gray-900 text-white'
                         : 'text-gray-300 hover:bg-gray-700'
                     }`
                   }
                 >
                   {item.label}
                 </NavLink>
               </li>
             ))}
           </ul>
         </nav>
       </div>
     );
   };
   
   export default Sidebar;
   ```

### Day 10-11: Role-Based Dashboard Components

1. **Admin Dashboard Implementation with Analytics**
   ```javascript
   // filepath: entraide-frontend/src/pages/dashboards/admin/AdminDashboard.js
   import React, { useState, useEffect } from 'react';
   import { Routes, Route } from 'react-router-dom';
   import { useTranslation } from 'react-i18next';
   import axios from 'axios';
   
   import DashboardOverview from './DashboardOverview';
   import AssociationsList from './AssociationsList';
   import CentersList from './CentersList';
   import ProgramsList from './ProgramsList';
   import UsersList from './UsersList';
   import ReportsDashboard from './ReportsDashboard';
   import AnalyticsDashboard from './AnalyticsDashboard';
   
   const AdminDashboard = () => {
     const { t } = useTranslation();
     const [stats, setStats] = useState({
       associations: 0,
       centers: 0,
       programs: 0,
       students: 0,
       trainers: 0
     });
     
     useEffect(() => {
       const fetchStats = async () => {
         try {
           const response = await axios.get('/api/admin/stats/');
           setStats(response.data);
         } catch (error) {
           console.error('Error fetching stats:', error);
         }
       };
       
       fetchStats();
     }, []);
     
     return (
       <Routes>
         <Route path="/" element={<DashboardOverview stats={stats} />} />
         <Route path="dashboard" element={<DashboardOverview stats={stats} />} />
         <Route path="associations/*" element={<AssociationsList />} />
         <Route path="centers/*" element={<CentersList />} />
         <Route path="programs/*" element={<ProgramsList />} />
         <Route path="users/*" element={<UsersList />} />
         <Route path="reports/*" element={<ReportsDashboard />} />
         <Route path="analytics/*" element={<AnalyticsDashboard />} />
       </Routes>
     );
   };
   
   export default AdminDashboard;
   ```

2. **Analytics Dashboard Component**
   ```javascript
   // filepath: entraide-frontend/src/pages/dashboards/admin/AnalyticsDashboard.js
   import React, { useState, useEffect } from 'react';
   import { useTranslation } from 'react-i18next';
   import axios from 'axios';
   import { 
     LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, 
     CartesianGrid, Tooltip, Legend, ResponsiveContainer 
   } from 'recharts';
   
   const AnalyticsDashboard = () => {
     const { t } = useTranslation();
     const [enrollmentData, setEnrollmentData] = useState([]);
     const [completionRates, setCompletionRates] = useState([]);
     const [attendanceData, setAttendanceData] = useState([]);
     const [loading, setLoading] = useState(true);
     
     useEffect(() => {
       const fetchAnalyticsData = async () => {
         try {
           // Fetch enrollment trends
           const enrollmentResponse = await axios.get('/api/analytics/enrollment-trends/');
           setEnrollmentData(enrollmentResponse.data);
           
           // Fetch program completion rates
           const completionResponse = await axios.get('/api/analytics/completion-rates/');
           setCompletionRates(completionResponse.data);
           
           // Fetch attendance statistics
           const attendanceResponse = await axios.get('/api/analytics/attendance-stats/');
           setAttendanceData(attendanceResponse.data);
           
         } catch (error) {
           console.error('Error fetching analytics data:', error);
         } finally {
           setLoading(false);
         }
       };
       
       fetchAnalyticsData();
     }, []);
     
     if (loading) {
       return <div>Loading analytics data...</div>;
     }
     
     return (
       <div className="space-y-8">
         <div>
           <h1 className="text-2xl font-bold mb-4">{t('analytics.title')}</h1>
           <p className="text-gray-600">{t('analytics.description')}</p>
         </div>
         
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {/* Enrollment Trends */}
           <div className="bg-white p-4 rounded-lg shadow">
             <h2 className="text-lg font-semibold mb-4">{t('analytics.enrollmentTrends')}</h2>
             <ResponsiveContainer width="100%" height={300}>
               <LineChart data={enrollmentData}>
                 <CartesianGrid strokeDasharray="3 3" />
                 <XAxis dataKey="month" />
                 <YAxis />
                 <Tooltip />
                 <Legend />
                 <Line type="monotone" dataKey="enrollments" stroke="#8884d8" />
               </LineChart>
             </ResponsiveContainer>
           </div>
           
           {/* Program Completion Rates */}
           <div className="bg-white p-4 rounded-lg shadow">
             <h2 className="text-lg font-semibold mb-4">{t('analytics.completionRates')}</h2>
             <ResponsiveContainer width="100%" height={300}>
               <BarChart data={completionRates}>
                 <CartesianGrid strokeDasharray="3 3" />
                 <XAxis dataKey="program" />
                 <YAxis />
                 <Tooltip />
                 <Legend />
                 <Bar dataKey="completionRate" fill="#82ca9d" />
               </BarChart>
             </ResponsiveContainer>
           </div>
           
           {/* Attendance Statistics */}
           <div className="bg-white p-4 rounded-lg shadow">
             <h2 className="text-lg font-semibold mb-4">{t('analytics.attendanceStats')}</h2>
             <ResponsiveContainer width="100%" height={300}>
               <PieChart>
                 <Pie 
                   data={attendanceData} 
                   dataKey="value" 
                   nameKey="status" 
                   cx="50%" 
                   cy="50%" 
                   outerRadius={100} 
                   fill="#8884d8"
                   label
                 />
                 <Tooltip />
                 <Legend />
               </PieChart>
             </ResponsiveContainer>
           </div>
         </div>
       </div>
     );
   };
   
   export default AnalyticsDashboard;
   ```

3. **Attendance Management Component for Trainers**
   ```javascript
   // filepath: entraide-frontend/src/pages/dashboards/trainer/AttendanceManagement.js
   import React, { useState, useEffect } from 'react';
   import { useTranslation } from 'react-i18next';
   import axios from 'axios';
   import { Button } from '../../../components/ui/button';
   import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/table';
   import { Select } from '../../../components/ui/select';
   import { Input } from '../../../components/ui/input';
   import { Checkbox } from '../../../components/ui/checkbox';
   import { toast } from '../../../components/ui/use-toast';
   
   const AttendanceManagement = () => {
     const { t } = useTranslation();
     const [courses, setCourses] = useState([]);
     const [selectedCourse, setSelectedCourse] = useState(null);
     const [students, setStudents] = useState([]);
     const [attendanceRecords, setAttendanceRecords] = useState([]);
     const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
     const [sessionTitle, setSessionTitle] = useState('');
     const [loading, setLoading] = useState(true);
     const [submitting, setSubmitting] = useState(false);
     
     useEffect(() => {
       const fetchCourses = async () => {
         try {
           const response = await axios.get('/api/programs/courses/my-courses/');
           setCourses(response.data);
           setLoading(false);
         } catch (error) {
           console.error('Error fetching courses:', error);
           setLoading(false);
         }
       };
       
       fetchCourses();
     }, []);
     
     const handleCourseChange = async (courseId) => {
       if (!courseId) {
         setSelectedCourse(null);
         setStudents([]);
         return;
       }
       
       const course = courses.find(c => c.id === parseInt(courseId));
       setSelectedCourse(course);
       
       try {
         const response = await axios.get(`/api/programs/courses/${courseId}/students/`);
         setStudents(response.data);
         
         // Initialize attendance records for all students
         const initialRecords = response.data.map(student => ({
           student_id: student.id,
           student_name: `${student.user.first_name} ${student.user.last_name}`,
           enrollment_id: student.enrollment_id,
           status: 'present',
           remarks: ''
         }));
         
         setAttendanceRecords(initialRecords);
       } catch (error) {
         console.error('Error fetching students:', error);
       }
     };
     
     const handleStatusChange = (enrollmentId, status) => {
       setAttendanceRecords(prevRecords => 
         prevRecords.map(record => 
           record.enrollment_id === enrollmentId 
             ? { ...record, status } 
             : record
         )
       );
     };
     
     const handleRemarksChange = (enrollmentId, remarks) => {
       setAttendanceRecords(prevRecords => 
         prevRecords.map(record => 
           record.enrollment_id === enrollmentId 
             ? { ...record, remarks } 
             : record
         )
       );
     };
     
     const handleSubmit = async () => {
       if (!selectedCourse || !sessionDate || !sessionTitle) {
         toast({
           title: t('attendance.missingDataTitle'),
           description: t('attendance.missingDataDescription'),
           variant: "destructive",
         });
         return;
       }
       
       setSubmitting(true);
       
       try {
         // First create the session
         const sessionResponse = await axios.post('/api/attendance/sessions/', {
           course: selectedCourse.id,
           session_date: sessionDate,
           title: sessionTitle,
           description: `Attendance for ${sessionTitle}`
         });
         
         const sessionId = sessionResponse.data.id;
         
         // Then create attendance records
         const recordsPayload = {
           session_id: sessionId,
           records: attendanceRecords.map(record => ({
             enrollment: record.enrollment_id,
             status: record.status,
             remarks: record.remarks
           }))
         };
         
         await axios.post('/api/attendance/records/bulk_create/', recordsPayload);
         
         toast({
           title: t('attendance.successTitle'),
           description: t('attendance.successDescription'),
         });
         
         // Reset form
         setSessionTitle('');
         setSessionDate(new Date().toISOString().split('T')[0]);
       } catch (error) {
         console.error('Error saving attendance:', error);
         toast({
           title: t('attendance.errorTitle'),
           description: error.response?.data?.detail || t('attendance.errorDescription'),
           variant: "destructive",
         });
       } finally {
         setSubmitting(false);
       }
     };
     
     if (loading) {
       return <div>Loading courses...</div>;
     }
     
     return (
       <div className="space-y-6">
         <div>
           <h1 className="text-2xl font-bold">{t('attendance.title')}</h1>
           <p className="text-gray-600">{t('attendance.subtitle')}</p>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
             <label className="block text-sm font-medium text-gray-700">
               {t('attendance.selectCourse')}
             </label>
             <Select 
               onChange={(e) => handleCourseChange(e.target.value)}
               className="w-full"
             >
               <option value="">{t('attendance.chooseCourse')}</option>
               {courses.map(course => (
                 <option key={course.id} value={course.id}>
                   {course.program.name} - {new Date(course.start_date).toLocaleDateString()}
                 </option>
               ))}
             </Select>
           </div>
           
           <div>
             <label className="block text-sm font-medium text-gray-700">
               {t('attendance.sessionDate')}
             </label>
             <Input
               type="date"
               value={sessionDate}
               onChange={(e) => setSessionDate(e.target.value)}
               className="w-full"
             />
           </div>
           
           <div className="md:col-span-2">
             <label className="block text-sm font-medium text-gray-700">
               {t('attendance.sessionTitle')}
             </label>
             <Input
               value={sessionTitle}
               onChange={(e) => setSessionTitle(e.target.value)}
               placeholder={t('attendance.sessionTitlePlaceholder')}
               className="w-full"
             />
           </div>
         </div>
         
         {selectedCourse && students.length > 0 ? (
           <div>
             <h2 className="text-lg font-semibold mb-2">{t('attendance.studentsList')}</h2>
             
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>{t('attendance.studentName')}</TableHead>
                   <TableHead>{t('attendance.present')}</TableHead>
                   <TableHead>{t('attendance.absent')}</TableHead>
                   <TableHead>{t('attendance.late')}</TableHead>
                   <TableHead>{t('attendance.excused')}</TableHead>
                   <TableHead>{t('attendance.remarks')}</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {attendanceRecords.map((record) => (
                   <TableRow key={record.enrollment_id}>
                     <TableCell>{record.student_name}</TableCell>
                     <TableCell>
                       <Checkbox
                         checked={record.status === 'present'}
                         onCheckedChange={() => handleStatusChange(record.enrollment_id, 'present')}
                       />
                     </TableCell>
                     <TableCell>
                       <Checkbox
                         checked={record.status === 'absent'}
                         onCheckedChange={() => handleStatusChange(record.enrollment_id, 'absent')}
                       />
                     </TableCell>
                     <TableCell>
                       <Checkbox
                         checked={record.status === 'late'}
                         onCheckedChange={() => handleStatusChange(record.enrollment_id, 'late')}
                       />
                     </TableCell>
                     <TableCell>
                       <Checkbox
                         checked={record.status === 'excused'}
                         onCheckedChange={() => handleStatusChange(record.enrollment_id, 'excused')}
                       />
                     </TableCell>
                     <TableCell>
                       <Input
                         value={record.remarks}
                         onChange={(e) => handleRemarksChange(record.enrollment_id, e.target.value)}
                         placeholder={t('attendance.remarksPlaceholder')}
                       />
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
             
             <div className="mt-4">
               <Button 
                 onClick={handleSubmit}
                 disabled={submitting}
               >
                 {submitting ? t('attendance.saving') : t('attendance.saveAttendance')}
               </Button>
             </div>
           </div>
         ) : (
           selectedCourse && (
             <div className="text-center p-8 bg-gray-50 rounded-lg">
               <p>{t('attendance.noStudentsEnrolled')}</p>
             </div>
           )
         )}
       </div>
     );
   };
   
   export default AttendanceManagement;
   ```

4. **Student Attendance View Component**
   ```javascript
   // filepath: entraide-frontend/src/pages/dashboards/student/MyAttendance.js
   import React, { useState, useEffect } from 'react';
   import { useTranslation } from 'react-i18next';
   import axios from 'axios';
   import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/table';
   import { Select } from '../../../components/ui/select';
   import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
   
   const MyAttendance = () => {
     const { t } = useTranslation();
     const [courses, setCourses] = useState([]);
     const [selectedCourse, setSelectedCourse] = useState(null);
     const [attendanceRecords, setAttendanceRecords] = useState([]);
     const [attendanceStats, setAttendanceStats] = useState([]);
     const [loading, setLoading] = useState(true);
     
     useEffect(() => {
       const fetchCourses = async () => {
         try {
           const response = await axios.get('/api/students/enrollments/my-enrollments/');
           setCourses(response.data);
           setLoading(false);
         } catch (error) {
           console.error('Error fetching courses:', error);
           setLoading(false);
         }
       };
       
       fetchCourses();
     }, []);
     
     const fetchAttendanceForCourse = async (enrollmentId) => {
       try {
         const response = await axios.get(`/api/attendance/records/by-enrollment/${enrollmentId}/`);
         setAttendanceRecords(response.data);
         
         // Calculate statistics
         const stats = {
           present: 0,
           absent: 0,
           late: 0,
           excused: 0,
           total: response.data.length
         };
         
         response.data.forEach(record => {
           stats[record.status]++;
         });
         
         const statArray = [
           { name: t('attendance.present'), value: stats.present, color: '#4ade80' },
           { name: t('attendance.absent'), value: stats.absent, color: '#f87171' },
           { name: t('attendance.late'), value: stats.late, color: '#facc15' },
           { name: t('attendance.excused'), value: stats.excused, color: '#60a5fa' }
         ];
         
         setAttendanceStats(statArray);
       } catch (error) {
         console.error('Error fetching attendance records:', error);
       }
     };
     
     const handleCourseChange = (enrollmentId) => {
       if (!enrollmentId) {
         setSelectedCourse(null);
         setAttendanceRecords([]);
         return;
       }
       
       const course = courses.find(c => c.id === parseInt(enrollmentId));
       setSelectedCourse(course);
       fetchAttendanceForCourse(enrollmentId);
     };
     
     const formatDate = (dateString) => {
       const options = { year: 'numeric', month: 'long', day: 'numeric' };
       return new Date(dateString).toLocaleDateString(undefined, options);
     };
     
     if (loading) {
       return <div>Loading courses...</div>;
     }
     
     return (
       <div className="space-y-6">
         <div>
           <h1 className="text-2xl font-bold">{t('attendance.myAttendance')}</h1>
           <p className="text-gray-600">{t('attendance.myAttendanceDescription')}</p>
         </div>
         
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">
             {t('attendance.selectCourse')}
           </label>
           <Select 
             onChange={(e) => handleCourseChange(e.target.value)}
             className="w-full max-w-xs"
           >
             <option value="">{t('attendance.chooseCourse')}</option>
             {courses.map(course => (
               <option key={course.id} value={course.id}>
                 {course.course.program.name}
               </option>
             ))}
           </Select>
         </div>
         
         {selectedCourse && attendanceRecords.length > 0 ? (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="lg:col-span-2">
               <h2 className="text-lg font-semibold mb-2">{t('attendance.records')}</h2>
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>{t('attendance.date')}</TableHead>
                     <TableHead>{t('attendance.session')}</TableHead>
                     <TableHead>{t('attendance.status')}</TableHead>
                     <TableHead>{t('attendance.remarks')}</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {attendanceRecords.map((record) => (
                     <TableRow key={record.id}>
                       <TableCell>{formatDate(record.session.session_date)}</TableCell>
                       <TableCell>{record.session.title}</TableCell>
                       <TableCell>
                         <span className={
                           record.status === 'present' ? 'text-green-600' :
                           record.status === 'absent' ? 'text-red-600' :
                           record.status === 'late' ? 'text-yellow-600' : 'text-blue-600'
                         }>
                           {t(`attendance.${record.status}`)}
                         </span>
                       </TableCell>
                       <TableCell>{record.remarks || '-'}</TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </div>
             
             <div>
               <h2 className="text-lg font-semibold mb-2">{t('attendance.summary')}</h2>
               <div className="bg-white p-4 rounded-lg shadow">
                 <ResponsiveContainer width="100%" height={200}>
                   <PieChart>
                     <Pie
                       data={attendanceStats}
                       cx="50%"
                       cy="50%"
                       labelLine={false}
                       outerRadius={80}
                       fill="#8884d8"
                       dataKey="value"
                       label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                     >
                       {attendanceStats.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                     </Pie>
                     <Tooltip />
                     <Legend />
                   </PieChart>
                 </ResponsiveContainer>
                 
                 <div className="mt-4">
                   <p className="text-sm">
                     <strong>{t('attendance.attendanceRate')}:</strong> {
                       attendanceStats.length ? 
                       `${((attendanceStats[0].value / (attendanceStats[0].value + attendanceStats[1].value + attendanceStats[2].value)) * 100).toFixed(1)}%` 
                       : '0%'
                     }
                   </p>
                 </div>
               </div>
             </div>
           </div>
         ) : (
           selectedCourse && (
             <div className="text-center p-8 bg-gray-50 rounded-lg">
               <p>{t('attendance.noAttendanceRecords')}</p>
             </div>
           )
         )}
       </div>
     );
   };
   
   export default MyAttendance;
   ```

### Day 12: Internationalization & Digital Resource Library

1. **Setup i18n**
   ```javascript
   // filepath: entraide-frontend/src/i18n.js
   import i18n from 'i18next';
   import { initReactI18next } from 'react-i18next';
   import Backend from 'i18next-http-backend';
   import LanguageDetector from 'i18next-browser-languagedetector';
   
   i18n
     .use(Backend)
     .use(LanguageDetector)
     .use(initReactI18next)
     .init({
       fallbackLng: 'en',
       debug: process.env.NODE_ENV === 'development',
       
       interpolation: {
         escapeValue: false,
       },
       
       react: {
         useSuspense: false,
       },
     });
     
   export default i18n;
   ```

2. **Create Translation Files**
   ```javascript
   // filepath: entraide-frontend/public/locales/en/translation.json
   {
     "common": {
       "search": "Search",
       "view": "View",
       "edit": "Edit",
       "delete": "Delete",
       "save": "Save",
       "cancel": "Cancel",
       "actions": "Actions",
       "loading": "Loading...",
       "noResults": "No results found",
       "error": "An error occurred"
     },
     "nav": {
       "dashboard": "Dashboard",
       "associations": "Associations",
       "centers": "Centers",
       "programs": "Programs",
       "users": "Users",
       "reports": "Reports",
       "students": "Students",
       "trainers": "Trainers",
       "courses": "Courses",
       "myCourses": "My Courses",
       "exams": "Exams",
       "myExams": "My Exams",
       "results": "Results",
       "myStudents": "My Students",
       "analytics": "Analytics",
       "resources": "Learning Resources",
       "attendance": "Attendance"
     },
     "login": {
       "title": "Welcome Back",
       "subtitle": "Sign in to your account",
       "username": "Username",
       "password": "Password",
       "loginButton": "Sign In",
       "loggingIn": "Signing In...",
       "forgotPassword": "Forgot Password?",
       "verificationTitle": "Two-Factor Authentication",
       "verificationSubtitle": "Enter the verification code sent to your email",
       "verificationCode": "Verification Code",
       "verifying": "Verifying...",
       "verifyButton": "Verify"
     },
     "associations": {
       "title": "Associations",
       "addNew": "Add Association",
       "name": "Name",
       "president": "President",
       "contractDates": "Contract Dates"
     },
     "attendance": {
       "title": "Manage Attendance",
       "subtitle": "Track student attendance for your courses",
       "myAttendance": "My Attendance",
       "myAttendanceDescription": "View your attendance records across all courses",
       "selectCourse": "Select Course",
       "chooseCourse": "-- Choose a course --",
       "sessionDate": "Session Date",
       "sessionTitle": "Session Title",
       "sessionTitlePlaceholder": "Enter a title for this session",
       "studentsList": "Students",
       "studentName": "Student Name",
       "present": "Present",
       "absent": "Absent",
       "late": "Late",
       "excused": "Excused",
       "remarks": "Remarks",
       "remarksPlaceholder": "Optional remarks",
       "saveAttendance": "Save Attendance",
       "saving": "Saving...",
       "noStudentsEnrolled": "No students are enrolled in this course",
       "missingDataTitle": "Missing Information",
       "missingDataDescription": "Please select a course, date, and title before saving attendance",
       "successTitle": "Success!",
       "successDescription": "Attendance has been recorded successfully",
       "errorTitle": "Error",
       "errorDescription": "Failed to save attendance records",
       "records": "Attendance Records",
       "summary": "Attendance Summary",
       "date": "Date",
       "session": "Session",
       "status": "Status",
       "attendanceRate": "Attendance Rate",
       "noAttendanceRecords": "No attendance records found for this course"
     },
     "analytics": {
       "title": "Analytics Dashboard",
       "description": "Review performance metrics and insights",
       "enrollmentTrends": "Enrollment Trends",
       "completionRates": "Program Completion Rates",
       "attendanceStats": "Attendance Statistics",
       "studentPerformance": "Student Performance",
       "centerPerformance": "Center Performance"
     },
     "resources": {
       "title": "Learning Resources",
       "description": "Access educational materials and resources",
       "uploadResource": "Upload Resource",
       "browseResources": "Browse Resources",
       "myResources": "My Resources",
       "resourceName": "Resource Name",
       "resourceType": "Type",
       "uploadDate": "Upload Date",
       "uploadedBy": "Uploaded By",
       "actions": "Actions",
       "downloadResource": "Download",
       "viewResource": "View",
       "deleteResource": "Delete",
       "confirmDelete": "Are you sure you want to delete this resource?",
       "documentType": "Document",
       "videoType": "Video",
       "imageType": "Image",
       "otherType": "Other",
       "noResources": "No resources available"
     }
   }
   ```

3. **Implement Digital Resource Library**
   ```javascript
   // filepath: entraide-frontend/src/pages/dashboards/common/ResourceLibrary.js
   import React, { useState, useEffect, useContext } from 'react';
   import { useTranslation } from 'react-i18next';
   import axios from 'axios';
   import { Button } from '../../../components/ui/button';
   import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/table';
   import { Input } from '../../../components/ui/input';
   import { Select } from '../../../components/ui/select';
   import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../components/ui/dialog';
   import { toast } from '../../../components/ui/use-toast';
   import { AuthContext } from '../../../context/AuthContext';
   
   const ResourceLibrary = () => {
     const { t } = useTranslation();
     const { currentUser } = useContext(AuthContext);
     const [resources, setResources] = useState([]);
     const [filteredResources, setFilteredResources] = useState([]);
     const [searchTerm, setSearchTerm] = useState('');
     const [resourceType, setResourceType] = useState('');
     const [loading, setLoading] = useState(true);
     
     // Upload state
     const [isUploading, setIsUploading] = useState(false);
     const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
     const [newResource, setNewResource] = useState({
       name: '',
       description: '',
       resource_type: 'document',
       file: null
     });
     
     useEffect(() => {
       fetchResources();
     }, []);
     
     useEffect(() => {
       filterResources();
     }, [searchTerm, resourceType, resources]);
     
     const fetchResources = async () => {
       try {
         // The endpoint would be different based on user role
         const endpoint = currentUser.role === 'student' 
           ? '/api/resources/available/' 
           : '/api/resources/';
           
         const response = await axios.get(endpoint);
         setResources(response.data);
       } catch (error) {
         console.error('Error fetching resources:', error);
         toast({
           title: t('common.error'),
           description: t('resources.fetchError'),
           variant: 'destructive',
         });
       } finally {
         setLoading(false);
       }
     };
     
     const filterResources = () => {
       let filtered = [...resources];
       
       if (searchTerm) {
         filtered = filtered.filter(resource => 
           resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           resource.description.toLowerCase().includes(searchTerm.toLowerCase())
         );
       }
       
       if (resourceType) {
         filtered = filtered.filter(resource => resource.resource_type === resourceType);
       }
       
       setFilteredResources(filtered);
     };
     
     const handleInputChange = (e) => {
       const { name, value } = e.target;
       setNewResource(prev => ({ ...prev, [name]: value }));
     };
     
     const handleFileChange = (e) => {
       setNewResource(prev => ({ ...prev, file: e.target.files[0] }));
     };
     
     const handleUpload = async () => {
       if (!newResource.name || !newResource.file) {
         toast({
           title: t('common.error'),
           description: t('resources.missingFields'),
           variant: 'destructive',
         });
         return;
       }
       
       setIsUploading(true);
       
       try {
         const formData = new FormData();
         formData.append('name', newResource.name);
         formData.append('description', newResource.description);
         formData.append('resource_type', newResource.resource_type);
         formData.append('file', newResource.file);
         
         await axios.post('/api/resources/', formData, {
           headers: {
             'Content-Type': 'multipart/form-data',
           },
         });
         
         toast({
           title: t('resources.uploadSuccess'),
           description: t('resources.uploadSuccessDetail'),
         });
         
         setUploadDialogOpen(false);
         setNewResource({
           name: '',
           description: '',
           resource_type: 'document',
           file: null
         });
         
         // Refresh resources
         fetchResources();
       } catch (error) {
         console.error('Error uploading resource:', error);
         toast({
           title: t('common.error'),
           description: t('resources.uploadError'),
           variant: 'destructive',
         });
       } finally {
         setIsUploading(false);
       }
     };
     
     const handleDelete = async (resourceId) => {
       if (!window.confirm(t('resources.confirmDelete'))) {
         return;
       }
       
       try {
         await axios.delete(`/api/resources/${resourceId}/`);
         setResources(resources.filter(resource => resource.id !== resourceId));
         toast({
           title: t('resources.deleteSuccess'),
           description: t('resources.deleteSuccessDetail'),
         });
       } catch (error) {
         console.error('Error deleting resource:', error);
         toast({
           title: t('common.error'),
           description: t('resources.deleteError'),
           variant: 'destructive',
         });
       }
     };
     
     const formatDate = (dateString) => {
       return new Date(dateString).toLocaleDateString();
     };
     
     const getResourceTypeLabel = (type) => {
       return t(`resources.${type}Type`);
     };
     
     // Determine if user can upload (teachers, admins, supervisors)
     const canUpload = ['admin', 'trainer', 'center_supervisor', 'association_supervisor'].includes(currentUser.role);
     
     return (
       <div className="space-y-6">
         <div className="flex justify-between items-center">
           <div>
             <h1 className="text-2xl font-bold">{t('resources.title')}</h1>
             <p className="text-gray-600">{t('resources.description')}</p>
           </div>
           
           {canUpload && (
             <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
               <DialogTrigger asChild>
                 <Button>{t('resources.uploadResource')}</Button>
               </DialogTrigger>
               <DialogContent>
                 <DialogHeader>
                   <DialogTitle>{t('resources.uploadResource')}</DialogTitle>
                   <DialogDescription>{t('resources.uploadDescription')}</DialogDescription>
                 </DialogHeader>
                 
                 <div className="space-y-4 py-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                       {t('resources.resourceName')}
                     </label>
                     <Input
                       name="name"
                       value={newResource.name}
                       onChange={handleInputChange}
                       required
                     />
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                       {t('resources.description')}
                     </label>
                     <Input
                       name="description"
                       value={newResource.description}
                       onChange={handleInputChange}
                     />
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                       {t('resources.resourceType')}
                     </label>
                     <Select
                       name="resource_type"
                       value={newResource.resource_type}
                       onChange={handleInputChange}
                     >
                       <option value="document">{t('resources.documentType')}</option>
                       <option value="video">{t('resources.videoType')}</option>
                       <option value="image">{t('resources.imageType')}</option>
                       <option value="other">{t('resources.otherType')}</option>
                     </Select>
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                       {t('resources.file')}
                     </label>
                     <Input
                       type="file"
                       onChange={handleFileChange}
                       required
                     />
                   </div>
                 </div>
                 
                 <DialogFooter>
                   <Button
                     variant="outline"
                     onClick={() => setUploadDialogOpen(false)}
                   >
                     {t('common.cancel')}
                   </Button>
                   <Button
                     onClick={handleUpload}
                     disabled={isUploading}
                   >
                     {isUploading ? t('resources.uploading') : t('resources.upload')}
                   </Button>
                 </DialogFooter>
               </DialogContent>
             </Dialog>
           )}
         </div>
         
         <div className="flex flex-col sm:flex-row gap-4">
           <div className="w-full sm:w-2/3">
             <Input
               placeholder={t('common.search')}
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           <div className="w-full sm:w-1/3">
             <Select
               value={resourceType}
               onChange={(e) => setResourceType(e.target.value)}
             >
               <option value="">{t('resources.allTypes')}</option>
               <option value="document">{t('resources.documentType')}</option>
               <option value="video">{t('resources.videoType')}</option>
               <option value="image">{t('resources.imageType')}</option>
               <option value="other">{t('resources.otherType')}</option>
             </Select>
           </div>
         </div>
         
         {loading ? (
           <div className="text-center p-8">
             <p>{t('common.loading')}</p>
           </div>
         ) : filteredResources.length > 0 ? (
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead>{t('resources.resourceName')}</TableHead>
                 <TableHead>{t('resources.resourceType')}</TableHead>
                 <TableHead>{t('resources.uploadDate')}</TableHead>
                 <TableHead>{t('resources.uploadedBy')}</TableHead>
                 <TableHead>{t('resources.actions')}</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {filteredResources.map((resource) => (
                 <TableRow key={resource.id}>
                   <TableCell>{resource.name}</TableCell>
                   <TableCell>{getResourceTypeLabel(resource.resource_type)}</TableCell>
                   <TableCell>{formatDate(resource.created_at)}</TableCell>
                   <TableCell>{resource.uploaded_by_name}</TableCell>
                   <TableCell>
                     <div className="flex gap-2">
                       <Button variant="outline" size="sm" asChild>
                         <a href={resource.file_url} target="_blank" rel="noreferrer">
                           {t('resources.downloadResource')}
                         </a>
                       </Button>
                       
                       {(currentUser.id === resource.uploaded_by || currentUser.role === 'admin') && (
                         <Button 
                           variant="destructive" 
                           size="sm" 
                           onClick={() => handleDelete(resource.id)}
                         >
                           {t('resources.deleteResource')}
                         </Button>
                       )}
                     </div>
                   </TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
         ) : (
           <div className="text-center p-8 bg-gray-50 rounded-lg">
             <p>{t('resources.noResources')}</p>
           </div>
         )}
       </div>
     );
   };
   
   export default ResourceLibrary;
   ```

## Phase 4: Enhanced Features Development (Days 13-15)

### Day 13: Calendar and Performance Tracking

1. **Implement Calendar System**
   ```javascript
   // filepath: entraide-frontend/src/pages/dashboards/common/CalendarView.js
   import React, { useState, useEffect, useContext } from 'react';
   import { useTranslation } from 'react-i18next';
   import axios from 'axios';
   import { Button } from '../../../components/ui/button';
   import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../components/ui/dialog';
   import { Input } from '../../../components/ui/input';
   import { Select } from '../../../components/ui/select';
   import { toast } from '../../../components/ui/use-toast';
   import { AuthContext } from '../../../context/AuthContext';
   import FullCalendar from '@fullcalendar/react';
   import dayGridPlugin from '@fullcalendar/daygrid';
   import timeGridPlugin from '@fullcalendar/timegrid';
   import interactionPlugin from '@fullcalendar/interaction';
   
   const CalendarView = () => {
     const { t } = useTranslation();
     const { currentUser } = useContext(AuthContext);
     const [events, setEvents] = useState([]);
     const [newEvent, setNewEvent] = useState({
       title: '',
       start: '',
       end: '',
       description: '',
       type: 'course',
       backgroundColor: '#3788d8'
     });
     const [showDialog, setShowDialog] = useState(false);
     const [loading, setLoading] = useState(true);
     const [isEditing, setIsEditing] = useState(false);
     const [selectedEventId, setSelectedEventId] = useState(null);
     
     useEffect(() => {
       fetchEvents();
     }, []);
     
     const fetchEvents = async () => {
       try {
         let endpoint = '/api/calendar/events/';
         if (currentUser.role === 'student') {
           endpoint = '/api/calendar/events/student/';
         } else if (currentUser.role === 'trainer') {
           endpoint = '/api/calendar/events/trainer/';
         }
         
         const response = await axios.get(endpoint);
         
         // Format events for FullCalendar
         const formattedEvents = response.data.map(event => ({
           id: event.id,
           title: event.title,
           start: event.start_datetime,
           end: event.end_datetime,
           description: event.description,
           type: event.event_type,
           backgroundColor: getEventColor(event.event_type),
           editable: canEditEvent(event)
         }));
         
         setEvents(formattedEvents);
       } catch (error) {
         console.error('Error fetching calendar events:', error);
         toast({
           title: t('common.error'),
           description: t('calendar.fetchError'),
           variant: 'destructive',
         });
       } finally {
         setLoading(false);
       }
     };
     
     const getEventColor = (type) => {
       switch (type) {
         case 'course':
           return '#3788d8'; // blue
         case 'exam':
           return '#e74c3c'; // red
         case 'assignment':
           return '#f39c12'; // yellow
         case 'attendance':
           return '#2ecc71'; // green
         default:
           return '#9b59b6'; // purple
       }
     };
     
     const canEditEvent = (event) => {
       // Admin can edit all events
       if (currentUser.role === 'admin') return true;
       
       // Trainers can edit their own events
       if (currentUser.role === 'trainer' && event.created_by === currentUser.id) return true;
       
       // Center supervisors can edit center events
       if (currentUser.role === 'center_supervisor' && 
           (event.center_id === currentUser.center_id)) return true;
           
       return false;
     };
     
     const handleDateClick = (info) => {
       if (!canCreateEvents()) return;
       
       // Reset and prepare new event
       setNewEvent({
         title: '',
         start: info.dateStr,
         end: info.dateStr,
         description: '',
         type: 'course',
         backgroundColor: '#3788d8'
       });
       
       setIsEditing(false);
       setShowDialog(true);
     };
     
     const handleEventClick = (info) => {
       const event = events.find(e => e.id === parseInt(info.event.id));
       
       if (!event.editable) {
         // Just show details
         toast({
           title: event.title,
           description: event.description,
         });
         return;
       }
       
       // Open edit dialog
       setNewEvent({
         title: info.event.title,
         start: info.event.start.toISOString().split('T')[0],
         end: info.event.end ? info.event.end.toISOString().split('T')[0] : info.event.start.toISOString().split('T')[0],
         description: info.event.extendedProps.description || '',
         type: info.event.extendedProps.type,
         backgroundColor: info.event.backgroundColor
       });
       
       setSelectedEventId(parseInt(info.event.id));
       setIsEditing(true);
       setShowDialog(true);
     };
     
     const canCreateEvents = () => {
       return ['admin', 'trainer', 'center_supervisor'].includes(currentUser.role);
     };
     
     const handleInputChange = (e) => {
       const { name, value } = e.target;
       setNewEvent(prev => {
         const updated = { ...prev, [name]: value };
         
         // Update color based on type
         if (name === 'type') {
           updated.backgroundColor = getEventColor(value);
         }
         
         return updated;
       });
     };
     
     const handleSaveEvent = async () => {
       if (!newEvent.title || !newEvent.start) {
         toast({
           title: t('common.error'),
           description: t('calendar.missingFields'),
           variant: 'destructive',
         });
         return;
       }
       
       try {
         let response;
         const eventData = {
           title: newEvent.title,
           start_datetime: `${newEvent.start}T00:00:00Z`,
           end_datetime: `${newEvent.end || newEvent.start}T23:59:59Z`,
           description: newEvent.description,
           event_type: newEvent.type
         };
         
         if (isEditing) {
           response = await axios.put(`/api/calendar/events/${selectedEventId}/`, eventData);
           
           // Update local state
           setEvents(events.map(event => 
             event.id === selectedEventId ? {
               ...event,
               title: newEvent.title,
               start: eventData.start_datetime,
               end: eventData.end_datetime,
               description: newEvent.description,
               type: newEvent.type,
               backgroundColor: getEventColor(newEvent.type)
             } : event
           ));
           
           toast({
             title: t('calendar.updateSuccess'),
             description: t('calendar.updateSuccessDetail'),
           });
         } else {
           response = await axios.post('/api/calendar/events/', eventData);
           
           // Add to local state
           const newCalendarEvent = {
             id: response.data.id,
             title: newEvent.title,
             start: eventData.start_datetime,
             end: eventData.end_datetime,
             description: newEvent.description,
             type: newEvent.type,
             backgroundColor: getEventColor(newEvent.type),
             editable: true
           };
           
           setEvents([...events, newCalendarEvent]);
           
           toast({
             title: t('calendar.createSuccess'),
             description: t('calendar.createSuccessDetail'),
           });
         }
         
         setShowDialog(false);
       } catch (error) {
         console.error('Error saving event:', error);
         toast({
           title: t('common.error'),
           description: t('calendar.saveError'),
           variant: 'destructive',
         });
       }
     };
     
     const handleDeleteEvent = async () => {
       if (!isEditing || !selectedEventId) return;
       
       if (!window.confirm(t('calendar.confirmDelete'))) return;
       
       try {
         await axios.delete(`/api/calendar/events/${selectedEventId}/`);
         
         // Remove from local state
         setEvents(events.filter(event => event.id !== selectedEventId));
         
         toast({
           title: t('calendar.deleteSuccess'),
           description: t('calendar.deleteSuccessDetail'),
         });
         
         setShowDialog(false);
       } catch (error) {
         console.error('Error deleting event:', error);
         toast({
           title: t('common.error'),
           description: t('calendar.deleteError'),
           variant: 'destructive',
         });
       }
     };
     
     return (
       <div className="space-y-6">
         <div className="flex justify-between items-center">
           <div>
             <h1 className="text-2xl font-bold">{t('calendar.title')}</h1>
             <p className="text-gray-600">{t('calendar.description')}</p>
           </div>
         </div>
         
         <div className="bg-white p-4 rounded-lg shadow">
           <FullCalendar
             plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
             headerToolbar={{
               left: 'prev,next today',
               center: 'title',
               right: 'dayGridMonth,timeGridWeek,timeGridDay'
             }}
             initialView="dayGridMonth"
             events={events}
             dateClick={handleDateClick}
             eventClick={handleEventClick}
             editable={true}
             selectable={true}
             selectMirror={true}
             dayMaxEvents={true}
           />
         </div>
         
         <Dialog open={showDialog} onOpenChange={setShowDialog}>
           <DialogContent>
             <DialogHeader>
               <DialogTitle>
                 {isEditing ? t('calendar.editEvent') : t('calendar.newEvent')}
               </DialogTitle>
               <DialogDescription>
                 {t('calendar.eventFormDescription')}
               </DialogDescription>
             </DialogHeader>
             
             <div className="space-y-4 py-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   {t('calendar.eventTitle')}
                 </label>
                 <Input
                   name="title"
                   value={newEvent.title}
                   onChange={handleInputChange}
                   required
                 />
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">
                     {t('calendar.startDate')}
                   </label>
                   <Input
                     type="date"
                     name="start"
                     value={newEvent.start}
                     onChange={handleInputChange}
                     required
                   />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">
                     {t('calendar.endDate')}
                   </label>
                   <Input
                     type="date"
                     name="end"
                     value={newEvent.end}
                     onChange={handleInputChange}
                   />
                 </div>
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   {t('calendar.eventType')}
                 </label>
                 <Select
                   name="type"
                   value={newEvent.type}
                   onChange={handleInputChange}
                 >
                   <option value="course">{t('calendar.typeCourse')}</option>
                   <option value="exam">{t('calendar.typeExam')}</option>
                   <option value="assignment">{t('calendar.typeAssignment')}</option>
                   <option value="attendance">{t('calendar.typeAttendance')}</option>
                   <option value="other">{t('calendar.typeOther')}</option>
                 </Select>
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   {t('calendar.description')}
                 </label>
                 <Input
                   name="description"
                   value={newEvent.description}
                   onChange={handleInputChange}
                 />
               </div>
             </div>
             
             <DialogFooter className="flex justify-between">
               <div>
                 {isEditing && (
                   <Button
                     variant="destructive"
                     onClick={handleDeleteEvent}
                   >
                     {t('calendar.deleteEvent')}
                   </Button>
                 )}
               </div>
               <div className="flex gap-2">
                 <Button
                   variant="outline"
                   onClick={() => setShowDialog(false)}
                 >
                   {t('common.cancel')}
                 </Button>
                 <Button onClick={handleSaveEvent}>
                   {t('common.save')}
                 </Button>
               </div>
             </DialogFooter>
           </DialogContent>
         </Dialog>
       </div>
     );
   };
   
   export default CalendarView;
   ```

2. **Implement Student Performance Tracking**
   ```javascript
   // filepath: entraide-frontend/src/pages/dashboards/trainer/StudentPerformance.js
   import React, { useState, useEffect } from 'react';
   import { useTranslation } from 'react-i18next';
   import axios from 'axios';
   import { Button } from '../../../components/ui/button';
   import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/table';
   import { Select } from '../../../components/ui/select';
   import { Input } from '../../../components/ui/input';
   import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
   import { toast } from '../../../components/ui/use-toast';
   
   const StudentPerformance = () => {
     const { t } = useTranslation();
     const [courses, setCourses] = useState([]);
     const [selectedCourse, setSelectedCourse] = useState(null);
     const [selectedStudent, setSelectedStudent] = useState(null);
     const [students, setStudents] = useState([]);
     const [performanceData, setPerformanceData] = useState({
       examResults: [],
       attendanceStats: [],
       skillsMatrix: []
     });
     const [loading, setLoading] = useState(true);
     
     useEffect(() => {
       const fetchCourses = async () => {
         try {
           const response = await axios.get('/api/programs/courses/my-courses/');
           setCourses(response.data);
           setLoading(false);
         } catch (error) {
           console.error('Error fetching courses:', error);
           setLoading(false);
         }
       };
       
       fetchCourses();
     }, []);
     
     const handleCourseChange = async (courseId) => {
       if (!courseId) {
         setSelectedCourse(null);
         setStudents([]);
         return;
       }
       
       setLoading(true);
       
       try {
         const course = courses.find(c => c.id === parseInt(courseId));
         setSelectedCourse(course);
         
         const response = await axios.get(`/api/programs/courses/${courseId}/students/`);
         setStudents(response.data);
       } catch (error) {
         console.error('Error fetching students:', error);
         toast({
           title: t('common.error'),
           description: t('performance.fetchStudentsError'),
           variant: 'destructive',
         });
       } finally {
         setLoading(false);
       }
     };
     
     const handleStudentSelect = async (studentId) => {
       if (!studentId) {
         setSelectedStudent(null);
         setPerformanceData({
           examResults: [],
           attendanceStats: [],
           skillsMatrix: []
         });
         return;
       }
       
       setLoading(true);
       
       try {
         const student = students.find(s => s.id === parseInt(studentId));
         setSelectedStudent(student);
         
         // Fetch exam results
         const examResponse = await axios.get(`/api/exams/results/by-student/${studentId}/?course=${selectedCourse.id}`);
         
         // Fetch attendance stats
         const attendanceResponse = await axios.get(`/api/attendance/stats/by-student/${studentId}/?course=${selectedCourse.id}`);
         
         // Fetch skills matrix (if implemented)
         const skillsResponse = await axios.get(`/api/students/skills/${studentId}/?course=${selectedCourse.id}`);
         
         setPerformanceData({
           examResults: examResponse.data,
           attendanceStats: attendanceResponse.data,
           skillsMatrix: skillsResponse.data
         });
       } catch (error) {
         console.error('Error fetching performance data:', error);
         toast({
           title: t('common.error'),
           description: t('performance.fetchDataError'),
           variant: 'destructive',
         });
       } finally {
         setLoading(false);
       }
     };
     
     if (loading && !selectedCourse) {
       return <div>{t('common.loading')}</div>;
     }
     
     return (
       <div className="space-y-6">
         <div>
           <h1 className="text-2xl font-bold">{t('performance.title')}</h1>
           <p className="text-gray-600">{t('performance.description')}</p>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
               {t('performance.selectCourse')}
             </label>
             <Select 
               onChange={(e) => handleCourseChange(e.target.value)}
               className="w-full"
             >
               <option value="">{t('performance.chooseCourse')}</option>
               {courses.map(course => (
                 <option key={course.id} value={course.id}>
                   {course.program.name} - {new Date(course.start_date).toLocaleDateString()}
                 </option>
               ))}
             </Select>
           </div>
           
           {selectedCourse && (
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">
                 {t('performance.selectStudent')}
               </label>
               <Select 
                 onChange={(e) => handleStudentSelect(e.target.value)}
                 className="w-full"
                 disabled={!selectedCourse}
               >
                 <option value="">{t('performance.chooseStudent')}</option>
                 {students.map(student => (
                   <option key={student.id} value={student.id}>
                     {student.user.first_name} {student.user.last_name}
                   </option>
                 ))}
               </Select>
             </div>
           )}
         </div>
         
         {selectedStudent && (
           <div className="space-y-8">
             <div className="bg-white p-6 rounded-lg shadow">
               <h2 className="text-xl font-bold mb-4">
                 {selectedStudent.user.first_name} {selectedStudent.user.last_name} - {t('performance.overview')}
               </h2>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="bg-blue-50 p-4 rounded-lg text-center">
                   <h3 className="text-lg font-medium text-blue-800">{t('performance.averageScore')}</h3>
                   <p className="text-3xl font-bold text-blue-900">
                     {performanceData.examResults.length > 0 
                       ? (performanceData.examResults.reduce((sum, result) => sum + result.score, 0) / 
                          performanceData.examResults.length).toFixed(1)
                       : '-'}
                   </p>
                 </div>
                 
                 <div className="bg-green-50 p-4 rounded-lg text-center">
                   <h3 className="text-lg font-medium text-green-800">{t('performance.attendanceRate')}</h3>
                   <p className="text-3xl font-bold text-green-900">
                     {performanceData.attendanceStats.total_sessions > 0
                       ? `${(performanceData.attendanceStats.present_count / 
                           performanceData.attendanceStats.total_sessions * 100).toFixed(1)}%`
                       : '-'}
                   </p>
                 </div>
                 
                 <div className="bg-purple-50 p-4 rounded-lg text-center">
                   <h3 className="text-lg font-medium text-purple-800">{t('performance.skillsProgress')}</h3>
                   <p className="text-3xl font-bold text-purple-900">
                     {performanceData.skillsMatrix.length > 0
                       ? `${(performanceData.skillsMatrix.filter(skill => skill.proficiency >= 3).length / 
                           performanceData.skillsMatrix.length * 100).toFixed(0)}%`
                       : '-'}
                   </p>
                 </div>
               </div>
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {/* Exam Results Chart */}
               <div className="bg-white p-4 rounded-lg shadow">
                 <h3 className="text-lg font-semibold mb-4">{t('performance.examResults')}</h3>
                 {performanceData.examResults.length > 0 ? (
                   <ResponsiveContainer width="100%" height={300}>
                     <BarChart data={performanceData.examResults}>
                       <CartesianGrid strokeDasharray="3 3" />
                       <XAxis dataKey="exam_name" />
                       <YAxis domain={[0, 100]} />
                       <Tooltip />
                       <Legend />
                       <Bar dataKey="score" name={t('performance.score')} fill="#8884d8" />
                       <Bar dataKey="passing_score" name={t('performance.passingScore')} fill="#82ca9d" />
                     </BarChart>
                   </ResponsiveContainer>
                 ) : (
                   <div className="text-center p-8 bg-gray-50 rounded-lg">
                     <p>{t('performance.noExamResults')}</p>
                   </div>
                 )}
               </div>
               
               {/* Attendance Chart */}
               <div className="bg-white p-4 rounded-lg shadow">
                 <h3 className="text-lg font-semibold mb-4">{t('performance.attendanceOverTime')}</h3>
                 {performanceData.attendanceStats.attendance_over_time?.length > 0 ? (
                   <ResponsiveContainer width="100%" height={300}>
                     <LineChart data={performanceData.attendanceStats.attendance_over_time}>
                       <CartesianGrid strokeDasharray="3 3" />
                       <XAxis dataKey="date" />
                       <YAxis />
                       <Tooltip />
                       <Legend />
                       <Line type="monotone" dataKey="status_numeric" name={t('performance.attended')} stroke="#2ecc71" />
                     </LineChart>
                   </ResponsiveContainer>
                 ) : (
                   <div className="text-center p-8 bg-gray-50 rounded-lg">
                     <p>{t('performance.noAttendanceData')}</p>
                   </div>
                 )}
               </div>
             </div>
             
             {/* Skills Matrix */}
             <div className="bg-white p-4 rounded-lg shadow">
               <h3 className="text-lg font-semibold mb-4">{t('performance.skillsMatrix')}</h3>
               {performanceData.skillsMatrix.length > 0 ? (
                 <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead>{t('performance.skill')}</TableHead>
                       <TableHead>{t('performance.proficiency')}</TableHead>
                       <TableHead>{t('performance.updateProficiency')}</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {performanceData.skillsMatrix.map((skill) => (
                       <TableRow key={skill.id}>
                         <TableCell>{skill.name}</TableCell>
                         <TableCell>
                           <div className="flex items-center">
                             <div className="w-full bg-gray-200 rounded-full h-2.5">
                               <div 
                                 className="bg-blue-600 h-2.5 rounded-full" 
                                 style={{ width: `${(skill.proficiency / 5) * 100}%` }}
                               ></div>
                             </div>
                             <span className="ml-2">
                               {skill.proficiency}/5
                             </span>
                           </div>
                         </TableCell>
                         <TableCell>
                           <Select 
                             value={skill.proficiency} 
                             onChange={async (e) => {
                               try {
                                 await axios.put(`/api/students/skills/${skill.id}/`, {
                                   proficiency: parseInt(e.target.value)
                                 });
                                 
                                 // Update local state
                                 setPerformanceData(prev => ({
                                   ...prev,
                                   skillsMatrix: prev.skillsMatrix.map(s => 
                                     s.id === skill.id ? {...s, proficiency: parseInt(e.target.value)} : s
                                   )
                                 }));
                                 
                                 toast({
                                   title: t('performance.skillUpdated'),
                                   description: t('performance.skillUpdatedDescription'),
                                 });
                               } catch (error) {
                                 console.error('Error updating skill:', error);
                                 toast({
                                   title: t('common.error'),
                                   description: t('performance.skillUpdateError'),
                                   variant: 'destructive',
                                 });
                               }
                             }}
                           >
                             <option value="1">1 - {t('performance.beginner')}</option>
                             <option value="2">2 - {t('performance.novice')}</option>
                             <option value="3">3 - {t('performance.intermediate')}</option>
                             <option value="4">4 - {t('performance.advanced')}</option>
                             <option value="5">5 - {t('performance.expert')}</option>
                           </Select>
                         </TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
               ) : (
                 <div className="text-center p-8 bg-gray-50 rounded-lg">
                   <p>{t('performance.noSkillsData')}</p>
                 </div>
               )}
             </div>
             
             <div className="flex justify-end">
               <Button
                 onClick={() => {
                   // Generate and download PDF report
                   toast({
                     title: t('performance.generatingReport'),
                     description: t('performance.reportWillDownload'),
                   });
                   
                   axios.get(`/api/reports/student-performance/${selectedStudent.id}/?course=${selectedCourse.id}`, {
                     responseType: 'blob'
                   }).then(response => {
                     const url = window.URL.createObjectURL(new Blob([response.data]));
                     const link = document.createElement('a');
                     link.href = url;
                     link.setAttribute('download', `${selectedStudent.user.last_name}_performance_report.pdf`);
                     document.body.appendChild(link);
                     link.click();
                     link.remove();
                   }).catch(error => {
                     console.error('Error generating report:', error);
                     toast({
                       title: t('common.error'),
                       description: t('performance.reportError'),
                       variant: 'destructive',
                     });
                   });
                 }}
               >
                 {t('performance.generateReport')}
               </Button>
             </div>
           </div>
         )}
       </div>
     );
   };
   
   export default StudentPerformance;
   ```

### Day 14: Frontend Accessibility and Feedback System

1. **Implement Feedback and Evaluation System**
   ```javascript
   // filepath: entraide-frontend/src/pages/dashboards/student/CourseFeedback.js
   import React, { useState, useEffect } from 'react';
   import { useTranslation } from 'react-i18next';
   import axios from 'axios';
   import { Button } from '../../../components/ui/button';
   import { Select } from '../../../components/ui/select';
   import { Textarea } from '../../../components/ui/textarea';
   import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
   import { Label } from '../../../components/ui/label';
   import { toast } from '../../../components/ui/use-toast';
   
   const CourseFeedback = () => {
     const { t } = useTranslation();
     const [courses, setCourses] = useState([]);
     const [selectedCourse, setSelectedCourse] = useState(null);
     const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState(false);
     const [submitting, setSubmitting] = useState(false);
     const [loading, setLoading] = useState(true);
     const [feedback, setFeedback] = useState({
       course_rating: '5',
       trainer_rating: '5',
       content_rating: '5',
       facilities_rating: '5',
       expectations_met: '5',
       best_aspects: '',
       improvement_suggestions: '',
       other_comments: ''
     });
     
     useEffect(() => {
       const fetchCourses = async () => {
         try {
           const response = await axios.get('/api/students/enrollments/my-enrollments/');
           setCourses(response.data);
           setLoading(false);
         } catch (error) {
           console.error('Error fetching courses:', error);
           setLoading(false);
         }
       };
       
       fetchCourses();
     }, []);
     
     const handleCourseChange = async (enrollmentId) => {
       if (!enrollmentId) {
         setSelectedCourse(null);
         setHasSubmittedFeedback(false);
         return;
       }
       
       try {
         const enrollment = courses.find(c => c.id === parseInt(enrollmentId));
         setSelectedCourse(enrollment);
         
         // Check if feedback already exists
         const response = await axios.get(`/api/feedback/by-enrollment/${enrollmentId}/`);
         
         if (response.data && response.data.id) {
           setHasSubmittedFeedback(true);
           setFeedback({
             course_rating: response.data.course_rating.toString(),
             trainer_rating: response.data.trainer_rating.toString(),
             content_rating: response.data.content_rating.toString(),
             facilities_rating: response.data.facilities_rating.toString(),
             expectations_met: response.data.expectations_met.toString(),
             best_aspects: response.data.best_aspects || '',
             improvement_suggestions: response.data.improvement_suggestions || '',
             other_comments: response.data.other_comments || ''
           });
         } else {
           setHasSubmittedFeedback(false);
           setFeedback({
             course_rating: '5',
             trainer_rating: '5',
             content_rating: '5',
             facilities_rating: '5',
             expectations_met: '5',
             best_aspects: '',
             improvement_suggestions: '',
             other_comments: ''
           });
         }
       } catch (error) {
         if (error.response && error.response.status === 404) {
           setHasSubmittedFeedback(false);
           setFeedback({
             course_rating: '5',
             trainer_rating: '5',
             content_rating: '5',
             facilities_rating: '5',
             expectations_met: '5',
             best_aspects: '',
             improvement_suggestions: '',
             other_comments: ''
           });
         } else {
           console.error('Error checking feedback:', error);
           toast({
             title: t('common.error'),
             description: t('feedback.checkError'),
             variant: 'destructive',
           });
         }
       }
     };
     
     const handleInputChange = (e) => {
       const { name, value } = e.target;
       setFeedback(prev => ({
         ...prev,
         [name]: value
       }));
     };
     
     const handleRatingChange = (name, value) => {
       setFeedback(prev => ({
         ...prev,
         [name]: value
       }));
     };
     
     const handleSubmit = async (e) => {
       e.preventDefault();
       
       if (!selectedCourse) {
         toast({
           title: t('feedback.missingCourse'),
           description: t('feedback.selectCourse'),
           variant: 'destructive',
         });
         return;
       }
       
       setSubmitting(true);
       
       try {
         const feedbackData = {
           enrollment: selectedCourse.id,
           course_rating: parseInt(feedback.course_rating),
           trainer_rating: parseInt(feedback.trainer_rating),
           content_rating: parseInt(feedback.content_rating),
           facilities_rating: parseInt(feedback.facilities_rating),
           expectations_met: parseInt(feedback.expectations_met),
           best_aspects: feedback.best_aspects,
           improvement_suggestions: feedback.improvement_suggestions,
           other_comments: feedback.other_comments
         };
         
         if (hasSubmittedFeedback) {
           // Update existing feedback
           await axios.put(`/api/feedback/by-enrollment/${selectedCourse.id}/`, feedbackData);
           toast({
             title: t('feedback.updateSuccess'),
             description: t('feedback.updateSuccessDetail'),
           });
         } else {
           // Create new feedback
           await axios.post('/api/feedback/', feedbackData);
           setHasSubmittedFeedback(true);
           toast({
             title: t('feedback.submitSuccess'),
             description: t('feedback.submitSuccessDetail'),
           });
         }
       } catch (error) {
         console.error('Error submitting feedback:', error);
         toast({
           title: t('common.error'),
           description: t('feedback.submitError'),
           variant: 'destructive',
         });
       } finally {
         setSubmitting(false);
       }
     };
     
     if (loading) {
       return <div>{t('common.loading')}</div>;
     }
     
     return (
       <div className="space-y-6">
         <div>
           <h1 className="text-2xl font-bold">{t('feedback.title')}</h1>
           <p className="text-gray-600">{t('feedback.description')}</p>
         </div>
         
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">
             {t('feedback.selectCourse')}
           </label>
           <Select 
             onChange={(e) => handleCourseChange(e.target.value)}
             className="w-full max-w-md"
           >
             <option value="">{t('feedback.chooseCourse')}</option>
             {courses.map(course => (
               <option key={course.id} value={course.id}>
                 {course.course.program.name}
               </option>
             ))}
           </Select>
         </div>
         
         {selectedCourse && (
           <form onSubmit={handleSubmit} className="space-y-6">
             <div className="bg-white p-6 rounded-lg shadow space-y-6">
               <h2 className="text-xl font-semibold">{t('feedback.ratings')}</h2>
               
               <div>
                 <h3 className="text-lg font-medium mb-2">{t('feedback.courseRating')}</h3>
                 <RadioGroup
                   value={feedback.course_rating}
                   onValueChange={(value) => handleRatingChange('course_rating', value)}
                   className="flex space-x-4"
                   disabled={submitting}
                 >
                   {[1, 2, 3, 4, 5].map((rating) => (
                     <div key={rating} className="flex items-center space-x-2">
                       <RadioGroupItem value={rating.toString()} id={`course_${rating}`} />
                       <Label htmlFor={`course_${rating}`}>{rating}</Label>
                     </div>
                   ))}
                 </RadioGroup>
               </div>
               
               <div>
                 <h3 className="text-lg font-medium mb-2">{t('feedback.trainerRating')}</h3>
                 <RadioGroup
                   value={feedback.trainer_rating}
                   onValueChange={(value) => handleRatingChange('trainer_rating', value)}
                   className="flex space-x-4"
                   disabled={submitting}
                 >
                   {[1, 2, 3, 4, 5].map((rating) => (
                     <div key={rating} className="flex items-center space-x-2">
                       <RadioGroupItem value={rating.toString()} id={`trainer_${rating}`} />
                       <Label htmlFor={`trainer_${rating}`}>{rating}</Label>
                     </div>
                   ))}
                 </RadioGroup>
               </div>
               
               <div>
                 <h3 className="text-lg font-medium mb-2">{t('feedback.contentRating')}</h3>
                 <RadioGroup
                   value={feedback.content_rating}
                   onValueChange={(value) => handleRatingChange('content_rating', value)}
                   className="flex space-x-4"
                   disabled={submitting}
                 >
                   {[1, 2, 3, 4, 5].map((rating) => (
                     <div key={rating} className="flex items-center space-x-2">
                       <RadioGroupItem value={rating.toString()} id={`content_${rating}`} />
                       <Label htmlFor={`content_${rating}`}>{rating}</Label>
                     </div>
                   ))}
                 </RadioGroup>
               </div>
               
               <div>
                 <h3 className="text-lg font-medium mb-2">{t('feedback.facilitiesRating')}</h3>
                 <RadioGroup
                   value={feedback.facilities_rating}
                   onValueChange={(value) => handleRatingChange('facilities_rating', value)}
                   className="flex space-x-4"
                   disabled={submitting}
                 >
                   {[1, 2, 3, 4, 5].map((rating) => (
                     <div key={rating} className="flex items-center space-x-2">
                       <RadioGroupItem value={rating.toString()} id={`facilities_${rating}`} />
                       <Label htmlFor={`facilities_${rating}`}>{rating}</Label>
                     </div>
                   ))}
                 </RadioGroup>
               </div>
               
               <div>
                 <h3 className="text-lg font-medium mb-2">{t('feedback.expectationsMet')}</h3>
                 <RadioGroup
                   value={feedback.expectations_met}
                   onValueChange={(value) => handleRatingChange('expectations_met', value)}
                   className="flex space-x-4"
                   disabled={submitting}
                 >
                   {[1, 2, 3, 4, 5].map((rating) => (
                     <div key={rating} className="flex items-center space-x-2">
                       <RadioGroupItem value={rating.toString()} id={`expectations_${rating}`} />
                       <Label htmlFor={`expectations_${rating}`}>{rating}</Label>
                     </div>
                   ))}
                 </RadioGroup>
               </div>
             </div>
             
             <div className="bg-white p-6 rounded-lg shadow space-y-6">
               <h2 className="text-xl font-semibold">{t('feedback.comments')}</h2>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   {t('feedback.bestAspects')}
                 </label>
                 <Textarea
                   name="best_aspects"
                   value={feedback.best_aspects}
                   onChange={handleInputChange}
                   rows={4}
                   disabled={submitting}
                   placeholder={t('feedback.bestAspectsPlaceholder')}
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   {t('feedback.improvementSuggestions')}
                 </label>
                 <Textarea
                   name="improvement_suggestions"
                   value={feedback.improvement_suggestions}
                   onChange={handleInputChange}
                   rows={4}
                   disabled={submitting}
                   placeholder={t('feedback.improvementSuggestionsPlaceholder')}
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   {t('feedback.otherComments')}
                 </label>
                 <Textarea
                   name="other_comments"
                   value={feedback.other_comments}
                   onChange={handleInputChange}
                   rows={4}
                   disabled={submitting}
                   placeholder={t('feedback.otherCommentsPlaceholder')}
                 />
               </div>
             </div>
             
             <div className="flex justify-end">
               <Button type="submit" disabled={submitting}>
                 {submitting 
                   ? t('feedback.submitting') 
                   : hasSubmittedFeedback 
                     ? t('feedback.updateFeedback') 
                     : t('feedback.submitFeedback')
                 }
               </Button>
             </div>
           </form>
         )}
       </div>
     );
   };
   
   export default CourseFeedback;
   ```

2. **Implement Accessibility Features**
   ```javascript
   // filepath: entraide-frontend/src/context/AccessibilityContext.js
   import React, { createContext, useState, useEffect } from 'react';
   
   export const AccessibilityContext = createContext();
   
   export const AccessibilityProvider = ({ children }) => {
     const [highContrast, setHighContrast] = useState(false);
     const [largeText, setLargeText] = useState(false);
     const [reducedMotion, setReducedMotion] = useState(false);
     
     // Load preferences from localStorage on mount
     useEffect(() => {
       const storedHighContrast = localStorage.getItem('highContrast') === 'true';
       const storedLargeText = localStorage.getItem('largeText') === 'true';
       const storedReducedMotion = localStorage.getItem('reducedMotion') === 'true';
       
       setHighContrast(storedHighContrast);
       setLargeText(storedLargeText);
       setReducedMotion(storedReducedMotion);
       
       // Apply settings
       if (storedHighContrast) document.body.classList.add('high-contrast');
       if (storedLargeText) document.body.classList.add('large-text');
       if (storedReducedMotion) document.body.classList.add('reduced-motion');
     }, []);
     
     const toggleHighContrast = () => {
       const newValue = !highContrast;
       setHighContrast(newValue);
       localStorage.setItem('highContrast', newValue);
       
       if (newValue) {
         document.body.classList.add('high-contrast');
       } else {
         document.body.classList.remove('high-contrast');
       }
     };
     
     const toggleLargeText = () => {
       const newValue = !largeText;
       setLargeText(newValue);
       localStorage.setItem('largeText', newValue);
       
       if (newValue) {
         document.body.classList.add('large-text');
       } else {
         document.body.classList.remove('large-text');
       }
     };
     
     const toggleReducedMotion = () => {
       const newValue = !reducedMotion;
       setReducedMotion(newValue);
       localStorage.setItem('reducedMotion', newValue);
       
       if (newValue) {
         document.body.classList.add('reduced-motion');
       } else {
         document.body.classList.remove('reduced-motion');
       }
     };
     
     return (
       <AccessibilityContext.Provider
         value={{
           highContrast,
           largeText,
           reducedMotion,
           toggleHighContrast,
           toggleLargeText,
           toggleReducedMotion
         }}
       >
         {children}
       </AccessibilityContext.Provider>
     );
   };
   ```

3. **Accessibility Controls Component**
   ```javascript
   // filepath: entraide-frontend/src/components/accessibility/AccessibilityControls.js
   import React, { useContext } from 'react';
   import { useTranslation } from 'react-i18next';
   import { AccessibilityContext } from '../../context/AccessibilityContext';
   import { Button } from '../ui/button';
   import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
   import { Switch } from '../ui/switch';
   import { Label } from '../ui/label';
   
   const AccessibilityControls = () => {
     const { t } = useTranslation();
     const { 
       highContrast, 
       largeText, 
       reducedMotion,
       toggleHighContrast,
       toggleLargeText,
       toggleReducedMotion
     } = useContext(AccessibilityContext);
     
     return (
       <Dialog>
         <DialogTrigger asChild>
           <Button variant="outline" size="icon" className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50" aria-label={t('accessibility.controlsLabel')}>
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <circle cx="12" cy="12" r="10"></circle>
               <path d="M12 8v8"></path>
               <path d="M8 12h8"></path>
             </svg>
           </Button>
         </DialogTrigger>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>{t('accessibility.title')}</DialogTitle>
             <DialogDescription>
               {t('accessibility.description')}
             </DialogDescription>
           </DialogHeader>
           
           <div className="space-y-4 py-4">
             <div className="flex items-center justify-between">
               <div>
                 <Label htmlFor="high-contrast">{t('accessibility.highContrast')}</Label>
                 <p className="text-sm text-gray-500">{t('accessibility.highContrastDescription')}</p>
               </div>
               <Switch
                 id="high-contrast"
                 checked={highContrast}
                 onCheckedChange={toggleHighContrast}
               />
             </div>
             
             <div className="flex items-center justify-between">
               <div>
                 <Label htmlFor="large-text">{t('accessibility.largeText')}</Label>
                 <p className="text-sm text-gray-500">{t('accessibility.largeTextDescription')}</p>
               </div>
               <Switch
                 id="large-text"
                 checked={largeText}
                 onCheckedChange={toggleLargeText}
               />
             </div>
             
             <div className="flex items-center justify-between">
               <div>
                 <Label htmlFor="reduced-motion">{t('accessibility.reducedMotion')}</Label>
                 <p className="text-sm text-gray-500">{t('accessibility.reducedMotionDescription')}</p>
               </div>
               <Switch
                 id="reduced-motion"
                 checked={reducedMotion}
                 onCheckedChange={toggleReducedMotion}
               />
             </div>
           </div>
           
           <DialogFooter>
             <Button variant="outline">{t('common.close')}</Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>
     );
   };
   
   export default AccessibilityControls;
   ```

### Day 15: Documentation, Financial Management and Reports

1. **Financial Management Module**
   ```javascript
   // filepath: entraide-frontend/src/pages/dashboards/admin/FinancialManagement.js
   import React, { useState, useEffect } from 'react';
   import { useTranslation } from 'react-i18next';
   import axios from 'axios';
   import { Button } from '../../../components/ui/button';
   import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/table';
   import { Input } from '../../../components/ui/input';
   import { Select } from '../../../components/ui/select';
   import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../components/ui/dialog';
   import { toast } from '../../../components/ui/use-toast';
   import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
   
   const FinancialManagement = () => {
     const { t } = useTranslation();
     const [transactions, setTransactions] = useState([]);
     const [budgets, setBudgets] = useState([]);
     const [centers, setCenters] = useState([]);
     const [programs, setPrograms] = useState([]);
     const [financialReports, setFinancialReports] = useState({});
     const [loading, setLoading] = useState(true);
     const [showDialog, setShowDialog] = useState(false);
     const [transactionType, setTransactionType] = useState('expense');
     
     // Form state
     const [newTransaction, setNewTransaction] = useState({
       amount: '',
       description: '',
       date: new Date().toISOString().split('T')[0],
       category: '',
       center: '',
       program: ''
     });
     
     useEffect(() => {
       const fetchFinancialData = async () => {
         try {
           // Fetch transactions
           const transactionsResponse = await axios.get('/api/finance/transactions/');
           setTransactions(transactionsResponse.data);
           
           // Fetch budgets
           const budgetsResponse = await axios.get('/api/finance/budgets/');
           setBudgets(budgetsResponse.data);
           
           // Fetch centers for dropdown
           const centersResponse = await axios.get('/api/centers/');
           setCenters(centersResponse.data);
           
           // Fetch programs for dropdown
           const programsResponse = await axios.get('/api/programs/');
           setPrograms(programsResponse.data);
           
           // Fetch financial reports
           const reportsResponse = await axios.get('/api/finance/reports/summary/');
           setFinancialReports(reportsResponse.data);
         } catch (error) {
           console.error('Error fetching financial data:', error);
           toast({
             title: t('common.error'),
             description: t('finance.fetchError'),
             variant: 'destructive',
           });
         } finally {
           setLoading(false);
         }
       };
       
       fetchFinancialData();
     }, []);
     
     const handleInputChange = (e) => {
       const { name, value } = e.target;
       setNewTransaction(prev => ({
         ...prev,
         [name]: value
       }));
     };
     
     const handleAddTransaction = async () => {
       try {
         const transactionData = {
           ...newTransaction,
           amount: parseFloat(newTransaction.amount),
           transaction_type: transactionType,
           center: newTransaction.center ? parseInt(newTransaction.center) : null,
           program: newTransaction.program ? parseInt(newTransaction.program) : null
         };
         
         const response = await axios.post('/api/finance/transactions/', transactionData);
         
         // Add to local state
         setTransactions([response.data, ...transactions]);
         
         toast({
           title: t('finance.addSuccess'),
           description: t('finance.addSuccessDetail'),
         });
         
         // Reset form
         setNewTransaction({
           amount: '',
           description: '',
           date: new Date().toISOString().split('T')[0],
           category: '',
           center: '',
           program: ''
         });
         
         setShowDialog(false);
       } catch (error) {
         console.error('Error adding transaction:', error);
         toast({
           title: t('common.error'),
           description: t('finance.addError'),
           variant: 'destructive',
         });
       }
     };
     
     const formatCurrency = (amount) => {
       return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(amount);
     };
     
     const formatDate = (dateString) => {
       return new Date(dateString).toLocaleDateString();
     };
     
     if (loading) {
       return <div>{t('common.loading')}</div>;
     }
     
     return (
       <div className="space-y-8">
         <div className="flex justify-between items-center">
           <div>
             <h1 className="text-2xl font-bold">{t('finance.title')}</h1>
             <p className="text-gray-600">{t('finance.description')}</p>
           </div>
           
           <Dialog open={showDialog} onOpenChange={setShowDialog}>
             <DialogTrigger asChild>
               <Button>{t('finance.addTransaction')}</Button>
             </DialogTrigger>
             <DialogContent>
               <DialogHeader>
                 <DialogTitle>{t('finance.newTransaction')}</DialogTitle>
                 <DialogDescription>
                   {t('finance.newTransactionDescription')}
                 </DialogDescription>
               </DialogHeader>
               
               <div className="space-y-4 py-4">
                 <div className="grid grid-cols-2 gap-4">
                   <div className="col-span-2">
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                       {t('finance.transactionType')}
                     </label>
                     <div className="flex gap-4">
                       <Button
                         type="button"
                         variant={transactionType === 'expense' ? 'default' : 'outline'}
                         onClick={() => setTransactionType('expense')}
                       >
                         {t('finance.expense')}
                       </Button>
                       <Button
                         type="button"
                         variant={transactionType === 'income' ? 'default' : 'outline'}
                         onClick={() => setTransactionType('income')}
                       >
                         {t('finance.income')}
                       </Button>
                     </div>
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                       {t('finance.amount')}
                     </label>
                     <Input
                       type="number"
                       name="amount"
                       value={newTransaction.amount}
                       onChange={handleInputChange}
                       required
                     />
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                       {t('finance.date')}
                     </label>
                     <Input
                       type="date"
                       name="date"
                       value={newTransaction.date}
                       onChange={handleInputChange}
                       required
                     />
                   </div>
                   
                   <div className="col-span-2">
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                       {t('finance.description')}
                     </label>
                     <Input
                       name="description"
                       value={newTransaction.description}
                       onChange={handleInputChange}
                       required
                     />
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                       {t('finance.category')}
                     </label>
                     <Select
                       name="category"
                       value={newTransaction.category}
                       onChange={handleInputChange}
                       required
                     >
                       <option value="">{t('finance.selectCategory')}</option>
                       <option value="salary">{t('finance.categorySalary')}</option>
                       <option value="equipment">{t('finance.categoryEquipment')}</option>
                       <option value="rent">{t('finance.categoryRent')}</option>
                       <option value="utilities">{t('finance.categoryUtilities')}</option>
                       <option value="material">{t('finance.categoryMaterial')}</option>
                       <option value="transport">{t('finance.categoryTransport')}</option>
                       <option value="other">{t('finance.categoryOther')}</option>
                     </Select>
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                       {t('finance.center')}
                     </label>
                     <Select
                       name="center"
                       value={newTransaction.center}
                       onChange={handleInputChange}
                     >
                       <option value="">{t('finance.selectCenter')}</option>
                       {centers.map(center => (
                         <option key={center.id} value={center.id}>{center.name}</option>
                       ))}
                     </Select>
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                       {t('finance.program')}
                     </label>
                     <Select
                       name="program"
                       value={newTransaction.program}
                       onChange={handleInputChange}
                     >
                       <option value="">{t('finance.selectProgram')}</option>
                       {programs.map(program => (
                         <option key={program.id} value={program.id}>{program.name}</option>
                       ))}
                     </Select>
                   </div>
                 </div>
               </div>
               
               <DialogFooter>
                 <Button variant="outline" onClick={() => setShowDialog(false)}>
                   {t('common.cancel')}
                 </Button>
                 <Button onClick={handleAddTransaction}>
                   {t('finance.addButton')}
                 </Button>
               </DialogFooter>
             </DialogContent>
           </Dialog>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-4 rounded-lg shadow">
             <h2 className="text-lg font-semibold mb-2">{t('finance.totalBudget')}</h2>
             <p className="text-3xl font-bold">
               {formatCurrency(financialReports.total_budget || 0)}
             </p>
             <div className="text-sm text-gray-500 mt-1">
               {t('finance.remainingBudget')}: {formatCurrency(financialReports.remaining_budget || 0)}
             </div>
           </div>
           
           <div className="bg-white p-4 rounded-lg shadow">
             <h2 className="text-lg font-semibold mb-2">{t('finance.totalIncome')}</h2>
             <p className="text-3xl font-bold text-green-600">
               {formatCurrency(financialReports.total_income || 0)}
             </p>
           </div>
           
           <div className="bg-white p-4 rounded-lg shadow">
             <h2 className="text-lg font-semibold mb-2">{t('finance.totalExpenses')}</h2>
             <p className="text-3xl font-bold text-red-600">
               {formatCurrency(financialReports.total_expenses || 0)}
             </p>
           </div>
         </div>
         
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="bg-white p-4 rounded-lg shadow">
             <h2 className="text-lg font-semibold mb-4">{t('finance.expensesByCategory')}</h2>
             {financialReports.expenses_by_category?.length > 0 ? (
               <ResponsiveContainer width="100%" height={300}>
                 <BarChart data={financialReports.expenses_by_category}>
                   <CartesianGrid strokeDasharray="3 3" />
                   <XAxis dataKey="category" />
                   <YAxis />
                   <Tooltip formatter={(value) => formatCurrency(value)} />
                   <Legend />
                   <Bar dataKey="amount" fill="#f87171" name={t('finance.amount')} />
                 </BarChart>
               </ResponsiveContainer>
             ) : (
               <div className="text-center p-8 bg-gray-50 rounded-lg">
                 <p>{t('finance.noExpenseData')}</p>
               </div>
             )}
           </div>
           
           <div className="bg-white p-4 rounded-lg shadow">
             <h2 className="text-lg font-semibold mb-4">{t('finance.monthlyExpenses')}</h2>
             {financialReports.monthly_expenses?.length > 0 ? (
               <ResponsiveContainer width="100%" height={300}>
                 <LineChart data={financialReports.monthly_expenses}>
                   <CartesianGrid strokeDasharray="3 3" />
                   <XAxis dataKey="month" />
                   <YAxis />
                   <Tooltip formatter={(value) => formatCurrency(value)} />
                   <Legend />
                   <Line type="monotone" dataKey="expenses" stroke="#ef4444" name={t('finance.expenses')} />
                   <Line type="monotone" dataKey="income" stroke="#10b981" name={t('finance.income')} />
                 </LineChart>
               </ResponsiveContainer>
             ) : (
               <div className="text-center p-8 bg-gray-50 rounded-lg">
                 <p>{t('finance.noMonthlyData')}</p>
               </div>
             )}
           </div>
         </div>
         
         <div>
           <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-semibold">{t('finance.recentTransactions')}</h2>
             <Button variant="outline">
               {t('finance.viewAll')}
             </Button>
           </div>
           
           <div className="bg-white rounded-lg shadow">
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>{t('finance.date')}</TableHead>
                   <TableHead>{t('finance.description')}</TableHead>
                   <TableHead>{t('finance.category')}</TableHead>
                   <TableHead>{t('finance.amount')}</TableHead>
                   <TableHead>{t('finance.transactionType')}</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {transactions.slice(0, 10).map(transaction => (
                   <TableRow key={transaction.id}>
                     <TableCell>{formatDate(transaction.date)}</TableCell>
                     <TableCell>{transaction.description}</TableCell>
                     <TableCell>{t(`finance.category${transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}`)}</TableCell>
                     <TableCell className={transaction.transaction_type === 'income' ? 'text-green-600' : 'text-red-600'}>
                       {formatCurrency(transaction.amount)}
                     </TableCell>
                     <TableCell>
                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                         transaction.transaction_type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                       }`}>
                         {transaction.transaction_type === 'income' ? t('finance.income') : t('finance.expense')}
                       </span>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </div>
         </div>
       </div>
     );
   };
   
   export default FinancialManagement;
   ```

2. **API Documentation and Final Guide**
   ```javascript
   // filepath: entraide-frontend/src/pages/Documentation.js
   import React, { useState } from 'react';
   import { useTranslation } from 'react-i18next';
   import { Tab } from '@headlessui/react';
   
   const Documentation = () => {
     const { t } = useTranslation();
     let [categories] = useState([
       { id: 'user', title: t('docs.userGuide') },
       { id: 'admin', title: t('docs.adminGuide') },
       { id: 'api', title: t('docs.apiDocs') }
     ]);
     
     return (
       <div className="max-w-6xl mx-auto px-4 py-8">
         <h1 className="text-3xl font-bold mb-2">{t('docs.title')}</h1>
         <p className="text-gray-600 mb-8">{t('docs.description')}</p>
         
         <Tab.Group>
           <Tab.List className="flex space-x-1 rounded-xl bg-gray-200 p-1">
             {categories.map((category) => (
               <Tab
                 key={category.id}
                 className={({ selected }) =>
                   `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                   ${
                     selected
                       ? 'bg-white shadow text-blue-700'
                       : 'text-gray-700 hover:bg-white/[0.12] hover:text-blue-600'
                   }`
                 }
               >
                 {category.title}
               </Tab>
             ))}
           </Tab.List>
           <Tab.Panels className="mt-4">
             {/* User Guide */}
             <Tab.Panel className="bg-white rounded-xl p-6 shadow">
               <h2 className="text-xl font-bold mb-4">{t('docs.userGuide')}</h2>
               <div className="space-y-6">
                 <section>
                   <h3 className="text-lg font-semibold mb-2">{t('docs.gettingStarted')}</h3>
                   <p>{t('docs.userGettingStartedDesc')}</p>
                   <ul className="list-disc ml-6 mt-2 space-y-1">
                     <li>{t('docs.userGuideLogin')}</li>
                     <li>{t('docs.userGuideNavigation')}</li>
                     <li>{t('docs.userGuideProfile')}</li>
                   </ul>
                 </section>
                 
                 <section>
                   <h3 className="text-lg font-semibold mb-2">{t('docs.studentFeatures')}</h3>
                   <p>{t('docs.studentFeaturesDesc')}</p>
                   <ul className="list-disc ml-6 mt-2 space-y-1">
                     <li>{t('docs.userGuideStudentCourses')}</li>
                     <li>{t('docs.userGuideStudentExams')}</li>
                     <li>{t('docs.userGuideStudentAttendance')}</li>
                     <li>{t('docs.userGuideStudentResources')}</li>
                   </ul>
                 </section>
                 
                 <section>
                   <h3 className="text-lg font-semibold mb-2">{t('docs.trainerFeatures')}</h3>
                   <p>{t('docs.trainerFeaturesDesc')}</p>
                   <ul className="list-disc ml-6 mt-2 space-y-1">
                     <li>{t('docs.userGuideTrainerCourses')}</li>
                     <li>{t('docs.userGuideTrainerExams')}</li>
                     <li>{t('docs.userGuideTrainerAttendance')}</li>
                     <li>{t('docs.userGuideTrainerResources')}</li>
                   </ul>
                 </section>
                 
                 <section>
                   <h3 className="text-lg font-semibold mb-2">{t('docs.accessibility')}</h3>
                   <p>{t('docs.accessibilityDesc')}</p>
                   <ul className="list-disc ml-6 mt-2 space-y-1">
                     <li>{t('docs.userGuideAccessibilityControls')}</li>
                     <li>{t('docs.userGuideAccessibilityHighContrast')}</li>
                     <li>{t('docs.userGuideAccessibilityLargeText')}</li>
                     <li>{t('docs.userGuideAccessibilityReducedMotion')}</li>
                   </ul>
                 </section>
               </div>
             </Tab.Panel>
             
             {/* Admin Guide */}
             <Tab.Panel className="bg-white rounded-xl p-6 shadow">
               <h2 className="text-xl font-bold mb-4">{t('docs.adminGuide')}</h2>
               <div className="space-y-6">
                 <section>
                   <h3 className="text-lg font-semibold mb-2">{t('docs.adminOverview')}</h3>
                   <p>{t('docs.adminOverviewDesc')}</p>
                 </section>
                 
                 <section>
                   <h3 className="text-lg font-semibold mb-2">{t('docs.userManagement')}</h3>
                   <p>{t('docs.userManagementDesc')}</p>
                   <ul className="list-disc ml-6 mt-2 space-y-1">
                     <li>{t('docs.adminGuideUserCreation')}</li>
                     <li>{t('docs.adminGuideUserRoles')}</li>
                     <li>{t('docs.adminGuideUserPermissions')}</li>
                   </ul>
                 </section>
                 
                 <section>
                   <h3 className="text-lg font-semibold mb-2">{t('docs.centerManagement')}</h3>
                   <p>{t('docs.centerManagementDesc')}</p>
                   <ul className="list-disc ml-6 mt-2 space-y-1">
                     <li>{t('docs.adminGuideCenterCreation')}</li>
                     <li>{t('docs.adminGuideCenterConfiguration')}</li>
                     <li>{t('docs.adminGuideCenterSupervisors')}</li>
                   </ul>
                 </section>
                 
                 <section>
                   <h3 className="text-lg font-semibold mb-2">{t('docs.associationManagement')}</h3>
                   <p>{t('docs.associationManagementDesc')}</p>
                   <ul className="list-disc ml-6 mt-2 space-y-1">
                     <li>{t('docs.adminGuideAssociationCreation')}</li>
                     <li>{t('docs.adminGuideAssociationContracts')}</li>
                     <li>{t('docs.adminGuideAssociationCenters')}</li>
                   </ul>
                 </section>
                 
                 <section>
                   <h3 className="text-lg font-semibold mb-2">{t('docs.programManagement')}</h3>
                   <p>{t('docs.programManagementDesc')}</p>
                   <ul className="list-disc ml-6 mt-2 space-y-1">
                     <li>{t('docs.adminGuideProgramCreation')}</li>
                     <li>{t('docs.adminGuideProgramCourses')}</li>
                     <li>{t('docs.adminGuideProgramAssignment')}</li>
                   </ul>
                 </section>
                 
                 <section>
                   <h3 className="text-lg font-semibold mb-2">{t('docs.financialManagement')}</h3>
                   <p>{t('docs.financialManagementDesc')}</p>
                   <ul className="list-disc ml-6 mt-2 space-y-1">
                     <li>{t('docs.adminGuideBudgeting')}</li>
                     <li>{t('docs.adminGuideExpenseTracking')}</li>
                     <li>{t('docs.adminGuideFinancialReports')}</li>
                   </ul>
                 </section>
                 
                 <section>
                   <h3 className="text-lg font-semibold mb-2">{t('docs.analyticsReporting')}</h3>
                   <p>{t('docs.analyticsReportingDesc')}</p>
                   <ul className="list-disc ml-6 mt-2 space-y-1">
                     <li>{t('docs.adminGuideAnalyticsDashboard')}</li>
                     <li>{t('docs.adminGuideCustomReports')}</li>
                     <li>{t('docs.adminGuideDataExport')}</li>
                   </ul>
                 </section>
               </div>
             </Tab.Panel>
             
             {/* API Documentation */}
             <Tab.Panel className="bg-white rounded-xl p-6 shadow">
               <h2 className="text-xl font-bold mb-4">{t('docs.apiDocs')}</h2>
               <div className="space-y-6">
                 <section>
                   <h3 className="text-lg font-semibold mb-2">{t('docs.apiOverview')}</h3>
                   <p>{t('docs.apiOverviewDesc')}</p>
                   <p className="mt-2">
                     <a 
                       href="/api/docs/" 
                       target="_blank" 
                       rel="noreferrer" 
                       className="text-blue-600 hover:text-blue-800 flex items-center"
                     >
                       {t('docs.apiDocsLink')}
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                         <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                       </svg>
                     </a>
                   </p>
                 </section>
                 
                 <section>
                   <h3 className="text-lg font-semibold mb-2">{t('docs.authentication')}</h3>
                   <p>{t('docs.authenticationDesc')}</p>
                   <pre className="bg-gray-100 p-4 rounded-md mt-2 overflow-x-auto">
                     <code>
                       {`POST /api/auth/token/
                          {
                            "username": "example_user",
                            "password": "securepassword"
                          }

                          // Response
                          {
                            "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                            "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                          }`}
                     </code>
                   </pre>
                 </section>
                 
                 <section>
                   <h3 className="text-lg font-semibold mb-2">{t('docs.endpoints')}</h3>
                   <p>{t('docs.endpointsDesc')}</p>
                   
                   <div className="mt-4 border rounded-md">
                     <div className="border-b p-2 bg-gray-50 font-medium">
                       {t('docs.userEndpoints')}
                     </div>
                     <div className="p-2">
                       <ul className="space-y-1">
                         <li><code>GET /api/accounts/profile/</code> - {t('docs.apiGetProfile')}</li>
                         <li><code>PUT /api/accounts/profile/</code> - {t('docs.apiUpdateProfile')}</li>
                         <li><code>POST /api/accounts/change-password/</code> - {t('docs.apiChangePassword')}</li>
                       </ul>
                     </div>
                   </div>
                   
                   <div className="mt-4 border rounded-md">
                     <div className="border-b p-2 bg-gray-50 font-medium">
                       {t('docs.studentEndpoints')}
                     </div>
                     <div className="p-2">
                       <ul className="space-y-1">
                         <li><code>GET /api/students/enrollments/my-enrollments/</code> - {t('docs.apiGetEnrollments')}</li>
                         <li><code>GET /api/exams/results/my-results/</code> - {t('docs.apiGetResults')}</li>
                         <li><code>GET /api/attendance/records/my-attendance/</code> - {t('docs.apiGetAttendance')}</li>
                       </ul>
                     </div>
                   </div>
                   
                   <div className="mt-4 border rounded-md">
                     <div className="border-b p-2 bg-gray-50 font-medium">
                       {t('docs.trainerEndpoints')}
                     </div>
                     <div className="p-2">
                       <ul className="space-y-1">
                         <li><code>GET /api/programs/courses/my-courses/</code> - {t('docs.apiGetCourses')}</li>
                         <li><code>GET /api/programs/courses/{'{id}'}/students/</code> - {t('docs.apiGetCourseStudents')}</li>
                         <li><code>POST /api/attendance/sessions/</code> - {t('docs.apiCreateSession')}</li>
                         <li><code>POST /api/exams/</code> - {t('docs.apiCreateExam')}</li>
                       </ul>
                     </div>
                   </div>
                 </section>
                 
                 <section>
                   <h3 className="text-lg font-semibold mb-2">{t('docs.models')}</h3>
                   <p>{t('docs.modelsDesc')}</p>
                   <p className="mt-2">
                     {t('docs.modelsNote')}
                   </p>
                 </section>
               </div>
             </Tab.Panel>
           </Tab.Panels>
         </Tab.Group>
       </div>
     );
   };
   
   export default Documentation;
   ```

## Enhanced Features Summary

1. **Analytics and Reporting**
   - Dashboard visualizations for enrollment trends, program success rates, and performance metrics
   - Student, center, and trainer performance tracking
   - Custom reporting tools with export capabilities
   - Geographic distribution mapping of centers and students

2. **Attendance Management**
   - Digital attendance tracking for all training sessions
   - Student attendance history and statistics
   - Attendance reports and analytics for supervisors
   - Automated absence threshold alerts

3. **Digital Resource Library**
   - Centralized repository for training materials
   - Role-based access to educational resources
   - Upload and download functionality for various file types
   - Categorization and search capabilities for learning materials

4. **Student Performance Tracking**
   - Comprehensive student performance dashboards
   - Skills matrix for competency-based evaluations
   - Visual progress indicators for student development
   - Performance improvement recommendations

5. **Feedback and Evaluation System**
   - Course and trainer rating mechanisms
   - Detailed feedback forms for continuous improvement
   - Analytics on feedback sentiment and trends
   - Program improvement based on student suggestions

6. **Calendar and Scheduling System**
   - Integrated calendar for courses, exams, and events
   - Schedule conflict detection and notification
   - Personal calendars for students and trainers
   - Event categorization and filtering

7. **Financial Management**
   - Program budgeting and cost tracking
   - Expense management by category and center
   - Financial reporting and visualizations
   - Budget versus actual spending analysis

8. **Accessibility Features**
   - High contrast mode for visually impaired users
   - Text size adjustment options
   - Reduced motion settings for users with motion sensitivity
   - Screen reader compatibility

9. **Additional Security**
   - Two-factor authentication
   - Comprehensive audit logging
   - Advanced password policies
   - Session timeout and management

10. **Documentation and Guides**
    - Detailed user guides for all roles
    - API documentation for developers
    - System administration manuals
    - Help resources integrated throughout the application

By incorporating these enhanced features, the Entraide National Management System becomes a comprehensive platform that not only manages basic educational operations but provides advanced tools for analysis, communication, accessibility, and effective resource management.

## Summary of Implementation Plan

This comprehensive plan covers all aspects of developing the enhanced Entraide National management system:

1. **Days 1-3**: Project setup, database design, and planning
2. **Days 4-7**: Backend development with Django REST Framework
3. **Days 8-12**: Frontend development with React
4. **Days 13-15**: Enhanced features, testing, documentation, and deployment

Each day has clear deliverables, and the architecture is designed to accommodate future scaling. The database design captures the complex relationships between entities, and the role-based access control ensures proper security throughout the system.

The enhanced features address the complete lifecycle of training program management, from enrollment and attendance to performance tracking and analytics, making this a truly comprehensive solution for Entraide National's needs.