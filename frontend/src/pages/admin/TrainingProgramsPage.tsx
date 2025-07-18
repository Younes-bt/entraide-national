import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle, BookOpen, Users, Calendar, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// TODO: Consider moving API_BASE_URL to an environment variable
const API_BASE_URL = 'http://localhost:8000/api';

interface TrainingProgram {
  id: number;
  name: string;
  description: string;
  duration_years: number;
  logo?: string;
  created_at: string;
  updated_at: string;
}

interface Course {
  id: number;
  name: string;
  description: string;
  cover_image?: string;
  is_active: boolean;
  order: number;
  program: number | { id: number };
  units_count?: number;
  created_at: string;
  updated_at: string;
}

const TrainingProgramsPage: React.FC = () => {
  const { t } = useTranslation();
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, accessToken } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) {
        setError(t('trainingPrograms.error.notAuthenticated', 'Authentication token is missing. Please log in.'));
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch both training programs and courses
        const [programsResponse, coursesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/programs/trainingprogrames/`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch(`${API_BASE_URL}/courses/courses/`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          })
        ]);

        if (!programsResponse.ok) {
          throw new Error(`Failed to fetch training programs: ${programsResponse.status}`);
        }

        if (!coursesResponse.ok) {
          throw new Error(`Failed to fetch courses: ${coursesResponse.status}`);
        }

        const programsData = await programsResponse.json();
        const coursesData = await coursesResponse.json();

        setTrainingPrograms(programsData.results || []);
        setCourses(coursesData.results || []);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(t('trainingPrograms.error.unknown', 'An unknown error occurred.'));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [accessToken, t]);

  // Calculate statistics
  const totalPrograms = trainingPrograms.length;
  const totalCourses = courses.length;
  const activeCourses = courses.filter(course => course.is_active).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            {t('trainingPrograms.title', 'Training Programs Management')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('trainingPrograms.subtitle', 'Manage training programs and their course content')}
          </p>
        </div>
        <Link to="/admin/training-programs/add">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> 
            {t('trainingPrograms.addNew', 'Add New Program')}
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Programs</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPrograms}</div>
            <p className="text-xs text-muted-foreground">
              Training programs
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              {activeCourses} active courses
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
      
      {!isLoading && !error && trainingPrograms.length === 0 && (
        <div className="text-center py-12">
          <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {t('trainingPrograms.noPrograms', 'No training programs found')}
          </h3>
          <p className="text-muted-foreground mb-4">
            {t('trainingPrograms.noProgramsDescription', 'Get started by creating your first training program.')}
          </p>
          <Link to="/admin/training-programs/add">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> 
              {t('trainingPrograms.createFirst', 'Create Your First Program')}
            </Button>
          </Link>
        </div>
      )}
      
      {!isLoading && !error && trainingPrograms.length > 0 && (
        <Accordion type="single" collapsible className="w-full">
          {trainingPrograms.map((program) => {
            const programCourses = courses.filter(
              course =>
                course.program === program.id ||
                (typeof course.program === 'object' && course.program.id === program.id)
            );
            
            return (
              <AccordionItem key={program.id} value={`program-${program.id}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold text-left">{program.name}</h3>
                        <p className="text-sm text-muted-foreground text-left">
                          {program.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{program.duration_years} year{program.duration_years !== 1 ? 's' : ''}</span>
                      <span>{programCourses.length} course{programCourses.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-4">
                    {programCourses.length === 0 ? (
                      <div className="text-center py-8">
                        <BookOpen className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">
                          {t('trainingPrograms.noCoursesForProgram', 'No courses found for this program')}
                        </p>
                        <Link to={`/admin/courses/add?program=${program.id}`}>
                          <Button variant="outline" size="sm" className="mt-2">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            {t('trainingPrograms.addCourse', 'Add Course')}
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {programCourses.map((course) => (
                          <Card key={course.id} className="border-l-4 border-l-blue-500">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div>
                                    <h4 className="font-medium">{course.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {course.description}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    course.is_active 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {course.is_active ? 'Active' : 'Inactive'}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    {course.units_count || 0} units
                                  </span>
                                  <Link to={`/admin/courses/${course.id}`}>
                                    <Button variant="outline" size="sm">
                                      View Details
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
};

export default TrainingProgramsPage; 