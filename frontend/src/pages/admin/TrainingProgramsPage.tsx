import React, { useState, useEffect } from 'react';
import TrainingProgramCard, { type Course } from './components/TrainingProgramCard';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle, BookOpen, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// TODO: Consider moving API_BASE_URL to an environment variable
const API_BASE_URL = 'http://localhost:8000/api';

const TrainingProgramsPage: React.FC = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, accessToken } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      if (!accessToken) {
        setError(t('courses.error.notAuthenticated', 'Authentication token is missing. Please log in.'));
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/courses/courses/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          let errorDetail = 'Failed to fetch courses.';
          try {
            const errorData = await response.json();
            errorDetail = errorData.detail || `HTTP error! status: ${response.status}`;
          } catch (e) {
            // If response is not JSON or error parsing JSON
            errorDetail = `HTTP error! status: ${response.status}`;
          }
          throw new Error(errorDetail);
        }

        const data = await response.json();
        setCourses(data.results || []);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(t('courses.error.unknown', 'An unknown error occurred.'));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [accessToken, t]);

  // Calculate statistics
  const activeCourses = courses.filter(course => course.is_active).length;
  const totalUnits = courses.reduce((acc, course) => acc + (course.units_count || 0), 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            {t('courses.title', 'Course Content Management')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('courses.subtitle', 'Manage course content, units, sections, and learning materials')}
          </p>
        </div>
        <Link to="/admin/courses/add">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> 
            {t('courses.addNew', 'Add New Course')}
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeCourses} active courses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUnits}</div>
            <p className="text-xs text-muted-foreground">
              Across all courses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground">
              System operational
            </p>
          </CardContent>
        </Card>
      </div>
      
      {isLoading && <p>{t('loading', 'Loading...')}</p>}
      {error && <p className="text-red-500">{t('error', 'Error')}: {error}</p>}
      
      {!isLoading && !error && courses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {t('courses.noCourses', 'No courses found')}
          </h3>
          <p className="text-muted-foreground mb-4">
            {t('courses.noCoursesDescription', 'Get started by creating your first course with units and sections.')}
          </p>
          <Link to="/admin/courses/add">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> 
              {t('courses.createFirst', 'Create Your First Course')}
            </Button>
          </Link>
        </div>
      )}
      
      {!isLoading && !error && courses.length > 0 && (
        <div className="flex flex-wrap gap-6">
          {courses.map((course) => (
            <TrainingProgramCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainingProgramsPage; 