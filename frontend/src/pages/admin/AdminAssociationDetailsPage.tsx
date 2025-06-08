import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  UserCheck,
  Users
} from 'lucide-react';

// Extended Association interface for details
interface AssociationDetails {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  logo_url?: string;
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
    <div className="container mx-auto p-4 space-y-8">
      {/* Back Button */}
      <Button 
        variant="outline" 
        onClick={() => navigate('/admin/associations')}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('adminAssociationDetailsPage.backToAssociations') || 'Back to Associations'}
      </Button>

      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-[#409E09]/5 to-[#409E09]/10 border-[#409E09]/20">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0">
            {/* Left Side - Logo and Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Logo */}
              <div className="flex-shrink-0">
                {association.logo_url ? (
                  <img 
                    src={association.logo_url} 
                    alt={`${association.name} logo`}
                    className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg" 
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-[#409E09] flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                    {association.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Name, Description and Badges */}
              <div className="space-y-3">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {association.name}
                  </h1>
                  {association.description && (
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                      {association.description}
                    </p>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  {association.is_active !== undefined && (
                    <Badge variant={association.is_active ? "default" : "secondary"} className="bg-[#409E09]">
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
                  {association.registration_number && (
                    <Badge variant="outline" className="bg-white/50">
                      ID: {association.registration_number}
                    </Badge>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-[#409E09]" />
                    <span className="font-medium">{association.centers?.length || 0}</span>
                    <span>{t('adminAssociationDetailsPage.generalInfo.centersCount') || 'Centers'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-[#409E09]" />
                    <span>{t('adminAssociationDetailsPage.generalInfo.createdAt') || 'Created'} {formatDate(association.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button variant="outline" onClick={handleEdit} className="border-[#409E09] text-[#409E09] hover:bg-[#409E09] hover:text-white">
                <Edit className="mr-2 h-4 w-4" />
                {t('adminAssociationDetailsPage.editAssociation') || 'Edit'}
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                {t('adminAssociationDetailsPage.deleteAssociation') || 'Delete'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact & Links Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Mail className="mr-3 h-6 w-6 text-[#409E09]" />
            {t('adminAssociationDetailsPage.contact.title') || 'Contact Information & Links'}
          </CardTitle>
          <CardDescription>
            {t('adminAssociationDetailsPage.contact.description') || 'Get in touch with the association'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <Mail className="h-5 w-5 text-[#409E09]" />
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {t('adminAssociationDetailsPage.contact.email') || 'Email'}
                </label>
                <p className="text-sm font-medium">{association.email || (t('adminAssociationDetailsPage.notAvailable') || 'N/A')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <Phone className="h-5 w-5 text-[#409E09]" />
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {t('adminAssociationDetailsPage.contact.phone') || 'Phone'}
                </label>
                <p className="text-sm font-medium">{association.phone_number || (t('adminAssociationDetailsPage.notAvailable') || 'N/A')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <MapPin className="h-5 w-5 text-[#409E09]" />
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {t('adminAssociationDetailsPage.contact.city') || 'City'}
                </label>
                <p className="text-sm font-medium">{association.city || (t('adminAssociationDetailsPage.notAvailable') || 'N/A')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <MapPin className="h-5 w-5 text-[#409E09]" />
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {t('adminAssociationDetailsPage.contact.address') || 'Address'}
                </label>
                <p className="text-sm font-medium">{association.address || (t('adminAssociationDetailsPage.notAvailable') || 'N/A')}</p>
              </div>
            </div>
          </div>

          {/* Social Links & Website */}
          {(association.website || association.facebook_link || association.instagram_link || association.twitter_link || association.maps_link) && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Globe className="mr-2 h-5 w-5 text-[#409E09]" />
                  {t('adminAssociationDetailsPage.contact.socialLinks') || 'Website & Social Media'}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {association.website && (
                    <Button variant="outline" asChild size="sm">
                      <a href={association.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="mr-2 h-4 w-4" />
                        {t('adminAssociationDetailsPage.contact.website') || 'Website'}
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </a>
                    </Button>
                  )}
                  {association.facebook_link && (
                    <Button variant="outline" asChild size="sm">
                      <a href={association.facebook_link} target="_blank" rel="noopener noreferrer">
                        <Facebook className="mr-2 h-4 w-4" />
                        {t('adminAssociationDetailsPage.contact.facebook') || 'Facebook'}
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </a>
                    </Button>
                  )}
                  {association.instagram_link && (
                    <Button variant="outline" asChild size="sm">
                      <a href={association.instagram_link} target="_blank" rel="noopener noreferrer">
                        <Instagram className="mr-2 h-4 w-4" />
                        {t('adminAssociationDetailsPage.contact.instagram') || 'Instagram'}
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </a>
                    </Button>
                  )}
                  {association.twitter_link && (
                    <Button variant="outline" asChild size="sm">
                      <a href={association.twitter_link} target="_blank" rel="noopener noreferrer">
                        <Twitter className="mr-2 h-4 w-4" />
                        {t('adminAssociationDetailsPage.contact.twitter') || 'Twitter'}
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </a>
                    </Button>
                  )}
                  {association.maps_link && (
                    <Button variant="outline" asChild size="sm">
                      <a href={association.maps_link} target="_blank" rel="noopener noreferrer">
                        <MapPin className="mr-2 h-4 w-4" />
                        {t('adminAssociationDetailsPage.contact.viewOnMap') || 'View on Map'}
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Supervisor Section */}
      {association.supervisor && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <UserCheck className="mr-3 h-6 w-6 text-[#409E09]" />
              {t('adminAssociationDetailsPage.generalInfo.supervisor') || 'Supervisor'}
            </CardTitle>
            <CardDescription>
              Association management contact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="h-12 w-12 rounded-full bg-[#409E09] flex items-center justify-center text-white font-semibold">
                {association.supervisor.first_name.charAt(0)}{association.supervisor.last_name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold">
                  {association.supervisor.first_name} {association.supervisor.last_name}
                  {association.supervisor.arabic_first_name && association.supervisor.arabic_last_name && (
                    <span className="text-gray-500 ml-2 font-normal">
                      ({association.supervisor.arabic_first_name} {association.supervisor.arabic_last_name})
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{association.supervisor.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Centers Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-xl">
            <div className="flex items-center">
              <Building className="mr-3 h-6 w-6 text-[#409E09]" />
              {t('adminAssociationDetailsPage.centers.title') || 'Associated Centers'}
              <Badge variant="outline" className="ml-3">
                {association.centers?.length || 0}
              </Badge>
            </div>
          </CardTitle>
          <CardDescription>
            {t('adminAssociationDetailsPage.centers.description') || 'All centers affiliated with this association'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {association.centers && association.centers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {association.centers.map((center) => (
                <Card key={center.id} className="hover:shadow-md transition-all duration-200 hover:border-[#409E09]/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      {center.name}
                      <div className="flex items-center space-x-1">
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
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      {center.city && (
                        <p className="flex items-center">
                          <MapPin className="mr-2 h-3 w-3 text-[#409E09]" />
                          {center.city}
                        </p>
                      )}
                      {center.phone_number && (
                        <p className="flex items-center">
                          <Phone className="mr-2 h-3 w-3 text-[#409E09]" />
                          {center.phone_number}
                        </p>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-[#409E09] text-[#409E09] hover:bg-[#409E09] hover:text-white"
                      onClick={() => navigate(`/admin/centers/details/${center.id}`)}
                    >
                      {t('adminAssociationDetailsPage.centers.viewDetails') || 'View Details'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {t('adminAssociationDetailsPage.centers.noCenters') || 'No centers found for this association'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contract & Administrative Info Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <FileText className="mr-3 h-6 w-6 text-[#409E09]" />
            {t('adminAssociationDetailsPage.contract.title') || 'Contract & Administrative Information'}
          </CardTitle>
          <CardDescription>
            Contract details and system information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contract Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-[#409E09]" />
              Contract Period
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <Calendar className="h-5 w-5 text-[#409E09]" />
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {t('adminAssociationDetailsPage.contract.startDate') || 'Start Date'}
                  </label>
                  <p className="text-sm font-medium">{formatDate(association.contract_start_date)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <Calendar className="h-5 w-5 text-[#409E09]" />
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {t('adminAssociationDetailsPage.contract.endDate') || 'End Date'}
                  </label>
                  <p className="text-sm font-medium">{formatDate(association.contract_end_date)}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* System Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FileText className="mr-2 h-5 w-5 text-[#409E09]" />
              System Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <FileText className="h-5 w-5 text-[#409E09]" />
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {t('adminAssociationDetailsPage.generalInfo.id') || 'System ID'}
                  </label>
                  <p className="text-sm font-medium">#{association.id}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <Calendar className="h-5 w-5 text-[#409E09]" />
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {t('adminAssociationDetailsPage.generalInfo.createdAt') || 'Created'}
                  </label>
                  <p className="text-sm font-medium">{formatDate(association.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <Calendar className="h-5 w-5 text-[#409E09]" />
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {t('adminAssociationDetailsPage.generalInfo.updatedAt') || 'Last Updated'}
                  </label>
                  <p className="text-sm font-medium">{formatDate(association.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAssociationDetailsPage; 