import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AssociationData {
  id: number;
  name: string;
  description: string;
  email: string;
  phone_number: string;
  address: string;
  city: string;
  registration_number: string;
  website: string;
  facebook_link: string;
  instagram_link: string;
  twitter_link: string;
  maps_link: string;
  contract_start_date: string;
  contract_end_date: string;
  supervisor: number | null;
}

interface Supervisor {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

const AdminEditAssociationPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useAuth();

  const [formData, setFormData] = useState<AssociationData>({
    id: 0,
    name: '',
    description: '',
    email: '',
    phone_number: '',
    address: '',
    city: '',
    registration_number: '',
    website: '',
    facebook_link: '',
    instagram_link: '',
    twitter_link: '',
    maps_link: '',
    contract_start_date: '',
    contract_end_date: '',
    supervisor: null,
  });

  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch association data
  useEffect(() => {
    const fetchAssociationData = async () => {
      if (!id) {
        setError('Association ID not provided in URL');
        setLoading(false);
        return;
      }
      
      if (!accessToken) {
        setError('Authentication token missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/associations/${id}/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch association data');
        }

        const data = await response.json();
        setFormData({
          id: data.id,
          name: data.name || '',
          description: data.description || '',
          email: data.email || '',
          phone_number: data.phone_number || '',
          address: data.address || '',
          city: data.city || '',
          registration_number: data.registration_number || '',
          website: data.website || '',
          facebook_link: data.facebook_link || '',
          instagram_link: data.instagram_link || '',
          twitter_link: data.twitter_link || '',
          maps_link: data.maps_link || '',
          contract_start_date: data.contract_start_date || '',
          contract_end_date: data.contract_end_date || '',
          supervisor: data.supervisor?.id || null,
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch association data');
        console.error('Failed to fetch association data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssociationData();
  }, [id, accessToken]);

  // Fetch supervisors
  useEffect(() => {
    const fetchSupervisors = async () => {
      if (!accessToken) return;

      try {
        const response = await fetch('/api/accounts/users/?role=association_supervisor', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSupervisors(data.results || data || []);
        }
      } catch (err) {
        console.error('Failed to fetch supervisors:', err);
      }
    };

    fetchSupervisors();
  }, [accessToken]);

  const handleInputChange = (field: keyof AssociationData, value: string | number | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError(t('adminEditAssociationPage.nameRequired'));
      return;
    }

    if (!accessToken) {
      setError(t('adminEditAssociationPage.authRequired'));
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        name: formData.name,
        description: formData.description,
        email: formData.email || null,
        phone_number: formData.phone_number || null,
        address: formData.address || null,
        city: formData.city || null,
        registration_number: formData.registration_number || null,
        website: formData.website || null,
        facebook_link: formData.facebook_link || null,
        instagram_link: formData.instagram_link || null,
        twitter_link: formData.twitter_link || null,
        maps_link: formData.maps_link || null,
        contract_start_date: formData.contract_start_date || null,
        contract_end_date: formData.contract_end_date || null,
        supervisor: formData.supervisor,
      };

      const response = await fetch(`/api/associations/${id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          // Not JSON response
        }
        throw new Error(errorData?.detail || `HTTP error! status: ${response.status}`);
      }

      // Success
      navigate(`/admin/associations/details/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('adminEditAssociationPage.unknownError'));
      console.error('Failed to update association:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>{t('adminEditAssociationPage.loadingData')}</span>
          </div>
        </div>
      </div>
    );
  }

  if (error && !formData.id) {
    return (
      <div className="container mx-auto p-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/associations')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('adminEditAssociationPage.backToDetails')}
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">{t('adminEditAssociationPage.errorLoadingTitle')}</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/admin/associations/details/${id}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('adminEditAssociationPage.backToDetails')}
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('adminEditAssociationPage.title')}: {formData.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('adminEditAssociationPage.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t('adminEditAssociationPage.basicInfoTitle')}</CardTitle>
            <CardDescription>
              {t('adminEditAssociationPage.basicInfoDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {t('adminEditAssociationPage.associationName')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={t('adminEditAssociationPage.enterName')}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registration_number">{t('adminEditAssociationPage.registrationNumber')}</Label>
                <Input
                  id="registration_number"
                  value={formData.registration_number}
                  onChange={(e) => handleInputChange('registration_number', e.target.value)}
                  placeholder={t('adminEditAssociationPage.enterRegistration')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('adminEditAssociationPage.description')}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder={t('adminEditAssociationPage.enterDescription')}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supervisor">{t('adminEditAssociationPage.supervisor')}</Label>
              <Select
                value={formData.supervisor?.toString() || 'none'}
                onValueChange={(value) => handleInputChange('supervisor', value === 'none' ? null : parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('adminEditAssociationPage.selectSupervisor')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t('adminEditAssociationPage.noSupervisor')}</SelectItem>
                  {supervisors.map((supervisor) => (
                    <SelectItem key={supervisor.id} value={supervisor.id.toString()}>
                      {supervisor.first_name} {supervisor.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t('adminEditAssociationPage.contactInfoTitle')}</CardTitle>
            <CardDescription>
              {t('adminEditAssociationPage.contactInfoDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('adminEditAssociationPage.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder={t('adminEditAssociationPage.enterEmail')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">{t('adminEditAssociationPage.phoneNumber')}</Label>
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => handleInputChange('phone_number', e.target.value)}
                  placeholder={t('adminEditAssociationPage.enterPhone')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">{t('adminEditAssociationPage.address')}</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder={t('adminEditAssociationPage.enterAddress')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">{t('adminEditAssociationPage.city')}</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder={t('adminEditAssociationPage.enterCity')}
                />
              </div>
            </div>

            <Separator />

            <h4 className="text-sm font-medium">{t('adminEditAssociationPage.socialMediaTitle')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">{t('adminEditAssociationPage.websiteUrl')}</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder={t('adminEditAssociationPage.websitePlaceholder')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maps_link">{t('adminEditAssociationPage.mapsLink')}</Label>
                <Input
                  id="maps_link"
                  type="url"
                  value={formData.maps_link}
                  onChange={(e) => handleInputChange('maps_link', e.target.value)}
                  placeholder={t('adminEditAssociationPage.mapsPlaceholder')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebook_link">{t('adminEditAssociationPage.facebookUrl')}</Label>
                <Input
                  id="facebook_link"
                  type="url"
                  value={formData.facebook_link}
                  onChange={(e) => handleInputChange('facebook_link', e.target.value)}
                  placeholder={t('adminEditAssociationPage.facebookPlaceholder')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram_link">{t('adminEditAssociationPage.instagramUrl')}</Label>
                <Input
                  id="instagram_link"
                  type="url"
                  value={formData.instagram_link}
                  onChange={(e) => handleInputChange('instagram_link', e.target.value)}
                  placeholder={t('adminEditAssociationPage.instagramPlaceholder')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter_link">{t('adminEditAssociationPage.twitterUrl')}</Label>
                <Input
                  id="twitter_link"
                  type="url"
                  value={formData.twitter_link}
                  onChange={(e) => handleInputChange('twitter_link', e.target.value)}
                  placeholder={t('adminEditAssociationPage.twitterPlaceholder')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t('adminEditAssociationPage.contractInfoTitle')}</CardTitle>
            <CardDescription>
              {t('adminEditAssociationPage.contractInfoDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contract_start_date">{t('adminEditAssociationPage.contractStartDate')}</Label>
                <Input
                  id="contract_start_date"
                  type="date"
                  value={formData.contract_start_date}
                  onChange={(e) => handleInputChange('contract_start_date', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contract_end_date">{t('adminEditAssociationPage.contractEndDate')}</Label>
                <Input
                  id="contract_end_date"
                  type="date"
                  value={formData.contract_end_date}
                  onChange={(e) => handleInputChange('contract_end_date', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/admin/associations/details/${id}`)}
            disabled={saving}
          >
            {t('adminEditAssociationPage.cancel')}
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="bg-[#409E09] hover:bg-[#367A08] text-white"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('adminEditAssociationPage.saving')}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {t('adminEditAssociationPage.saveChanges')}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditAssociationPage; 