import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have a Textarea component
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, ArrowLeft } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const AdminAddTrainingProgramPage: React.FC = () => {
  const { t } = useTranslation();
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration_years: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    } else {
      setLogoFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!accessToken) {
      setError(t('trainingPrograms.error.notAuthenticated'));
      return;
    }

    // Basic Frontend Validation
    if (!formData.name.trim()) {
      setError(t('adminAddTrainingProgram.validation.nameRequired'));
      return;
    }
    if (!formData.description.trim()) {
      setError(t('adminAddTrainingProgram.validation.descriptionRequired'));
      return;
    }
    if (!formData.duration_years.trim()) {
      setError(t('adminAddTrainingProgram.validation.durationRequired'));
      return;
    }
    const duration = parseInt(formData.duration_years);
    if (isNaN(duration) || duration <= 0) {
      setError(t('adminAddTrainingProgram.validation.durationPositive'));
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const submissionFormData = new FormData();
    submissionFormData.append('name', formData.name.trim());
    submissionFormData.append('description', formData.description.trim());
    submissionFormData.append('duration_years', formData.duration_years.trim()); // Send as string, backend handles conversion
    if (logoFile) {
      submissionFormData.append('logo', logoFile);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/programs/trainingprogrames/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          // 'Content-Type': 'multipart/form-data' is automatically set by browser for FormData
        },
        body: submissionFormData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        let errorMessage = t('adminAddTrainingProgram.messages.errorDefault');
        if (responseData && typeof responseData === 'object') {
          if (response.status === 409 || (responseData.name && responseData.name.some((err: string) => err.includes('already exists')))) {
            errorMessage = t('adminAddTrainingProgram.messages.errorConflict');
          } else {
            const errors = Object.entries(responseData)
              .map(([key, value]) => `${key}: ${(Array.isArray(value) ? value.join(', ') : value)}`)
              .join('; ');
            errorMessage = errors || errorMessage;
          }
        }
        throw new Error(errorMessage);
      }
      
      setSuccessMessage(t('adminAddTrainingProgram.messages.success'));
      setFormData({ name: '', description: '', duration_years: '' });
      setLogoFile(null);
      // Clear the file input visually (if possible, often tricky across browsers)
      const fileInput = document.getElementById('logo') as HTMLInputElement;
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
            {t('adminAddTrainingProgram.backButton')}
        </Button>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{t('adminAddTrainingProgram.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>{t('supervisors.addError.title')}</AlertTitle> {/* Reusing generic error title for now */}
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {successMessage && (
            <Alert variant="default" className="mb-4 bg-green-100 border-green-400 text-green-700">
              <AlertTitle>{t('supervisors.addSuccess.title')}</AlertTitle> {/* Reusing generic success title */}
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">{t('adminAddTrainingProgram.labels.name')} <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('adminAddTrainingProgram.placeholders.name')}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">{t('adminAddTrainingProgram.labels.description')} <span className="text-destructive">*</span></Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={t('adminAddTrainingProgram.placeholders.description')}
                required
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="duration_years">{t('adminAddTrainingProgram.labels.durationYears')} <span className="text-destructive">*</span></Label>
              <Input
                id="duration_years"
                name="duration_years"
                type="number"
                value={formData.duration_years}
                onChange={handleChange}
                placeholder={t('adminAddTrainingProgram.placeholders.durationYears')}
                required
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="logo">{t('adminAddTrainingProgram.labels.logo')}</Label>
              <Input
                id="logo"
                name="logo"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
            <CardFooter className="flex justify-end p-0 pt-6">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/training-programs')} className="mr-2">
                {t('actions.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('adminAddTrainingProgram.buttons.create')}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAddTrainingProgramPage; 