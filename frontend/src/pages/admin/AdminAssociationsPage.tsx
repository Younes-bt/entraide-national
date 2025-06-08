import React, { useEffect, useState, useMemo, useCallback } from 'react';
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

// Updated Association interface with additional fields
interface Association {
  id: number;
  logo?: string;
  logo_url?: string;
  name: string;
  city?: string;
  supervisor?: {
    id: number;
    first_name: string;
    last_name: string;
  };
  phone_number?: string;
  email?: string;
  address?: string;
  website?: string;
  facebook_link?: string;
  instagram_link?: string;
  twitter_link?: string;
  is_active?: boolean;
  is_verified?: boolean;
  created_at?: string;
  updated_at?: string;
  // Add other fields as needed
}

const AdminAssociationsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [associations, setAssociations] = useState<Association[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedActiveStatus, setSelectedActiveStatus] = useState<string>('all');
  const [selectedVerifiedStatus, setSelectedVerifiedStatus] = useState<string>('all');

  const fetchAndSetAssociations = useCallback(() => {
    if (accessToken) {
      setLoading(true);
      fetch('/api/associations/', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
        .then(async (response) => {
          if (!response.ok) {
            let errorData;
            try {
              errorData = await response.json();
            } catch {
              // Not JSON, or empty response
            }
            const errorMessage = errorData?.detail || response.statusText || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
          }
          return response.json();
        })
        .then((data) => {
          console.log("API Response Data for Associations:", data);
          setAssociations(data.results || []);
          setError(null);
          setLoading(false);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Failed to fetch associations');
          console.error("Failed to fetch associations:", err);
          setLoading(false);
        });
    } else {
      setError('Authentication token not found. Please log in.');
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchAndSetAssociations();
  }, [accessToken, fetchAndSetAssociations]);

  // Get unique cities for filter dropdown
  const uniqueCities = useMemo(() => {
    const cities = associations
      .map(association => association.city)
      .filter(city => city && city.trim() !== '')
      .map(city => city!.trim());
    return [...new Set(cities)].sort();
  }, [associations]);

  // Filter associations based on search and filter criteria
  const filteredAssociations = useMemo(() => {
    return associations.filter(association => {
      // Search term filter
      const matchesSearch = searchTerm === '' || 
        association.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (association.supervisor?.first_name && association.supervisor.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (association.supervisor?.last_name && association.supervisor.last_name.toLowerCase().includes(searchTerm.toLowerCase()));

      // City filter
      const matchesCity = selectedCity === 'all' || association.city === selectedCity;

      // Active status filter
      const matchesActiveStatus = selectedActiveStatus === 'all' || 
        (selectedActiveStatus === 'active' && association.is_active === true) ||
        (selectedActiveStatus === 'inactive' && association.is_active === false);

      // Verified status filter
      const matchesVerifiedStatus = selectedVerifiedStatus === 'all' || 
        (selectedVerifiedStatus === 'verified' && association.is_verified === true) ||
        (selectedVerifiedStatus === 'unverified' && association.is_verified === false);

      return matchesSearch && matchesCity && matchesActiveStatus && matchesVerifiedStatus;
    });
  }, [associations, searchTerm, selectedCity, selectedActiveStatus, selectedVerifiedStatus]);

  const handleViewDetails = (association: Association) => {
    navigate(`/admin/associations/details/${association.id}`);
  };

  const handleEdit = (id: number) => {
    console.log("Edit association with id:", id);
    navigate(`/admin/associations/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(t('adminAssociationsPage.confirmDeleteAssociation', { associationId: id }) || `Are you sure you want to delete association ${id}?`)) {
      console.log("Delete association with id:", id);
      // Implement delete logic here
      try {
        // Placeholder for actual API call
        console.log('Simulating deletion...');
        setAssociations(prevAssociations => prevAssociations.filter(a => a.id !== id));
      } catch (delErr: unknown) {
        const errorMessage = delErr instanceof Error ? delErr.message : 'Unknown error occurred';
        setError(t('adminAssociationsPage.errorDeletingAssociation', { message: errorMessage }) || `Failed to delete association: ${errorMessage}`);
      }
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCity('all');
    setSelectedActiveStatus('all');
    setSelectedVerifiedStatus('all');
  };

  if (loading && !associations.length && !error) {
    return <div className="container mx-auto p-4"><p>{t('adminAssociationsPage.loadingAssociations') || 'Loading associations...'}</p></div>;
  }

  if (error) {
    return <div className="container mx-auto p-4"><p className="text-red-500">{error}</p></div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('adminAssociationsPage.title') || 'Associations Management'}</h1>
        <Button onClick={() => navigate('/admin/associations/add')}> 
          <PlusCircle className="mr-2 h-4 w-4" /> {t('adminAssociationsPage.addNewAssociationButton') || 'Add Association'}
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
                placeholder={t('adminAssociationsPage.searchPlaceholder') || 'Search associations...'}
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
                <SelectValue placeholder={t('adminAssociationsPage.filterByCity') || 'City'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('adminAssociationsPage.allCities') || 'All Cities'}</SelectItem>
                {uniqueCities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Active Status Filter */}
            <Select value={selectedActiveStatus} onValueChange={setSelectedActiveStatus}>
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder={t('adminAssociationsPage.filterByStatus') || 'Status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('adminAssociationsPage.allStatuses') || 'All'}</SelectItem>
                <SelectItem value="active">{t('adminAssociationsPage.statusActive') || 'Active'}</SelectItem>
                <SelectItem value="inactive">{t('adminAssociationsPage.statusInactive') || 'Inactive'}</SelectItem>
              </SelectContent>
            </Select>

            {/* Verified Status Filter */}
            <Select value={selectedVerifiedStatus} onValueChange={setSelectedVerifiedStatus}>
              <SelectTrigger className="w-full sm:w-[130px]">
                <SelectValue placeholder={t('adminAssociationsPage.filterByVerified') || 'Verified'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('adminAssociationsPage.allVerificationStatuses') || 'All'}</SelectItem>
                <SelectItem value="verified">{t('adminAssociationsPage.verifiedOnly') || 'Verified'}</SelectItem>
                <SelectItem value="unverified">{t('adminAssociationsPage.unverifiedOnly') || 'Unverified'}</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters Button */}
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full sm:w-auto"
            >
              <Filter className="mr-2 h-4 w-4" />
              {t('adminAssociationsPage.clearFilters') || 'Clear'}
            </Button>
          </div>
        </div>
      </div>

      {/* Display error if it exists */}
      {error && associations.length > 0 && <p className="text-red-500 mb-4">{error}</p>}
      
      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        {t('adminAssociationsPage.resultsCount', { count: filteredAssociations.length, total: associations.length }) || `Showing ${filteredAssociations.length} of ${associations.length} associations`}
      </div>
      
      {/* Associations Cards Grid */}
      {filteredAssociations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssociations.map((association) => (
            <div
              key={association.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 cursor-pointer group"
            >
              {/* Card Header with Logo and Actions */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {association.logo_url ? (
                    <img 
                      src={association.logo_url} 
                      alt={t('adminAssociationsPage.logoAlt', { name: association.name }) || `${association.name} logo`} 
                      className="h-12 w-12 rounded-full object-cover" 
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 text-xs font-semibold">
                      {association.name.charAt(0).toUpperCase()}
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
                      <span className="sr-only">{t('adminAssociationsPage.openMenuSr') || 'Open menu'}</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(association)}>
                      <EyeIcon className="mr-2 h-4 w-4" />
                      {t('adminAssociationsPage.actionViewDetails') || 'View Details'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(association.id)}>
                      <Edit2Icon className="mr-2 h-4 w-4" />
                      {t('adminAssociationsPage.actionEdit') || 'Edit'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(association.id)} className="text-red-500 hover:!text-red-600">
                      <Trash2Icon className="mr-2 h-4 w-4" />
                      {t('adminAssociationsPage.actionDelete') || 'Delete'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Association Name */}
              <h3 
                className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 cursor-pointer hover:underline"
                onClick={() => handleViewDetails(association)}
              >
                {association.name}
              </h3>

              {/* City and Contact Info */}
              <div className="space-y-1 mb-3">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  📍 {association.city || t('adminAssociationsPage.notAvailable') || 'N/A'}
                </p>
                {association.phone_number && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    📞 {association.phone_number}
                  </p>
                )}
                {association.supervisor && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    👤 {association.supervisor.first_name} {association.supervisor.last_name}
                  </p>
                )}
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                {association.is_active !== undefined && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    association.is_active 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {association.is_active ? (t('adminAssociationsPage.statusActive') || 'Active') : (t('adminAssociationsPage.statusInactive') || 'Inactive')}
                  </span>
                )}
                {association.is_verified !== undefined && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    association.is_verified 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {association.is_verified ? (t('adminAssociationsPage.verifiedOnly') || 'Verified') : (t('adminAssociationsPage.unverifiedOnly') || 'Unverified')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {searchTerm || selectedCity !== 'all' || selectedActiveStatus !== 'all' || selectedVerifiedStatus !== 'all'
              ? (t('adminAssociationsPage.noAssociationsMatchFilters') || 'No associations match your current filters')
              : (t('adminAssociationsPage.noAssociationsFound') || 'No associations found')
            }
          </p>
          {(searchTerm || selectedCity !== 'all' || selectedActiveStatus !== 'all' || selectedVerifiedStatus !== 'all') && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="mt-4"
            >
              {t('adminAssociationsPage.clearFilters') || 'Clear Filters'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminAssociationsPage; 