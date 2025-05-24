import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/apiClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Package, PlusCircle, Eye, Edit, Trash2, ShieldAlert, HelpCircle, Wrench, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Separator } from '@/components/ui/separator';

// Interface for Equipment (matches backend model and serializer)
interface Equipment {
  id: number;
  name: string;
  description?: string;
  condition?: 'new' | 'excellent' | 'good' | 'fair' | 'need_reparation' | 'damaged';
  quantity?: number;
  picture?: string | null; 
  picture_url?: string | null; 
  room?: number | null; // Room ID it's assigned to (if any)
  room_name?: string; // Optional: if we want to display room name directly
  center: number; // Center ID
  created_at?: string;
  updated_at?: string;
}

interface Center {
  id: number;
  name: string;
  // We might not need to store all equipment in centerData state if we fetch them separately
}

const CenterEquipmentPage: React.FC = () => {
  const { t } = useTranslation();
  const { user: authUser } = useAuth();
  const navigate = useNavigate();

  const [centerData, setCenterData] = useState<Center | null>(null);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCenterAndEquipment = async () => {
      if (!authUser) {
        setError(t('login_details.authRequired'));
        setLoading(false);
        return;
      }

      // @ts-ignore authUser has id and role
      if (authUser.role === 'center_supervisor' && authUser.id) {
        try {
          setLoading(true);
          // 1. Fetch the supervised center's ID and name
          const supervisedCentersResponse = await apiClient.get<{ results: Center[] }>(`/centers-app/centers/?supervisor=${authUser.id}`);
          
          if (supervisedCentersResponse.data.results && supervisedCentersResponse.data.results.length > 0) {
            const currentCenter = supervisedCentersResponse.data.results[0];
            setCenterData(currentCenter);

            // 2. Fetch all equipment for this center
            // Assuming the EquipmentSerializer includes room_name if populated by a custom method or annotation in backend
            const equipmentResponse = await apiClient.get<{ results: Equipment[] }>(`/centers-app/equipment/?center__id=${currentCenter.id}`);
            setEquipmentList(equipmentResponse.data.results);
            setError(null);
          } else {
            setError(t('centerRoomsPage.noCenterAssigned')); // Re-use existing translation
          }
        } catch (err: any) {
          console.error(t('centerEquipmentPage.errorFetching'), err);
          setError(err.response?.data?.detail || err.message || t('centerEquipmentPage.errorFetchingDetail'));
        } finally {
          setLoading(false);
        }
      } else {
        setError(t('centerRoomsPage.accessDenied')); // Re-use existing translation
        setLoading(false);
      }
    };

    fetchCenterAndEquipment();
  }, [authUser, t]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getConditionIcon = (condition?: Equipment['condition']) => {
    switch (condition) {
      case 'new':
      case 'excellent':
        return <ShieldCheck className="mr-2 h-5 w-5 text-green-500" />;
      case 'good':
        return <ShieldCheck className="mr-2 h-5 w-5 text-blue-500" />;
      case 'fair':
        return <ShieldAlert className="mr-2 h-5 w-5 text-yellow-500" />;
      case 'need_reparation':
        return <Wrench className="mr-2 h-5 w-5 text-orange-500" />;
      case 'damaged':
        return <ShieldAlert className="mr-2 h-5 w-5 text-red-500" />;
      default:
        return <Package className="mr-2 h-5 w-5 text-gray-500" />;
    }
  };
  
  const getConditionBadgeVariant = (condition?: Equipment['condition']): "default" | "secondary" | "destructive" | "outline" => {
    switch (condition) {
      case 'new': case 'excellent': return 'default'; // Success-like
      case 'good': return 'secondary';
      case 'fair': return 'outline';
      case 'need_reparation': case 'damaged': return 'destructive';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-lg">{t('centerEquipmentPage.loadingMessage')}</p>
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

  if (!centerData) { // Should be covered by error state, but as a fallback
    return (
      <Alert className="m-4">
        <HelpCircle className="h-4 w-4" />
        <AlertTitle>{t('centerRoomsPage.noCenterDataTitle')}</AlertTitle>
        <AlertDescription>{t('centerRoomsPage.noCenterDataDescription')}</AlertDescription>
      </Alert>
    );
  }
  
  // Placeholder actions for buttons
  const handleAddEquipment = () => {
    navigate('add'); // Updated to navigate to the new add page
    // alert(t('centerEquipmentPage.actions.addNotImplemented')); // Old alert
  };
  const handleViewEquipment = (id: number) => {
    // navigate(`/center/equipment/${id}`); // TODO: Create this route and page
    alert(t('centerEquipmentPage.actions.viewNotImplemented'));
  };
  const handleEditEquipment = (id: number) => {
    // navigate(`/center/equipment/${id}/edit`); // TODO: Create this route and page
    alert(t('centerEquipmentPage.actions.editNotImplemented'));
  };
  const handleDeleteEquipment = (id: number) => {
    // TODO: Implement delete with confirmation
    alert(t('centerEquipmentPage.actions.deleteNotImplemented'));
  };


  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('centerEquipmentPage.pageTitle', { centerName: centerData.name })}
          </h1>
          <p className="text-muted-foreground">
            {t('centerEquipmentPage.pageSubtitle', { count: equipmentList.length })}
          </p>
        </div>
        <Button onClick={handleAddEquipment}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('centerEquipmentPage.addNewEquipmentButton')}
        </Button>
      </div>

      {equipmentList.length === 0 && (
        <Alert className="m-4">
          <Package className="h-4 w-4" />
          <AlertTitle>{t('centerEquipmentPage.noEquipmentTitle', { centerName: centerData.name })}</AlertTitle>
          <AlertDescription>{t('centerEquipmentPage.noEquipmentDescription')}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {equipmentList.map(item => (
          <Card key={item.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            {item.picture_url && (
              <div className="w-full h-48 bg-muted overflow-hidden">
                <img src={item.picture_url} alt={item.name} className="w-full h-full object-cover" />
              </div>
            )}
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                {getConditionIcon(item.condition)}
                {item.name}
              </CardTitle>
              {item.description && <CardDescription className="text-sm mt-1 leading-tight">{item.description}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-2 text-sm flex-grow">
              <Separator className="my-2" />
              <p><strong>{t('centerEquipmentPage.fields.quantity')}:</strong> {item.quantity ?? 'N/A'}</p>
              {item.condition && (
                <p>
                  <strong>{t('centerEquipmentPage.fields.condition')}: </strong> 
                  <Badge variant={getConditionBadgeVariant(item.condition)}>{t(`equipmentConditions.${item.condition}`)}</Badge>
                </p>
              )}
              {item.room_name && <p><strong>{t('centerEquipmentPage.fields.assignedRoom')}:</strong> {item.room_name}</p>}
              {!item.room_name && item.room && <p><strong>{t('centerEquipmentPage.fields.assignedRoomId')}:</strong> {item.room}</p>}
               <div className="text-xs text-muted-foreground pt-1">
                <p>{t('centerInfoPage.rooms.created')}: {formatDate(item.created_at)}</p>
                <p>{t('centerInfoPage.rooms.updated')}: {formatDate(item.updated_at)}</p>
              </div>
            </CardContent>
            <CardFooter className="pt-3 pb-3 border-t flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => handleViewEquipment(item.id)}>
                <Eye className="mr-2 h-4 w-4" /> {t('actions.viewDetails')} 
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleEditEquipment(item.id)}>
                <Edit className="mr-2 h-4 w-4" /> {t('actions.edit')}
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteEquipment(item.id)}>
                <Trash2 className="mr-2 h-4 w-4" /> {t('actions.delete')}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CenterEquipmentPage; 