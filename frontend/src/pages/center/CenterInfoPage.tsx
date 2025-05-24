import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/apiClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from 'react-i18next';

// Define an interface for Equipment
interface Equipment {
  id: number;
  name: string;
  description?: string;
  quantity?: number;
  is_functional?: boolean;
  // Add other fields from your Equipment model as needed
}

// Define an interface for Room
interface Room {
  id: number;
  name: string;
  description?: string;
  type?: string; // e.g., 'classroom', 'office', 'meeting_room'
  capacity?: number;
  is_available?: boolean;
  picture?: string | null;
  equipments?: Equipment[]; // Array of Equipment objects
  // Add other fields from your Room model as needed
}

// Define an interface for Group
interface Group {
  id: number;
  name: string;
  description?: string;
  // Add other fields from your Group model as needed, e.g., number_of_members if available
}

// Updated Center interface to include rooms and groups
interface Center {
  id: number;
  name: string;
  description: string;
  logo: string | null;
  logo_url?: string | null;
  phone_number: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  maps_link: string | null;
  website: string | null;
  facebook_link: string | null;
  instagram_link: string | null;
  twitter_link: string | null;
  association_name?: string;
  affiliated_to: string | null;
  other_affiliation: string | null;
  is_active: boolean;
  is_verified: boolean;
  supervisor_username?: string;
  supervisor_first_name?: string;
  supervisor_last_name?: string;
  rooms?: Room[]; // Array of Room objects
  groups?: Group[]; // Array of Group objects
  created_at?: string; 
  updated_at?: string;
}

const CenterInfoPage: React.FC = () => {
  const { t } = useTranslation();
  const { user: authUser } = useAuth();
  const [centerData, setCenterData] = useState<Center | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCenterInfo = async () => {
      if (!authUser) {
        setError(t('login_details.authRequired'));
        setLoading(false);
        return;
      }

      // @ts-ignore - Assuming authUser has id and role
      if (authUser.role === 'center_supervisor' && authUser.id) {
        try {
          setLoading(true);
          const supervisedCentersResponse = await apiClient.get<{ results: { id: number }[] }>(`/centers-app/centers/?supervisor=${authUser.id}`);

          if (supervisedCentersResponse.data.results && supervisedCentersResponse.data.results.length > 0) {
            const centerIdToFetch = supervisedCentersResponse.data.results[0].id;
            const centerResponse = await apiClient.get<Center>(`/centers-app/centers/${centerIdToFetch}/`);
            setCenterData(centerResponse.data);
            setError(null);
          } else {
            setError('No center is currently assigned to this supervisor account, or the center data could not be retrieved.');
          }
        } catch (err: any) {
          console.error('Error fetching center information for supervisor:', err);
          setError(err.response?.data?.detail || err.message || 'Failed to fetch center information. Please ensure you are assigned as a supervisor to a center.');
        } finally {
          setLoading(false);
        }
      } else {
        setError('Access denied. This page is for center supervisors, or your user ID is missing.');
        setLoading(false);
      }
    };

    fetchCenterInfo();
  }, [authUser, t]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Loading center information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>{t('login_details.errorTitle')}</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!centerData) {
    return (
      <Alert>
        <AlertTitle>No Data</AlertTitle>
        <AlertDescription>Center information could not be loaded or is not available.</AlertDescription>
      </Alert>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center space-x-4 pb-2">
          <Avatar className="h-20 w-20">
            <AvatarImage src={centerData.logo_url || centerData.logo || undefined} alt={centerData.name} />
            <AvatarFallback>{centerData.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-3xl font-bold">{centerData.name}</CardTitle>
            <CardDescription className="text-lg">
              Managed by: {centerData.supervisor_first_name} {centerData.supervisor_last_name} ({centerData.supervisor_username})
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-2"> 
          <p className="text-muted-foreground mb-4">{centerData.description}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4">
          <TabsTrigger value="general">{t('centerInfoPage.tabGeneralInfo')}</TabsTrigger>
          <TabsTrigger value="contact">{t('centerInfoPage.tabContactLinks')}</TabsTrigger>
          <TabsTrigger value="rooms">{t('centerInfoPage.tabRooms')}</TabsTrigger>
          <TabsTrigger value="groups">{t('centerInfoPage.tabGroups')}</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>{t('centerInfoPage.generalInfo.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><strong>{t('centerInfoPage.generalInfo.affiliatedTo')}</strong> {centerData.affiliated_to}{centerData.affiliated_to === 'other' && centerData.other_affiliation ? ` (${centerData.other_affiliation})` : ''}</div>
              <div><strong>{t('centerInfoPage.generalInfo.association')}</strong> {centerData.association_name || 'N/A'}</div>
              <div>
                <strong>{t('centerInfoPage.generalInfo.status')}</strong> 
                {centerData.is_active ? t('centerInfoPage.generalInfo.active') : t('centerInfoPage.generalInfo.inactive')} 
                {centerData.is_verified ? <span className="text-green-600 font-semibold">{t('centerInfoPage.generalInfo.verified')}</span> : <span className="text-orange-600 font-semibold">{t('centerInfoPage.generalInfo.notVerified')}</span>}
              </div>
              <div><strong>{t('centerInfoPage.generalInfo.registeredOn')}</strong> {formatDate(centerData.created_at)}</div>
              <div><strong>{t('centerInfoPage.generalInfo.lastUpdated')}</strong> {formatDate(centerData.updated_at)}</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>{t('centerInfoPage.contactLinks.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><strong>{t('centerInfoPage.contactLinks.email')}</strong> {centerData.email || 'N/A'}</div>
              <div><strong>{t('centerInfoPage.contactLinks.phone')}</strong> {centerData.phone_number || 'N/A'}</div>
              <div><strong>{t('centerInfoPage.contactLinks.address')}</strong> {`${centerData.address || 'N/A'}, ${centerData.city || 'N/A'}`}</div>
              {centerData.maps_link && <div><strong>{t('centerInfoPage.contactLinks.location')}</strong> <a href={centerData.maps_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{t('centerInfoPage.contactLinks.viewOnMap')}</a></div>}
              {centerData.website && <div><strong>{t('centerInfoPage.contactLinks.website')}</strong> <a href={centerData.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{centerData.website}</a></div>}
              {centerData.facebook_link && <div><strong>{t('centerInfoPage.contactLinks.facebook')}</strong> <a href={centerData.facebook_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{t('centerInfoPage.contactLinks.viewProfile')}</a></div>}
              {centerData.instagram_link && <div><strong>{t('centerInfoPage.contactLinks.instagram')}</strong> <a href={centerData.instagram_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{t('centerInfoPage.contactLinks.viewProfile')}</a></div>}
              {centerData.twitter_link && <div><strong>{t('centerInfoPage.contactLinks.twitter')}</strong> <a href={centerData.twitter_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{t('centerInfoPage.contactLinks.viewProfile')}</a></div>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms">
          <Card>
            <CardHeader>
              <CardTitle>{t('centerInfoPage.rooms.title', { count: centerData.rooms?.length || 0 })}</CardTitle>
              <CardDescription>{t('centerInfoPage.rooms.description')}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {centerData.rooms && centerData.rooms.length > 0 ? (
                centerData.rooms.map(room => (
                  <Card 
                    key={room.id} 
                    className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/center/rooms/${room.id}`)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{room.name}</CardTitle>
                      {room.type && <CardDescription>{room.type}</CardDescription>}
                    </CardHeader>
                    <CardContent className="text-sm space-y-1 flex-grow">
                      {room.description && <p className="text-xs text-muted-foreground mb-1">{room.description}</p>}
                      <p><strong>{t('centerInfoPage.rooms.capacity')}</strong> {room.capacity !== undefined ? room.capacity : 'N/A'}</p>
                      <p><strong>{t('centerInfoPage.rooms.available')}</strong> {room.is_available ? t('common.yes') : t('common.no')}</p>
                      {room.equipments && room.equipments.length > 0 && (
                        <p><strong>{t('centerInfoPage.rooms.equipment')}</strong> {t('centerInfoPage.rooms.equipmentItems', { count: room.equipments.length })}</p>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="col-span-full text-muted-foreground">{t('centerInfoPage.rooms.noRooms')}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups">
          <Card>
            <CardHeader>
              <CardTitle>{t('centerInfoPage.groups.title', { count: centerData.groups?.length || 0 })}</CardTitle>
              <CardDescription>{t('centerInfoPage.groups.description')}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {centerData.groups && centerData.groups.length > 0 ? (
                centerData.groups.map(group => (
                  <Card key={group.id} className="flex flex-col">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-1 flex-grow">
                      {group.description && <p className="text-xs text-muted-foreground">{group.description}</p>}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="col-span-full text-muted-foreground">{t('centerInfoPage.groups.noGroups')}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CenterInfoPage;