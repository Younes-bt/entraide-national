from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CourseViewSet,
    UnitViewSet,
    SectionViewSet,
    LessonViewSet,
    PracticeViewSet,
    QuestionViewSet,
    QuestionOptionViewSet
)

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'units', UnitViewSet, basename='unit')
router.register(r'sections', SectionViewSet, basename='section')
router.register(r'lessons', LessonViewSet, basename='lesson')
router.register(r'practice', PracticeViewSet, basename='practice')
router.register(r'questions', QuestionViewSet, basename='question')
router.register(r'question-options', QuestionOptionViewSet, basename='questionoption')

urlpatterns = [
    path('', include(router.urls)),
] 