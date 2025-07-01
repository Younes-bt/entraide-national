import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, ArrowLeft, BookOpen, Layers, FileText, Info } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

interface Course {
  id: number;
  name: string;
  description: string;
  cover_image?: string;
  is_active: boolean;
  order: number;
}

interface Unit {
  id: number;
  course: number;
  name: string;
  description: string;
  order: number;
  sections_count?: number;
}

const AdminAddSectionPage: React.FC = () => {
  const { t } = useTranslation();
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const { courseId, unitId } = useParams<{ courseId: string; unitId: string }>();

  const [course, setCourse] = useState<Course | null>(null);
  const [unit, setUnit] = useState<Unit | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    about: '',
    order: '0',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch course and unit details
  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken || !courseId || !unitId) {
        setError('Authentication token, course ID, or unit ID is missing.');
        setIsLoadingData(false);
        return;
      }

      try {
        // Fetch course details
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

        // Fetch unit details
        const unitResponse = await fetch(`${API_BASE_URL}/courses/units/${unitId}/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!unitResponse.ok) {
          throw new Error('Failed to fetch unit details.');
        }

        const unitData = await unitResponse.json();
        setUnit(unitData);
        
        // Set default order to next available order
        setFormData(prev => ({
          ...prev,
          order: (unitData.sections_count || 0).toString()
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data.');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [accessToken, courseId, unitId, t]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!accessToken) {
      setError('Authentication token is missing. Please log in.');
      return;
    }

    if (!courseId || !unitId) {
      setError('Course ID or Unit ID is missing.');
      return;
    }

    // Basic Frontend Validation
    if (!formData.name.trim()) {
      setError('Section name is required.');
      return;
    }
    const order = parseInt(formData.order);
    if (isNaN(order) || order < 0) {
      setError('Order must be a valid non-negative number.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const submitData = {
      unit: parseInt(unitId),
      name: formData.name.trim(),
      description: formData.description.trim(),
      about: formData.about.trim(),
      order: order,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/courses/sections/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        let errorMessage = 'Failed to create section. Please try again.';
        if (responseData && typeof responseData === 'object') {
          if (response.status === 400 && responseData.order) {
            errorMessage = 'A section with this order already exists in this unit. Please choose a different order.';
          } else {
            const errors = Object.entries(responseData)
              .map(([key, value]) => `${key}: ${(Array.isArray(value) ? value.join(', ') : value)}`)
              .join('; ');
            errorMessage = errors || errorMessage;
          }
        }
        throw new Error(errorMessage);
      }
      
      setSuccessMessage('Section created successfully! Redirecting...');
      setFormData({ name: '', description: '', about: '', order: '0' });

      setTimeout(() => navigate(`/admin/courses/${courseId}`), 2000);

    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading section details...</span>
        </div>
      </div>
    );
  }

  if (!course || !unit) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Course or unit not found or failed to load.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Button variant="outline" onClick={() => navigate(`/admin/courses/${courseId}`)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Course
      </Button>
      
      {/* Course and Unit Context */}
      <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-green-600" />
          <div>
            <h2 className="font-semibold text-green-900 dark:text-green-100">Adding Section to:</h2>
            <p className="text-green-700 dark:text-green-300 font-medium">{course.name}</p>
            <p className="text-sm text-green-600 dark:text-green-400">
              Unit {unit.order + 1}: {unit.name}
            </p>
            <p className="text-xs text-green-500 dark:text-green-500">
              Current sections: {unit.sections_count || 0}
            </p>
          </div>
        </div>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Create New Section
          </CardTitle>
          <p className="text-muted-foreground">
            Add a new section to organize lessons and practice exercises within this unit.
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
            {/* Section Name */}
            <div>
              <Label htmlFor="name">
                Section Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter section name (e.g., Introduction to Layers)"
                required
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Choose a clear, descriptive name for this section
              </p>
            </div>

            {/* Section Description */}
            <div>
              <Label htmlFor="description">
                Section Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of what this section covers..."
                rows={3}
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-1">
                A short overview of the section's content (optional)
              </p>
            </div>

            {/* Section About */}
            <div>
              <Label htmlFor="about">
                About This Section
              </Label>
              <Textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleChange}
                placeholder="Detailed information about what students will learn in this section, learning objectives, and key concepts..."
                rows={4}
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Detailed learning objectives and what students will achieve (optional)
              </p>
            </div>

            {/* Section Order */}
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
                Lower numbers appear first in the unit outline (0 = first section)
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <p className="text-sm text-green-800 dark:text-green-200 font-medium mb-1">
                    <strong>Next steps:</strong>
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    After creating this section, you'll be able to add lessons (videos, PDFs, text) and practice exercises (questions, quizzes) to build the complete learning experience.
                  </p>
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
            disabled={isLoading}
            onClick={handleSubmit}
            className="min-w-[120px]"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Creating...' : 'Create Section'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminAddSectionPage; 