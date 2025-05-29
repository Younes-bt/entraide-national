import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2, Users, Briefcase } from 'lucide-react';

// Define constants for filters
const ALL_PROGRAMS_VALUE = '__ALL_PROGRAMS_FILTER__';

// Interface for User data within a Trainer, based on UserProfileSerializer
interface TrainerUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username?: string;
  Arabic_first_name?: string | null;
  arabic_last_name?: string | null;
  profile_picture?: string | null; // URL from CloudinaryField
  birth_date?: string | null;
  birth_city?: string | null;
  CIN_id?: string | null;
  phone_number?: string | null;
  address?: string | null;
  city?: string | null;
  role_display?: string;
  is_active?: boolean;
  // date_joined?: string; // Available in UserSerializer if needed
}

// Interface for Trainer data
interface Trainer {
  id: number;
  user: TrainerUser; // Nested user details
  center: number; // Assuming center is represented by its ID in the fetched trainer data
  program: string | number; // Program ID
  program_name?: string; // Program name from the updated serializer
  contarct_with: string;
  contract_start_date: string;
  contract_end_date: string;
  created_at: string;
  updated_at: string;
}

// Interface for Center data (can be reused or imported if defined globally)
interface Center {
  id: number;
  name: string;
  description?: string;
}

// Interface for Program data (can be reused or imported)
interface ProgramData {
  id: string | number;
  name: string;
}

// Mobile Trainer Card Component
const TrainerCard = ({ trainer, onViewDetails, onEdit, onDeactivate, getInitials, t, getProgramNameById, formatDate }: {
  trainer: Trainer;
  onViewDetails: (trainerId: number) => void;
  onEdit: (trainerId: number) => void;
  onDeactivate: (trainerId: number) => void;
  getInitials: (first: string, last: string) => string;
  t: any; // i18next translation function
  getProgramNameById: (programId: string | number | undefined | null, programName?: string) => string;
  formatDate: (dateString: string) => string;
}) => (
  <Card className="w-full">
    <CardContent className="p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <Avatar className="h-9 w-9 flex-shrink-0">
            <AvatarImage src={trainer.user.profile_picture || undefined} alt={`${trainer.user.first_name} ${trainer.user.last_name}`} />
            <AvatarFallback className="text-xs">
              {getInitials(trainer.user.first_name, trainer.user.last_name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-sm truncate">
              {trainer.user.first_name} {trainer.user.last_name}
            </div>
            <div className="text-xs text-muted-foreground font-light truncate">
              {getProgramNameById(trainer.program, trainer.program_name)}
            </div>
            <div className="text-xs text-muted-foreground font-light truncate">
              {t('centerTrainersPage.contractEnds')}: {formatDate(trainer.contract_end_date)}
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-7 w-7 p-0 flex-shrink-0">
              <span className="sr-only">{t('centerTrainersPage.openMenu')}</span>
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewDetails(trainer.id)}>
              <Eye className="mr-2 h-4 w-4" />
              {t('centerTrainersPage.actions.viewDetails')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(trainer.id)}>
              <Edit className="mr-2 h-4 w-4" />
              {t('centerTrainersPage.actions.edit')}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={() => onDeactivate(trainer.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              {t('centerTrainersPage.actions.deactivate')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardContent>
  </Card>
);

const CenterTrainersPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [centerData, setCenterData] = useState<Center | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<string>(''); // Stores Program ID

  const [allProgramsData, setAllProgramsData] = useState<ProgramData[]>([]);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchAllPrograms = async () => {
      if (!token) return;
      try {
        const response = await fetch('http://localhost:8000/api/programs/trainingprogrames/', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
          console.error('[CenterTrainersPage] Failed to fetch all programs list status:', response.status);
          setAllProgramsData([]);
          return;
        }
        const data = await response.json();
        setAllProgramsData(Array.isArray(data) ? data : (data.results || []));
      } catch (err) {
        console.error('[CenterTrainersPage] Error fetching all programs:', err);
        setAllProgramsData([]);
      }
    };
    fetchAllPrograms();
  }, [token]);

  const getProgramNameById = (programId: string | number | undefined | null, programName?: string): string => {
    if (programId === null || programId === undefined) return 'N/A';
    
    // If we have the program name directly from the API, use it
    if (programName) {
      console.log('[CenterTrainersPage] Using program name from API:', programName);
      return programName;
    }
    
    // Add debugging
    console.log('[CenterTrainersPage] Looking for program with ID:', programId, 'Type:', typeof programId);
    console.log('[CenterTrainersPage] Available programs:', allProgramsData.map(p => ({ id: p.id, name: p.name, idType: typeof p.id })));
    
    const program = allProgramsData.find(p => p.id.toString() === programId.toString());
    const result = program ? program.name : t('centerTrainersPage.unknownProgram');
    
    console.log('[CenterTrainersPage] Program match result:', result);
    return result;
  };
  
  const filteredTrainers = trainers.filter(trainer => {
    const nameMatch = `${trainer.user.first_name} ${trainer.user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = trainer.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = nameMatch || emailMatch;
    
    const matchesProgram = !selectedProgram || trainer.program.toString() === selectedProgram;
    
    return matchesSearch && matchesProgram;
  });

  useEffect(() => {
    fetchData();
  }, [user]); // Re-fetch if user context changes

  const fetchData = async () => {
    console.log('[CenterTrainersPage] fetchData initiated');
    if (!user?.id) {
      console.error('[CenterTrainersPage] Access Denied: User ID not found.');
      setError(t('centerTrainersPage.accessDenied'));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setTrainers([]);

    if (!token) {
      console.error('[CenterTrainersPage] Auth Error: Token not available.');
      setError(t('centerTrainersPage.errorAuthNotAvailable'));
      setLoading(false);
      return;
    }

    try {
      console.log(`[CenterTrainersPage] Fetching center for supervisor ID: ${user.id}`);
      const supervisedCentersResponse = await fetch(`http://localhost:8000/api/centers-app/centers/?supervisor=${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      console.log('[CenterTrainersPage] Supervisor centers response status:', supervisedCentersResponse.status);

      if (!supervisedCentersResponse.ok) {
        const errorText = await supervisedCentersResponse.text();
        console.error('[CenterTrainersPage] Failed to fetch supervised center:', errorText);
        setError(t('centerTrainersPage.noCenterAssigned'));
        setLoading(false);
        return;
      }

      const supervisedCentersData = await supervisedCentersResponse.json();
      console.log('[CenterTrainersPage] Supervised centers data received:', supervisedCentersData);
      const centers = Array.isArray(supervisedCentersData) ? supervisedCentersData : supervisedCentersData.results || [];

      if (centers.length === 0) {
        console.warn('[CenterTrainersPage] Supervisor is not assigned to any center.');
        setError(t('centerTrainersPage.noCenterAssigned'));
        setLoading(false);
        return;
      }
      
      const currentCenter = centers[0] as Center; // Assuming supervisor is assigned to one primary center for this view
      setCenterData(currentCenter);
      console.log('[CenterTrainersPage] Current center set:', currentCenter);

      if (!currentCenter.id) {
        console.error('[CenterTrainersPage] Current center ID is missing!');
        setError(t('centerTrainersPage.errorFetchingDetail'));
        setLoading(false);
        return;
      }

      console.log(`[CenterTrainersPage] Fetching trainers for center ID: ${currentCenter.id}`);
      // API endpoint for teachers, filtered by center
      const trainersResponse = await fetch(`http://localhost:8000/api/teachers/teachers/?center=${currentCenter.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('[CenterTrainersPage] Trainers response status (for center):', trainersResponse.status);

      if (!trainersResponse.ok) {
        const errorText = await trainersResponse.text();
        console.error(`[CenterTrainersPage] Failed to fetch trainers for center ${currentCenter.id}: `, errorText);
        setError(t('centerTrainersPage.errorFetchingTrainersForCenter', { centerName: currentCenter.name })); 
        setLoading(false);
        return;
      }

      const trainersData = await trainersResponse.json();
      console.log('[CenterTrainersPage] Trainers data received (for center):', trainersData);
      
      // Add detailed debugging for trainer structure
      if (Array.isArray(trainersData) && trainersData.length > 0) {
        console.log('[CenterTrainersPage] First trainer structure:', trainersData[0]);
        console.log('[CenterTrainersPage] First trainer program field:', trainersData[0].program, 'Type:', typeof trainersData[0].program);
      } else if (trainersData && trainersData.results && trainersData.results.length > 0) {
        console.log('[CenterTrainersPage] First trainer structure (paginated):', trainersData.results[0]);
        console.log('[CenterTrainersPage] First trainer program field (paginated):', trainersData.results[0].program, 'Type:', typeof trainersData.results[0].program);
      }
      
      let allTrainersRaw: Trainer[] = [];
      if (Array.isArray(trainersData)) {
        allTrainersRaw = trainersData;
      } else if (trainersData && trainersData.results) { // Handle paginated response
        allTrainersRaw = trainersData.results;
      }
      
      const activeTrainers = allTrainersRaw.filter(trainer => trainer.user && trainer.user.is_active === true);
      
      setTrainers(activeTrainers);
      console.log('[CenterTrainersPage] Processed and set active trainers (for center):', activeTrainers);
      if (activeTrainers.length === 0) {
        console.log('[CenterTrainersPage] No active trainers found in center:', currentCenter.name);
      }

    } catch (err) {
      console.error('[CenterTrainersPage] General error in fetchData:', err);
      if (!error) { // Avoid overwriting specific errors
          setError(t('centerTrainersPage.errorFetchingDetail'));
      }
    } finally {
      console.log('[CenterTrainersPage] fetchData finished.');
      setLoading(false);
    }
  };

  const handleEditTrainer = (trainerId: number) => {
    navigate(`/center/trainers/edit/${trainerId}`);
  };

  const handleViewTrainerDetails = (trainerId: number) => {
    navigate(`/center/trainers/${trainerId}`);
  };

  const handleDeactivateTrainer = async (trainerId: number) => {
    if (!window.confirm(t('centerTrainersPage.actions.confirmDeactivate'))) {
      return;
    }
    if (!token) {
      setError(t('centerTrainersPage.errorAuthNotAvailable'));
      console.error('[CenterTrainersPage] Deactivate failed: Auth token not available.');
      return;
    }
    try {
      // The TeacherCreateUpdateSerializer expects { user: { is_active: false } } for PATCH
      const payload = { user: { is_active: false } };
      const response = await fetch(`http://localhost:8000/api/teachers/teachers/${trainerId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to deactivate trainer. Server did not provide specific error.' }));
        const errorMessage = errorData.detail || `Failed to deactivate trainer. Status: ${response.status}`;
        console.error('[CenterTrainersPage] Deactivate failed:', errorMessage);
        setError(errorMessage);
        throw new Error(errorMessage);
      }
      // Refetch data or filter out locally
      setTrainers(prevTrainers => prevTrainers.filter(trainer => trainer.id !== trainerId));
      console.log(`[CenterTrainersPage] Trainer ${trainerId} user set to inactive.`);
    } catch (err) {
      console.error('[CenterTrainersPage] Error during trainer deactivation:', err);
      // Avoid setting generic error if a specific one from response handling was already set
      if (!(err instanceof Error && err.message.startsWith('Failed to deactivate trainer'))) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred while deactivating the trainer.');
      }
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return 'N/A';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-3 md:p-4">
        <div className="flex justify-center items-center py-10">
          <span className="text-sm md:text-base">{t('centerTrainersPage.loadingMessage')}</span>
        </div>
      </div>
    );
  }

  if (error && !centerData) { // Show critical error if centerData couldn't be fetched
    return (
      <div className="container mx-auto p-3 md:p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600 text-lg md:text-xl">
              {t('centerTrainersPage.errorTitleCritical')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm md:text-base">{error}</p>
            {error === t('centerTrainersPage.noCenterAssigned') && 
              <p className="text-muted-foreground text-sm md:text-base mt-2">{t('centerTrainersPage.checkAssignment')}</p>}
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!centerData) { // Should be covered by above, but as a fallback
    return (
      <div className="container mx-auto p-3 md:p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600 text-lg md:text-xl">{t('centerTrainersPage.noCenterDataTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm md:text-base">{t('centerTrainersPage.noCenterDataDescription')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // If there's an error but centerData exists (e.g., error fetching trainers but not center)
  // This part is tricky, might want to show trainers list area with an error message within it.
  // For now, if error exists, it implies a major issue.

  return (
    <div className="container mx-auto p-3 md:p-4 space-y-4 md:space-y-6">
      <div className="flex flex-col gap-3 md:gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl md:text-3xl font-bold break-words leading-tight">
              {t('centerTrainersPage.pageTitle', { centerName: centerData.name })}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              {t('centerTrainersPage.pageSubtitle', { count: filteredTrainers.length })}
            </p>
          </div>
          <Link to="new" className="w-full sm:w-auto">
            <Button className="flex items-center justify-center gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              <span className="sm:inline">{t('centerTrainersPage.addNewTrainerButton')}</span>
            </Button>
          </Link>
        </div>
      </div>

      <Card className="w-full">
        <CardContent className="pt-4 md:pt-6">
          <div className="space-y-3 md:space-y-0 md:flex md:flex-row md:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t('centerTrainersPage.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-none md:flex gap-3 md:gap-4">
              <Select
                value={selectedProgram === '' ? ALL_PROGRAMS_VALUE : selectedProgram}
                onValueChange={(value) => setSelectedProgram(value === ALL_PROGRAMS_VALUE ? '' : value)}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder={t('centerTrainersPage.filterByProgram')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_PROGRAMS_VALUE}>{t('centerTrainersPage.allPrograms')}</SelectItem>
                  {allProgramsData.map((program) => (
                    <SelectItem key={`program-${program.id}`} value={program.id.toString()}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && centerData && ( // Display error related to fetching trainers if centerData is available
        <Card className="border-red-500">
          <CardHeader>
            <CardTitle className="text-red-600">{t('centerTrainersPage.errorFetchingTrainersTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" /> {/* Changed icon */}
            {t('centerTrainersPage.trainersListTitle')} ({filteredTrainers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTrainers.length === 0 && !loading && !error ? ( // Added !error here
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || selectedProgram
                  ? t('centerTrainersPage.noTrainersMatchFilter')
                  : t('centerTrainersPage.noTrainersFound', { centerName: centerData.name })
                }
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('centerTrainersPage.tableHeaders.trainer')}</TableHead>
                      <TableHead>{t('centerTrainersPage.tableHeaders.program')}</TableHead>
                      <TableHead>{t('centerTrainersPage.tableHeaders.contractWith')}</TableHead>
                      <TableHead>{t('centerTrainersPage.tableHeaders.contractStart')}</TableHead>
                      <TableHead>{t('centerTrainersPage.tableHeaders.contractEnd')}</TableHead>
                      <TableHead className="text-right">{t('centerTrainersPage.tableHeaders.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTrainers.map((trainer) => (
                      <TableRow key={trainer.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={trainer.user.profile_picture || undefined} alt={`${trainer.user.first_name} ${trainer.user.last_name}`} />
                              <AvatarFallback className="text-xs">
                                {getInitials(trainer.user.first_name, trainer.user.last_name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {trainer.user.first_name} {trainer.user.last_name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {trainer.user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getProgramNameById(trainer.program, trainer.program_name)}</TableCell>
                        <TableCell>
                          <Badge variant={trainer.contarct_with === 'entraide' ? 'default' : 'secondary'}>
                            {trainer.contarct_with}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(trainer.contract_start_date)}</TableCell>
                        <TableCell>{formatDate(trainer.contract_end_date)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">{t('centerTrainersPage.openMenu')}</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewTrainerDetails(trainer.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                {t('centerTrainersPage.actions.viewDetails')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditTrainer(trainer.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                {t('centerTrainersPage.actions.edit')}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeactivateTrainer(trainer.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t('centerTrainersPage.actions.deactivate')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-3">
                {filteredTrainers.map((trainer) => (
                  <TrainerCard
                    key={trainer.id}
                    trainer={trainer}
                    onViewDetails={handleViewTrainerDetails}
                    onEdit={handleEditTrainer}
                    onDeactivate={handleDeactivateTrainer}
                    getInitials={getInitials}
                    t={t}
                    getProgramNameById={getProgramNameById}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CenterTrainersPage; 