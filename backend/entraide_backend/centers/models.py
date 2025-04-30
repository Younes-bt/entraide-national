from django.db import models
from accounts.models import User
from cloudinary.models import CloudinaryField
from django.core.validators import MinValueValidator


class Equipment(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    condition = models.CharField(max_length=50, choices=[
        ('new', 'New'),
        ('excellent', 'Excellent'),
        ('good', 'Good'),
        ('fair', 'Fair'),
        ('need_reparation', 'Needs Repair'),
        ('damaged', 'Damaged'),
    ])
    quantity = models.IntegerField(validators=[MinValueValidator(0)])
    picture = CloudinaryField('image', blank=True, null=True)

    # Assuming that each equipment is associated with a center and a room
    center = models.ForeignKey('Center', on_delete=models.CASCADE, related_name='equipments')
    room = models.ForeignKey('Room', on_delete=models.SET_NULL, related_name='equipments', null=True, blank=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Equipment'
        verbose_name_plural = 'Equipment'
        ordering = ['name']

    def __str__(self):
        return self.name

class Room(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    type = models.CharField(max_length=50, choices=[
        ('classroom', 'Classroom'),
        ('meeting_room', 'Meeting Room'),
        ('auditorium', 'Auditorium'),
        ('lab', 'Lab'),
        ('other', 'Other'),
    ])
    capacity = models.IntegerField()
    is_available = models.BooleanField(default=True)
    picture = CloudinaryField('image', blank=True, null=True)
    center = models.ForeignKey('Center', on_delete=models.CASCADE, related_name='rooms')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Room'
        verbose_name_plural = 'Rooms'
        ordering = ['capacity']

    def __str__(self):
        return self.name

class Center(models.Model):
    # profile fields
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    logo = CloudinaryField('logo', blank=True, null=True)

    # contact information
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(max_length=255, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    maps_link = models.URLField(max_length=255, blank=True, null=True)

    # social media links
    # These fields can be blank or null if the association does not have them
    website = models.URLField(max_length=255, blank=True, null=True)
    facebook_link = models.URLField(max_length=255, blank=True, null=True)
    instagram_link = models.URLField(max_length=255, blank=True, null=True)
    twitter_link = models.URLField(max_length=255, blank=True, null=True)

    # management fields
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    supervisor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='supervised_associations', null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Center'
        verbose_name_plural = 'Centers'
        ordering = ['city']
    

    def __str__(self):
        return self.name
