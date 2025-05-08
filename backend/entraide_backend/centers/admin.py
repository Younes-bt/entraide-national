from django.contrib import admin
from .models import Equipment, Room, Center, Group

# Register your models here.
admin.site.register(Equipment)
admin.site.register(Room)
admin.site.register(Center)
admin.site.register(Group)
