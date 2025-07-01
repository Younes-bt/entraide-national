from django.contrib import admin
from .models import Course, Unit, Section, Lesson, Practice, Question, QuestionOption


class UnitInline(admin.TabularInline):
    model = Unit
    extra = 1
    fields = ('name', 'description', 'order')


class SectionInline(admin.TabularInline):
    model = Section
    extra = 1
    fields = ('name', 'description', 'order')


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1
    fields = ('title', 'lesson_type', 'order', 'duration_minutes')


class QuestionOptionInline(admin.TabularInline):
    model = QuestionOption
    extra = 4
    fields = ('option_text', 'is_correct', 'order')


class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1
    fields = ('question_text', 'question_type', 'points', 'order')


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'order', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'description')
    list_editable = ('is_active', 'order')
    inlines = [UnitInline]
    
    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'cover_image')
        }),
        ('Settings', {
            'fields': ('is_active', 'order')
        }),
    )


@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = ('name', 'course', 'order', 'created_at')
    list_filter = ('course', 'created_at')
    search_fields = ('name', 'description', 'course__name')
    list_editable = ('order',)
    inlines = [SectionInline]


@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ('name', 'unit', 'order', 'created_at')
    list_filter = ('unit__course', 'unit', 'created_at')
    search_fields = ('name', 'description', 'unit__name', 'unit__course__name')
    list_editable = ('order',)
    inlines = [LessonInline]
    
    fieldsets = (
        (None, {
            'fields': ('unit', 'name', 'description', 'about', 'order')
        }),
    )


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'lesson_type', 'section', 'order', 'duration_minutes')
    list_filter = ('lesson_type', 'section__unit__course', 'created_at')
    search_fields = ('title', 'text_content', 'section__name')
    list_editable = ('order', 'duration_minutes')
    
    fieldsets = (
        (None, {
            'fields': ('section', 'title', 'lesson_type', 'order', 'duration_minutes')
        }),
        ('Content', {
            'fields': ('text_content', 'video_url', 'pdf_file', 'external_url'),
            'description': 'Fill in the appropriate field based on lesson type'
        }),
    )


@admin.register(Practice)
class PracticeAdmin(admin.ModelAdmin):
    list_display = ('section', 'created_at')
    list_filter = ('section__unit__course', 'created_at')
    search_fields = ('section__name', 'instructions')
    inlines = [QuestionInline]


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('question_text_short', 'question_type', 'practice', 'points', 'order')
    list_filter = ('question_type', 'practice__section__unit__course', 'created_at')
    search_fields = ('question_text', 'practice__section__name')
    list_editable = ('points', 'order')
    inlines = [QuestionOptionInline]
    
    def question_text_short(self, obj):
        return obj.question_text[:50] + "..." if len(obj.question_text) > 50 else obj.question_text
    question_text_short.short_description = 'Question'


@admin.register(QuestionOption)
class QuestionOptionAdmin(admin.ModelAdmin):
    list_display = ('option_text_short', 'question_short', 'is_correct', 'order')
    list_filter = ('is_correct', 'question__question_type', 'created_at')
    search_fields = ('option_text', 'question__question_text')
    list_editable = ('is_correct', 'order')
    
    def option_text_short(self, obj):
        return obj.option_text[:30] + "..." if len(obj.option_text) > 30 else obj.option_text
    option_text_short.short_description = 'Option'
    
    def question_short(self, obj):
        return obj.question.question_text[:30] + "..." if len(obj.question.question_text) > 30 else obj.question.question_text
    question_short.short_description = 'Question'
