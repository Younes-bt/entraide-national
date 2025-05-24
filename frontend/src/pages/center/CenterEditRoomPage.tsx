import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface RoomData {
  id: number;
  name: string;
  description?: string;
  type: 'classroom' | 'meeting_room' | 'auditorium' | 'lab' | 'other';
  capacity: number | string; 
  is_available: boolean;
  center: number; 
  picture?: File | null;
  picture_url?: string | null; // To display existing picture
}

const CenterEditRoomPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const { user: authUser } = useAuth();
  
  const [initialLoading, setInitialLoading] = useState<boolean>(true); // For fetching initial room data
  const [formData, setFormData] = useState<Partial<RoomData>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [currentPictureUrl, setCurrentPictureUrl] = useState<string | null | undefined>(null);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomId) {
        setError(t('centerEditRoomPage.errorNoRoomId'));
        setInitialLoading(false);
        return;
      }
      try {
        setInitialLoading(true);
        const response = await apiClient.get<RoomData>(`/centers-app/rooms/${roomId}/`);
        const roomData = response.data;
        setFormData({
          ...roomData,
          capacity: roomData.capacity?.toString() ?? '', // Ensure capacity is string for input
          picture: null // Don't pre-fill file input, handle separately
        });
        setCurrentPictureUrl(roomData.picture_url);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching room data:", err);
        setError(err.response?.data?.detail || err.message || t('centerEditRoomPage.errorFetchingData'));
      } finally {
        setInitialLoading(false);
      }
    };

    fetchRoomData();
  }, [roomId, t]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name?.trim()) errors.name = t('centerAddRoomPage.validation.nameRequired'); // Re-use from add page
    if (!formData.type) errors.type = t('centerAddRoomPage.validation.typeRequired');
    if (formData.capacity === undefined || formData.capacity === '' || !(Number(formData.capacity) > 0)) {
      errors.capacity = t('centerAddRoomPage.validation.capacityPositive');
    }
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

  const handleSelectChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, picture: e.target.files![0] }));
      setCurrentPictureUrl(URL.createObjectURL(e.target.files![0])); // Preview new image
    } else {
      // If file is cleared, reset to null or original picture if desired
      setFormData(prev => ({ ...prev, picture: null }));
      // Decide if you want to revert to original or show no picture
      // For now, let's assume if they clear it, they want it removed or original to be kept if no new one uploaded.
      // Backend will handle if picture field is not sent (means no change) or sent as null (means remove)
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm() || !roomId) return;

    setSubmitting(true);
    setError(null);

    const dataToSubmit = new FormData();
    dataToSubmit.append('name', formData.name!);
    dataToSubmit.append('type', formData.type!);
    dataToSubmit.append('capacity', String(formData.capacity!));
    dataToSubmit.append('is_available', String(formData.is_available!));
    // Center ID doesn't change for an existing room, but API might require it or might ignore it.
    // If your API for PATCH/PUT doesn't require center, you can omit this.
    // For safety, include it if unsure and backend is designed to ignore it if not changeable.
    if (formData.center) {
        dataToSubmit.append('center', String(formData.center));
    }

    if (formData.description) {
      dataToSubmit.append('description', formData.description);
    }
    // Only append picture if a new one has been selected
    if (formData.picture) {
      dataToSubmit.append('picture', formData.picture);
    }
    // If you need to explicitly signal picture removal, you might send 'picture': null or an empty string
    // This depends on your backend API design for handling file updates/clears.

    try {
      await apiClient.patch(`/centers-app/rooms/${roomId}/`, dataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate(`../${roomId}`); // Navigate back to the room details page
    } catch (err: any) {
      console.error("Error updating room:", err);
      setError(err.response?.data?.detail || err.message || t('centerEditRoomPage.errorUpdatingRoom'));
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

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-lg">{t('centerEditRoomPage.loadingInitialData')}</p>
      </div>
    );
  }

  if (error && !submitting && !initialLoading) {
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
  
  if (!formData.id && !initialLoading) { // If no room data after loading (e.g. invalid roomId)
     return (
      <Alert variant="destructive" className="m-4">
        <AlertTitle>{t('centerEditRoomPage.errorRoomNotFound')}</AlertTitle>
        <AlertDescription>{t('centerEditRoomPage.errorRoomNotFoundDescription')}</AlertDescription>
        <Button onClick={() => navigate('../')} variant="link" className="mt-2">
           {t('centerRoomDetailsPage.backToRoomsList')} 
        </Button>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('centerEditRoomPage.backToRoomDetails')}
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>{t('centerEditRoomPage.title', { roomName: formData.name || 'Room' })}</CardTitle>
          <CardDescription>{t('centerEditRoomPage.description')}</CardDescription>
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
              <label htmlFor="name" className="block text-sm font-medium">{t('centerAddRoomPage.labels.name')}</label>
              <Input id="name" name="name" type="text" value={formData.name || ''} onChange={handleChange} required className="mt-1" />
              {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium">{t('centerAddRoomPage.labels.description')} ({t('common.optional')})</label>
              <Textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} className="mt-1" />
              {formErrors.description && <p className="text-xs text-red-500 mt-1">{formErrors.description}</p>}
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium">{t('centerAddRoomPage.labels.type')}</label>
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
              <label htmlFor="capacity" className="block text-sm font-medium">{t('centerAddRoomPage.labels.capacity')}</label>
              <Input id="capacity" name="capacity" type="number" value={formData.capacity || ''} onChange={handleChange} required min="1" className="mt-1" />
              {formErrors.capacity && <p className="text-xs text-red-500 mt-1">{formErrors.capacity}</p>}
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="is_available" name="is_available" checked={formData.is_available} onCheckedChange={(checked) => handleSelectChange('is_available', !!checked)} />
              <label htmlFor="is_available" className="text-sm font-medium leading-none">{t('centerAddRoomPage.labels.isAvailable')}</label>
            </div>

            <div>
              <label htmlFor="picture" className="block text-sm font-medium">{t('centerAddRoomPage.labels.picture')} ({t('common.optional')})</label>
              {currentPictureUrl && (
                <div className="mt-2 mb-2">
                  <img src={formData.picture ? currentPictureUrl : (currentPictureUrl.startsWith('blob:') ? currentPictureUrl : currentPictureUrl) } alt={t('centerEditRoomPage.currentImageAlt')} className="max-h-40 rounded" />
                  <p className="text-xs text-muted-foreground mt-1">{t('centerEditRoomPage.currentImageNotice')}</p>
                </div>
              )}
              <Input id="picture" name="picture" type="file" onChange={handleFileChange} className="mt-1" accept="image/*" />
              {formErrors.picture && <p className="text-xs text-red-500 mt-1">{formErrors.picture}</p>}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={submitting}>
                    {t('actions.cancel')}
                </Button>
                <Button type="submit" disabled={submitting || initialLoading} className="bg-primary hover:bg-primary/90">
                    {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {t('centerEditRoomPage.buttons.saveChanges')}
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CenterEditRoomPage; 