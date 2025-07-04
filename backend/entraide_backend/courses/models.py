from django.db import models
from cloudinary.models import CloudinaryField
from programs.models import TrainingPrograme


class Course(models.Model):
    """
    Top-level course (ex: infography)
    """
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    cover_image = CloudinaryField('image', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)  # For ordering courses
    program = models.ForeignKey(TrainingPrograme, on_delete=models.CASCADE, null=False, blank=False, related_name='courses_program')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class Unit(models.Model):
    """
    Units within a course (ex: introduction, Photoshop, illustrator, InDesign)
    """
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='units')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)  # For ordering units within course
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'name']
        unique_together = ['course', 'order']

    def __str__(self):
        return f"{self.course.name} - {self.name}"


class Section(models.Model):
    """
    Sections within a unit (ex: What is Photoshop?, Installation and Workspace, Layers)
    """
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name='sections')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    about = models.TextField(blank=True)  # About this section (moved from Learn model)
    order = models.PositiveIntegerField(default=0)  # For ordering sections within unit
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'name']
        unique_together = ['unit', 'order']

    def __str__(self):
        return f"{self.unit.name} - {self.name}"


class Lesson(models.Model):
    """
    Individual lessons within a section (YouTube links, PDF links, text)
    """
    LESSON_TYPES = [
        ('video', 'Video (YouTube)'),
        ('pdf', 'PDF Document'),
        ('text', 'Text Content'),
        ('link', 'External Link'),
    ]
    
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=255)
    lesson_type = models.CharField(max_length=10, choices=LESSON_TYPES)
    
    # Content fields
    text_content = models.TextField(blank=True)  # For text lessons
    video_url = models.URLField(blank=True)  # For YouTube videos
    pdf_file = CloudinaryField('raw', blank=True, null=True)  # For PDF files
    external_url = models.URLField(blank=True)  # For external links
    
    order = models.PositiveIntegerField(default=0)  # For ordering lessons
    duration_minutes = models.PositiveIntegerField(null=True, blank=True)  # Estimated time
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'title']
        unique_together = ['section', 'order']

    def __str__(self):
        return f"{self.section.name} - {self.title}"


class Practice(models.Model):
    """
    Practice content for a section
    """
    section = models.OneToOneField(Section, on_delete=models.CASCADE, related_name='practice')
    instructions = models.TextField(blank=True)  # Instructions for practice
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Practice: {self.section.name}"


class Question(models.Model):
    """
    Questions for practice (QCM - Multiple Choice Questions)
    """
    QUESTION_TYPES = [
        ('mcq', 'Multiple Choice Question'),
        ('true_false', 'True/False'),
        ('short_answer', 'Short Answer'),
    ]
    
    practice = models.ForeignKey(Practice, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES, default='mcq')
    points = models.PositiveIntegerField(default=1)  # Points for this question
    order = models.PositiveIntegerField(default=0)  # For ordering questions
    explanation = models.TextField(blank=True)  # Explanation of the correct answer
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'id']
        unique_together = ['practice', 'order']

    def __str__(self):
        return f"Q{self.order + 1}: {self.question_text[:50]}..."


class QuestionOption(models.Model):
    """
    Options for multiple choice questions
    """
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    option_text = models.CharField(max_length=500)
    is_correct = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)  # For ordering options (A, B, C, D)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']
        unique_together = ['question', 'order']

    def __str__(self):
        return f"{self.question.question_text[:30]}... - Option {self.order + 1}: {self.option_text[:30]}..."
