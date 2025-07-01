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
import { Loader2, ArrowLeft, BookOpen, Layers, Info, Trash2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

interface Course {
  id: number;
  name: string;
  description: string;
  cover_image?: string;
  is_active: boolean;
  order: number;
  units_count?: number;
}

interface Unit {
  id: number;
  course: number;
  name: string;
  description: string;
  order: number;
  created_at: string;
  updated_at: string;
}

const AdminEditUnitPage: React.FC = () => {
  const { t } = useTranslation();
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const { courseId, unitId } = useParams<{ courseId: string; unitId: string }>();

  const [course, setCourse] = useState<Course | null>(null);
  const [unit, setUnit] = useState<Unit | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    order: '0',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

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
        
        // Pre-populate form with unit data
        setFormData({
          name: unitData.name,
          description: unitData.description || '',
          order: unitData.order.toString(),
        });

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
      setError('Unit name is required.');
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
      course: parseInt(courseId),
      name: formData.name.trim(),
      description: formData.description.trim(),
      order: order,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/courses/units/${unitId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        let errorMessage = 'Failed to update unit. Please try again.';
        if (responseData && typeof responseData === 'object') {
          if (response.status === 400 && responseData.order) {
            errorMessage = 'A unit with this order already exists in this course. Please choose a different order.';
          } else {
            const errors = Object.entries(responseData)
              .map(([key, value]) => `${key}: ${(Array.isArray(value) ? value.join(', ') : value)}`)
              .join('; ');
            errorMessage = errors || errorMessage;
          }
        }
        throw new Error(errorMessage);
      }
      
      setSuccessMessage('Unit updated successfully! Redirecting...');
      
      // Update local unit state
      setUnit(responseData);

      setTimeout(() => navigate(`/admin/courses/${courseId}`), 2000);

    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!accessToken || !unitId) {
      setError('Authentication token or unit ID is missing.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/courses/units/${unitId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete unit. Please try again.');
      }

      setSuccessMessage('Unit deleted successfully! Redirecting...');
      setTimeout(() => navigate(`/admin/courses/${courseId}`), 1500);

    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading unit details...</span>
        </div>
      </div>
    );
  }

  if (!course || !unit) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Course or unit not found, or failed to load.</AlertDescription>
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
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <div>
            <h2 className="font-semibold text-blue-900 dark:text-blue-100">Editing Unit in:</h2>
            <p className="text-blue-700 dark:text-blue-300 font-medium">{course.name}</p>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Unit {unit.order + 1}: {unit.name}
            </p>
          </div>
        </div>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Edit Unit
          </CardTitle>
          <p className="text-muted-foreground">
            Update the unit information and organization within this course.
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
            {/* Unit Name */}
            <div>
              <Label htmlFor="name">
                Unit Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter unit name (e.g., Introduction to Photoshop)"
                required
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Choose a clear, descriptive name for this unit
              </p>
            </div>

            {/* Unit Description */}
            <div>
              <Label htmlFor="description">
                Unit Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what this unit covers, its learning objectives, and key topics..."
                rows={4}
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Provide a helpful description of what students will learn in this unit (optional)
              </p>
            </div>

            {/* Unit Order */}
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
                Lower numbers appear first in the course outline (0 = first unit)
              </p>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
                    <strong>Created:</strong> {new Date(unit.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Last updated: {new Date(unit.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <div>
            {!showDeleteConfirm ? (
              <Button 
                type="button" 
                variant="destructive" 
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isLoading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Unit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Confirm Delete
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(`/admin/courses/${courseId}`)}
              disabled={isLoading}
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
              {isLoading ? 'Updating...' : 'Update Unit'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminEditUnitPage; 