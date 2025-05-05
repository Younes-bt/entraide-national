from django.db import models
from programs.models import TrainingPrograme, WeeklyCoursePlan
from accounts.models import User


class Question(models.Model):
    training = models.ForeignKey(TrainingPrograme, on_delete=models.CASCADE, related_name='questions')
    week = models.ForeignKey(WeeklyCoursePlan, on_delete=models.CASCADE, related_name='questions')
    TYPE_CHOICES = [
        ('MCQ', 'Multiple Choice Question'),
        ('TF', 'True/False'),
        ('SA', 'Short Answer'),
        ('LA', 'Long Answer'),
        ('FIB', 'Fill in the Blanks'),
        ('MA', 'Matching'),
    ]
    type = models.CharField(max_length=3, choices=TYPE_CHOICES)  # Increased max_length to 3
    question_text = models.TextField()
    options = models.JSONField(null=True, blank=True)  # For MCQ options
    correct_answer = models.TextField(null=True, blank=True)  # For MCQ correct answer
    points = models.FloatField(default=1.0)  # Add points field with default value
    added_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='added_questions')
    created_at = models.DateTimeField(auto_now_add=True)   
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.question_text[:50]}..."


class Exam(models.Model):
    EXAM_TYPE_CHOICES = [
        ('term1_theory', 'Term 1 Theory'),
        ('term1_practical', 'Term 1 Practical'),
        ('term2_theory', 'Term 2 Theory'),
        ('term2_practical', 'Term 2 Practical'),
    ]
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('completed', 'Completed'),
    ]
    exam_type = models.CharField(max_length=20, choices=EXAM_TYPE_CHOICES)
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='exams')
    training = models.ForeignKey(TrainingPrograme, on_delete=models.CASCADE, related_name='exams')
    questions = models.ManyToManyField(Question, related_name='exams')
    score = models.FloatField(null=True, blank=True)  # Score out of 100
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    total_points = models.FloatField(default=0)  # Total possible points
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def calculate_score(self):
        submissions = self.submissions.all()
        earned_points = sum(submission.points or 0 for submission in submissions)
        possible_points = sum(question.points for question in self.questions.all())
        
        if possible_points > 0:
            self.score = (earned_points / possible_points) * 100
        else:
            self.score = 0
            
        self.total_points = possible_points
        self.save()
        return self.score
    
    def __str__(self):
        return f"{self.exam_type} - {self.student.first_name} {self.student.last_name}"
    
    def get_questions(self):
        return self.questions.all()


class Submission(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submissions')
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='submissions')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='submissions')
    student_answer = models.JSONField()  # Student's answer
    points = models.FloatField(null=True, blank=True)  # Points awarded for the answer
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['student', 'exam', 'question']

    def __str__(self):
        return f"Submission by {self.student.first_name} {self.student.last_name} for {self.exam.exam_type}"
    
    def check_answer(self):
        if self.question.type == 'MCQ':
            # For MCQ, compare selected option(s) with correct answer
            if str(self.student_answer) == str(self.question.correct_answer):
                self.points = self.question.points
            else:
                self.points = 0
        elif self.question.type == 'TF':
            # For True/False, direct comparison should work
            if str(self.student_answer).lower() == str(self.question.correct_answer).lower():
                self.points = self.question.points
            else:
                self.points = 0
        elif self.question.type in ['SA', 'LA']:
            # For text answers, potentially need manual grading
            # Set to null to indicate manual grading needed
            pass
        else:
            self.points = 0
            
        self.save()
        return self.points

