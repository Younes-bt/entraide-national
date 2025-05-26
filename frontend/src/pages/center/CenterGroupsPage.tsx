import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Users, Eye } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

// Interface for Group
interface Group {
  id: number;
  name: string;
  description: string;
  center: number;
  created_at: string;
  updated_at: string;
}

// Interface for Center (simplified for this page's needs)
interface Center {
  id: number;
  name: string;
  groups?: Group[];
}

const CenterGroupsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const [centerData, setCenterData] = useState<Center | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCenterGroups = async () => {
      if (!authUser) {
        setError(t('centerGroupsPage.accessDenied'));
        setLoading(false);
        return;
      }

      // @ts-ignore - Assuming authUser has id and role
      if (authUser.role === 'center_supervisor' && authUser.id) {
        try {
          setLoading(true);
          
          // First, get the center supervised by this user
          const supervisedCentersResponse = await apiClient.get<{ results: { id: number; name: string }[] }>(`/centers-app/centers/?supervisor=${authUser.id}`);

          if (supervisedCentersResponse.data.results && supervisedCentersResponse.data.results.length > 0) {
            const centerInfo = supervisedCentersResponse.data.results[0];
            setCenterData(centerInfo);

            // Then fetch groups for this center
            const groupsResponse = await apiClient.get<{ results: Group[] }>(`/centers-app/groups/?center__id=${centerInfo.id}`);
            setGroups(groupsResponse.data.results || []);
            setError(null);
          } else {
            setError(t('centerGroupsPage.noCenterAssigned'));
          }
        } catch (err: any) {
          console.error(t('centerGroupsPage.errorFetching'), err);
          setError(t('centerGroupsPage.errorFetchingDetail'));
        } finally {
          setLoading(false);
        }
      } else {
        setError(t('centerGroupsPage.accessDenied'));
        setLoading(false);
      }
    };

    fetchCenterGroups();
  }, [authUser, t]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center py-10">
          <span>{t('centerGroupsPage.loadingMessage')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">
              {centerData ? t('centerGroupsPage.noGroupsTitle', { centerName: centerData.name }) : t('centerRoomsPage.noCenterDataTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {centerData ? t('centerGroupsPage.noGroupsDescription') : t('centerRoomsPage.noCenterDataDescription')}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            {t('centerGroupsPage.pageTitle', { centerName: centerData?.name || 'Center' })}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('centerGroupsPage.pageSubtitle', { count: groups.length })}
          </p>
        </div>
        <Button onClick={() => navigate('/center/groups/add')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('centerGroupsPage.addNewGroupButton')}
        </Button>
      </div>

      {/* Groups Grid */}
      {groups.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>{t('centerGroupsPage.noGroupsTitle', { centerName: centerData?.name || 'Center' })}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t('centerGroupsPage.noGroupsDescription')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Card key={group.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Users className="h-8 w-8 text-primary" />
                  <Badge variant="secondary">ID: {group.id}</Badge>
                </div>
                <CardTitle className="text-xl">{group.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {group.description || 'No description available'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>
                    <strong>{t('centerGroupsPage.fields.createdAt')}:</strong> {new Date(group.created_at).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>{t('centerGroupsPage.fields.updatedAt')}:</strong> {new Date(group.updated_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/center/groups/${group.id}`)}
                    className="flex-1"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    {t('centerGroupsPage.actions.viewDetails')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CenterGroupsPage; 