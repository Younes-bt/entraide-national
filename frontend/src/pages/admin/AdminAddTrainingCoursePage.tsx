import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

interface TrainingProgram {
  id: number;
  name: string;
  description: string;
  duration_years: number;
  logo?: string | null;
}

interface Center {
  id: number;
  name: string;
  city?: string;
  is_active: boolean;
}

interface Trainer {
  id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    is_active: boolean;
    profile_picture?: string;
  };
  center: number;
  program: number;
  program_name: string;
  contarct_with: string;
  contract_start_date: string;
  contract_end_date: string;
}

interface FormData {
  program: string;
  center: string;
  trainer: string;
  academic_year: string;
}

const AdminAddTrainingCoursePage: React.FC = () => {
  const { t } = useTranslation();
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  // Generate academic years from 2024-2025 to 2030-2031
  const generateAcademicYears = (): string[] => {
    const years: string[] = [];
    for (let startYear = 2024; startYear <= 2030; startYear++) {
      years.push(`${startYear}-${startYear + 1}`);
    }
    return years;
  };

  const academicYears = generateAcademicYears();

  const [formData, setFormData] = useState<FormData>({
    program: '',
    center: '',
    trainer: '',
    academic_year: '',
  });

  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [centers, setCenters] = useState<Center[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) {
        setError(t('adminAddTrainingCourse.error.notAuthenticated', 'Authentication token is missing. Please log in.'));
        setIsLoadingData(false);
        return;
      }

      try {
        setIsLoadingData(true);
        setError(null);

        // Fetch all required data in parallel
        const [programsRes, centersRes, trainersRes] = await Promise.all([
          fetch(`${API_BASE_URL}/programs/trainingprogrames/`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch(`${API_BASE_URL}/centers-app/centers/`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch(`${API_BASE_URL}/teachers/teachers/`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }),
        ]);

        if (!programsRes.ok || !centersRes.ok || !trainersRes.ok) {
          throw new Error('Failed to fetch required data');
        }

        const [programsData, centersData, trainersData] = await Promise.all([
          programsRes.json(),
          centersRes.json(),
          trainersRes.json(),
        ]);

        setPrograms(programsData.results || []);
        setCenters((centersData.results || []).filter((center: Center) => center.is_active));
        setTrainers((trainersData.results || []).filter((trainer: Trainer) => trainer.user.is_active));

      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(t('adminAddTrainingCourse.error.loadData', 'Failed to load required data.'));
        }
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [accessToken, t]);

  const handleSelectChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear any previous errors when user makes changes
    if (error) setError(null);
    if (successMessage) setSuccessMessage(null);
  };

  const validateForm = (): boolean => {
    if (!formData.program.trim()) {
      setError(t('adminAddTrainingCourse.validation.programRequired', 'Please select a training program.'));
      return false;
    }
    if (!formData.center.trim()) {
      setError(t('adminAddTrainingCourse.validation.centerRequired', 'Please select a center.'));
      return false;
    }
    if (!formData.trainer.trim()) {
      setError(t('adminAddTrainingCourse.validation.trainerRequired', 'Please select a trainer.'));
      return false;
    }
    if (!formData.academic_year.trim()) {
      setError(t('adminAddTrainingCourse.validation.academicYearRequired', 'Please enter an academic year.'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!accessToken) {
      setError(t('adminAddTrainingCourse.error.notAuthenticated'));
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/programs/trainingcourses/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          program: parseInt(formData.program),
          center: parseInt(formData.center),
          trainer: getSelectedTrainerInfo()?.user.id || parseInt(formData.trainer),
          academic_year: formData.academic_year,
        }),
      });

      if (!response.ok) {
        let errorDetail = 'Failed to create training course.';
        try {
          const errorData = await response.json();
          errorDetail = errorData.detail || errorData.message || `HTTP error! status: ${response.status}`;
        } catch (e) {
          errorDetail = `HTTP error! status: ${response.status}`;
        }
        throw new Error(errorDetail);
      }

      const result = await response.json();
      setSuccessMessage(t('adminAddTrainingCourse.success.created', 'Training course created successfully!'));
      
      // Reset form
      setFormData({
        program: '',
        center: '',
        trainer: '',
        academic_year: '',
      });

      // Navigate back after a short delay
      setTimeout(() => {
        navigate('/admin/training-courses');
      }, 2000);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('adminAddTrainingCourse.error.unknown', 'An unknown error occurred while creating the training course.'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectedProgramInfo = () => {
    if (!formData.program) return null;
    return programs.find(p => p.id.toString() === formData.program);
  };

  const getSelectedCenterInfo = () => {
    if (!formData.center) return null;
    return centers.find(c => c.id.toString() === formData.center);
  };

  const getSelectedTrainerInfo = () => {
    if (!formData.trainer) return null;
    return trainers.find(t => t.id.toString() === formData.trainer);
  };

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin mr-3" />
        <p>{t('adminAddTrainingCourse.loadingData', 'Loading required data...')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Button variant="outline" onClick={() => navigate('/admin/training-courses')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('adminAddTrainingCourse.backButton', 'Back to Training Courses')}
      </Button>

      <Card className="mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">
            {t('adminAddTrainingCourse.title', 'Add New Training Course')}
          </CardTitle>
          <p className="text-muted-foreground">
            {t('adminAddTrainingCourse.subtitle', 'Create a new training course by selecting a program, center, and trainer.')}
          </p>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t('adminAddTrainingCourse.errorTitle', 'Error')}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert variant="default" className="border-green-200 bg-green-50 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>{t('adminAddTrainingCourse.successTitle', 'Success')}</AlertTitle>
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            {/* Training Program Selection */}
            <div className="space-y-2">
              <Label htmlFor="program">
                {t('adminAddTrainingCourse.labels.program', 'Training Program')} 
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Select value={formData.program} onValueChange={(value) => handleSelectChange('program', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('adminAddTrainingCourse.placeholders.program', 'Select a training program')} />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.id.toString()}>
                      {program.name} ({program.duration_years} {program.duration_years === 1 ? 'Year' : 'Years'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getSelectedProgramInfo() && (
                <p className="text-sm text-muted-foreground mt-1">
                  {getSelectedProgramInfo()?.description}
                </p>
              )}
            </div>

            {/* Center Selection */}
            <div className="space-y-2">
              <Label htmlFor="center">
                {t('adminAddTrainingCourse.labels.center', 'Training Center')} 
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Select value={formData.center} onValueChange={(value) => handleSelectChange('center', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('adminAddTrainingCourse.placeholders.center', 'Select a training center')} />
                </SelectTrigger>
                <SelectContent>
                  {centers.map((center) => (
                    <SelectItem key={center.id} value={center.id.toString()}>
                      {center.name} {center.city && `- ${center.city}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getSelectedCenterInfo() && (
                <p className="text-sm text-muted-foreground mt-1">
                  {getSelectedCenterInfo()?.city && `Located in ${getSelectedCenterInfo()?.city}`}
                </p>
              )}
            </div>

            {/* Trainer Selection */}
            <div className="space-y-2">
              <Label htmlFor="trainer">
                {t('adminAddTrainingCourse.labels.trainer', 'Trainer')} 
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Select value={formData.trainer} onValueChange={(value) => handleSelectChange('trainer', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('adminAddTrainingCourse.placeholders.trainer', 'Select a trainer')} />
                </SelectTrigger>
                <SelectContent>
                  {trainers.map((trainer) => (
                    <SelectItem key={trainer.id} value={trainer.id.toString()}>
                      {trainer.user.first_name} {trainer.user.last_name} - {trainer.user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getSelectedTrainerInfo() && (
                <p className="text-sm text-muted-foreground mt-1">
                  {getSelectedTrainerInfo()?.user.email}
                </p>
              )}
            </div>

            {/* Academic Year Selection */}
            <div className="space-y-2">
              <Label htmlFor="academic_year">
                {t('adminAddTrainingCourse.labels.academicYear', 'Academic Year')} 
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Select value={formData.academic_year} onValueChange={(value) => handleSelectChange('academic_year', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('adminAddTrainingCourse.placeholders.academicYear', 'Select academic year')} />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {t('adminAddTrainingCourse.help.academicYear', 'Select the academic year for this training course')}
              </p>
            </div>

            {/* Summary Section */}
            {formData.program && formData.center && formData.trainer && formData.academic_year && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">
                  {t('adminAddTrainingCourse.summary.title', 'Course Summary')}
                </h4>
                <div className="space-y-1 text-sm">
                  <p><strong>{t('adminAddTrainingCourse.summary.program', 'Program')}:</strong> {getSelectedProgramInfo()?.name}</p>
                  <p><strong>{t('adminAddTrainingCourse.summary.center', 'Center')}:</strong> {getSelectedCenterInfo()?.name}</p>
                  <p><strong>{t('adminAddTrainingCourse.summary.trainer', 'Trainer')}:</strong> {getSelectedTrainerInfo()?.user.first_name} {getSelectedTrainerInfo()?.user.last_name}</p>
                  <p><strong>{t('adminAddTrainingCourse.summary.academicYear', 'Academic Year')}:</strong> {formData.academic_year}</p>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/admin/training-courses')}
            >
              {t('actions.cancel', 'Cancel')}
            </Button>
            <Button type="submit" disabled={isLoading || !formData.program || !formData.center || !formData.trainer || !formData.academic_year}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('adminAddTrainingCourse.buttons.create', 'Create Training Course')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminAddTrainingCoursePage; 