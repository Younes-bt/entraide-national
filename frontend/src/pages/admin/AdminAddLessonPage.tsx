import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, ArrowLeft, BookOpen, PlayCircle, FileText, ExternalLink, Type, Info, Upload } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

interface Course {
  id: number;
  name: string;
  description: string;
}

interface Unit {
  id: number;
  name: string;
  description: string;
  order: number;
}

interface Section {
  id: number;
  name: string;
  description: string;
  about: string;
  order: number;
  lessons_count?: number;
}

type LessonType = 'video' | 'pdf' | 'text' | 'link';

const LESSON_TYPE_OPTIONS = [
  { value: 'video', label: 'Video (YouTube)', icon: PlayCircle, description: 'Embed YouTube videos' },
  { value: 'pdf', label: 'PDF Document', icon: FileText, description: 'Upload PDF files' },
  { value: 'text', label: 'Text Content', icon: Type, description: 'Rich text content' },
  { value: 'link', label: 'External Link', icon: ExternalLink, description: 'Link to external resources' },
];

const AdminAddLessonPage: React.FC = () => {
  const { t } = useTranslation();
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const { courseId, sectionId } = useParams<{ courseId: string; sectionId: string }>();

  const [course, setCourse] = useState<Course | null>(null);
  const [unit, setUnit] = useState<Unit | null>(null);
  const [section, setSection] = useState<Section | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    lesson_type: '' as LessonType | '',
    text_content: '',
    video_url: '',
    external_url: '',
    order: '0',
    duration_minutes: '',
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch course, unit, and section details
  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken || !courseId || !sectionId) {
        setError('Authentication token, course ID, or section ID is missing.');
        setIsLoadingData(false);
        return;
      }

      try {
        // Fetch course details with full hierarchy
        const courseResponse = await fetch(`${API_BASE_URL}/courses/courses/${courseId}/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!courseResponse.ok) {
          throw new Error('Failed to fetch course details.');
        }

        const courseData = await courseResponse.json();
        setCourse(courseData);

        // Find the specific unit and section from the course data
        let foundUnit = null;
        let foundSection = null;

        for (const unit of courseData.units || []) {
          for (const section of unit.sections || []) {
            if (section.id.toString() === sectionId) {
              foundUnit = unit;
              foundSection = section;
              break;
            }
          }
          if (foundSection) break;
        }

        if (!foundUnit || !foundSection) {
          throw new Error(`Section with ID ${sectionId} not found in course ${courseId}.`);
        }

        setUnit(foundUnit);
        setSection(foundSection);
        
        // Set default order to next available order
        setFormData(prev => ({
          ...prev,
          order: (foundSection.lessons?.length || 0).toString()
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data.');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [accessToken, courseId, sectionId, t]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLessonTypeChange = (value: LessonType) => {
    setFormData({ 
      ...formData, 
      lesson_type: value,
      // Clear other content fields when type changes
      text_content: '',
      video_url: '',
      external_url: '',
    });
    setPdfFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    } else {
      setPdfFile(null);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      return 'Lesson title is required.';
    }
    if (!formData.lesson_type) {
      return 'Please select a lesson type.';
    }

    const order = parseInt(formData.order);
    if (isNaN(order) || order < 0) {
      return 'Order must be a valid non-negative number.';
    }

    const duration = formData.duration_minutes ? parseInt(formData.duration_minutes) : null;
    if (formData.duration_minutes && (isNaN(duration!) || duration! <= 0)) {
      return 'Duration must be a valid positive number.';
    }

    // Validate content based on lesson type
    switch (formData.lesson_type) {
      case 'video':
        if (!formData.video_url.trim()) {
          return 'YouTube URL is required for video lessons.';
        }
        if (!formData.video_url.includes('youtube.com') && !formData.video_url.includes('youtu.be')) {
          return 'Please enter a valid YouTube URL.';
        }
        break;
      case 'pdf':
        if (!pdfFile) {
          return 'PDF file is required for PDF lessons.';
        }
        if (pdfFile.type !== 'application/pdf') {
          return 'Please upload a valid PDF file.';
        }
        break;
      case 'text':
        if (!formData.text_content.trim()) {
          return 'Text content is required for text lessons.';
        }
        break;
      case 'link':
        if (!formData.external_url.trim()) {
          return 'External URL is required for link lessons.';
        }
        try {
          new URL(formData.external_url);
        } catch {
          return 'Please enter a valid URL.';
        }
        break;
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!accessToken) {
      setError('Authentication token is missing. Please log in.');
      return;
    }

    if (!courseId || !sectionId) {
      setError('Course ID or Section ID is missing.');
      return;
    }

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      let submitData: any;

      if (formData.lesson_type === 'pdf' && pdfFile) {
        // Use FormData for file upload
        submitData = new FormData();
        submitData.append('section', sectionId);
        submitData.append('title', formData.title.trim());
        submitData.append('lesson_type', formData.lesson_type);
        submitData.append('order', formData.order);
        if (formData.duration_minutes) {
          submitData.append('duration_minutes', formData.duration_minutes);
        }
        submitData.append('pdf_file', pdfFile);
      } else {
        // Use JSON for other types
        submitData = {
          section: parseInt(sectionId),
          title: formData.title.trim(),
          lesson_type: formData.lesson_type,
          order: parseInt(formData.order),
          ...(formData.duration_minutes && { duration_minutes: parseInt(formData.duration_minutes) }),
          ...(formData.lesson_type === 'video' && { video_url: formData.video_url.trim() }),
          ...(formData.lesson_type === 'text' && { text_content: formData.text_content.trim() }),
          ...(formData.lesson_type === 'link' && { external_url: formData.external_url.trim() }),
        };
      }

      const headers: any = {
        'Authorization': `Bearer ${accessToken}`,
      };

      if (formData.lesson_type !== 'pdf') {
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(`${API_BASE_URL}/courses/lessons/`, {
        method: 'POST',
        headers,
        body: formData.lesson_type === 'pdf' ? submitData : JSON.stringify(submitData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        let errorMessage = 'Failed to create lesson. Please try again.';
        if (responseData && typeof responseData === 'object') {
          if (response.status === 400 && responseData.order) {
            errorMessage = 'A lesson with this order already exists in this section. Please choose a different order.';
          } else {
            const errors = Object.entries(responseData)
              .map(([key, value]) => `${key}: ${(Array.isArray(value) ? value.join(', ') : value)}`)
              .join('; ');
            errorMessage = errors || errorMessage;
          }
        }
        throw new Error(errorMessage);
      }
      
      setSuccessMessage('Lesson created successfully! Redirecting...');
      setFormData({ 
        title: '', 
        lesson_type: '' as LessonType | '', 
        text_content: '', 
        video_url: '', 
        external_url: '', 
        order: '0', 
        duration_minutes: '' 
      });
      setPdfFile(null);

      setTimeout(() => navigate(`/admin/courses/${courseId}`), 2000);

    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const getLessonTypeIcon = (type: LessonType) => {
    const option = LESSON_TYPE_OPTIONS.find(opt => opt.value === type);
    return option ? option.icon : Type;
  };

  if (isLoadingData) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading lesson details...</span>
        </div>
      </div>
    );
  }

  if (!course || !unit || !section) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Course, unit, or section not found or failed to load.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const selectedLessonType = LESSON_TYPE_OPTIONS.find(opt => opt.value === formData.lesson_type);

  return (
    <div className="container mx-auto p-4">
      <Button variant="outline" onClick={() => navigate(`/admin/courses/${courseId}`)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Course
      </Button>
      
      {/* Course, Unit, and Section Context */}
      <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-purple-600" />
          <div>
            <h2 className="font-semibold text-purple-900 dark:text-purple-100">Adding Lesson to:</h2>
            <p className="text-purple-700 dark:text-purple-300 font-medium">{course.name}</p>
            <p className="text-sm text-purple-600 dark:text-purple-400">
              Unit {unit.order + 1}: {unit.name} → Section {section.order + 1}: {section.name}
            </p>
            <p className="text-xs text-purple-500 dark:text-purple-500">
              Current lessons: {section.lessons_count || 0}
            </p>
          </div>
        </div>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {formData.lesson_type && selectedLessonType && (
              <selectedLessonType.icon className="w-5 h-5" />
            )}
            Create New Lesson
          </CardTitle>
          <p className="text-muted-foreground">
            Add educational content to this section. Choose the type of lesson and provide the appropriate content.
          </p>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {successMessage && (
            <Alert variant="default" className="mb-4 bg-green-100 border-green-400 text-green-700">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Lesson Title */}
            <div>
              <Label htmlFor="title">
                Lesson Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter lesson title (e.g., Introduction to Layers in Photoshop)"
                required
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Choose a clear, descriptive title for this lesson
              </p>
            </div>

            {/* Lesson Type */}
            <div>
              <Label htmlFor="lesson_type">
                Lesson Type <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.lesson_type} onValueChange={handleLessonTypeChange}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select lesson type" />
                </SelectTrigger>
                <SelectContent>
                  {LESSON_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-muted-foreground">{option.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">
                Choose the type of content for this lesson
              </p>
            </div>

            {/* Dynamic Content Fields Based on Lesson Type */}
            {formData.lesson_type === 'video' && (
              <div>
                <Label htmlFor="video_url">
                  YouTube URL <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="video_url"
                  name="video_url"
                  type="url"
                  value={formData.video_url}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Enter the full YouTube URL for the video
                </p>
              </div>
            )}

            {formData.lesson_type === 'pdf' && (
              <div>
                <Label htmlFor="pdf_file">
                  PDF File <span className="text-destructive">*</span>
                </Label>
                <div className="mt-2">
                  <Input
                    id="pdf_file"
                    name="pdf_file"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf"
                    required
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                  />
                  {pdfFile && (
                    <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md">
                      <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Selected: {pdfFile.name}
                      </p>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload a PDF document for students to download
                </p>
              </div>
            )}

            {formData.lesson_type === 'text' && (
              <div>
                <Label htmlFor="text_content">
                  Text Content <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="text_content"
                  name="text_content"
                  value={formData.text_content}
                  onChange={handleChange}
                  placeholder="Write your lesson content here. You can include explanations, instructions, concepts, and any text-based educational material..."
                  rows={8}
                  required
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Write the complete text content for this lesson
                </p>
              </div>
            )}

            {formData.lesson_type === 'link' && (
              <div>
                <Label htmlFor="external_url">
                  External URL <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="external_url"
                  name="external_url"
                  type="url"
                  value={formData.external_url}
                  onChange={handleChange}
                  placeholder="https://example.com/resource"
                  required
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Link to an external resource, tutorial, or website
                </p>
              </div>
            )}

            {/* Duration */}
            <div>
              <Label htmlFor="duration_minutes">
                Estimated Duration (minutes)
              </Label>
              <Input
                id="duration_minutes"
                name="duration_minutes"
                type="number"
                value={formData.duration_minutes}
                onChange={handleChange}
                placeholder="15"
                min="1"
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-1">
                How long should students spend on this lesson? (optional)
              </p>
            </div>

            {/* Order */}
            <div>
              <Label htmlFor="order">
                Display Order
              </Label>
              <Input
                id="order"
                name="order"
                type="number"
                value={formData.order}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Lower numbers appear first in the section (0 = first lesson)
              </p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                <div>
                  <p className="text-sm text-purple-800 dark:text-purple-200 font-medium mb-1">
                    <strong>Content Guidelines:</strong>
                  </p>
                  <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                    <li>• <strong>Videos:</strong> Use YouTube URLs for better performance</li>
                    <li>• <strong>PDFs:</strong> Keep file sizes reasonable for faster downloads</li>
                    <li>• <strong>Text:</strong> Write clear, structured content with examples</li>
                    <li>• <strong>Links:</strong> Ensure external resources are reliable and accessible</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(`/admin/courses/${courseId}`)}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || !formData.lesson_type}
            onClick={handleSubmit}
            className="min-w-[120px]"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Creating...' : 'Create Lesson'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminAddLessonPage; 