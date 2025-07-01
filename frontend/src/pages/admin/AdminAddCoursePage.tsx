import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, ArrowLeft, BookOpen, Upload, Info } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const AdminAddCoursePage: React.FC = () => {
  const { t } = useTranslation();
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true,
    order: '0',
  });
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, is_active: checked });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImageFile(e.target.files[0]);
    } else {
      setCoverImageFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!accessToken) {
      setError('Authentication token is missing. Please log in.');
      return;
    }

    // Basic Frontend Validation
    if (!formData.name.trim()) {
      setError('Course name is required.');
      return;
    }
    if (!formData.description.trim()) {
      setError('Course description is required.');
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

    const submissionFormData = new FormData();
    submissionFormData.append('name', formData.name.trim());
    submissionFormData.append('description', formData.description.trim());
    submissionFormData.append('is_active', formData.is_active.toString());
    submissionFormData.append('order', formData.order.trim());
    if (coverImageFile) {
      submissionFormData.append('cover_image', coverImageFile);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/courses/courses/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          // 'Content-Type': 'multipart/form-data' is automatically set by browser for FormData
        },
        body: submissionFormData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        let errorMessage = 'Failed to create course. Please try again.';
        if (responseData && typeof responseData === 'object') {
          if (response.status === 409 || (responseData.name && responseData.name.some((err: string) => err.includes('already exists')))) {
            errorMessage = 'A course with this name already exists. Please choose a different name.';
          } else {
            const errors = Object.entries(responseData)
              .map(([key, value]) => `${key}: ${(Array.isArray(value) ? value.join(', ') : value)}`)
              .join('; ');
            errorMessage = errors || errorMessage;
          }
        }
        throw new Error(errorMessage);
      }
      
      setSuccessMessage('Course created successfully! Redirecting...');
      setFormData({ name: '', description: '', is_active: true, order: '0' });
      setCoverImageFile(null);
      // Clear the file input visually
      const fileInput = document.getElementById('cover_image') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      setTimeout(() => navigate('/admin/training-programs'), 2000);

    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Button variant="outline" onClick={() => navigate('/admin/training-programs')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Courses
      </Button>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Create New Course
          </CardTitle>
          <p className="text-muted-foreground">
            Create a new course and start building educational content with units, sections, and lessons.
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
            {/* Course Name */}
            <div>
              <Label htmlFor="name">
                Course Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter course name (e.g., Infography Design)"
                required
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Choose a clear, descriptive name for your course
              </p>
            </div>

            {/* Course Description */}
            <div>
              <Label htmlFor="description">
                Course Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what this course covers, its objectives, and what students will learn..."
                required
                rows={5}
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Provide a comprehensive description of the course content and learning objectives
              </p>
            </div>

            {/* Cover Image */}
            <div>
              <Label htmlFor="cover_image">
                Course Cover Image
              </Label>
              <div className="mt-2">
                <Input
                  id="cover_image"
                  name="cover_image"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                />
                {coverImageFile && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-700 flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Selected: {coverImageFile.name}
                    </p>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Upload an attractive cover image to represent your course (optional)
              </p>
            </div>

            {/* Course Order */}
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
                Lower numbers appear first in the course list (0 = first)
              </p>
            </div>

            {/* Course Status */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="is_active" className="flex items-center gap-2">
                Course is active and visible to users
                <Info className="w-4 h-4 text-muted-foreground" />
              </Label>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Next steps:</strong> After creating the course, you'll be able to add units, sections, 
                lessons, and practice exercises to build out the complete learning experience.
              </p>
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/admin/training-programs')}
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
            {isLoading ? 'Creating...' : 'Create Course'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminAddCoursePage; 