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
    profile_picture = CloudinaryField('image', blank=True, null=True)
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

