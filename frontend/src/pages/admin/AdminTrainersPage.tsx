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
import { MoreHorizontal, EyeIcon, Edit2Icon, Trash2Icon, PlusCircle, Search, Filter, UserCog, MapPin, Building, Calendar } from 'lucide-react';

// Trainer interface based on TeacherSerializer
interface Trainer {
  id: string | number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    profile_picture?: string;
    is_active: boolean;
    Arabic_first_name?: string;
    arabic_last_name?: string;
    CIN_id?: string;
    birth_date?: string;
    birth_city?: string;
    address?: string;
    city?: string;
  };
  center: string; // Center name as string
  program_name: string; // Program name as string
  program: number; // Program ID
  contarct_with: 'entraide' | 'association';
  contract_start_date: string;
  contract_end_date: string;
  created_at: string;
  updated_at: string;
}

// API base URL
const API_BASE_URL = 'http://localhost:8000/api';

// Fetch trainers function
async function fetchTrainers(token: string | null): Promise<Trainer[]> {
  if (!token) {
    throw new Error('Authentication token not available.');
  }

  const response = await fetch(`${API_BASE_URL}/teachers/teachers/`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch trainers' }));
    if (response.status === 401) {
      throw new Error(errorData.detail || 'Authentication failed or token expired.');
    }
    throw new Error(errorData.detail || 'Failed to fetch trainers');
  }
  
  const data = await response.json();
  return data.results || data;
}

const AdminTrainersPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const auth = useAuth();
  const userAccessToken = auth.accessToken;

  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCenter, setSelectedCenter] = useState<string>('all');
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [selectedContractType, setSelectedContractType] = useState<string>('all');
  const [selectedActiveStatus, setSelectedActiveStatus] = useState<string>('all');

  const fetchAndSetTrainers = () => {
    if (userAccessToken) {
      setLoading(true);
      fetchTrainers(userAccessToken)
        .then(data => {
          setTrainers(data);
          setLoading(false);
          setError(null);
        })
        .catch(err => {
          console.error(err);
          setError(t('adminTrainersPage.errorLoadingDynamic', { message: err.message }) || err.message);
          setLoading(false);
        });
    } else if (!auth.isLoading) {
      setError(t('adminTrainersPage.errorAuthNotAvailable') || 'Authentication not available');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetTrainers();
  }, [userAccessToken, auth.isLoading]);

  // Get unique centers, programs for filter dropdowns
  const uniqueCenters = useMemo(() => {
    const centers = trainers
      .map(trainer => trainer.center)
      .filter(center => center && center.trim() !== '')
      .map(center => center.trim());
    return [...new Set(centers)].sort();
  }, [trainers]);

  const uniquePrograms = useMemo(() => {
    const programs = trainers
      .map(trainer => trainer.program_name)
      .filter(program => program && program.trim() !== '')
      .map(program => program.trim());
    return [...new Set(programs)].sort();
  }, [trainers]);

  // Filter trainers based on search and filter criteria
  const filteredTrainers = useMemo(() => {
    return trainers.filter(trainer => {
      // Search term filter
      const matchesSearch = searchTerm === '' || 
        trainer.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.center.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.program_name.toLowerCase().includes(searchTerm.toLowerCase());

      // Center filter
      const matchesCenter = selectedCenter === 'all' || trainer.center === selectedCenter;

      // Program filter
      const matchesProgram = selectedProgram === 'all' || trainer.program_name === selectedProgram;

      // Contract type filter
      const matchesContractType = selectedContractType === 'all' || trainer.contarct_with === selectedContractType;

      // Active status filter
      const matchesActiveStatus = selectedActiveStatus === 'all' || 
        (selectedActiveStatus === 'active' && trainer.user.is_active === true) ||
        (selectedActiveStatus === 'inactive' && trainer.user.is_active === false);

      return matchesSearch && matchesCenter && matchesProgram && matchesContractType && matchesActiveStatus;
    });
  }, [trainers, searchTerm, selectedCenter, selectedProgram, selectedContractType, selectedActiveStatus]);

  const getTrainerFullName = (trainer: Trainer): string => {
    return `${trainer.user.first_name} ${trainer.user.last_name}`;
  };

  const getTrainerInitials = (trainer: Trainer): string => {
    return `${trainer.user.first_name.charAt(0)}${trainer.user.last_name.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleViewDetails = (trainer: Trainer) => {
    navigate(`/admin/trainers/details/${trainer.id}`);
  };

  const handleEdit = (trainerId: string | number) => {
    console.log(`Edit trainer ${trainerId}`);
    navigate(`/admin/trainers/edit/${trainerId}`);
  };

  const handleDelete = async (trainerId: string | number) => {
    if (window.confirm(t('adminTrainersPage.confirmDeleteTrainer', { trainerId }) || `Are you sure you want to delete this trainer?`)) {
      console.warn(`Delete trainer ${trainerId}`);
      if (!userAccessToken) {
        setError(t('adminTrainersPage.errorAuthNotAvailableForDelete') || 'Authentication not available for delete');
        return;
      }
      try {
        // Placeholder for actual API call
        // await actualDeleteTrainerApiCall(trainerId, userAccessToken);
        console.log('Simulating deletion...');
        setTrainers(prevTrainers => prevTrainers.filter(t => t.id !== trainerId));
        // fetchAndSetTrainers(); // Or refetch to ensure consistency after delete
      } catch (delErr: any) {
        setError(t('adminTrainersPage.errorDeletingTrainer', { message: delErr.message }) || delErr.message);
      }
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCenter('all');
    setSelectedProgram('all');
    setSelectedContractType('all');
    setSelectedActiveStatus('all');
  };

  if (loading && !trainers.length && !error) return <div className="container mx-auto p-4"><p>{t('adminTrainersPage.loadingTrainers') || 'Loading trainers...'}</p></div>;
  if (auth.isLoading) return <div className="container mx-auto p-4"><p>{t('adminTrainersPage.loadingAuthAndTrainers') || 'Loading...'}</p></div>;
  // Display general error if it exists
  if (error) return <div className="container mx-auto p-4"><p className="text-red-500">{error}</p></div>;
  
  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('adminTrainersPage.title') || 'Trainers Management'}</h1>
        <Button onClick={() => navigate('/admin/trainers/add')}> 
          <PlusCircle className="mr-2 h-4 w-4" /> {t('adminTrainersPage.addNewTrainerButton') || 'Add Trainer'}
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
                placeholder={t('adminTrainersPage.searchPlaceholder') || 'Search trainers...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-2">
            {/* Center Filter */}
            <Select value={selectedCenter} onValueChange={setSelectedCenter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder={t('adminTrainersPage.filterByCenter') || 'Center'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('adminTrainersPage.allCenters') || 'All Centers'}</SelectItem>
                {uniqueCenters.map(center => (
                  <SelectItem key={center} value={center}>{center}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Program Filter */}
            <Select value={selectedProgram} onValueChange={setSelectedProgram}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder={t('adminTrainersPage.filterByProgram') || 'Program'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('adminTrainersPage.allPrograms') || 'All Programs'}</SelectItem>
                {uniquePrograms.map(program => (
                  <SelectItem key={program} value={program}>{program}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Contract Type Filter */}
            <Select value={selectedContractType} onValueChange={setSelectedContractType}>
              <SelectTrigger className="w-full sm:w-[130px]">
                <SelectValue placeholder={t('adminTrainersPage.filterByContract') || 'Contract'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('adminTrainersPage.allContracts') || 'All Contracts'}</SelectItem>
                <SelectItem value="entraide">{t('adminTrainersPage.contractEntraide') || 'Entraide'}</SelectItem>
                <SelectItem value="association">{t('adminTrainersPage.contractAssociation') || 'Association'}</SelectItem>
              </SelectContent>
            </Select>

            {/* Active Status Filter */}
            <Select value={selectedActiveStatus} onValueChange={setSelectedActiveStatus}>
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder={t('adminTrainersPage.filterByStatus') || 'Status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('adminTrainersPage.allStatuses') || 'All'}</SelectItem>
                <SelectItem value="active">{t('adminTrainersPage.statusActive') || 'Active'}</SelectItem>
                <SelectItem value="inactive">{t('adminTrainersPage.statusInactive') || 'Inactive'}</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters Button */}
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full sm:w-auto"
            >
              <Filter className="mr-2 h-4 w-4" />
              {t('adminTrainersPage.clearFilters') || 'Clear'}
            </Button>
          </div>
        </div>
      </div>

      {/* Display fetch error separately if it exists, to not hide cards during other errors like delete */}
      {error && trainers.length > 0 && <p className="text-red-500 mb-4">{error}</p>}
      
      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        {t('adminTrainersPage.resultsCount', { count: filteredTrainers.length, total: trainers.length }) || `Showing ${filteredTrainers.length} of ${trainers.length} trainers`}
      </div>
      
      { (!loading || trainers.length > 0) && !(!userAccessToken && !auth.isLoading) && (
        <>
          {/* Trainers Cards Grid */}
          {filteredTrainers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTrainers.map((trainer) => (
                <div
                  key={trainer.id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 cursor-pointer group"
                >
                  {/* Card Header with Avatar and Actions */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {trainer.user.profile_picture ? (
                        <img 
                          src={trainer.user.profile_picture} 
                          alt={t('adminTrainersPage.profileAlt', { name: getTrainerFullName(trainer) }) || `${getTrainerFullName(trainer)} profile`} 
                          className="h-12 w-12 rounded-full object-cover" 
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-sm font-semibold">
                          {getTrainerInitials(trainer)}
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
                          <span className="sr-only">{t('adminTrainersPage.openMenuSr') || 'Open menu'}</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(trainer)}>
                          <EyeIcon className="mr-2 h-4 w-4" />
                          {t('adminTrainersPage.actionViewDetails') || 'View Details'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(trainer.id)}>
                          <Edit2Icon className="mr-2 h-4 w-4" />
                          {t('adminTrainersPage.actionEdit') || 'Edit'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(trainer.id)} className="text-red-500 hover:!text-red-600">
                          <Trash2Icon className="mr-2 h-4 w-4" />
                          {t('adminTrainersPage.actionDelete') || 'Delete'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Trainer Name */}
                  <h3 
                    className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 cursor-pointer hover:underline"
                    onClick={() => handleViewDetails(trainer)}
                  >
                    {getTrainerFullName(trainer)}
                  </h3>

                  {/* Additional Info */}
                  <div className="space-y-1 mb-3">
                    <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center">
                      <Building className="mr-1 h-3 w-3" />
                      {trainer.center}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center">
                      <UserCog className="mr-1 h-3 w-3" />
                      {trainer.program_name}
                    </p>
                    {trainer.user.city && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center">
                        <MapPin className="mr-1 h-3 w-3" />
                        {trainer.user.city}
                      </p>
                    )}
                    <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {formatDate(trainer.contract_start_date)} - {formatDate(trainer.contract_end_date)}
                    </p>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2">
                    {trainer.user.is_active !== undefined && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        trainer.user.is_active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {trainer.user.is_active ? (t('adminTrainersPage.statusActive') || 'Active') : (t('adminTrainersPage.statusInactive') || 'Inactive')}
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      trainer.contarct_with === 'entraide'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    }`}>
                      {trainer.contarct_with === 'entraide' ? (t('adminTrainersPage.contractEntraide') || 'Entraide') : (t('adminTrainersPage.contractAssociation') || 'Association')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {searchTerm || selectedCenter !== 'all' || selectedProgram !== 'all' || selectedContractType !== 'all' || selectedActiveStatus !== 'all'
                  ? (t('adminTrainersPage.noTrainersMatchFilters') || 'No trainers match your current filters')
                  : (t('adminTrainersPage.noTrainersFound') || 'No trainers found')
                }
              </p>
              {(searchTerm || selectedCenter !== 'all' || selectedProgram !== 'all' || selectedContractType !== 'all' || selectedActiveStatus !== 'all') && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  {t('adminTrainersPage.clearFilters') || 'Clear Filters'}
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminTrainersPage; 