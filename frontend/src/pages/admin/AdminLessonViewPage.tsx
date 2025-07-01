import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, PlayCircle, FileText, ExternalLink, Type, Clock, Edit, Download, AlertCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

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
  section: number;
}

const AdminLessonViewPage: React.FC = () => {
  const { t } = useTranslation();
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLesson = async () => {
      if (!accessToken || !lessonId) {
        setError('Authentication token or lesson ID is missing.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/courses/lessons/${lessonId}/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch lesson details.');
        }

        const data = await response.json();
        setLesson(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load lesson.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLesson();
  }, [accessToken, lessonId]);

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayCircle className="w-5 h-5" />;
      case 'pdf': return <FileText className="w-5 h-5" />;
      case 'link': return <ExternalLink className="w-5 h-5" />;
      default: return <Type className="w-5 h-5" />;
    }
  };

  const renderLessonContent = () => {
    if (!lesson) return null;

    switch (lesson.lesson_type) {
      case 'video':
        if (lesson.video_url) {
          const videoId = lesson.video_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
          if (videoId) {
            return (
              <div className="aspect-video w-full">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={lesson.title}
                  frameBorder="0"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              </div>
            );
          }
        }
        return <p>Invalid video URL</p>;

      case 'pdf':
        if (!lesson.pdf_file) {
          return (
            <div className="flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No PDF file available</p>
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-4">
            {/* PDF Info Bar */}
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">PDF Document</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {lesson.title}
                  </p>
                </div>
              </div>
                             <div className="flex gap-2">
                 <Button variant="outline" size="sm" asChild>
                   <a href={`${API_BASE_URL}/courses/lessons/${lesson.id}/pdf_proxy/`} target="_blank" rel="noopener noreferrer">
                     <ExternalLink className="w-4 h-4 mr-2" />
                     Open in New Tab
                   </a>
                 </Button>
                 <Button variant="outline" size="sm" asChild>
                   <a href={`${API_BASE_URL}/courses/lessons/${lesson.id}/pdf_proxy/`} download={`${lesson.title}.pdf`}>
                     <Download className="w-4 h-4 mr-2" />
                     Download
                   </a>
                 </Button>
               </div>
            </div>

                        {/* PDF Viewer */}
            <div className="space-y-4">
              {/* Primary PDF Access - Working Solution */}
              <div className="p-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      {lesson.title}
                    </h3>
                    <p className="text-blue-700 dark:text-blue-300 mb-4">
                      Click below to view the PDF lesson content in a new tab
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button size="lg" asChild>
                      <a 
                        href={lesson.pdf_file}
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-5 h-5 mr-2" />
                        Open PDF Lesson
                      </a>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <a 
                        href={lesson.pdf_file}
                        download={`${lesson.title}.pdf`}
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Download PDF
                      </a>
                    </Button>
                  </div>
                </div>
              </div>


            </div>


          </div>
        );

      case 'text':
        return (
          <div className="prose dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap">{lesson.text_content || 'No content available'}</div>
          </div>
        );

      case 'link':
        return lesson.external_url ? (
          <div>
            <Button asChild>
              <a href={lesson.external_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Link
              </a>
            </Button>
          </div>
        ) : <p>No external link available</p>;

      default:
        return <p>Unknown lesson type</p>;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading lesson...</span>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || 'Lesson not found.'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Button variant="outline" onClick={() => navigate(`/admin/courses/${courseId}`)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Course
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-3">
                {getLessonIcon(lesson.lesson_type)}
                {lesson.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">
                  {lesson.lesson_type.toUpperCase()}
                </Badge>
                {lesson.duration_minutes && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {lesson.duration_minutes} min
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderLessonContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLessonViewPage; 