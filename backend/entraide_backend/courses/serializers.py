from rest_framework import serializers
from .models import Course, Unit, Section, Lesson, Practice, Question, QuestionOption


class QuestionOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionOption
        fields = ['id', 'option_text', 'is_correct', 'order', 'created_at', 'updated_at']


class QuestionSerializer(serializers.ModelSerializer):
    options = QuestionOptionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Question
        fields = ['id', 'question_text', 'question_type', 'points', 'order', 
                 'explanation', 'options', 'created_at', 'updated_at']


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'lesson_type', 'text_content', 'video_url', 
                 'pdf_file', 'external_url', 'order', 'duration_minutes', 
                 'created_at', 'updated_at']
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Handle cloudinary PDF file URL
        if instance.pdf_file and hasattr(instance.pdf_file, 'url'):
            representation['pdf_file'] = instance.pdf_file.url
        elif 'pdf_file' in representation:
            representation['pdf_file'] = None
        return representation


class PracticeSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Practice
        fields = ['id', 'instructions', 'questions', 'created_at', 'updated_at']


class SectionSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    practice = PracticeSerializer(read_only=True)
    
    class Meta:
        model = Section
        fields = ['id', 'name', 'description', 'about', 'order', 'lessons', 'practice', 
                 'created_at', 'updated_at']


class UnitSerializer(serializers.ModelSerializer):
    sections = SectionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Unit
        fields = ['id', 'name', 'description', 'order', 'sections', 
                 'created_at', 'updated_at']


class CourseSerializer(serializers.ModelSerializer):
    units = UnitSerializer(many=True, read_only=True)
    
    class Meta:
        model = Course
        fields = ['id', 'name', 'description', 'cover_image', 'is_active', 
                 'order', 'units', 'created_at', 'updated_at']
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Handle cloudinary cover image URL
        if instance.cover_image and hasattr(instance.cover_image, 'url'):
            representation['cover_image'] = instance.cover_image.url
        elif 'cover_image' in representation:
            representation['cover_image'] = None
        return representation


# Simplified serializers for list views (without nested data)
class CourseListSerializer(serializers.ModelSerializer):
    units_count = serializers.SerializerMethodField()
    program = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = Course
        fields = ['id', 'name', 'description', 'cover_image', 'is_active', 
                 'order', 'units_count', 'created_at', 'updated_at', 'program']
    
    def get_units_count(self, obj):
        return obj.units.count()
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Handle cloudinary cover image URL
        if instance.cover_image and hasattr(instance.cover_image, 'url'):
            representation['cover_image'] = instance.cover_image.url
        elif 'cover_image' in representation:
            representation['cover_image'] = None
        return representation


class UnitListSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.name', read_only=True)
    sections_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Unit
        fields = ['id', 'name', 'description', 'order', 'course_name', 
                 'sections_count', 'created_at', 'updated_at']
    
    def get_sections_count(self, obj):
        return obj.sections.count()


class SectionListSerializer(serializers.ModelSerializer):
    unit_name = serializers.CharField(source='unit.name', read_only=True)
    course_name = serializers.CharField(source='unit.course.name', read_only=True)
    lessons_count = serializers.SerializerMethodField()
    has_practice = serializers.SerializerMethodField()
    
    class Meta:
        model = Section
        fields = ['id', 'name', 'description', 'about', 'order', 'unit_name', 
                 'course_name', 'lessons_count', 'has_practice', 'created_at', 'updated_at']
    
    def get_lessons_count(self, obj):
        return obj.lessons.count()
    
    def get_has_practice(self, obj):
        return hasattr(obj, 'practice')


# Create/Update serializers (without nested read-only fields)
class CourseCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['name', 'description', 'cover_image', 'is_active', 'order']


class UnitCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = ['course', 'name', 'description', 'order']


class SectionCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ['unit', 'name', 'description', 'about', 'order']


class LessonCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['section', 'title', 'lesson_type', 'text_content', 'video_url', 
                 'pdf_file', 'external_url', 'order', 'duration_minutes']


class PracticeCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Practice
        fields = ['section', 'instructions']


class QuestionCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['practice', 'question_text', 'question_type', 'points', 
                 'order', 'explanation']


class QuestionOptionCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionOption
        fields = ['question', 'option_text', 'is_correct', 'order'] 