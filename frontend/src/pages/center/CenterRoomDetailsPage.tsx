import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '@/lib/apiClient';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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

// Interfaces (can be shared if they become more complex or used elsewhere)
interface Equipment {
  id: number;
  name: string;
  description?: string;
  condition?: 'new' | 'excellent' | 'good' | 'fair' | 'need_reparation' | 'damaged';
  quantity?: number;
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
  center?: number; // Center ID, may or may not be needed directly on this page if fetched by room ID
}

const CenterRoomDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user: authUser } = useAuth(); // To ensure user is authorized if needed for actions

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!roomId) {
        setError(t('centerRoomDetailsPage.errorNoRoomId'));
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await apiClient.get<Room>(`/centers-app/rooms/${roomId}/`);
        setRoom(response.data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching room details:", err);
        setError(err.response?.data?.detail || err.message || t('centerRoomDetailsPage.errorFetchingDetails'));
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId, t]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
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

  // Placeholder for delete functionality
  const handleDeleteRoom = async () => {
    if (!room) return;
    if (window.confirm(t('centerRoomDetailsPage.confirmDelete', { roomName: room.name }))) {
      try {
        // await apiClient.delete(`/centers-app/rooms/${room.id}/`);
        // Add toast notification for success
        // navigate('../'); // Navigate back to rooms list
        alert('Delete functionality to be implemented.');
      } catch (err: any) {
        console.error("Error deleting room:", err);
        // Add toast notification for error
        setError(err.response?.data?.detail || t('centerRoomDetailsPage.errorDeletingRoom'));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-lg">{t('centerRoomDetailsPage.loadingRoomDetails')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertTitle>{t('login_details.errorTitle')}</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button variant="outline" size="sm" onClick={() => navigate('../')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('centerRoomDetailsPage.backToRoomsList')}
        </Button>
      </Alert>
    );
  }

  if (!room) {
    return (
      <Alert className="m-4">
        <AlertTitle>{t('centerRoomDetailsPage.roomNotFoundTitle')}</AlertTitle>
        <AlertDescription>{t('centerRoomDetailsPage.roomNotFoundDescription')}</AlertDescription>
        <Button variant="outline" size="sm" onClick={() => navigate('../')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('centerRoomDetailsPage.backToRoomsList')}
        </Button>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Button variant="outline" size="sm" onClick={() => navigate('../')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('centerRoomDetailsPage.backToRoomsList')}
      </Button>

      <Card className="overflow-hidden">
        {room.picture_url && (
          <div className="w-full h-64 bg-muted overflow-hidden">
            <img src={room.picture_url} alt={room.name} className="w-full h-full object-cover" />
          </div>
        )}
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
            <div>
                <CardTitle className="text-3xl font-bold flex items-center">
                    {getRoomTypeIcon(room.type)}
                    {room.name}
                </CardTitle>
                {room.description && <CardDescription className="mt-1 text-lg text-muted-foreground">{room.description}</CardDescription>}
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-4 flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => navigate(`edit`)}>
                    <Edit className="mr-2 h-4 w-4" /> {t('actions.edit')}
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDeleteRoom} >
                    <Trash2 className="mr-2 h-4 w-4" /> {t('actions.delete')}
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold text-lg mb-2">{t('centerRoomDetailsPage.sectionTitles.generalInfo')}</h3>
              <div className="space-y-2">
                <p><strong>{t('centerRoomDetailsPage.fields.type')}:</strong> {room.type ? t(`roomTypes.${room.type}`, room.type) : 'N/A'}</p>
                <p><strong>{t('centerRoomDetailsPage.fields.capacity')}:</strong> {room.capacity ?? 'N/A'}</p>
                <p><strong>{t('centerRoomDetailsPage.fields.isAvailable')}:</strong> 
                  {room.is_available ? <CheckCircle className="inline-block h-5 w-5 text-green-500" /> : <XCircle className="inline-block h-5 w-5 text-red-500" />}
                  <span className={`ml-1 ${room.is_available ? 'text-green-700' : 'text-red-700'} dark:${room.is_available ? 'text-green-400' : 'text-red-400'}`}>
                     {room.is_available ? t('common.yes') : t('common.no')}
                  </span>
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">{t('centerRoomDetailsPage.sectionTitles.timestamps')}</h3>
              <div className="space-y-2">
                <p><strong>{t('centerRoomDetailsPage.fields.createdAt')}:</strong> {formatDate(room.created_at)}</p>
                <p><strong>{t('centerRoomDetailsPage.fields.updatedAt')}:</strong> {formatDate(room.updated_at)}</p>
              </div>
            </div>
          </div>

          {room.equipments && room.equipments.length > 0 && (
            <>
              <Separator className="my-6" />
              <div>
                <h3 className="font-semibold text-xl mb-4 flex items-center">
                    <Package className="mr-3 h-6 w-6 text-indigo-600" /> 
                    {t('centerRoomDetailsPage.sectionTitles.equipmentInRoom')} ({room.equipments.length})
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('centerRoomDetailsPage.fields.equipmentName', 'Name')}</TableHead>
                      <TableHead className="w-[100px] text-center">{t('centerRoomDetailsPage.fields.equipmentQuantity', 'Quantity')}</TableHead>
                      <TableHead className="hidden md:table-cell">{t('centerRoomDetailsPage.fields.equipmentCondition', 'Condition')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {room.equipments.map(equip => (
                      <TableRow key={equip.id}>
                        <TableCell className="font-medium">{equip.name}</TableCell>
                        <TableCell className="text-center">{equip.quantity ?? 'N/A'}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant={getConditionBadgeVariant(equip.condition)} className="text-xs px-1.5 py-0.5">
                            {equip.condition ? t(`equipmentConditions.${equip.condition}`, equip.condition) : 'N/A'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
           {(!room.equipments || room.equipments.length === 0) && (
             <div className="mt-6 text-center text-muted-foreground py-4 border-t">
                <Package className="mx-auto h-8 w-8 mb-2" />
                {t('centerRoomDetailsPage.noEquipmentInRoom')}
            </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CenterRoomDetailsPage; 