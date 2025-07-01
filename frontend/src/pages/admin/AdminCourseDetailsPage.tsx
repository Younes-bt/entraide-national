import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  BookOpen, 
  Users, 
  PlayCircle, 
  FileText, 
  ExternalLink, 
  HelpCircle,
  Edit,
  Plus,
  Eye,
  Clock
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

interface Course {
  id: number;
  name: string;
  description: string;
  cover_image?: string;
  is_active: boolean;
  order: number;
  units: Unit[];
  created_at: string;
  updated_at: string;
}

interface Unit {
  id: number;
  name: string;
  description: string;
  order: number;
  sections: Section[];
  created_at: string;
  updated_at: string;
}

interface Section {
  id: number;
  name: string;
  description: string;
  about: string;
  order: number;
  lessons: Lesson[];
  practice?: Practice;
  created_at: string;
  updated_at: string;
}

interface Lesson {
  id: number;
  title: string;
  lesson_type: 'video' | 'pdf' | 'text' | 'link';
  text_content?: string;
  video_url?: string;
  pdf_file?: string;
  external_url?: string;
  order: number;
  duration_minutes?: number;
}

interface Practice {
  id: number;
  instructions: string;
  questions: Question[];
}

interface Question {
  id: number;
  question_text: string;
  question_type: 'mcq' | 'true_false' | 'short_answer';
  points: number;
  order: number;
  explanation: string;
  options: QuestionOption[];
}

interface QuestionOption {
  id: number;
  option_text: string;
  is_correct: boolean;
  order: number;
}

const AdminCourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuth();

  useEffect(() => {
    const fetchCourse = async () => {
      if (!accessToken || !id) return;

      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/courses/courses/${id}/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch course: ${response.status}`);
        }

        const data = await response.json();
        setCourse(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [accessToken, id]);

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayCircle className="w-4 h-4" />;
      case 'pdf': return <FileText className="w-4 h-4" />;
      case 'link': return <ExternalLink className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getLessonTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
      case 'pdf': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200';
      case 'link': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading course details...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  if (!course) {
    return <div className="p-6">Course not found</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate('/admin/training-programs')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{course.name}</h1>
          <p className="text-muted-foreground mt-1">{course.description}</p>
        </div>
        <Badge variant={course.is_active ? "default" : "secondary"}>
          {course.is_active ? "Active" : "Inactive"}
        </Badge>
        <Button variant="outline" asChild>
          <Link to={`/admin/courses/${course.id}/units/add`}>
            <Plus className="w-4 h-4 mr-2" />
            Add Unit
          </Link>
        </Button>
        <Button asChild>
          <Link to={`/admin/courses/${course.id}/edit`}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Course
          </Link>
        </Button>
      </div>

      {/* Course Cover */}
      {course.cover_image && (
        <div className="mb-6">
          <img 
            src={course.cover_image} 
            alt={course.name}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Units */}
      {course.units.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No units yet</h3>
            <p className="text-muted-foreground mb-4">
              Start building your course by adding units and sections.
            </p>
            <Button asChild>
              <Link to={`/admin/courses/${course.id}/units/add`}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Unit
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {course.units.map((unit, unitIndex) => (
            <Card key={unit.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Unit {unit.order + 1}: {unit.name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {unit.description}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/admin/courses/${course.id}/units/${unit.id}/sections/add`}>
                        <Plus className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/admin/courses/${course.id}/units/${unit.id}/edit`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {unit.sections.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No sections in this unit yet</p>
                    <Button variant="outline" asChild>
                      <Link to={`/admin/courses/${course.id}/units/${unit.id}/sections/add`}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Section
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {unit.sections.map((section, sectionIndex) => (
                      <div key={section.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            Section {section.order + 1}: {section.name}
                          </h4>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/admin/courses/${course.id}/sections/${section.id}/edit`}>
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                        </div>
                        
                        {section.description && (
                          <p className="text-sm text-muted-foreground mb-3">
                            {section.description}
                          </p>
                        )}

                        {section.about && (
                          <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded mb-3 border border-blue-200 dark:border-blue-800">
                            <p className="text-sm text-blue-900 dark:text-blue-100">{section.about}</p>
                          </div>
                        )}

                        {/* Lessons */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-medium text-sm">
                              Lessons ({section.lessons.length})
                            </h5>
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/admin/courses/${course.id}/sections/${section.id}/lessons/add`}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Lesson
                              </Link>
                            </Button>
                          </div>
                          
                          {section.lessons.length > 0 ? (
                            <div className="grid gap-2">
                              {section.lessons.map((lesson) => (
                                <div 
                                  key={lesson.id} 
                                  className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                  onClick={() => navigate(`/admin/courses/${course.id}/lessons/${lesson.id}`)}
                                >
                                  <div className={`p-1 rounded ${getLessonTypeColor(lesson.lesson_type)}`}>
                                    {getLessonIcon(lesson.lesson_type)}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{lesson.title}</p>
                                    {lesson.duration_minutes && (
                                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {lesson.duration_minutes} min
                                      </p>
                                    )}
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {lesson.lesson_type}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                              <p className="text-sm text-muted-foreground">No lessons yet</p>
                            </div>
                          )}
                        </div>

                        {/* Practice */}
                        {section.practice && (
                          <div>
                            <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                              <HelpCircle className="w-4 h-4" />
                              Practice ({section.practice.questions.length} questions)
                            </h5>
                            {section.practice.instructions && (
                              <p className="text-sm text-muted-foreground mb-2">
                                {section.practice.instructions}
                              </p>
                            )}
                            <div className="space-y-2">
                              {section.practice.questions.map((question) => (
                                <div key={question.id} className="p-2 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded">
                                  <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                                    Q{question.order + 1}: {question.question_text}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      {question.question_type}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {question.points} points
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {question.options.length} options
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {!section.practice && (
                          <div className="text-center py-3">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/admin/courses/${course.id}/sections/${section.id}/practice/add`}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Practice
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Unit Button */}
      {course.units.length > 0 && (
        <div className="mt-6">
          <Button asChild>
            <Link to={`/admin/courses/${course.id}/units/add`}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Unit
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminCourseDetailsPage; 