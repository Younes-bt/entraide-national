from django.shortcuts import render
from django.http import HttpResponse, Http404
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
import requests
import mimetypes
from .models import Course, Unit, Section, Lesson, Practice, Question, QuestionOption
from .serializers import (
    CourseSerializer, CourseListSerializer, CourseCreateUpdateSerializer,
    UnitSerializer, UnitListSerializer, UnitCreateUpdateSerializer,
    SectionSerializer, SectionListSerializer, SectionCreateUpdateSerializer,
    LessonSerializer, LessonCreateUpdateSerializer,
    PracticeSerializer, PracticeCreateUpdateSerializer,
    QuestionSerializer, QuestionCreateUpdateSerializer,
    QuestionOptionSerializer, QuestionOptionCreateUpdateSerializer
)


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['name', 'description']
    ordering_fields = ['order', 'name', 'created_at']
    ordering = ['order', 'name']

    def get_serializer_class(self):
        if self.action == 'list':
            return CourseListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return CourseCreateUpdateSerializer
        return CourseSerializer

    @action(detail=True, methods=['get'])
    def units(self, request, pk=None):
        """Get all units for a specific course"""
        course = self.get_object()
        units = course.units.all()
        serializer = UnitSerializer(units, many=True)
        return Response(serializer.data)


class UnitViewSet(viewsets.ModelViewSet):
    queryset = Unit.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['course']
    search_fields = ['name', 'description']
    ordering_fields = ['order', 'name', 'created_at']
    ordering = ['order', 'name']

    def get_serializer_class(self):
        if self.action == 'list':
            return UnitListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return UnitCreateUpdateSerializer
        return UnitSerializer

    @action(detail=True, methods=['get'])
    def sections(self, request, pk=None):
        """Get all sections for a specific unit"""
        unit = self.get_object()
        sections = unit.sections.all()
        serializer = SectionSerializer(sections, many=True)
        return Response(serializer.data)


class SectionViewSet(viewsets.ModelViewSet):
    queryset = Section.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['unit', 'unit__course']
    search_fields = ['name', 'description', 'about']
    ordering_fields = ['order', 'name', 'created_at']
    ordering = ['order', 'name']

    def get_serializer_class(self):
        if self.action == 'list':
            return SectionListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return SectionCreateUpdateSerializer
        return SectionSerializer

    @action(detail=True, methods=['get'])
    def lessons(self, request, pk=None):
        """Get all lessons for a specific section"""
        section = self.get_object()
        lessons = section.lessons.all()
        serializer = LessonSerializer(lessons, many=True)
        return Response(serializer.data)


class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['section', 'lesson_type', 'section__unit', 'section__unit__course']
    search_fields = ['title', 'text_content']
    ordering_fields = ['order', 'title', 'created_at', 'duration_minutes']
    ordering = ['order', 'title']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return LessonCreateUpdateSerializer
        return LessonSerializer

    @action(detail=True, methods=['get'])
    def pdf_proxy(self, request, pk=None):
        """Proxy PDF files to handle authentication and CORS issues"""
        lesson = self.get_object()
        
        if lesson.lesson_type != 'pdf' or not lesson.pdf_file:
            raise Http404("PDF file not found")
        
        try:
            # Fetch the PDF file from the original URL
            response = requests.get(lesson.pdf_file, timeout=30)
            response.raise_for_status()
            
            # Create HTTP response with proper headers
            pdf_response = HttpResponse(
                response.content,
                content_type='application/pdf'
            )
            
            # Set headers to allow embedding in iframe
            pdf_response['Content-Disposition'] = f'inline; filename="{lesson.title}.pdf"'
            pdf_response['X-Frame-Options'] = 'SAMEORIGIN'
            pdf_response['Access-Control-Allow-Origin'] = '*'
            pdf_response['Access-Control-Allow-Methods'] = 'GET'
            pdf_response['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'
            
            return pdf_response
            
        except requests.RequestException as e:
            raise Http404(f"Could not fetch PDF file: {str(e)}")


class PracticeViewSet(viewsets.ModelViewSet):
    queryset = Practice.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['section', 'section__unit', 'section__unit__course']
    search_fields = ['instructions', 'section__name']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return PracticeCreateUpdateSerializer
        return PracticeSerializer

    @action(detail=True, methods=['get'])
    def questions(self, request, pk=None):
        """Get all questions for a specific practice"""
        practice = self.get_object()
        questions = practice.questions.all()
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['practice', 'question_type', 'practice__section', 'practice__section__unit', 'practice__section__unit__course']
    search_fields = ['question_text', 'explanation']
    ordering_fields = ['order', 'points', 'created_at']
    ordering = ['order']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return QuestionCreateUpdateSerializer
        return QuestionSerializer

    @action(detail=True, methods=['get'])
    def options(self, request, pk=None):
        """Get all options for a specific question"""
        question = self.get_object()
        options = question.options.all()
        serializer = QuestionOptionSerializer(options, many=True)
        return Response(serializer.data)


class QuestionOptionViewSet(viewsets.ModelViewSet):
    queryset = QuestionOption.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['question', 'is_correct']
    search_fields = ['option_text']
    ordering_fields = ['order', 'created_at']
    ordering = ['order']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return QuestionOptionCreateUpdateSerializer
        return QuestionOptionSerializer
