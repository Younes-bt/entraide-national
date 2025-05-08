from django.shortcuts import render
from rest_framework import viewsets
from .models import Association
from .serializers import AssociationSerializer

# Create your views here.

class AssociationViewSet(viewsets.ModelViewSet):
    queryset = Association.objects.all()
    serializer_class = AssociationSerializer
