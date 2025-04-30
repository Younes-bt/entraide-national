from django.db import models
from accounts.models import User
from cloudinary.models import CloudinaryField



class Association(models.Model):
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
    contract_start_date = models.DateField(null=True, blank=True)
    contract_end_date = models.DateField(null=True, blank=True)
    registration_number = models.CharField(max_length=50, unique=True, blank=True, null=True)  # Unique registration number
    


    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
