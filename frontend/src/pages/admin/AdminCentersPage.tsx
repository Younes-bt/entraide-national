import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { MoreHorizontal, EyeIcon, Edit2Icon, Trash2Icon, PlusCircle } from 'lucide-react';

// Expanded Center interface based on CenterSerializer
interface Center {
  id: string | number;
  name: string;
  description?: string;
  logo?: string;
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

interface Room { // Basic Room interface, expand as needed
  id: number;
  name: string;
  type: string;
  capacity: number;
}

interface Group { // Basic Group interface, expand as needed
  id: number;
  name: string;
}

// API base URL - adjust if your dev server proxies or if it's different
const API_BASE_URL = 'http://localhost:8000/api';

// Modified fetchCenters to accept a token
async function fetchCenters(token: string | null): Promise<Center[]> {
  if (!token) {
    // TODO: i18n for error messages
    throw new Error('Authentication token not available.');
  }

  const response = await fetch(`${API_BASE_URL}/centers-app/centers/`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch centers' }));
    // Check for specific authentication error from backend if available
    if (response.status === 401) {
        // TODO: i18n for error messages
        throw new Error(errorData.detail || 'Authentication failed or token expired.');
    }
    // TODO: i18n for error messages
    throw new Error(errorData.detail || 'Failed to fetch centers');
  }
  const data = await response.json();
  return data.results || data;
}

const AdminCentersPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const auth = useAuth();
  const userAccessToken = auth.accessToken;

  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState<boolean>(false);

  const fetchAndSetCenters = () => {
    if (userAccessToken) {
      setLoading(true);
      fetchCenters(userAccessToken)
        .then(data => {
          setCenters(data);
          setLoading(false);
          setError(null);
        })
        .catch(err => {
          console.error(err);
          setError(t('adminCentersPage.errorLoadingDynamic', { message: err.message }));
          setLoading(false);
        });
    } else if (!auth.isLoading) {
      setError(t('adminCentersPage.errorAuthNotAvailable'));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetCenters();
  }, [userAccessToken, auth.isLoading]);

  const getAffiliationDisplay = (center: Center): string => {
    if (center.affiliated_to === 'other' && center.other_affiliation) {
      return center.other_affiliation;
    }
    const affiliationMap: { [key: string]: string } = {
      'entraide': t('adminCentersPage.affiliationEntraide'),
      'association': center.association_name || t('adminCentersPage.affiliationAssociation'),
    };
    return affiliationMap[center.affiliated_to] || center.affiliated_to;
  };

  const handleViewDetails = (center: Center) => {
    setSelectedCenter(center);
    setIsDetailDialogOpen(true);
  };

  const handleEdit = (centerId: string | number) => {
    console.log(`Edit center ${centerId}`);
    navigate(`/admin/centers/edit/${centerId}`);
  };

  const handleDelete = async (centerId: string | number) => {
    if (window.confirm(t('adminCentersPage.confirmDeleteCenter', { centerId } ))) {
      console.warn(`Delete center ${centerId}`);
      if (!userAccessToken) {
        setError(t('adminCentersPage.errorAuthNotAvailableForDelete'));
        return;
      }
      try {
        // Placeholder for actual API call
        // await actualDeleteCenterApiCall(centerId, userAccessToken);
        console.log('Simulating deletion...');
        setCenters(prevCenters => prevCenters.filter(c => c.id !== centerId));
        // fetchAndSetCenters(); // Or refetch to ensure consistency after delete
      } catch (delErr: any) {
        setError(t('adminCentersPage.errorDeletingCenter', { message: delErr.message }));
      }
    }
  };

  if (loading && !centers.length && !error) return <div className="container mx-auto p-4"><p>{t('adminCentersPage.loadingCenters')}</p></div>;
  if (auth.isLoading) return <div className="container mx-auto p-4"><p>{t('adminCentersPage.loadingAuthAndCenters')}</p></div>;
  // Display general error if it exists and it's not related to the detail dialog being open
  if (error && !isDetailDialogOpen) return <div className="container mx-auto p-4"><p className="text-red-500">{error}</p></div>;
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{t('adminCentersPage.title')}</h1>
        <Button onClick={() => navigate('/admin/centers/add')}> 
          <PlusCircle className="mr-2 h-4 w-4" /> {t('adminCentersPage.addNewCenterButton')}
        </Button>
      </div>

      {/* Display fetch error separately if it exists, to not hide table during other errors like delete */}
      {error && centers.length > 0 && <p className="text-red-500 mb-4">{error}</p>}
      
      { (!loading || centers.length > 0) && !(!userAccessToken && !auth.isLoading) && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">{t('adminCentersPage.tableHeaderLogo')}</TableHead>
                <TableHead>{t('adminCentersPage.tableHeaderName')}</TableHead>
                <TableHead>{t('adminCentersPage.tableHeaderAffiliatedTo')}</TableHead>
                <TableHead>{t('adminCentersPage.tableHeaderSupervisorName')}</TableHead>
                <TableHead>{t('adminCentersPage.tableHeaderPhone')}</TableHead>
                <TableHead className="text-right w-[100px]">{t('adminCentersPage.tableHeaderActions')}</TableHead>
             </TableRow>
            </TableHeader>
            <TableBody>
              {centers.map((center) => (
                <TableRow key={center.id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                  <TableCell>
                    {center.logo ? (
                      <img src={center.logo} alt={t('adminCentersPage.logoAlt', { name: center.name })} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-semibold">
                        {t('adminCentersPage.noLogo')}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{center.name}</TableCell>
                  <TableCell>{getAffiliationDisplay(center)}</TableCell>
                  <TableCell>
                    {center.supervisor_first_name && center.supervisor_last_name 
                      ? `${center.supervisor_first_name} ${center.supervisor_last_name}` 
                      : center.supervisor_username || t('adminCentersPage.notAvailable')}
                  </TableCell>
                  <TableCell>{center.phone_number || t('adminCentersPage.notAvailable')}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">{t('adminCentersPage.openMenuSr')}</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(center)}>
                          <EyeIcon className="mr-2 h-4 w-4" />
                          {t('adminCentersPage.actionViewDetails')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(center.id)}>
                          <Edit2Icon className="mr-2 h-4 w-4" />
                          {t('adminCentersPage.actionEdit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(center.id)} className="text-red-500 hover:!text-red-600">
                          <Trash2Icon className="mr-2 h-4 w-4" />
                          {t('adminCentersPage.actionDelete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {centers.length === 0 && !loading && <p className="text-center mt-4">{t('adminCentersPage.noCentersFound')}</p>}
        </>
      )}
      
      {selectedCenter && (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                {selectedCenter.logo && (
                  <img src={selectedCenter.logo} alt={t('adminCentersPage.logoAlt', { name: selectedCenter.name })} className="h-10 w-10 rounded-full object-cover mr-3" />
                )}
                {selectedCenter.name}
              </DialogTitle>
              <DialogDescription>
                {t('adminCentersPage.dialogDescription', { name: selectedCenter.name })}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <InfoRow label={t('adminCentersPage.dialogId')} value={selectedCenter.id.toString()} />
              <InfoRow label={t('adminCentersPage.dialogDescriptionLabel')} value={selectedCenter.description} />
              <InfoRow label={t('adminCentersPage.dialogAffiliation')} value={getAffiliationDisplay(selectedCenter)} />
              {selectedCenter.affiliated_to === 'association' && selectedCenter.association_name && (
                 <InfoRow label={t('adminCentersPage.dialogAssociationName')} value={selectedCenter.association_name} />
              )}
              {selectedCenter.affiliated_to === 'other' && selectedCenter.other_affiliation && (
                 <InfoRow label={t('adminCentersPage.dialogOtherAffiliationDetails')} value={selectedCenter.other_affiliation} />
              )}
              <InfoRow label={t('adminCentersPage.dialogPhone')} value={selectedCenter.phone_number} t={t} />
              <InfoRow label={t('adminCentersPage.dialogEmail')} value={selectedCenter.email} t={t} />
              <InfoRow label={t('adminCentersPage.dialogAddress')} value={selectedCenter.address} t={t} />
              <InfoRow label={t('adminCentersPage.dialogCity')} value={selectedCenter.city} t={t}/>
              <InfoRow 
                label={t('adminCentersPage.dialogSupervisor')} 
                value={
                  selectedCenter.supervisor_first_name && selectedCenter.supervisor_last_name 
                    ? `${selectedCenter.supervisor_first_name} ${selectedCenter.supervisor_last_name}` 
                    : selectedCenter.supervisor_username || (selectedCenter.supervisor ? `ID: ${selectedCenter.supervisor}`: t('adminCentersPage.notAvailable'))
                } 
              />
              <InfoRow label={t('adminCentersPage.dialogActive')} value={selectedCenter.is_active ? t('common.yes') : t('common.no')} />
              <InfoRow label={t('adminCentersPage.dialogVerified')} value={selectedCenter.is_verified ? t('common.yes') : t('common.no')} />
              <InfoRow label={t('adminCentersPage.dialogWebsite')} value={selectedCenter.website} link={selectedCenter.website} t={t} />
              <InfoRow label={t('adminCentersPage.dialogFacebook')} value={selectedCenter.facebook_link} link={selectedCenter.facebook_link} t={t} />
              <InfoRow label={t('adminCentersPage.dialogInstagram')} value={selectedCenter.instagram_link} link={selectedCenter.instagram_link} t={t} />
              <InfoRow label={t('adminCentersPage.dialogTwitter')} value={selectedCenter.twitter_link} link={selectedCenter.twitter_link} t={t} />
              <InfoRow label={t('adminCentersPage.dialogMapsLink')} value={selectedCenter.maps_link} link={selectedCenter.maps_link} t={t} />
              <InfoRow label={t('adminCentersPage.dialogCreatedAt')} value={selectedCenter.created_at ? new Date(selectedCenter.created_at).toLocaleString() : t('adminCentersPage.notAvailable')} />
              <InfoRow label={t('adminCentersPage.dialogLastUpdated')} value={selectedCenter.updated_at ? new Date(selectedCenter.updated_at).toLocaleString() : t('adminCentersPage.notAvailable')} />
              <InfoRow label={t('adminCentersPage.dialogRoomsCount')} value={selectedCenter.rooms?.length?.toString() || '0'} />
              <InfoRow label={t('adminCentersPage.dialogGroupsCount')} value={selectedCenter.groups?.length?.toString() || '0'} />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  {t('common.closeButton')}
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Helper component for Dialog content
const InfoRow: React.FC<{ label: string; value?: string | number | null; link?: string | null; t?: (key: string) => string }> = ({ label, value, link, t }) => {
  const notAvailableText = t ? t('adminCentersPage.notAvailable') : 'N/A';
  const displayValue = value === null || value === undefined || value === '' ? notAvailableText : value;
  const displayLink = link === null || link === undefined || link === '' ? null : link

  if (displayValue === notAvailableText && !displayLink) return null; // Don't render if only N/A and no link

  return (
    <div className="grid grid-cols-3 items-center gap-2 text-sm">
      <span className="font-semibold col-span-1">{label}:</span>
      {displayLink ? (
        <a href={displayLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline col-span-2 truncate">
          {displayValue === notAvailableText ? displayLink : displayValue.toString()}
        </a>
      ) : (
        <span className="col-span-2 truncate" title={displayValue?.toString()}>{displayValue.toString()}</span>
      )}
    </div>
  );
};

export default AdminCentersPage; 