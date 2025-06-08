import React, { useState, useEffect, useMemo } from 'react';
import TrainingCourseCard, { type TrainingCourse } from './components/TrainingCourseCard';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Filter, Loader2, AlertCircle, BookOpen } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const AdminTrainingCoursesPage: React.FC = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<TrainingCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, accessToken } = useAuth();
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCenter, setSelectedCenter] = useState('all');
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [selectedTrainer, setSelectedTrainer] = useState('all');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('all');
  
  // Dialog state for course details
  const [selectedCourse, setSelectedCourse] = useState<TrainingCourse | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!accessToken) {
        setError(t('adminTrainingCoursesPage.error.notAuthenticated', 'Authentication token is missing. Please log in.'));
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/programs/trainingcourses/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          let errorDetail = 'Failed to fetch training courses.';
          try {
            const errorData = await response.json();
            errorDetail = errorData.detail || `HTTP error! status: ${response.status}`;
          } catch (e) {
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
          setError(t('adminTrainingCoursesPage.error.unknown', 'An unknown error occurred while fetching training courses.'));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [accessToken, t]);

  // Get unique values for filter dropdowns
  const uniqueCenters = useMemo(() => {
    const centers = courses.map(course => course.center.name).filter(Boolean);
    return [...new Set(centers)].sort();
  }, [courses]);

  const uniquePrograms = useMemo(() => {
    const programs = courses.map(course => course.program.name).filter(Boolean);
    return [...new Set(programs)].sort();
  }, [courses]);

  const uniqueTrainers = useMemo(() => {
    const trainers = courses.map(course => `${course.trainer.first_name} ${course.trainer.last_name}`).filter(Boolean);
    return [...new Set(trainers)].sort();
  }, [courses]);

  const uniqueAcademicYears = useMemo(() => {
    const academicYears = courses.map(course => course.academic_year).filter(Boolean);
    return [...new Set(academicYears)].sort();
  }, [courses]);

  // Filter courses based on search and filter criteria
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      // Search term filter
      const matchesSearch = searchTerm === '' || 
        course.program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${course.trainer.first_name} ${course.trainer.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.trainer.email.toLowerCase().includes(searchTerm.toLowerCase());

      // Center filter
      const matchesCenter = selectedCenter === 'all' || course.center.name === selectedCenter;

      // Program filter
      const matchesProgram = selectedProgram === 'all' || course.program.name === selectedProgram;

      // Trainer filter
      const matchesTrainer = selectedTrainer === 'all' || 
        `${course.trainer.first_name} ${course.trainer.last_name}` === selectedTrainer;

      // Academic Year filter
      const matchesAcademicYear = selectedAcademicYear === 'all' || course.academic_year === selectedAcademicYear;

      return matchesSearch && matchesCenter && matchesProgram && matchesTrainer && matchesAcademicYear;
    });
      }, [courses, searchTerm, selectedCenter, selectedProgram, selectedTrainer, selectedAcademicYear]);

  const handleViewDetails = (course: TrainingCourse) => {
    setSelectedCourse(course);
    setIsDetailsDialogOpen(true);
  };

  const handleEdit = (course: TrainingCourse) => {
    // TODO: Implement edit functionality
    console.log('Edit course:', course);
  };

  const handleDelete = (course: TrainingCourse) => {
    // TODO: Implement delete functionality
    console.log('Delete course:', course);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCenter('all');
    setSelectedProgram('all');
    setSelectedTrainer('all');
    setSelectedAcademicYear('all');
  };

  if (!user || user.role !== 'admin') {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t('adminTrainingCoursesPage.accessDenied', 'Access Denied')}</AlertTitle>
        <AlertDescription>
          {t('adminTrainingCoursesPage.adminOnly', 'This page is only accessible to administrators.')}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {t('adminTrainingCoursesPage.title', 'Training Courses')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('adminTrainingCoursesPage.subtitle', 'Manage all training courses in the system')}
          </p>
        </div>
        <Link to="/admin/training-courses/add">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> 
            {t('adminTrainingCoursesPage.addNew', 'Add New Training Course')}
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('adminTrainingCoursesPage.searchPlaceholder', 'Search by program, center, or trainer...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedCenter} onValueChange={setSelectedCenter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder={t('adminTrainingCoursesPage.filterByCenter', 'Filter by Center')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('adminTrainingCoursesPage.allCenters', 'All Centers')}</SelectItem>
              {uniqueCenters.map(center => (
                <SelectItem key={center} value={center}>{center}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedProgram} onValueChange={setSelectedProgram}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder={t('adminTrainingCoursesPage.filterByProgram', 'Filter by Program')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('adminTrainingCoursesPage.allPrograms', 'All Programs')}</SelectItem>
              {uniquePrograms.map(program => (
                <SelectItem key={program} value={program}>{program}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedTrainer} onValueChange={setSelectedTrainer}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder={t('adminTrainingCoursesPage.filterByTrainer', 'Filter by Trainer')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('adminTrainingCoursesPage.allTrainers', 'All Trainers')}</SelectItem>
              {uniqueTrainers.map(trainer => (
                <SelectItem key={trainer} value={trainer}>{trainer}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder={t('adminTrainingCoursesPage.filterByAcademicYear', 'Filter by Academic Year')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('adminTrainingCoursesPage.allAcademicYears', 'All Academic Years')}</SelectItem>
              {uniqueAcademicYears.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Filters Button */}
          {(searchTerm || selectedCenter !== 'all' || selectedProgram !== 'all' || selectedTrainer !== 'all' || selectedAcademicYear !== 'all') && (
            <Button variant="outline" onClick={clearFilters}>
              {t('adminTrainingCoursesPage.clearFilters', 'Clear Filters')}
            </Button>
          )}
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          {t('adminTrainingCoursesPage.resultsCount', 'Showing {{count}} of {{total}} training courses', {
            count: filteredCourses.length,
            total: courses.length
          })}
        </div>
      </div>

      {/* Content */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-3" />
          <p>{t('adminTrainingCoursesPage.loading', 'Loading training courses...')}</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('adminTrainingCoursesPage.errorTitle', 'Error')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && courses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {t('adminTrainingCoursesPage.noCourses', 'No training courses found')}
          </h3>
          <p className="text-muted-foreground mb-4">
            {t('adminTrainingCoursesPage.noCoursesDescription', 'Get started by creating your first training course.')}
          </p>
          <Link to="/admin/training-courses/add">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('adminTrainingCoursesPage.addNew', 'Add New Training Course')}
            </Button>
          </Link>
        </div>
      )}

      {!isLoading && !error && filteredCourses.length === 0 && courses.length > 0 && (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {t('adminTrainingCoursesPage.noMatchingCourses', 'No matching courses')}
          </h3>
          <p className="text-muted-foreground mb-4">
            {t('adminTrainingCoursesPage.noMatchingCoursesDescription', 'Try adjusting your search or filter criteria.')}
          </p>
          <Button variant="outline" onClick={clearFilters}>
            {t('adminTrainingCoursesPage.clearFilters', 'Clear Filters')}
          </Button>
        </div>
      )}

      {!isLoading && !error && filteredCourses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4">
          {filteredCourses.map((course) => (
            <div key={course.id} className="flex justify-center">
              <TrainingCourseCard 
                course={course}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}

      {/* Course Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {t('adminTrainingCoursesPage.courseDetails', 'Training Course Details')}
            </DialogTitle>
            <DialogDescription>
              {selectedCourse && `${selectedCourse.program.name} - ${selectedCourse.center.name}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCourse && (
            <div className="space-y-6">
              {/* Program Information */}
              <div>
                <h4 className="font-semibold mb-2">{t('adminTrainingCoursesPage.programInfo', 'Program Information')}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">{t('adminTrainingCoursesPage.programName', 'Program Name')}:</span>
                    <p>{selectedCourse.program.name}</p>
                  </div>
                  <div>
                    <span className="font-medium">{t('adminTrainingCoursesPage.duration', 'Duration')}:</span>
                    <p>{selectedCourse.program.duration_years} {selectedCourse.program.duration_years === 1 ? 'Year' : 'Years'}</p>
                  </div>
                  {selectedCourse.program.description && (
                    <div className="col-span-2">
                      <span className="font-medium">{t('adminTrainingCoursesPage.description', 'Description')}:</span>
                      <p>{selectedCourse.program.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Center Information */}
              <div>
                <h4 className="font-semibold mb-2">{t('adminTrainingCoursesPage.centerInfo', 'Center Information')}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">{t('adminTrainingCoursesPage.centerName', 'Center Name')}:</span>
                    <p>{selectedCourse.center.name}</p>
                  </div>
                  {selectedCourse.center.city && (
                    <div>
                      <span className="font-medium">{t('adminTrainingCoursesPage.city', 'City')}:</span>
                      <p>{selectedCourse.center.city}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Trainer Information */}
              <div>
                <h4 className="font-semibold mb-2">{t('adminTrainingCoursesPage.trainerInfo', 'Trainer Information')}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">{t('adminTrainingCoursesPage.trainerName', 'Trainer Name')}:</span>
                    <p>{selectedCourse.trainer.first_name} {selectedCourse.trainer.last_name}</p>
                  </div>
                  <div>
                    <span className="font-medium">{t('adminTrainingCoursesPage.email', 'Email')}:</span>
                    <p>{selectedCourse.trainer.email}</p>
                  </div>
                </div>
              </div>

              {/* Course Details */}
              <div>
                <h4 className="font-semibold mb-2">{t('adminTrainingCoursesPage.courseDetails', 'Course Details')}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">{t('adminTrainingCoursesPage.academicYear', 'Academic Year')}:</span>
                    <p>{selectedCourse.academic_year}</p>
                  </div>
                  <div>
                    <span className="font-medium">{t('adminTrainingCoursesPage.duration', 'Duration')}:</span>
                    <p>{selectedCourse.program.duration_years} {selectedCourse.program.duration_years === 1 ? 'Year' : 'Years'}</p>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div>
                <h4 className="font-semibold mb-2">{t('adminTrainingCoursesPage.timestamps', 'Timestamps')}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">{t('adminTrainingCoursesPage.createdAt', 'Created')}:</span>
                    <p>{new Date(selectedCourse.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="font-medium">{t('adminTrainingCoursesPage.updatedAt', 'Last Updated')}:</span>
                    <p>{new Date(selectedCourse.updated_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTrainingCoursesPage; 