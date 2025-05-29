import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, EyeIcon, Edit2Icon, Trash2Icon, PlusCircle, Search, Filter } from 'lucide-react';

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
  logo_url?: string;
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

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedAffiliation, setSelectedAffiliation] = useState<string>('all');
  const [selectedActiveStatus, setSelectedActiveStatus] = useState<string>('all');
  const [selectedVerifiedStatus, setSelectedVerifiedStatus] = useState<string>('all');

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

  // Get unique cities for filter dropdown
  const uniqueCities = useMemo(() => {
    const cities = centers
      .map(center => center.city)
      .filter(city => city && city.trim() !== '')
      .map(city => city!.trim());
    return [...new Set(cities)].sort();
  }, [centers]);

  // Filter centers based on search and filter criteria
  const filteredCenters = useMemo(() => {
    return centers.filter(center => {
      // Search term filter
      const matchesSearch = searchTerm === '' || 
        center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (center.description && center.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (center.supervisor_first_name && center.supervisor_first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (center.supervisor_last_name && center.supervisor_last_name.toLowerCase().includes(searchTerm.toLowerCase()));

      // City filter
      const matchesCity = selectedCity === 'all' || center.city === selectedCity;

      // Affiliation filter
      const matchesAffiliation = selectedAffiliation === 'all' || center.affiliated_to === selectedAffiliation;

      // Active status filter
      const matchesActiveStatus = selectedActiveStatus === 'all' || 
        (selectedActiveStatus === 'active' && center.is_active === true) ||
        (selectedActiveStatus === 'inactive' && center.is_active === false);

      // Verified status filter
      const matchesVerifiedStatus = selectedVerifiedStatus === 'all' || 
        (selectedVerifiedStatus === 'verified' && center.is_verified === true) ||
        (selectedVerifiedStatus === 'unverified' && center.is_verified === false);

      return matchesSearch && matchesCity && matchesAffiliation && matchesActiveStatus && matchesVerifiedStatus;
    });
  }, [centers, searchTerm, selectedCity, selectedAffiliation, selectedActiveStatus, selectedVerifiedStatus]);

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
    navigate(`/admin/centers/details/${center.id}`);
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

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCity('all');
    setSelectedAffiliation('all');
    setSelectedActiveStatus('all');
    setSelectedVerifiedStatus('all');
  };

  if (loading && !centers.length && !error) return <div className="container mx-auto p-4"><p>{t('adminCentersPage.loadingCenters')}</p></div>;
  if (auth.isLoading) return <div className="container mx-auto p-4"><p>{t('adminCentersPage.loadingAuthAndCenters')}</p></div>;
  // Display general error if it exists
  if (error) return <div className="container mx-auto p-4"><p className="text-red-500">{error}</p></div>;
  
  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('adminCentersPage.title')}</h1>
        <Button onClick={() => navigate('/admin/centers/add')}> 
          <PlusCircle className="mr-2 h-4 w-4" /> {t('adminCentersPage.addNewCenterButton')}
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div 
        className="dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700 mb-6"
        style={{ 
          backgroundColor: '#409e0915', // #409e09 with 15% opacity for light background
          borderColor: '#409e09'
        }}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t('adminCentersPage.searchPlaceholder', 'Search centers...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-2">
            {/* City Filter */}
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder={t('adminCentersPage.filterByCity', 'City')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('adminCentersPage.allCities', 'All Cities')}</SelectItem>
                {uniqueCities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Affiliation Filter */}
            <Select value={selectedAffiliation} onValueChange={setSelectedAffiliation}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder={t('adminCentersPage.filterByAffiliation', 'Affiliation')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('adminCentersPage.allAffiliations', 'All Affiliations')}</SelectItem>
                <SelectItem value="entraide">{t('adminCentersPage.affiliationEntraide')}</SelectItem>
                <SelectItem value="association">{t('adminCentersPage.affiliationAssociation')}</SelectItem>
                <SelectItem value="other">{t('adminCentersPage.affiliationOther', 'Other')}</SelectItem>
              </SelectContent>
            </Select>

            {/* Active Status Filter */}
            <Select value={selectedActiveStatus} onValueChange={setSelectedActiveStatus}>
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder={t('adminCentersPage.filterByStatus', 'Status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('adminCentersPage.allStatuses', 'All')}</SelectItem>
                <SelectItem value="active">{t('adminCentersPage.statusActive', 'Active')}</SelectItem>
                <SelectItem value="inactive">{t('adminCentersPage.statusInactive', 'Inactive')}</SelectItem>
              </SelectContent>
            </Select>

            {/* Verified Status Filter */}
            <Select value={selectedVerifiedStatus} onValueChange={setSelectedVerifiedStatus}>
              <SelectTrigger className="w-full sm:w-[130px]">
                <SelectValue placeholder={t('adminCentersPage.filterByVerified', 'Verified')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('adminCentersPage.allVerificationStatuses', 'All')}</SelectItem>
                <SelectItem value="verified">{t('adminCentersPage.verifiedOnly', 'Verified')}</SelectItem>
                <SelectItem value="unverified">{t('adminCentersPage.unverifiedOnly', 'Unverified')}</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters Button */}
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full sm:w-auto"
            >
              <Filter className="mr-2 h-4 w-4" />
              {t('adminCentersPage.clearFilters', 'Clear')}
            </Button>
          </div>
        </div>
      </div>

      {/* Display fetch error separately if it exists, to not hide cards during other errors like delete */}
      {error && centers.length > 0 && <p className="text-red-500 mb-4">{error}</p>}
      
      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        {t('adminCentersPage.resultsCount', { count: filteredCenters.length, total: centers.length }) || `Showing ${filteredCenters.length} of ${centers.length} centers`}
      </div>
      
      { (!loading || centers.length > 0) && !(!userAccessToken && !auth.isLoading) && (
        <>
          {/* Centers Cards Grid */}
          {filteredCenters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCenters.map((center) => (
                <div
                  key={center.id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 cursor-pointer group"
                >
                  {/* Card Header with Logo and Actions */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {center.logo_url ? (
                        <img 
                          src={center.logo_url} 
                          alt={t('adminCentersPage.logoAlt', { name: center.name })} 
                          className="h-12 w-12 rounded-full object-cover" 
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 text-xs font-semibold">
                          {center.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    
                    {/* Actions Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
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
                  </div>

                  {/* Center Name */}
                  <h3 
                    className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 cursor-pointer hover:underline"
                    onClick={() => handleViewDetails(center)}
                  >
                    {center.name}
                  </h3>

                  {/* City */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {center.city || t('adminCentersPage.notAvailable')}
                  </p>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2">
                    {center.is_active !== undefined && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        center.is_active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {center.is_active ? t('adminCentersPage.statusActive', 'Active') : t('adminCentersPage.statusInactive', 'Inactive')}
                      </span>
                    )}
                    {center.is_verified !== undefined && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        center.is_verified 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {center.is_verified ? t('adminCentersPage.verifiedOnly', 'Verified') : t('adminCentersPage.unverifiedOnly', 'Unverified')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {searchTerm || selectedCity !== 'all' || selectedAffiliation !== 'all' || selectedActiveStatus !== 'all' || selectedVerifiedStatus !== 'all'
                  ? t('adminCentersPage.noCentersMatchFilters', 'No centers match your current filters')
                  : t('adminCentersPage.noCentersFound')
                }
              </p>
              {(searchTerm || selectedCity !== 'all' || selectedAffiliation !== 'all' || selectedActiveStatus !== 'all' || selectedVerifiedStatus !== 'all') && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  {t('adminCentersPage.clearFilters', 'Clear Filters')}
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminCentersPage; 