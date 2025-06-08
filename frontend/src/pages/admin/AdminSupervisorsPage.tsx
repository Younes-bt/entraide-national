import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import type { User } from '../../contexts/AuthContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Loader2, PlusCircle, Search, Filter, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define a specific type for Supervisors if needed, inheriting from User
interface Supervisor extends User {}

type FilterType = 'all' | 'recent' | 'hasPhone' | 'active';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const AdminSupervisorsPage = () => {
  const { t } = useTranslation();
  const { accessToken } = useAuth();
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [associationSupervisors, setAssociationSupervisors] = useState<Supervisor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search and filter states for center supervisors
  const [centerSearchTerm, setCenterSearchTerm] = useState<string>('');
  const [centerActiveFilter, setCenterActiveFilter] = useState<FilterType>('all');
  
  // Search and filter states for association supervisors
  const [associationSearchTerm, setAssociationSearchTerm] = useState<string>('');
  const [associationActiveFilter, setAssociationActiveFilter] = useState<FilterType>('all');

  useEffect(() => {
    const fetchSupervisors = async () => {
      if (!accessToken) {
        setError("Authentication required.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      
      let allUsers: User[] = [];
      let nextPageUrl: string | null = `${API_BASE_URL}/accounts/users/`;

      try {
        while (nextPageUrl) {
          const response = await fetch(nextPageUrl, { 
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            throw new Error(t('supervisors.fetchError') || 'Failed to fetch users');
          }
          const data = await response.json();
          allUsers = allUsers.concat(data.results);
          nextPageUrl = data.next; // Get the URL for the next page
        }
        
        console.log('Raw data from API (all pages):', allUsers);

        // Filter for center_supervisor role
        const filteredCenterSupervisors = allUsers.filter((user: User) => user.role === 'center_supervisor');
        setSupervisors(filteredCenterSupervisors);

        // Filter for association_supervisor role
        const filteredAssociationSupervisors = allUsers.filter((user: User) => user.role === 'association_supervisor');
        console.log('Filtered Association Supervisors (all pages):', filteredAssociationSupervisors);
        setAssociationSupervisors(filteredAssociationSupervisors);

      } catch (e) {
        setError((e as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupervisors();
  }, [accessToken, t]);

  // Filter function for supervisors
  const filterSupervisors = (supervisorsList: Supervisor[], searchTerm: string, activeFilter: FilterType) => {
    let filtered = supervisorsList;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((supervisor) => {
        const fullName = `${supervisor.first_name} ${supervisor.last_name}`.toLowerCase();
        const email = supervisor.email?.toLowerCase() || '';
        const phone = supervisor.phone_number?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        
        return fullName.includes(search) || email.includes(search) || phone.includes(search);
      });
    }

    // Apply quick filters
    switch (activeFilter) {
      case 'recent':
        // Filter users created in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filtered = filtered.filter((supervisor) => {
          if (!supervisor.date_joined) return false;
          return new Date(supervisor.date_joined) >= thirtyDaysAgo;
        });
        break;
      case 'hasPhone':
        filtered = filtered.filter((supervisor) => supervisor.phone_number && supervisor.phone_number.trim() !== '');
        break;
      case 'active':
        filtered = filtered.filter((supervisor) => supervisor.is_active !== false);
        break;
      case 'all':
      default:
        // No additional filtering
        break;
    }

    return filtered;
  };

  const handleEdit = (id: number) => {
    console.log("Edit supervisor:", id);
    // TODO: Implement edit functionality
  };

  const handleDelete = (id: number) => {
    console.log("Delete supervisor:", id);
    // TODO: Implement delete functionality
  };

  // Quick filter buttons component
  const QuickFilterButtons = ({ 
    activeFilter, 
    onFilterChange 
  }: { 
    activeFilter: FilterType; 
    onFilterChange: (filter: FilterType) => void;
  }) => (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={activeFilter === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('all')}
      >
        Show All
      </Button>
      <Button
        variant={activeFilter === 'recent' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('recent')}
      >
        Recently Added
      </Button>
      <Button
        variant={activeFilter === 'hasPhone' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('hasPhone')}
      >
        Has Phone
      </Button>
      <Button
        variant={activeFilter === 'active' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('active')}
      >
        Active
      </Button>
    </div>
  );

  // Search input component
  const SearchInput = ({ 
    value, 
    onChange, 
    placeholder 
  }: { 
    value: string; 
    onChange: (value: string) => void;
    placeholder: string;
  }) => (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-10"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          onClick={() => onChange('')}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );

  const filteredCenterSupervisors = filterSupervisors(supervisors, centerSearchTerm, centerActiveFilter);
  const filteredAssociationSupervisors = filterSupervisors(associationSupervisors, associationSearchTerm, associationActiveFilter);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" /> 
        <span>{t('supervisors.loading')}</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('sidebar.supervisors')}</h1>
        <div className="flex space-x-2">
          <Link to="/admin/supervisors/add">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('supervisors.addNewCenterSupervisor')}
            </Button>
          </Link>
          <Link to="/admin/supervisors/add-association">
            <Button variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('supervisors.addNewAssociationSupervisor')}
            </Button>
          </Link>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertTitle>{t('supervisors.errorTitle')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Section 1: Center Supervisors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {t('supervisors.centerSupervisorsTitle')} ({filteredCenterSupervisors.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="w-full sm:w-96">
              <SearchInput
                value={centerSearchTerm}
                onChange={setCenterSearchTerm}
                placeholder="Search center supervisors..."
              />
            </div>
            <QuickFilterButtons
              activeFilter={centerActiveFilter}
              onFilterChange={setCenterActiveFilter}
            />
          </div>
          
          {/* Center Supervisors Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">{t('table.avatar')}</TableHead>
                  <TableHead>{t('table.fullName')}</TableHead>
                  <TableHead>{t('table.center')}</TableHead>
                  <TableHead>{t('table.phone')}</TableHead>
                  <TableHead className="text-right">{t('table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCenterSupervisors.length > 0 ? (
                  filteredCenterSupervisors.map((supervisor) => (
                    <TableRow key={supervisor.id}>
                      <TableCell>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={supervisor.profile_picture || undefined} alt={`${supervisor.first_name} ${supervisor.last_name}`} />
                          <AvatarFallback>
                            {supervisor.first_name?.charAt(0)}{supervisor.last_name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {supervisor.first_name} {supervisor.last_name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        N/A
                      </TableCell>
                      <TableCell>
                        {supervisor.phone_number || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(supervisor.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>{t('actions.edit')}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(supervisor.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>{t('actions.delete')}</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      {centerSearchTerm || centerActiveFilter !== 'all' 
                        ? "No center supervisors match your search criteria"
                        : t('supervisors.noCenterResults')
                      }
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Association Supervisors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {t('supervisors.associationSupervisorsTitle')} ({filteredAssociationSupervisors.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="w-full sm:w-96">
              <SearchInput
                value={associationSearchTerm}
                onChange={setAssociationSearchTerm}
                placeholder="Search association supervisors..."
              />
            </div>
            <QuickFilterButtons
              activeFilter={associationActiveFilter}
              onFilterChange={setAssociationActiveFilter}
            />
          </div>
          
          {/* Association Supervisors Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">{t('table.avatar')}</TableHead>
                  <TableHead>{t('table.fullName')}</TableHead>
                  <TableHead>{t('table.association')}</TableHead>
                  <TableHead>{t('table.phone')}</TableHead>
                  <TableHead className="text-right">{t('table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssociationSupervisors.length > 0 ? (
                  filteredAssociationSupervisors.map((supervisor) => (
                    <TableRow key={supervisor.id}>
                      <TableCell>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={supervisor.profile_picture || undefined} alt={`${supervisor.first_name} ${supervisor.last_name}`} />
                          <AvatarFallback>
                            {supervisor.first_name?.charAt(0)}{supervisor.last_name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {supervisor.first_name} {supervisor.last_name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        N/A
                      </TableCell>
                      <TableCell>
                        {supervisor.phone_number || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(supervisor.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>{t('actions.edit')}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(supervisor.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>{t('actions.delete')}</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      {associationSearchTerm || associationActiveFilter !== 'all' 
                        ? "No association supervisors match your search criteria"
                        : t('supervisors.noAssociationResults')
                      }
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSupervisorsPage; 