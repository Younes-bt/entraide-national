import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, ArrowLeft, Home, Users, CalendarDays, CheckCircle, XCircle, Package, Tv, HelpCircle, Zap, Building, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Interfaces
interface Equipment {
  id: number;
  name: string;
  description?: string;
  condition?: 'new' | 'excellent' | 'good' | 'fair' | 'need_reparation' | 'damaged';
  quantity?: number;
  is_functional?: boolean;
  picture?: string | null; 
  picture_url?: string | null; 
  created_at?: string;
  updated_at?: string;
}

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
  center?: number;
}

const AdminRoomDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const { roomId, centerId } = useParams<{ roomId: string; centerId?: string }>();
  const navigate = useNavigate();
  const auth = useAuth();
  const userAccessToken = auth.accessToken;

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!roomId) {
        setError(t('adminRoomDetailsPage.errorNoRoomId', 'Room ID not provided'));
        setLoading(false);
        return;
      }

      if (!userAccessToken) {
        setError(t('adminRoomDetailsPage.errorAuthRequired', 'Authentication required'));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/centers-app/rooms/${roomId}/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userAccessToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch room details' }));
          throw new Error(errorData.detail || 'Failed to fetch room details');
        }

        const data = await response.json();
        setRoom(data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching room details:", err);
        setError(err.message || t('adminRoomDetailsPage.errorFetchingDetails', 'Failed to fetch room details'));
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId, userAccessToken, t]);

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
  
  const getConditionBadgeVariant = (condition?: Equipment['condition']): "default" | "secondary" | "destructive" | "outline" => {
    switch (condition) {
      case 'new': case 'excellent': return 'default';
      case 'good': return 'secondary';
      case 'fair': return 'outline';
      case 'need_reparation': case 'damaged': return 'destructive';
      default: return 'outline';
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

  const handleEditRoom = () => {
    if (room) {
      navigate(`/admin/rooms/edit/${room.id}`);
    }
  };

  const handleDeleteRoom = async () => {
    if (!room) return;
    
    if (window.confirm(t('adminRoomDetailsPage.confirmDelete', `Are you sure you want to delete "${room.name}"? This action cannot be undone.`))) {
      try {
        // TODO: Implement actual delete API call
        console.warn(`Delete room ${room.id}`);
        alert('Delete functionality to be implemented.');
        // Navigate back based on whether we came from a center or general rooms list
        // if (centerId) {
        //   navigate(`/admin/centers/${centerId}`);
        // } else {
        //   navigate('/admin/rooms');
        // }
      } catch (err: any) {
        console.error("Error deleting room:", err);
        setError(err.message || t('adminRoomDetailsPage.errorDeletingRoom', 'Failed to delete room'));
      }
    }
  };

  const handleBackNavigation = () => {
    if (centerId) {
      navigate(`/admin/centers/details/${centerId}`);
    } else {
      navigate('/admin/rooms');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-lg">{t('adminRoomDetailsPage.loadingRoomDetails', 'Loading room details...')}</p>
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
        <Button variant="outline" onClick={handleBackNavigation} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {centerId ? t('adminRoomDetailsPage.backToCenter', 'Back to Center') : t('adminRoomDetailsPage.backToRoomsList', 'Back to Rooms')}
        </Button>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="container mx-auto p-4">
        <Alert>
          <AlertTitle>{t('adminRoomDetailsPage.roomNotFoundTitle', 'Room Not Found')}</AlertTitle>
          <AlertDescription>{t('adminRoomDetailsPage.roomNotFoundDescription', 'The requested room could not be found.')}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={handleBackNavigation} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {centerId ? t('adminRoomDetailsPage.backToCenter', 'Back to Center') : t('adminRoomDetailsPage.backToRoomsList', 'Back to Rooms')}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Button variant="outline" onClick={handleBackNavigation} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {centerId ? t('adminRoomDetailsPage.backToCenter', 'Back to Center') : t('adminRoomDetailsPage.backToRoomsList', 'Back to Rooms')}
      </Button>

      <Card className="overflow-hidden">
        {room.picture_url && (
          <div className="w-full h-64 bg-muted overflow-hidden">
            <img src={room.picture_url} alt={room.name} className="w-full h-full object-cover" />
          </div>
        )}
        <CardHeader className="border-b bg-green-50 dark:bg-green-900/20">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
            <div>
              <CardTitle className="text-3xl font-bold flex items-center text-green-800 dark:text-green-200">
                {getRoomTypeIcon(room.type)}
                {room.name}
              </CardTitle>
              {room.description && (
                <CardDescription className="mt-1 text-lg text-green-700 dark:text-green-300">
                  {room.description}
                </CardDescription>
              )}
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline" className="border-green-300 text-green-700 dark:border-green-600 dark:text-green-300">
                  ID: {room.id}
                </Badge>
                {room.type && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                    {t(`roomTypes.${room.type}`, room.type)}
                  </Badge>
                )}
              </div>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-4 flex space-x-2">
              <Button variant="outline" onClick={handleEditRoom} className="border-green-300 text-green-700 hover:bg-green-50 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-900/30">
                <Edit className="mr-2 h-4 w-4" />
                {t('adminRoomDetailsPage.editRoom', 'Edit Room')}
              </Button>
              <Button variant="destructive" onClick={handleDeleteRoom}>
                <Trash2 className="mr-2 h-4 w-4" />
                {t('adminRoomDetailsPage.deleteRoom', 'Delete Room')}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-4 text-green-800 dark:text-green-200 border-b border-green-200 dark:border-green-700 pb-2">
                {t('adminRoomDetailsPage.sectionTitles.generalInfo', 'General Information')}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">{t('adminRoomDetailsPage.fields.type', 'Type')}:</span>
                  <span>{room.type ? t(`roomTypes.${room.type}`, room.type) : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{t('adminRoomDetailsPage.fields.capacity', 'Capacity')}:</span>
                  <span>{room.capacity ?? 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t('adminRoomDetailsPage.fields.isAvailable', 'Available')}:</span>
                  <div className="flex items-center">
                    {room.is_available ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-1" />
                    )}
                    <Badge variant={room.is_available ? "default" : "destructive"}>
                      {room.is_available ? t('common.yes', 'Yes') : t('common.no', 'No')}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4 text-green-800 dark:text-green-200 border-b border-green-200 dark:border-green-700 pb-2">
                {t('adminRoomDetailsPage.sectionTitles.timestamps', 'Timestamps')}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">{t('adminRoomDetailsPage.fields.createdAt', 'Created')}:</span>
                  <span className="text-sm">{formatDate(room.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{t('adminRoomDetailsPage.fields.updatedAt', 'Last Updated')}:</span>
                  <span className="text-sm">{formatDate(room.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {room.equipments && room.equipments.length > 0 && (
            <>
              <Separator className="my-6" />
              <div>
                <h3 className="font-semibold text-xl mb-4 flex items-center text-green-800 dark:text-green-200">
                  <Package className="mr-3 h-6 w-6 text-green-600" /> 
                  {t('adminRoomDetailsPage.sectionTitles.equipmentInRoom', 'Equipment in Room')} ({room.equipments.length})
                </h3>
                <div className="border border-green-200 dark:border-green-700 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-green-50 dark:bg-green-900/20">
                      <TableRow>
                        <TableHead className="font-semibold text-green-800 dark:text-green-200">
                          {t('adminRoomDetailsPage.fields.equipmentName', 'Name')}
                        </TableHead>
                        <TableHead className="w-[100px] text-center font-semibold text-green-800 dark:text-green-200">
                          {t('adminRoomDetailsPage.fields.equipmentQuantity', 'Quantity')}
                        </TableHead>
                        <TableHead className="hidden md:table-cell font-semibold text-green-800 dark:text-green-200">
                          {t('adminRoomDetailsPage.fields.equipmentCondition', 'Condition')}
                        </TableHead>
                        <TableHead className="hidden sm:table-cell font-semibold text-green-800 dark:text-green-200">
                          {t('adminRoomDetailsPage.fields.equipmentFunctional', 'Functional')}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {room.equipments.map(equip => (
                        <TableRow key={equip.id} className="hover:bg-green-50 dark:hover:bg-green-900/10">
                          <TableCell className="font-medium">
                            <div>
                              <div>{equip.name}</div>
                              {equip.description && (
                                <div className="text-sm text-muted-foreground">{equip.description}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{equip.quantity ?? 'N/A'}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant={getConditionBadgeVariant(equip.condition)} className="text-xs">
                              {equip.condition ? t(`equipmentConditions.${equip.condition}`, equip.condition) : 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {equip.is_functional !== undefined && (
                              <Badge variant={equip.is_functional ? "default" : "destructive"} className="text-xs">
                                {equip.is_functional ? t('common.yes', 'Yes') : t('common.no', 'No')}
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>
          )}
          
          {(!room.equipments || room.equipments.length === 0) && (
            <div className="mt-6 text-center text-muted-foreground py-8 border-t border-green-200 dark:border-green-700">
              <Package className="mx-auto h-12 w-12 mb-3 text-green-300" />
              <p className="text-lg">{t('adminRoomDetailsPage.noEquipmentInRoom', 'No equipment found in this room')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRoomDetailsPage; 