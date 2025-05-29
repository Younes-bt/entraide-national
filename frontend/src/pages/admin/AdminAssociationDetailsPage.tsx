import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Facebook, 
  Instagram, 
  Twitter,
  Building,
  Calendar,
  ExternalLink,
  FileText,
  UserCheck
} from 'lucide-react';

// Extended Association interface for details
interface AssociationDetails {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  city?: string;
  registration_number?: string;
  website?: string;
  facebook_link?: string;
  instagram_link?: string;
  twitter_link?: string;
  maps_link?: string;
  contract_start_date?: string;
  contract_end_date?: string;
  is_active?: boolean;
  is_verified?: boolean;
  supervisor?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    arabic_first_name?: string;
    arabic_last_name?: string;
  };
  centers?: Center[];
  created_at?: string;
  updated_at?: string;
}

interface Center {
  id: number;
  name: string;
  city?: string;
  phone_number?: string;
  is_active?: boolean;
  is_verified?: boolean;
}

const AdminAssociationDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useAuth();

  const [association, setAssociation] = useState<AssociationDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssociationDetails = async () => {
      if (!id) {
        setError(t('adminAssociationDetailsPage.errorNoAssociationId') || 'Association ID not provided');
        setLoading(false);
        return;
      }

      if (!accessToken) {
        setError(t('adminAssociationDetailsPage.errorAuthRequired') || 'Authentication required');
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
          let errorData;
          try {
            errorData = await response.json();
          } catch {
            // Not JSON response
          }
          const errorMessage = errorData?.detail || response.statusText || `HTTP error! status: ${response.status}`;
          throw new Error(errorMessage);
        }

        const data = await response.json();
        setAssociation(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : (t('adminAssociationDetailsPage.errorFetchingDetails') || 'Failed to fetch association details'));
        console.error("Failed to fetch association details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssociationDetails();
  }, [id, accessToken, t]);

  const handleEdit = () => {
    navigate(`/admin/associations/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!association || !accessToken) return;
    
    const confirmMessage = t('adminAssociationDetailsPage.confirmDelete', { name: association.name }) || 
                          `Are you sure you want to delete this association? This action cannot be undone.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        const response = await fetch(`/api/associations/${id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete association');
        }

        navigate('/admin/associations');
      } catch (err) {
        setError(err instanceof Error ? err.message : (t('adminAssociationDetailsPage.errorDeleting') || 'Failed to delete association'));
      }
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return t('adminAssociationDetailsPage.notAvailable') || 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <p>{t('adminAssociationDetailsPage.loadingDetails') || 'Loading association details...'}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/associations')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('adminAssociationDetailsPage.backToAssociations') || 'Back to Associations'}
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">
              {t('adminAssociationDetailsPage.associationNotFoundTitle') || 'Association Not Found'}
            </CardTitle>
            <CardDescription>
              {error}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!association) {
    return (
      <div className="container mx-auto p-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/associations')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('adminAssociationDetailsPage.backToAssociations') || 'Back to Associations'}
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>
              {t('adminAssociationDetailsPage.associationNotFoundTitle') || 'Association Not Found'}
            </CardTitle>
            <CardDescription>
              {t('adminAssociationDetailsPage.associationNotFoundDescription') || 'The requested association could not be found.'}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/associations')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('adminAssociationDetailsPage.backToAssociations') || 'Back to Associations'}
          </Button>
          <div className="flex items-center space-x-3">
            {association.logo ? (
              <img 
                src={association.logo} 
                alt={`${association.name} logo`}
                className="h-12 w-12 rounded-full object-cover border" 
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 text-lg font-semibold border">
                {association.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {association.name}
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                {association.is_active !== undefined && (
                  <Badge variant={association.is_active ? "default" : "secondary"}>
                    {association.is_active ? 
                      (t('adminAssociationDetailsPage.statusActive') || 'Active') : 
                      (t('adminAssociationDetailsPage.statusInactive') || 'Inactive')
                    }
                  </Badge>
                )}
                {association.is_verified !== undefined && (
                  <Badge variant={association.is_verified ? "default" : "outline"}>
                    {association.is_verified ? 
                      (t('adminAssociationDetailsPage.statusVerified') || 'Verified') : 
                      (t('adminAssociationDetailsPage.statusUnverified') || 'Unverified')
                    }
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            {t('adminAssociationDetailsPage.editAssociation') || 'Edit Association'}
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            {t('adminAssociationDetailsPage.deleteAssociation') || 'Delete Association'}
          </Button>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger 
            value="general"
            className="data-[state=active]:bg-[#409E09] data-[state=active]:text-white"
          >
            {t('adminAssociationDetailsPage.tabGeneral') || 'General Info'}
          </TabsTrigger>
          <TabsTrigger 
            value="contact"
            className="data-[state=active]:bg-[#409E09] data-[state=active]:text-white"
          >
            {t('adminAssociationDetailsPage.tabContact') || 'Contact & Links'}
          </TabsTrigger>
          <TabsTrigger 
            value="centers"
            className="data-[state=active]:bg-[#409E09] data-[state=active]:text-white"
          >
            {t('adminAssociationDetailsPage.tabCenters') || 'Centers'}
          </TabsTrigger>
          <TabsTrigger 
            value="contract"
            className="data-[state=active]:bg-[#409E09] data-[state=active]:text-white"
          >
            {t('adminAssociationDetailsPage.tabContract') || 'Contract'}
          </TabsTrigger>
        </TabsList>

        {/* General Information Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                {t('adminAssociationDetailsPage.generalInfo.title') || 'General Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {t('adminAssociationDetailsPage.generalInfo.basicInfo') || 'Basic Information'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('adminAssociationDetailsPage.generalInfo.id') || 'ID'}
                    </label>
                    <p className="text-sm">{association.id}</p>
                  </div>
                  {association.description && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('adminAssociationDetailsPage.generalInfo.description') || 'Description'}
                      </label>
                      <p className="text-sm">{association.description}</p>
                    </div>
                  )}
                  {association.registration_number && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('adminAssociationDetailsPage.generalInfo.registrationNumber') || 'Registration Number'}
                      </label>
                      <p className="text-sm">{association.registration_number}</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Supervisor */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <UserCheck className="mr-2 h-5 w-5" />
                  {t('adminAssociationDetailsPage.generalInfo.supervisor') || 'Supervisor'}
                </h3>
                {association.supervisor ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('adminAssociationDetailsPage.generalInfo.supervisorName') || 'Name'}
                      </label>
                      <p className="text-sm">
                        {association.supervisor.first_name} {association.supervisor.last_name}
                        {association.supervisor.arabic_first_name && association.supervisor.arabic_last_name && (
                          <span className="text-gray-500 ml-2">
                            ({association.supervisor.arabic_first_name} {association.supervisor.arabic_last_name})
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('adminAssociationDetailsPage.generalInfo.supervisorEmail') || 'Email'}
                      </label>
                      <p className="text-sm">{association.supervisor.email}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    {t('adminAssociationDetailsPage.generalInfo.noSupervisor') || 'No supervisor assigned'}
                  </p>
                )}
              </div>

              <Separator />

              {/* Statistics */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {t('adminAssociationDetailsPage.generalInfo.statistics') || 'Statistics'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">
                        {t('adminAssociationDetailsPage.generalInfo.centersCount') || 'Centers'}
                      </p>
                      <p className="text-lg font-semibold">{association.centers?.length || 0}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Timestamps */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {t('adminAssociationDetailsPage.generalInfo.timestamps') || 'Timestamps'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('adminAssociationDetailsPage.generalInfo.createdAt') || 'Created At'}
                    </label>
                    <p className="text-sm">{formatDate(association.created_at)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('adminAssociationDetailsPage.generalInfo.updatedAt') || 'Last Updated'}
                    </label>
                    <p className="text-sm">{formatDate(association.updated_at)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact & Links Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                {t('adminAssociationDetailsPage.contact.title') || 'Contact Information & Links'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {t('adminAssociationDetailsPage.contact.contactInfo') || 'Contact Information'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('adminAssociationDetailsPage.contact.email') || 'Email'}
                      </label>
                      <p className="text-sm">{association.email || (t('adminAssociationDetailsPage.notAvailable') || 'N/A')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('adminAssociationDetailsPage.contact.phone') || 'Phone'}
                      </label>
                      <p className="text-sm">{association.phone_number || (t('adminAssociationDetailsPage.notAvailable') || 'N/A')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('adminAssociationDetailsPage.contact.address') || 'Address'}
                      </label>
                      <p className="text-sm">{association.address || (t('adminAssociationDetailsPage.notAvailable') || 'N/A')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('adminAssociationDetailsPage.contact.city') || 'City'}
                      </label>
                      <p className="text-sm">{association.city || (t('adminAssociationDetailsPage.notAvailable') || 'N/A')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Location */}
              {association.maps_link && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    {t('adminAssociationDetailsPage.contact.location') || 'Location'}
                  </h3>
                  <Button variant="outline" asChild>
                    <a href={association.maps_link} target="_blank" rel="noopener noreferrer">
                      <MapPin className="mr-2 h-4 w-4" />
                      {t('adminAssociationDetailsPage.contact.viewOnMap') || 'View on Map'}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              )}

              {/* Social Links */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {t('adminAssociationDetailsPage.contact.socialLinks') || 'Website & Social Media'}
                </h3>
                {(association.website || association.facebook_link || association.instagram_link || association.twitter_link) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {association.website && (
                      <Button variant="outline" asChild>
                        <a href={association.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="mr-2 h-4 w-4" />
                          {t('adminAssociationDetailsPage.contact.website') || 'Website'}
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {association.facebook_link && (
                      <Button variant="outline" asChild>
                        <a href={association.facebook_link} target="_blank" rel="noopener noreferrer">
                          <Facebook className="mr-2 h-4 w-4" />
                          {t('adminAssociationDetailsPage.contact.facebook') || 'Facebook'}
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {association.instagram_link && (
                      <Button variant="outline" asChild>
                        <a href={association.instagram_link} target="_blank" rel="noopener noreferrer">
                          <Instagram className="mr-2 h-4 w-4" />
                          {t('adminAssociationDetailsPage.contact.instagram') || 'Instagram'}
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {association.twitter_link && (
                      <Button variant="outline" asChild>
                        <a href={association.twitter_link} target="_blank" rel="noopener noreferrer">
                          <Twitter className="mr-2 h-4 w-4" />
                          {t('adminAssociationDetailsPage.contact.twitter') || 'Twitter'}
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    {t('adminAssociationDetailsPage.contact.noSocialLinks') || 'No website or social media links available'}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Centers Tab */}
        <TabsContent value="centers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5" />
                {t('adminAssociationDetailsPage.centers.title') || 'Associated Centers'}
              </CardTitle>
              <CardDescription>
                {t('adminAssociationDetailsPage.centers.description') || 'All centers affiliated with this association'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {association.centers && association.centers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {association.centers.map((center) => (
                    <Card key={center.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{center.name}</CardTitle>
                        <div className="flex items-center space-x-2">
                          {center.is_active !== undefined && (
                            <Badge variant={center.is_active ? "default" : "secondary"} className="text-xs">
                              {center.is_active ? 
                                (t('adminAssociationDetailsPage.centers.active') || 'Active') : 
                                (t('adminAssociationDetailsPage.centers.inactive') || 'Inactive')
                              }
                            </Badge>
                          )}
                          {center.is_verified !== undefined && (
                            <Badge variant={center.is_verified ? "default" : "outline"} className="text-xs">
                              {center.is_verified ? 
                                (t('adminAssociationDetailsPage.centers.verified') || 'Verified') : 
                                (t('adminAssociationDetailsPage.centers.unverified') || 'Unverified')
                              }
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          {center.city && (
                            <p className="flex items-center">
                              <MapPin className="mr-2 h-3 w-3" />
                              {center.city}
                            </p>
                          )}
                          {center.phone_number && (
                            <p className="flex items-center">
                              <Phone className="mr-2 h-3 w-3" />
                              {center.phone_number}
                            </p>
                          )}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-3 w-full"
                          onClick={() => navigate(`/admin/centers/details/${center.id}`)}
                        >
                          {t('adminAssociationDetailsPage.centers.viewDetails') || 'View Details'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  {t('adminAssociationDetailsPage.centers.noCenters') || 'No centers found for this association'}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contract Tab */}
        <TabsContent value="contract" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                {t('adminAssociationDetailsPage.contract.title') || 'Contract Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('adminAssociationDetailsPage.contract.startDate') || 'Contract Start Date'}
                    </label>
                    <p className="text-sm">{formatDate(association.contract_start_date)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('adminAssociationDetailsPage.contract.endDate') || 'Contract End Date'}
                    </label>
                    <p className="text-sm">{formatDate(association.contract_end_date)}</p>
                  </div>
                </div>
              </div>
              {!association.contract_start_date && !association.contract_end_date && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  {t('adminAssociationDetailsPage.contract.noContractInfo') || 'No contract information available'}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAssociationDetailsPage; 