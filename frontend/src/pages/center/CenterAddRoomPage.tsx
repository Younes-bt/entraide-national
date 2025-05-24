import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Interface for the Room data to be submitted
interface NewRoomData {
  name: string;
  description?: string;
  type: 'classroom' | 'meeting_room' | 'auditorium' | 'lab' | 'other';
  capacity: number | string; // string to allow empty input initially
  is_available: boolean;
  center: number; // Center ID
  picture?: File | null;
}

const CenterAddRoomPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  
  const [centerId, setCenterId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<NewRoomData>>({
    name: '',
    description: '',
    type: 'classroom', // Default type
    capacity: '',
    is_available: true,
    picture: null,
  });
  const [loading, setLoading] = useState<boolean>(true); // Loading for fetching center ID
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fetch the supervising center ID once
  useEffect(() => {
    const fetchSupervisingCenter = async () => {
      if (authUser?.role === 'center_supervisor' && authUser.id) {
        try {
          const response = await apiClient.get<{ results: { id: number }[] }>(`/centers-app/centers/?supervisor=${authUser.id}`);
          if (response.data.results && response.data.results.length > 0) {
            setCenterId(response.data.results[0].id);
            setFormData(prev => ({ ...prev, center: response.data.results[0].id }));
          } else {
            setError(t('centerAddRoomPage.errorNoCenterSupervised'));
          }
        } catch (err) {
          console.error("Error fetching supervising center:", err);
          setError(t('centerAddRoomPage.errorFetchingCenterId'));
        }
      }
      setLoading(false);
    };
    fetchSupervisingCenter();
  }, [authUser, t]);

  // Basic validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name?.trim()) errors.name = t('centerAddRoomPage.validation.nameRequired');
    if (!formData.type) errors.type = t('centerAddRoomPage.validation.typeRequired');
    if (formData.capacity === undefined || formData.capacity === '' || !(Number(formData.capacity) > 0)) {
      errors.capacity = t('centerAddRoomPage.validation.capacityPositive');
    }
    if (!formData.center) errors.center = t('centerAddRoomPage.validation.centerIdMissing'); // Should not happen if fetched correctly
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      // @ts-ignore
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, picture: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!centerId) {
        setError(t('centerAddRoomPage.errorCenterIdNotSet'));
        return;
    }

    setSubmitting(true);
    setError(null);

    const dataToSubmit = new FormData();
    dataToSubmit.append('name', formData.name!);
    dataToSubmit.append('type', formData.type!);
    dataToSubmit.append('capacity', String(formData.capacity!));
    dataToSubmit.append('is_available', String(formData.is_available!));
    dataToSubmit.append('center', String(centerId)); // Use the fetched center ID
    if (formData.description) {
      dataToSubmit.append('description', formData.description);
    }
    if (formData.picture) {
      dataToSubmit.append('picture', formData.picture);
    }

    try {
      await apiClient.post('/centers-app/rooms/', dataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Ideally, show a success toast/notification here
      navigate('../rooms'); // Navigate back to the rooms list
    } catch (err: any) {
      console.error("Error creating room:", err);
      setError(err.response?.data?.detail || err.message || t('centerAddRoomPage.errorCreatingRoom'));
      // Potentially parse and set specific form errors from err.response.data
      if (err.response?.data && typeof err.response.data === 'object') {
        const backendErrors: Record<string, string> = {};
        for (const key in err.response.data) {
          if (Array.isArray(err.response.data[key])) {
            backendErrors[key] = err.response.data[key].join(' ');
          }
        }
        setFormErrors(prev => ({...prev, ...backendErrors}));
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">{t('centerAddRoomPage.loadingCenterInfo')}</p>
      </div>
    );
  }

  if (error && !submitting) { // Only show general error if not submitting (submission errors are handled in form)
    return (
      <Alert variant="destructive" className="m-4">
        <AlertTitle>{t('login_details.errorTitle')}</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button onClick={() => navigate(-1)} variant="link" className="mt-2">
          {t('common.backToList')}
        </Button>
      </Alert>
    );
  }
  
  if (!centerId && !loading) {
     return (
      <Alert variant="destructive" className="m-4">
        <AlertTitle>{t('centerAddRoomPage.errorCritical')}</AlertTitle>
        <AlertDescription>{t('centerAddRoomPage.errorNoCenterAssociatedAccount')}</AlertDescription>
        <Button onClick={() => navigate('/center/dashboard')} variant="link" className="mt-2">
          {t('sidebar.dashboard')}
        </Button>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('centerAddRoomPage.backToRoomsList')}
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>{t('centerAddRoomPage.title')}</CardTitle>
          <CardDescription>{t('centerAddRoomPage.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {error && submitting && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>{t('login_details.errorTitle')}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('centerAddRoomPage.labels.name')}</label>
              <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required className="mt-1" />
              {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('centerAddRoomPage.labels.description')} ({t('common.optional')})</label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="mt-1" />
              {formErrors.description && <p className="text-xs text-red-500 mt-1">{formErrors.description}</p>}
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('centerAddRoomPage.labels.type')}</label>
              <Select name="type" value={formData.type} onValueChange={(value) => handleSelectChange('type', value)} required>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={t('centerAddRoomPage.placeholders.selectType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classroom">{t('roomTypes.classroom')}</SelectItem>
                  <SelectItem value="meeting_room">{t('roomTypes.meeting_room')}</SelectItem>
                  <SelectItem value="auditorium">{t('roomTypes.auditorium')}</SelectItem>
                  <SelectItem value="lab">{t('roomTypes.lab')}</SelectItem>
                  <SelectItem value="other">{t('roomTypes.other')}</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.type && <p className="text-xs text-red-500 mt-1">{formErrors.type}</p>}
            </div>

            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('centerAddRoomPage.labels.capacity')}</label>
              <Input id="capacity" name="capacity" type="number" value={formData.capacity} onChange={handleChange} required min="1" className="mt-1" />
              {formErrors.capacity && <p className="text-xs text-red-500 mt-1">{formErrors.capacity}</p>}
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="is_available" name="is_available" checked={formData.is_available} onCheckedChange={(checked) => handleSelectChange('is_available', !!checked)} />
              <label htmlFor="is_available" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t('centerAddRoomPage.labels.isAvailable')}</label>
            </div>

            <div>
              <label htmlFor="picture" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('centerAddRoomPage.labels.picture')} ({t('common.optional')})</label>
              <Input id="picture" name="picture" type="file" onChange={handleFileChange} className="mt-1" accept="image/*" />
              {formErrors.picture && <p className="text-xs text-red-500 mt-1">{formErrors.picture}</p>}
            </div>

            <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={submitting}>
                    {t('common.cancelButton')}
                </Button>
                <Button type="submit" disabled={submitting || loading || !centerId}>
                    {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {t('centerAddRoomPage.buttons.createRoom')}
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CenterAddRoomPage; 