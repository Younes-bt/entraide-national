import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, ArrowLeft, PackagePlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Interface for Room (to populate dropdown)
interface Room {
  id: number;
  name: string;
}

// Interface for the Equipment data to be submitted
interface NewEquipmentData {
  name: string;
  description?: string;
  condition?: 'new' | 'excellent' | 'good' | 'fair' | 'need_reparation' | 'damaged';
  quantity?: number | string; // string to allow empty input initially
  picture?: File | null;
  room?: number | string; // Room ID, string for initial empty select value
  center: number; // Center ID
}

const CenterAddEquipmentPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  
  const [centerId, setCenterId] = useState<number | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [formData, setFormData] = useState<Partial<NewEquipmentData>>({
    name: '',
    description: '',
    condition: 'good', // Default condition
    quantity: '',
    picture: null,
    room: '', // Initially no room selected
  });
  const [loading, setLoading] = useState<boolean>(true); // For fetching center ID and rooms
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fetch the supervising center ID and its rooms
  useEffect(() => {
    const fetchInitialData = async () => {
      if (authUser?.role === 'center_supervisor' && authUser.id) {
        try {
          setLoading(true);
          // 1. Fetch supervising center
          const centerResponse = await apiClient.get<{ results: { id: number }[] }>(`/centers-app/centers/?supervisor=${authUser.id}`);
          if (centerResponse.data.results && centerResponse.data.results.length > 0) {
            const currentCenterId = centerResponse.data.results[0].id;
            setCenterId(currentCenterId);
            setFormData(prev => ({ ...prev, center: currentCenterId }));

            // 2. Fetch rooms for that center
            const roomsResponse = await apiClient.get<{ results: Room[] }>(`/centers-app/rooms/?center__id=${currentCenterId}&page_size=1000`); // Assuming rooms have a center filter
            setRooms(roomsResponse.data.results || []);
          } else {
            setError(t('centerAddEquipmentPage.errorNoCenterSupervised'));
          }
        } catch (err) {
          console.error("Error fetching initial data:", err);
          setError(t('centerAddEquipmentPage.errorFetchingInitialData'));
        }
      }
      setLoading(false);
    };
    fetchInitialData();
  }, [authUser, t]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name?.trim()) errors.name = t('centerAddEquipmentPage.validation.nameRequired');
    if (formData.quantity !== undefined && formData.quantity !== '' && !(Number(formData.quantity) > 0)) {
      errors.quantity = t('centerAddEquipmentPage.validation.quantityPositive');
    }
    if (!formData.center) errors.center = t('centerAddEquipmentPage.validation.centerIdMissing');
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        setError(t('centerAddEquipmentPage.errorCenterIdNotSet'));
        return;
    }

    setSubmitting(true);
    setError(null);

    const dataToSubmit = new FormData();
    dataToSubmit.append('name', formData.name!);
    dataToSubmit.append('center', String(centerId));
    if (formData.description) dataToSubmit.append('description', formData.description);
    if (formData.condition) dataToSubmit.append('condition', formData.condition);
    if (formData.quantity) dataToSubmit.append('quantity', String(formData.quantity));
    if (formData.room && formData.room !== "NO_ROOM") dataToSubmit.append('room', String(formData.room));
    if (formData.picture) dataToSubmit.append('picture', formData.picture);

    try {
      await apiClient.post('/centers-app/equipment/', dataToSubmit, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/center/equipment'); // Navigate back to the equipment list
    } catch (err: any) {
      console.error("Error creating equipment:", err);
      const errorMsg = err.response?.data?.detail || err.message || t('centerAddEquipmentPage.errorCreatingEquipment');
      setError(errorMsg);
      if (err.response?.data && typeof err.response.data === 'object') {
        const backendErrors: Record<string, string | string[]> = err.response.data;
        const newFormErrors: Record<string, string> = {};
        for (const key in backendErrors) {
            newFormErrors[key] = Array.isArray(backendErrors[key]) ? (backendErrors[key] as string[]).join(' ') : String(backendErrors[key]);
        }
        setFormErrors(prev => ({...prev, ...newFormErrors}));
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">{t('centerAddEquipmentPage.loadingInitialDataMessage')}</p>
      </div>
    );
  }

  if (error && !submitting && !centerId) { // Show critical error if centerId could not be fetched
    return (
      <Alert variant="destructive" className="m-4">
        <AlertTitle>{t('centerAddEquipmentPage.errorCritical')}</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
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
        {t('centerAddEquipmentPage.backToEquipmentList')}
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PackagePlus className="mr-2 h-6 w-6" /> 
            {t('centerAddEquipmentPage.title')}
          </CardTitle>
          <CardDescription>{t('centerAddEquipmentPage.description')}</CardDescription>
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
              <label htmlFor="name" className="block text-sm font-medium">{t('centerAddEquipmentPage.labels.name')}</label>
              <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required className="mt-1" />
              {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium">{t('centerAddEquipmentPage.labels.description')} ({t('common.optional')})</label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="mt-1" />
              {formErrors.description && <p className="text-xs text-red-500 mt-1">{formErrors.description}</p>}
            </div>

            <div>
              <label htmlFor="condition" className="block text-sm font-medium">{t('centerAddEquipmentPage.labels.condition')} ({t('common.optional')})</label>
              <Select name="condition" value={formData.condition} onValueChange={(value) => handleSelectChange('condition', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={t('centerAddEquipmentPage.placeholders.selectCondition')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">{t('equipmentConditions.new')}</SelectItem>
                  <SelectItem value="excellent">{t('equipmentConditions.excellent')}</SelectItem>
                  <SelectItem value="good">{t('equipmentConditions.good')}</SelectItem>
                  <SelectItem value="fair">{t('equipmentConditions.fair')}</SelectItem>
                  <SelectItem value="need_reparation">{t('equipmentConditions.need_reparation')}</SelectItem>
                  <SelectItem value="damaged">{t('equipmentConditions.damaged')}</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.condition && <p className="text-xs text-red-500 mt-1">{formErrors.condition}</p>}
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium">{t('centerAddEquipmentPage.labels.quantity')} ({t('common.optional')})</label>
              <Input id="quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} min="1" className="mt-1" />
              {formErrors.quantity && <p className="text-xs text-red-500 mt-1">{formErrors.quantity}</p>}
            </div>

            <div>
              <label htmlFor="room" className="block text-sm font-medium">{t('centerAddEquipmentPage.labels.room')} ({t('common.optional')})</label>
              <Select name="room" value={formData.room?.toString()} onValueChange={(value) => handleSelectChange('room', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={t('centerAddEquipmentPage.placeholders.selectRoom')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NO_ROOM">{t('centerAddEquipmentPage.placeholders.noRoomAssigned')}</SelectItem> 
                  {rooms.map(room => (
                    <SelectItem key={room.id} value={String(room.id)}>{room.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.room && <p className="text-xs text-red-500 mt-1">{formErrors.room}</p>}
            </div>

            <div>
              <label htmlFor="picture" className="block text-sm font-medium">{t('centerAddEquipmentPage.labels.picture')} ({t('common.optional')})</label>
              <Input id="picture" name="picture" type="file" onChange={handleFileChange} className="mt-1" accept="image/*" />
              {formErrors.picture && <p className="text-xs text-red-500 mt-1">{formErrors.picture}</p>}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={submitting}>
                    {t('actions.cancel')}
                </Button>
                <Button type="submit" disabled={submitting || !centerId} className="min-w-[120px]">
                    {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PackagePlus className="mr-2 h-4 w-4" />} 
                    {t('centerAddEquipmentPage.buttons.createEquipment')}
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CenterAddEquipmentPage; 