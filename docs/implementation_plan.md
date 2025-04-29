# Entraide National Management System: Detailed Implementation Plan

## Phase 1: Project Setup and Planning (Days 1-3)

### Day 1: Environment Setup & Project Initialization

#### Backend Setup
1. **Create Virtual Environment**
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

2. **Initialize Django Project**
   ```bash
   django-admin startproject entraide_backend .
   ```

3. **Create Core Apps**
   ```bash
   python manage.py startapp accounts
   python manage.py startapp centers
   python manage.py startapp associations
   python manage.py startapp programs
   python manage.py startapp students
   python manage.py startapp exams
   python manage.py startapp api
   ```

4. **Configure PostgreSQL Database**
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
       
       # Local apps
       'accounts',
       'centers',
       'associations',
       'programs',
       'students',
       'exams',
       'api',
   ]
   ```

#### Frontend Setup
1. **Initialize React Project**
   ```bash
   npx create-react-app entraide-frontend
   cd entraide-frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install axios react-router-dom i18next react-i18next @reduxjs/toolkit react-redux
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

1. **User & Authentication Models**
   ```python
   # filepath: accounts/models.py
   from django.db import models
   from django.contrib.auth.models import AbstractUser

   class UserRole(models.TextChoices):
       ADMIN = 'admin', 'Administrator'
       CENTER_SUPERVISOR = 'center_supervisor', 'Center Supervisor'
       ASSOCIATION_SUPERVISOR = 'association_supervisor', 'Association Supervisor'
       TRAINER = 'trainer', 'Trainer'
       STUDENT = 'student', 'Student'

   class User(AbstractUser):
       role = models.CharField(max_length=50, choices=UserRole.choices, default=UserRole.STUDENT)
       phone = models.CharField(max_length=15, blank=True)
       profile_pic = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
       
       # Timestamps
       created_at = models.DateTimeField(auto_now_add=True)
       updated_at = models.DateTimeField(auto_now=True)
       
       def __str__(self):
           return f"{self.username} ({self.get_role_display()})"
   ```

2. **Core Models**
   ```python
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

   ```python
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
   ```python
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

4. **Student Models**
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

5. **Exam Models**
   ```python
   # filepath: exams/models.py
   from django.db import models
   from programs.models import TrainingCourse
   from students.models import Student, Enrollment

   class Exam(models.Model):
       course = models.ForeignKey(TrainingCourse, on_delete=models.CASCADE, related_name='exams')
       name = models.CharField(max_length=255)
       date = models.DateField()
       TYPE_CHOICES = [
           ('midterm', 'Midterm'),
           ('final', 'Final'),
       ]
       exam_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
       passing_score = models.DecimalField(max_digits=5, decimal_places=2)
       
       created_at = models.DateTimeField(auto_now_add=True)
       updated_at = models.DateTimeField(auto_now=True)
       
       def __str__(self):
           return f"{self.name} - {self.course.program.name}"

   class ExamResult(models.Model):
       exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='results')
       enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name='exam_results')
       score = models.DecimalField(max_digits=5, decimal_places=2)
       passed = models.BooleanField(default=False)
       comments = models.TextField(blank=True)
       
       created_at = models.DateTimeField(auto_now_add=True)
       updated_at = models.DateTimeField(auto_now=True)
       
       class Meta:
           unique_together = ['exam', 'enrollment']
           
       def __str__(self):
           return f"{self.enrollment.student.user.get_full_name()} - {self.exam.name}"
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

### Day 7: Exam API & Data Validation

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

2. **Implement Internationalization**
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
     const { login } = useContext(AuthContext);
     const [credentials, setCredentials] = useState({ username: '', password: '' });
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
       
       if (!result.success) {
         setError(result.message);
       }
       
       setLoading(false);
     };
     
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
           ];
         case 'center_supervisor':
           return [
             { to: '/center/dashboard', label: t('nav.dashboard') },
             { to: '/center/students', label: t('nav.students') },
             { to: '/center/trainers', label: t('nav.trainers') },
             { to: '/center/courses', label: t('nav.courses') },
           ];
         case 'association_supervisor':
           return [
             { to: '/association/dashboard', label: t('nav.dashboard') },
             { to: '/association/centers', label: t('nav.centers') },
             { to: '/association/reports', label: t('nav.reports') },
           ];
         case 'trainer':
           return [
             { to: '/trainer/dashboard', label: t('nav.dashboard') },
             { to: '/trainer/courses', label: t('nav.myCourses') },
             { to: '/trainer/students', label: t('nav.myStudents') },
             { to: '/trainer/exams', label: t('nav.exams') },
           ];
         case 'student':
           return [
             { to: '/student/dashboard', label: t('nav.dashboard') },
             { to: '/student/courses', label: t('nav.myCourses') },
             { to: '/student/exams', label: t('nav.myExams') },
             { to: '/student/results', label: t('nav.results') },
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

1. **Admin Dashboard Implementation**
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
       </Routes>
     );
   };
   
   export default AdminDashboard;
   ```

2. **Create Key Admin Components**
   ```javascript
   // filepath: entraide-frontend/src/pages/dashboards/admin/AssociationsList.js
   import React, { useState, useEffect } from 'react';
   import { useTranslation } from 'react-i18next';
   import axios from 'axios';
   import { Button } from '../../../components/ui/button';
   import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/table';
   import { Input } from '../../../components/ui/input';
   
   const AssociationsList = () => {
     const { t } = useTranslation();
     const [associations, setAssociations] = useState([]);
     const [loading, setLoading] = useState(true);
     const [searchTerm, setSearchTerm] = useState('');
     
     useEffect(() => {
       const fetchAssociations = async () => {
         try {
           const response = await axios.get('/api/associations/');
           setAssociations(response.data);
         } catch (error) {
           console.error('Error fetching associations:', error);
         } finally {
           setLoading(false);
         }
       };
       
       fetchAssociations();
     }, []);
     
     const filteredAssociations = associations.filter(association => 
       association.name.toLowerCase().includes(searchTerm.toLowerCase())
     );
     
     if (loading) {
       return <div>Loading...</div>;
     }
     
     return (
       <div className="space-y-6">
         <div className="flex justify-between items-center">
           <h1 className="text-2xl font-bold">{t('associations.title')}</h1>
           <Button>{t('associations.addNew')}</Button>
         </div>
         
         <div>
           <Input
             placeholder={t('common.search')}
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="max-w-sm mb-4"
           />
           
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead>{t('associations.name')}</TableHead>
                 <TableHead>{t('associations.president')}</TableHead>
                 <TableHead>{t('associations.contractDates')}</TableHead>
                 <TableHead>{t('common.actions')}</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {filteredAssociations.map((association) => (
                 <TableRow key={association.id}>
                   <TableCell>{association.name}</TableCell>
                   <TableCell>{association.president_name}</TableCell>
                   <TableCell>
                     {association.contract_start_date} - {association.contract_end_date}
                   </TableCell>
                   <TableCell>
                     <div className="flex space-x-2">
                       <Button variant="outline" size="sm">
                         {t('common.view')}
                       </Button>
                       <Button variant="outline" size="sm">
                         {t('common.edit')}
                       </Button>
                     </div>
                   </TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
         </div>
       </div>
     );
   };
   
   export default AssociationsList;
   ```

3. **Student Dashboard Implementation**
   ```javascript
   // filepath: entraide-frontend/src/pages/dashboards/student/StudentDashboard.js
   import React from 'react';
   import { Routes, Route } from 'react-router-dom';
   
   import StudentOverview from './StudentOverview';
   import MyCourses from './MyCourses';
   import MyExams from './MyExams';
   import MyResults from './MyResults';
   
   const StudentDashboard = () => {
     return (
       <Routes>
         <Route path="/" element={<StudentOverview />} />
         <Route path="dashboard" element={<StudentOverview />} />
         <Route path="courses" element={<MyCourses />} />
         <Route path="exams" element={<MyExams />} />
         <Route path="results" element={<MyResults />} />
       </Routes>
     );
   };
   
   export default StudentDashboard;
   ```

### Day 12: Internationalization & Responsive Design

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
       "myStudents": "My Students"
     },
     "login": {
       "title": "Welcome Back",
       "subtitle": "Sign in to your account",
       "username": "Username",
       "password": "Password",
       "loginButton": "Sign In",
       "loggingIn": "Signing In...",
       "forgotPassword": "Forgot Password?"
     },
     "associations": {
       "title": "Associations",
       "addNew": "Add Association",
       "name": "Name",
       "president": "President",
       "contractDates": "Contract Dates"
     }
   }
   ```

## Phase 4: Testing, Deployment & Documentation (Days 13-15)

### Day 13: Integration Testing & Bug Fixing

1. **Write Basic Tests**
   ```python
   # filepath: accounts/tests.py
   from django.test import TestCase
   from django.urls import reverse
   from rest_framework.test import APIClient
   from rest_framework import status
   from accounts.models import User, UserRole
   
   class UserAPITest(TestCase):
       def setUp(self):
           # Create test admin user
           self.admin_user = User.objects.create_user(
               username='admin_test',
               password='testpass123',
               email='admin@test.com',
               role=UserRole.ADMIN
           )
           
           # Create test student
           self.student_user = User.objects.create_user(
               username='student_test',
               password='testpass123',
               email='student@test.com',
               role=UserRole.STUDENT
           )
           
           self.client = APIClient()
           
       def test_admin_can_list_users(self):
           # Login as admin
           self.client.force_authenticate(user=self.admin_user)
           
           # Make request
           response = self.client.get(reverse('user-list'))
           
           # Check status code
           self.assertEqual(response.status_code, status.HTTP_200_OK)
           
           # Check that both users are in the response
           self.assertEqual(len(response.data), 2)
           
       def test_student_cannot_list_users(self):
           # Login as student
           self.client.force_authenticate(user=self.student_user)
           
           # Make request
           response = self.client.get(reverse('user-list'))
           
           # Check that access is forbidden
           self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
   ```

2. **React Component Testing**
   ```javascript
   // filepath: entraide-frontend/src/components/navigation/Sidebar.test.js
   import { render, screen } from '@testing-library/react';
   import { BrowserRouter } from 'react-router-dom';
   import Sidebar from './Sidebar';
   
   // Mock translation hook
   jest.mock('react-i18next', () => ({
     useTranslation: () => ({
       t: (key) => key,
     }),
   }));
   
   describe('Sidebar', () => {
     test('renders admin navigation items', () => {
       render(
         <BrowserRouter>
           <Sidebar userRole="admin" />
         </BrowserRouter>
       );
       
       expect(screen.getByText('nav.dashboard')).toBeInTheDocument();
       expect(screen.getByText('nav.associations')).toBeInTheDocument();
       expect(screen.getByText('nav.centers')).toBeInTheDocument();
       expect(screen.getByText('nav.programs')).toBeInTheDocument();
       expect(screen.getByText('nav.users')).toBeInTheDocument();
       expect(screen.getByText('nav.reports')).toBeInTheDocument();
     });
     
     test('renders student navigation items', () => {
       render(
         <BrowserRouter>
           <Sidebar userRole="student" />
         </BrowserRouter>
       );
       
       expect(screen.getByText('nav.dashboard')).toBeInTheDocument();
       expect(screen.getByText('nav.myCourses')).toBeInTheDocument();
       expect(screen.getByText('nav.myExams')).toBeInTheDocument();
       expect(screen.getByText('nav.results')).toBeInTheDocument();
       
       // Ensure admin items are not present
       expect(screen.queryByText('nav.associations')).not.toBeInTheDocument();
     });
   });
   ```

### Day 14: API Documentation & Final Fixes

1. **Add API Documentation with Swagger/OpenAPI**
   ```python
   # filepath: entraide_backend/settings.py
   INSTALLED_APPS = [
       # ...existing apps
       'drf_yasg',
   ]
   
   # filepath: entraide_backend/urls.py
   from django.contrib import admin
   from django.urls import path, include
   from django.conf import settings
   from django.conf.urls.static import static
   from rest_framework import permissions
   from drf_yasg.views import get_schema_view
   from drf_yasg import openapi
   
   schema_view = get_schema_view(
      openapi.Info(
         title="Entraide National API",
         default_version='v1',
         description="API documentation for Entraide National platform",
         contact=openapi.Contact(email="contact@entraidenational.ma"),
         license=openapi.License(name="Proprietary"),
      ),
      public=True,
      permission_classes=[permissions.IsAdminUser],
   )
   
   urlpatterns = [
       path('admin/', admin.site.urls),
       path('api/', include('api.urls')),
       
       # API documentation
       path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
       path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
   ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
   ```

2. **Create README.md**
   ```markdown
   # Entraide National Management System

   A comprehensive management system for Morocco's Entraide National organization to digitize and streamline the training programs workflow.

   ## Features

   - User management with role-based access control
   - Association and center management
   - Training programs and courses management
   - Student enrollment and tracking
   - Exam and certification management
   - Multilingual support (Arabic, French, English, Amazigh)

   ## Technology Stack

   ### Backend
   - Django & Django REST Framework
   - PostgreSQL database
   - JWT Authentication
   - Cloudinary for media storage

   ### Frontend
   - React.js
   - Tailwind CSS
   - Shadcn UI components
   - i18next for internationalization

   ## Development Setup

   ### Prerequisites
   - Python 3.8+
   - Node.js 14+
   - PostgreSQL
   - Cloudinary account

   ### Backend Setup
   1. Clone the repository
   2. Create and activate a virtual environment
   3. Install dependencies: `pip install -r requirements.txt`
   4. Create `.env` file with necessary environment variables
   5. Run migrations: `python manage.py migrate`
   6. Create a superuser: `python manage.py createsuperuser`
   7. Run the server: `python manage.py runserver`

   ### Frontend Setup
   1. Navigate to the frontend directory: `cd entraide-frontend`
   2. Install dependencies: `npm install`
   3. Create `.env` file with necessary environment variables
   4. Run the development server: `npm start`

   ## API Documentation
   
   API documentation is available at `/api/docs/` when the server is running.

   ## Deployment

   The application is deployed on Render.com:
   - Backend: [https://entraide-api.onrender.com](https://entraide-api.onrender.com)
   - Frontend: [https://entraide-app.onrender.com](https://entraide-app.onrender.com)
   ```

### Day 15: Deployment to Render.com

1. **Prepare Backend for Deployment**
   ```python
   # filepath: requirements.txt
   # Add deployment requirements
   gunicorn==20.1.0
   whitenoise==6.2.0
   dj-database-url==1.0.0
   ```

   ```python
   # filepath: entraide_backend/settings.py
   # Add deployment settings
   import dj_database_url

   DEBUG = os.environ.get('DEBUG', 'False') == 'True'
   
   ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')
   
   # Update database settings for Render
   if 'DATABASE_URL' in os.environ:
       DATABASES['default'] = dj_database_url.config(
           conn_max_age=600,
           ssl_require=True
       )
       
   # Static files
   STATIC_URL = '/static/'
   STATIC_ROOT = BASE_DIR / 'staticfiles'
   
   # Whitenoise for static files
   MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')
   STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
   
   # CORS settings
   CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', 'http://localhost:3000').split(',')
   ```

2. **Prepare Frontend for Deployment**
   ```javascript
   // filepath: entraide-frontend/.env.production
   REACT_APP_API_URL=https://entraide-api.onrender.com/api
   ```

   ```javascript
   // filepath: entraide-frontend/src/services/api.js
   import axios from 'axios';

   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

   const api = axios.create({
     baseURL: API_URL,
     headers: {
       'Content-Type': 'application/json',
     },
   });

   // Add request interceptor for JWT token
   api.interceptors.request.use(
     (config) => {
       const token = localStorage.getItem('token');
       if (token) {
         config.headers.Authorization = `Bearer ${token}`;
       }
       return config;
     },
     (error) => {
       return Promise.reject(error);
     }
   );

   // Add response interceptor for token refresh
   api.interceptors.response.use(
     (response) => response,
     async (error) => {
       const originalRequest = error.config;
       
       // If error is 401 and not already retrying
       if (error.response.status === 401 && !originalRequest._retry) {
         originalRequest._retry = true;
         
         try {
           // Get refresh token
           const refreshToken = localStorage.getItem('refreshToken');
           
           if (!refreshToken) {
             // No refresh token, logout user
             localStorage.removeItem('token');
             window.location.href = '/login';
             return Promise.reject(error);
           }
           
           // Get new token
           const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
             refresh: refreshToken
           });
           
           // Update token
           const { access } = response.data;
           localStorage.setItem('token', access);
           
           // Retry original request
           originalRequest.headers.Authorization = `Bearer ${access}`;
           return axios(originalRequest);
         } catch (err) {
           // Error refreshing, logout user
           localStorage.removeItem('token');
           localStorage.removeItem('refreshToken');
           window.location.href = '/login';
           return Promise.reject(err);
         }
       }
       
       return Promise.reject(error);
     }
   );

   export default api;
   ```

3. **Create Render.com Deployment Files**
   ```yaml
   # filepath: render.yaml
   services:
     - type: web
       name: entraide-api
       env: python
       buildCommand: pip install -r requirements.txt && python manage.py collectstatic --noinput
       startCommand: gunicorn entraide_backend.wsgi:application
       envVars:
         - key: PYTHON_VERSION
           value: 3.9.0
         - key: DEBUG
           value: False
         - key: SECRET_KEY
           generateValue: true
         - key: ALLOWED_HOSTS
           value: .onrender.com,localhost,127.0.0.1
         - key: CORS_ALLOWED_ORIGINS
           value: https://entraide-app.onrender.com
         - key: DATABASE_URL
           fromDatabase:
             name: entraide-db
             property: connectionString
         - key: CLOUDINARY_URL
           sync: false
     
     - type: web
       name: entraide-app
       env: static
       buildCommand: npm install && npm run build
       staticPublishPath: ./build
       envVars:
         - key: REACT_APP_API_URL
           value: https://entraide-api.onrender.com/api
     
     - type: postgresql
       name: entraide-db
       ipAllowList: []
       plan: free
   ```

## Summary of Implementation Plan

This comprehensive plan covers all aspects of developing the Entraide National management system:

1. **Days 1-3**: Project setup, database design, and planning
2. **Days 4-7**: Backend development with Django REST Framework
3. **Days 8-12**: Frontend development with React
4. **Days 13-15**: Testing, documentation, and deployment

Each day has clear deliverables, and the architecture is designed to accommodate future scaling. The database design captures the complex relationships between entities, and the role-based access control ensures appropriate permissions for each user type.

By following this plan, the development team can efficiently build a robust system that meets Entraide National's needs within the 15-day timeline.

Similar code found with 4 license types
