import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

// Interface for new group data
interface NewGroupData {
  name: string;
  description: string;
  center: number; // Center ID
}

const CenterAddGroupPage: React.FC = () => {
  const { t } = useTranslation();
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const [centerData, setCenterData] = useState<{ id: number; name: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const [newGroupData, setNewGroupData] = useState<NewGroupData>({
    name: '',
    description: '',
    center: 0, // Will be set when center data is loaded
  });

  useEffect(() => {
    const fetchSupervisingCenter = async () => {
      if (!authUser) {
        setError(t('centerAddGroupPage.accessDenied'));
        setLoading(false);
        return;
      }

      // @ts-ignore - Assuming authUser has id and role
      if (authUser.role === 'center_supervisor' && authUser.id) {
        try {
          setLoading(true);
          
          // Get the center supervised by this user
          const supervisedCentersResponse = await apiClient.get<{ results: { id: number; name: string }[] }>(`/centers-app/centers/?supervisor=${authUser.id}`);

          if (supervisedCentersResponse.data.results && supervisedCentersResponse.data.results.length > 0) {
            const centerInfo = supervisedCentersResponse.data.results[0];
            setCenterData(centerInfo);
            setNewGroupData(prev => ({ ...prev, center: centerInfo.id }));
            setError(null);
          } else {
            setError(t('centerAddGroupPage.errorNoCenterSupervised'));
          }
        } catch (err: any) {
          console.error('Error fetching supervising center ID:', err);
          setError(t('centerAddGroupPage.errorFetchingCenterId'));
        } finally {
          setLoading(false);
        }
      } else {
        setError(t('centerAddGroupPage.accessDenied'));
        setLoading(false);
      }
    };

    fetchSupervisingCenter();
  }, [authUser, t]);

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!newGroupData.name.trim()) {
      errors.name = t('centerAddGroupPage.validation.nameRequired');
    }

    if (!newGroupData.description.trim()) {
      errors.description = t('centerAddGroupPage.validation.descriptionRequired');
    }

    if (!newGroupData.center) {
      errors.center = t('centerAddGroupPage.validation.centerIdMissing');
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewGroupData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!newGroupData.center) {
      setError(t('centerAddGroupPage.errorCenterIdNotSet'));
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await apiClient.post('/centers-app/groups/', newGroupData);
      
      if (response.status === 201) {
        // Success - navigate back to groups list
        navigate('/center/groups');
      }
    } catch (err: any) {
      console.error('Error creating group:', err);
      setError(t('centerAddGroupPage.errorCreatingGroup'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center py-10">
          <span>{t('centerAddGroupPage.loadingCenterInfo')}</span>
        </div>
      </div>
    );
  }

  if (error && !centerData) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">{t('centerAddGroupPage.errorCritical')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => navigate('/center/groups')} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('centerAddGroupPage.backToGroupsList')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate('/center/groups')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{t('centerAddGroupPage.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('centerAddGroupPage.description')}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{t('centerAddGroupPage.title')}</CardTitle>
          <CardDescription>
            {centerData && `Adding group to: ${centerData.name}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Group Name */}
            <div className="space-y-2">
              <Label htmlFor="name">{t('centerAddGroupPage.labels.name')} *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={newGroupData.name}
                onChange={handleChange}
                placeholder={t('centerAddGroupPage.placeholders.name')}
                className={validationErrors.name ? 'border-red-500' : ''}
              />
              {validationErrors.name && (
                <p className="text-sm text-red-600">{validationErrors.name}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">{t('centerAddGroupPage.labels.description')} *</Label>
              <Textarea
                id="description"
                name="description"
                value={newGroupData.description}
                onChange={handleChange}
                placeholder={t('centerAddGroupPage.placeholders.description')}
                rows={4}
                className={validationErrors.description ? 'border-red-500' : ''}
              />
              {validationErrors.description && (
                <p className="text-sm text-red-600">{validationErrors.description}</p>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/center/groups')}
                disabled={submitting}
              >
                {t('common.cancelButton')}
              </Button>
              <Button 
                type="submit" 
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? t('centerAddGroupPage.buttons.creating') : t('centerAddGroupPage.buttons.createGroup')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CenterAddGroupPage; 