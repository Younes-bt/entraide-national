import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Edit, Trash2, Eye, ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from 'react-i18next';

// Equipment interface
interface Equipment {
  id: number;
  name: string;
  description?: string;
  quantity?: number;
  is_functional?: boolean;
  condition?: 'new' | 'excellent' | 'good' | 'fair' | 'need_reparation' | 'damaged';
}

// Room interface
interface Room {
  id: number;
  name: string;
  description?: string;
  type?: 'classroom' | 'meeting_room' | 'auditorium' | 'lab' | 'other';
  capacity?: number;
  is_available?: boolean;
  picture?: string | null;
  picture_url?: string | null;
  equipments?: Equipment[];
  created_at?: string;
  updated_at?: string;
}

// Group interface
interface Group {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// Center interface
interface Center {
  id: string | number;
  name: string;
  description?: string;
  logo?: string;
  logo_url?: string;
  phone_number?: string;
  email?: string;
  address?: string;
  city?: string;
  maps_link?: string;
  website?: string;
  facebook_link?: string;
  instagram_link?: string;
  twitter_link?: string;
  association?: number | string | null;
  association_name?: string;
  affiliated_to: 'entraide' | 'association' | 'other' | string;
  other_affiliation?: string;
  is_active?: boolean;
  is_verified?: boolean;
  supervisor?: number | string | null;
  supervisor_username?: string;
  supervisor_first_name?: string;
  supervisor_last_name?: string;
  rooms?: Room[];
  groups?: Group[];
  created_at?: string;
  updated_at?: string;
}

const AdminCenterDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const { centerId } = useParams<{ centerId: string }>();
  const navigate = useNavigate();
  const auth = useAuth();
  const userAccessToken = auth.accessToken;

  const [center, setCenter] = useState<Center | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCenterDetails = async () => {
      if (!centerId) {
        setError(t('adminCenterDetailsPage.errorNoCenterId', 'Center ID not provided'));
        setLoading(false);
        return;
      }

      if (!userAccessToken) {
        setError(t('adminCenterDetailsPage.errorAuthRequired', 'Authentication required'));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/centers-app/centers/${centerId}/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userAccessToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch center details' }));
          throw new Error(errorData.detail || 'Failed to fetch center details');
        }

        const data = await response.json();
        setCenter(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching center details:', err);
        setError(err.message || t('adminCenterDetailsPage.errorFetchingDetails', 'Failed to fetch center details'));
      } finally {
        setLoading(false);
      }
    };

    fetchCenterDetails();
  }, [centerId, userAccessToken, t]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAffiliationDisplay = (center: Center): string => {
    if (center.affiliated_to === 'other' && center.other_affiliation) {
      return center.other_affiliation;
    }
    const affiliationMap: { [key: string]: string } = {
      'entraide': t('adminCentersPage.affiliationEntraide', 'Entraide National'),
      'association': center.association_name || t('adminCentersPage.affiliationAssociation', 'Association'),
    };
    return affiliationMap[center.affiliated_to] || center.affiliated_to;
  };

  const handleEdit = () => {
    if (center) {
      navigate(`/admin/centers/edit/${center.id}`);
    }
  };

  const handleDelete = async () => {
    if (!center) return;
    
    if (window.confirm(t('adminCenterDetailsPage.confirmDelete', `Are you sure you want to delete "${center.name}"? This action cannot be undone.`))) {
      try {
        // TODO: Implement actual delete API call
        console.warn(`Delete center ${center.id}`);
        alert('Delete functionality to be implemented.');
        // navigate('/admin/centers');
      } catch (delErr: any) {
        setError(t('adminCenterDetailsPage.errorDeleting', 'Failed to delete center'));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-lg">{t('adminCenterDetailsPage.loadingDetails', 'Loading center details...')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertTitle>{t('login_details.errorTitle', 'Error')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => navigate('/admin/centers')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('adminCenterDetailsPage.backToCenters', 'Back to Centers')}
        </Button>
      </div>
    );
  }

  if (!center) {
    return (
      <div className="container mx-auto p-4">
        <Alert>
          <AlertTitle>{t('adminCenterDetailsPage.centerNotFoundTitle', 'Center Not Found')}</AlertTitle>
          <AlertDescription>{t('adminCenterDetailsPage.centerNotFoundDescription', 'The requested center could not be found.')}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => navigate('/admin/centers')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('adminCenterDetailsPage.backToCenters', 'Back to Centers')}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Back Button */}
      <Button variant="outline" onClick={() => navigate('/admin/centers')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('adminCenterDetailsPage.backToCenters', 'Back to Centers')}
      </Button>

      {/* Header Card */}
      <Card className="mb-6">
        <CardHeader className="flex flex-col items-center text-center space-y-4 pb-2">
          <Avatar className="h-24 w-24">
            <AvatarImage src={center.logo_url || center.logo || undefined} alt={center.name} />
            <AvatarFallback className="text-2xl font-bold">{center.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-3xl font-bold">{center.name}</CardTitle>
            <CardDescription className="text-lg">
              {center.city && `${center.city} • `}
              {getAffiliationDisplay(center)}
            </CardDescription>
          </div>
          
          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 justify-center">
            {center.is_active !== undefined && (
              <Badge variant={center.is_active ? "default" : "destructive"}>
                {center.is_active ? t('adminCentersPage.statusActive', 'Active') : t('adminCentersPage.statusInactive', 'Inactive')}
              </Badge>
            )}
            {center.is_verified !== undefined && (
              <Badge variant={center.is_verified ? "secondary" : "outline"}>
                {center.is_verified ? t('adminCentersPage.verifiedOnly', 'Verified') : t('adminCentersPage.unverifiedOnly', 'Unverified')}
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              {t('adminCenterDetailsPage.editCenter', 'Edit Center')}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              {t('adminCenterDetailsPage.deleteCenter', 'Delete Center')}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-2 text-center"> 
          {center.description && (
            <p className="text-muted-foreground mb-4">{center.description}</p>
          )}
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4 bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <TabsTrigger 
            value="general"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-50 dark:hover:bg-green-900/30 text-green-700 dark:text-green-300"
          >
            {t('adminCenterDetailsPage.tabGeneral', 'General Info')}
          </TabsTrigger>
          <TabsTrigger 
            value="contact"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-50 dark:hover:bg-green-900/30 text-green-700 dark:text-green-300"
          >
            {t('adminCenterDetailsPage.tabContact', 'Contact & Links')}
          </TabsTrigger>
          <TabsTrigger 
            value="rooms"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-50 dark:hover:bg-green-900/30 text-green-700 dark:text-green-300"
          >
            {t('adminCenterDetailsPage.tabRooms', 'Rooms')}
          </TabsTrigger>
          <TabsTrigger 
            value="groups"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-50 dark:hover:bg-green-900/30 text-green-700 dark:text-green-300"
          >
            {t('adminCenterDetailsPage.tabGroups', 'Groups')}
          </TabsTrigger>
        </TabsList>

        {/* General Information Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>{t('adminCenterDetailsPage.generalInfo.title', 'General Information')}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                    {t('adminCenterDetailsPage.generalInfo.basicInfo', 'Basic Information')}
                  </h4>
                  <div className="space-y-2">
                    <div><strong>{t('adminCenterDetailsPage.generalInfo.id', 'ID')}:</strong> {center.id}</div>
                    <div><strong>{t('adminCenterDetailsPage.generalInfo.affiliation', 'Affiliation')}:</strong> {getAffiliationDisplay(center)}</div>
                    {center.association_name && (
                      <div><strong>{t('adminCenterDetailsPage.generalInfo.association', 'Association')}:</strong> {center.association_name}</div>
                    )}
                    {center.affiliated_to === 'other' && center.other_affiliation && (
                      <div><strong>{t('adminCenterDetailsPage.generalInfo.otherAffiliation', 'Other Affiliation')}:</strong> {center.other_affiliation}</div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                    {t('adminCenterDetailsPage.generalInfo.supervisor', 'Supervisor')}
                  </h4>
                  <div className="space-y-2">
                    {center.supervisor_first_name && center.supervisor_last_name ? (
                      <div><strong>{t('adminCenterDetailsPage.generalInfo.supervisorName', 'Name')}:</strong> {center.supervisor_first_name} {center.supervisor_last_name}</div>
                    ) : null}
                    {center.supervisor_username && (
                      <div><strong>{t('adminCenterDetailsPage.generalInfo.supervisorUsername', 'Username')}:</strong> {center.supervisor_username}</div>
                    )}
                    {!center.supervisor_first_name && !center.supervisor_last_name && !center.supervisor_username && (
                      <div className="text-muted-foreground">{t('adminCenterDetailsPage.generalInfo.noSupervisor', 'No supervisor assigned')}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                    {t('adminCenterDetailsPage.generalInfo.statistics', 'Statistics')}
                  </h4>
                  <div className="space-y-2">
                    <div><strong>{t('adminCenterDetailsPage.generalInfo.roomsCount', 'Rooms')}:</strong> {center.rooms?.length || 0}</div>
                    <div><strong>{t('adminCenterDetailsPage.generalInfo.groupsCount', 'Groups')}:</strong> {center.groups?.length || 0}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                    {t('adminCenterDetailsPage.generalInfo.timestamps', 'Timestamps')}
                  </h4>
                  <div className="space-y-2">
                    <div><strong>{t('adminCenterDetailsPage.generalInfo.createdAt', 'Created')}:</strong> {formatDate(center.created_at)}</div>
                    <div><strong>{t('adminCenterDetailsPage.generalInfo.updatedAt', 'Last Updated')}:</strong> {formatDate(center.updated_at)}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact & Links Tab */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>{t('adminCenterDetailsPage.contact.title', 'Contact Information & Links')}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
                  {t('adminCenterDetailsPage.contact.contactInfo', 'Contact Information')}
                </h4>
                <div className="space-y-3">
                  <div>
                    <strong>{t('adminCenterDetailsPage.contact.email', 'Email')}:</strong>
                    {center.email ? (
                      <a href={`mailto:${center.email}`} className="ml-2 text-blue-600 hover:underline">
                        {center.email}
                      </a>
                    ) : (
                      <span className="ml-2 text-muted-foreground">N/A</span>
                    )}
                  </div>
                  <div>
                    <strong>{t('adminCenterDetailsPage.contact.phone', 'Phone')}:</strong>
                    {center.phone_number ? (
                      <a href={`tel:${center.phone_number}`} className="ml-2 text-blue-600 hover:underline">
                        {center.phone_number}
                      </a>
                    ) : (
                      <span className="ml-2 text-muted-foreground">N/A</span>
                    )}
                  </div>
                  <div>
                    <strong>{t('adminCenterDetailsPage.contact.address', 'Address')}:</strong>
                    <span className="ml-2">{center.address || 'N/A'}</span>
                  </div>
                  <div>
                    <strong>{t('adminCenterDetailsPage.contact.city', 'City')}:</strong>
                    <span className="ml-2">{center.city || 'N/A'}</span>
                  </div>
                  {center.maps_link && (
                    <div>
                      <strong>{t('adminCenterDetailsPage.contact.location', 'Location')}:</strong>
                      <a href={center.maps_link} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline inline-flex items-center">
                        {t('adminCenterDetailsPage.contact.viewOnMap', 'View on Map')}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
                  {t('adminCenterDetailsPage.contact.socialLinks', 'Website & Social Media')}
                </h4>
                <div className="space-y-3">
                  {center.website && (
                    <div>
                      <strong>{t('adminCenterDetailsPage.contact.website', 'Website')}:</strong>
                      <a href={center.website} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline inline-flex items-center">
                        {center.website}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  )}
                  {center.facebook_link && (
                    <div>
                      <strong>{t('adminCenterDetailsPage.contact.facebook', 'Facebook')}:</strong>
                      <a href={center.facebook_link} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline inline-flex items-center">
                        {t('adminCenterDetailsPage.contact.viewProfile', 'View Profile')}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  )}
                  {center.instagram_link && (
                    <div>
                      <strong>{t('adminCenterDetailsPage.contact.instagram', 'Instagram')}:</strong>
                      <a href={center.instagram_link} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline inline-flex items-center">
                        {t('adminCenterDetailsPage.contact.viewProfile', 'View Profile')}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  )}
                  {center.twitter_link && (
                    <div>
                      <strong>{t('adminCenterDetailsPage.contact.twitter', 'Twitter')}:</strong>
                      <a href={center.twitter_link} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline inline-flex items-center">
                        {t('adminCenterDetailsPage.contact.viewProfile', 'View Profile')}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  )}
                  {!center.website && !center.facebook_link && !center.instagram_link && !center.twitter_link && (
                    <div className="text-muted-foreground">{t('adminCenterDetailsPage.contact.noSocialLinks', 'No website or social media links available')}</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rooms Tab */}
        <TabsContent value="rooms">
          <Card>
            <CardHeader>
              <CardTitle>Rooms ({center.rooms?.length || 0})</CardTitle>
              <CardDescription>{t('adminCenterDetailsPage.rooms.description', 'All rooms available in this center')}</CardDescription>
            </CardHeader>
            <CardContent>
              {center.rooms && center.rooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {center.rooms.map(room => (
                    <Card key={room.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{room.name}</CardTitle>
                          <Badge variant="outline">ID: {room.id}</Badge>
                        </div>
                        {room.type && (
                          <CardDescription>{t(`roomTypes.${room.type}`, room.type)}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {room.description && (
                          <p className="text-sm text-muted-foreground">{room.description}</p>
                        )}
                        <div className="text-sm space-y-1">
                          <div><strong>{t('adminCenterDetailsPage.rooms.capacity', 'Capacity')}:</strong> {room.capacity || 'N/A'}</div>
                          <div>
                            <strong>{t('adminCenterDetailsPage.rooms.available', 'Available')}:</strong>
                            <Badge variant={room.is_available ? "default" : "secondary"} className="ml-2">
                              {room.is_available ? t('common.yes', 'Yes') : t('common.no', 'No')}
                            </Badge>
                          </div>
                          {room.equipments && room.equipments.length > 0 && (
                            <div><strong>{t('adminCenterDetailsPage.rooms.equipment', 'Equipment')}:</strong> {room.equipments.length} {t('adminCenterDetailsPage.rooms.items', 'items')}</div>
                          )}
                        </div>
                        <div className="pt-2">
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="mr-2 h-4 w-4" />
                            {t('adminCenterDetailsPage.rooms.viewDetails', 'View Details')}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">{t('adminCenterDetailsPage.rooms.noRooms', 'No rooms found for this center')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Groups Tab */}
        <TabsContent value="groups">
          <Card>
            <CardHeader>
              <CardTitle>Groups ({center.groups?.length || 0})</CardTitle>
              <CardDescription>{t('adminCenterDetailsPage.groups.description', 'All student groups in this center')}</CardDescription>
            </CardHeader>
            <CardContent>
              {center.groups && center.groups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {center.groups.map(group => (
                    <Card key={group.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{group.name}</CardTitle>
                          <Badge variant="outline">ID: {group.id}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {group.description && (
                          <p className="text-sm text-muted-foreground">{group.description}</p>
                        )}
                        <div className="text-sm space-y-1">
                          <div><strong>{t('adminCenterDetailsPage.groups.createdAt', 'Created')}:</strong> {formatDate(group.created_at)}</div>
                          <div><strong>{t('adminCenterDetailsPage.groups.updatedAt', 'Updated')}:</strong> {formatDate(group.updated_at)}</div>
                        </div>
                        <div className="pt-2">
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="mr-2 h-4 w-4" />
                            {t('adminCenterDetailsPage.groups.viewDetails', 'View Details')}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">{t('adminCenterDetailsPage.groups.noGroups', 'No groups found for this center')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCenterDetailsPage; 