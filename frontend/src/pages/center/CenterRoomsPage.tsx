import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/apiClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Home, Users, CalendarDays, CheckCircle, XCircle, Package, Tv, HelpCircle, Zap, Wrench, ShieldAlert, ShieldCheck, Building, PlusCircle, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Interface for Equipment
interface Equipment {
  id: number;
  name: string;
  description?: string;
  condition?: 'new' | 'excellent' | 'good' | 'fair' | 'need_reparation' | 'damaged';
  quantity?: number;
  picture?: string | null; // Assuming this will be a URL
  created_at?: string;
  updated_at?: string;
}

// Interface for Room
interface Room {
  id: number;
  name: string;
  description?: string;
  type?: 'classroom' | 'meeting_room' | 'auditorium' | 'lab' | 'other';
  capacity?: number;
  is_available?: boolean;
  picture?: string | null; // Original path, might still be useful or can be removed if not needed
  picture_url?: string | null; // Full URL for display
  equipments?: Equipment[];
  created_at?: string;
  updated_at?: string;
}

// Interface for Center (simplified for this page's needs, but fetching gives full object)
interface Center {
  id: number;
  name: string;
  rooms?: Room[];
  // Add other fields if needed for display, e.g., supervisor info from CenterInfoPage
  // supervisor_first_name?: string;
  // supervisor_last_name?: string;
}

const CenterRoomsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user: authUser } = useAuth();
  const [centerData, setCenterData] = useState<Center | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCenterRooms = async () => {
      if (!authUser) {
        setError(t('login_details.authRequired'));
        setLoading(false);
        return;
      }

      // @ts-ignore - Assuming authUser has id and role
      if (authUser.role === 'center_supervisor' && authUser.id) {
        try {
          setLoading(true);
          // First, get the ID of the center supervised by the current user
          const supervisedCentersResponse = await apiClient.get<{ results: { id: number; name: string }[] }>(`/centers-app/centers/?supervisor=${authUser.id}`);

          if (supervisedCentersResponse.data.results && supervisedCentersResponse.data.results.length > 0) {
            const centerIdToFetch = supervisedCentersResponse.data.results[0].id;
            // Then, fetch the full details of that center, which includes rooms
            const centerResponse = await apiClient.get<Center>(`/centers-app/centers/${centerIdToFetch}/`);
            setCenterData(centerResponse.data);
            setError(null);
          } else {
            setError(t('centerRoomsPage.noCenterAssigned'));
          }
        } catch (err: any) {
          console.error(t('centerRoomsPage.errorFetching'), err);
          setError(err.response?.data?.detail || err.message || t('centerRoomsPage.errorFetchingDetail'));
        } finally {
          setLoading(false);
        }
      } else {
        setError(t('centerRoomsPage.accessDenied'));
        setLoading(false);
      }
    };

    fetchCenterRooms();
  }, [authUser, t]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getConditionBadgeVariant = (condition?: Equipment['condition']): "default" | "secondary" | "destructive" | "outline" => {
    switch (condition) {
      case 'new':
      case 'excellent':
        return 'default'; // Or a success-like variant if you have one
      case 'good':
        return 'secondary';
      case 'fair':
        return 'outline';
      case 'need_reparation':
      case 'damaged':
        return 'destructive';
      default:
        return 'outline';
    }
  };
  
  const getRoomTypeIcon = (type?: Room['type']) => {
    switch (type) {
      case 'classroom': return <Users className="mr-2 h-5 w-5 text-blue-500" />;
      case 'meeting_room': return <Building className="mr-2 h-5 w-5 text-green-500" />;
      case 'auditorium': return <Tv className="mr-2 h-5 w-5 text-purple-500" />;
      case 'lab': return <Zap className="mr-2 h-5 w-5 text-orange-500" />;
      case 'other': return <HelpCircle className="mr-2 h-5 w-5 text-gray-500" />;
      default: return <Home className="mr-2 h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-lg">{t('centerRoomsPage.loadingMessage')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>{t('login_details.errorTitle')}</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!centerData || !centerData.rooms || centerData.rooms.length === 0) {
    return (
      <Alert className="m-4">
        <HelpCircle className="h-4 w-4" />
        <AlertTitle>{centerData ? t('centerRoomsPage.noRoomsTitle', { centerName: centerData.name }) : t('centerRoomsPage.noCenterDataTitle')}</AlertTitle>
        <AlertDescription>
          {centerData ? t('centerRoomsPage.noRoomsDescription') : t('centerRoomsPage.noCenterDataDescription')}
        </AlertDescription>
        {centerData && (
          <div className="mt-4">
            <Link to="add">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                {t('centerRoomsPage.addNewRoomButton')}
              </Button>
            </Link>
          </div>
        )}
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('centerRoomsPage.pageTitle', { centerName: centerData.name })}</h1>
          <p className="text-muted-foreground">{t('centerRoomsPage.pageSubtitle', { count: centerData.rooms.length })}</p>
        </div>
        <Link to="add" className="mt-4 sm:mt-0">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('centerRoomsPage.addNewRoomButton')}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {centerData.rooms.map(room => (
          <Card key={room.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            {room.picture_url && (
              <div className="w-full h-48 overflow-hidden">
                <img src={room.picture_url} alt={room.name} className="w-full h-full object-cover" />
              </div>
            )}
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center">
                {getRoomTypeIcon(room.type)}
                {room.name}
              </CardTitle>
              {room.description && <CardDescription className="text-sm mt-1">{room.description}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-3 text-sm flex-grow">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{t('centerInfoPage.rooms.created')}: {formatDate(room.created_at)}</span>
                <span>{t('centerInfoPage.rooms.updated')}: {formatDate(room.updated_at)}</span>
              </div>
               <Separator />
              <div className="flex items-center space-x-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span>{t('centerInfoPage.rooms.capacity')}: <strong>{room.capacity ?? 'N/A'}</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                {room.is_available ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                <span>{t('centerInfoPage.rooms.available')}: <strong>{room.is_available ? t('common.yes') : t('common.no')}</strong></span>
              </div>
              {room.type && (
                <div className="flex items-center space-x-2">
                   {getRoomTypeIcon(room.type)}
                  <span>{t('centerInfoPage.rooms.type')}: <strong>{t(`roomTypes.${room.type}`, room.type)}</strong></span>
                </div>
              )}
             
              {room.equipments && room.equipments.length > 0 && (
                <>
                  <Separator className="my-3"/>
                  <div>
                    <h4 className="text-md font-semibold mb-2 flex items-center">
                      <Package className="mr-2 h-5 w-5 text-indigo-500" />
                      {t('centerInfoPage.rooms.equipment')} ({room.equipments.length})
                    </h4>
                    <Table className="mt-2">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="p-2">{t('centerInfoPage.equipment.name', 'Name')}</TableHead>
                          <TableHead className="p-2 text-center w-[60px]">{t('centerInfoPage.equipment.quantityShort', 'Qty')}</TableHead>
                          <TableHead className="p-2 hidden sm:table-cell">{t('centerInfoPage.equipment.condition', 'Condition')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {room.equipments.map(equip => (
                          <TableRow key={equip.id} className="text-xs">
                            <TableCell className="p-2 font-medium">{equip.name}</TableCell>
                            <TableCell className="p-2 text-center">{equip.quantity ?? 'N/A'}</TableCell>
                            <TableCell className="p-2 hidden sm:table-cell">
                              {equip.condition && 
                                <Badge variant={getConditionBadgeVariant(equip.condition)} className="text-xs px-1 py-0.5">
                                  {t('equipmentConditions.' + equip.condition, equip.condition)}
                                </Badge>
                              }
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
               {(!room.equipments || room.equipments.length === 0) && (
                 <>
                  <Separator className="my-3"/>
                  <p className="text-xs text-muted-foreground italic flex items-center">
                    <Package className="mr-2 h-4 w-4" />
                    {t('centerInfoPage.rooms.noEquipment')}
                  </p>
                 </>
               )}
            </CardContent>
            <CardFooter className="pt-3 pb-3 border-t">
              <Button variant="outline" size="sm" asChild>
                <Link to={`${room.id}`}>
                  <Eye className="mr-2 h-4 w-4" /> 
                  {t('centerRoomsPage.viewDetailsButton')}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CenterRoomsPage; 