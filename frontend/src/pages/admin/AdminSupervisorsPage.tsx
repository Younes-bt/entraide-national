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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Loader2, PlusCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from 'react-router-dom';

// Define a specific type for Supervisors if needed, inheriting from User
interface Supervisor extends User {}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const AdminSupervisorsPage = () => {
  const { t } = useTranslation();
  const { accessToken } = useAuth();
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [associationSupervisors, setAssociationSupervisors] = useState<Supervisor[]>([]); // New state for association supervisors
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        // Assuming the user has reverted the filter to use 'user.role'
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

  const handleEdit = (id: number) => {
    console.log("Edit supervisor:", id);
    // TODO: Implement edit functionality (e.g., navigate to edit page or open modal)
  };

  const handleDelete = (id: number) => {
    console.log("Delete supervisor:", id);
    // TODO: Implement delete functionality (e.g., show confirmation, call API)
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
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
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>{t('supervisors.errorTitle')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
            <Loader2 className="mr-2 h-8 w-8 animate-spin" /> 
            <span>{t('supervisors.loading')}</span>
        </div>
      ) : (
        <>
          {/* Center Supervisors Table */}
          <h2 className="text-2xl font-semibold mb-4 mt-8">{t('supervisors.centerSupervisorsTitle')}</h2>
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
                {supervisors.length > 0 ? (
                  supervisors.map((supervisor) => (
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
                      {t('supervisors.noCenterResults')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Association Supervisors Table */}
          <h2 className="text-2xl font-semibold mb-4 mt-8">{t('supervisors.associationSupervisorsTitle')}</h2>
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
                {associationSupervisors.length > 0 ? (
                  associationSupervisors.map((supervisor) => (
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
                      {t('supervisors.noAssociationResults')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminSupervisorsPage; 