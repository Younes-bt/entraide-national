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
import { MoreHorizontal, Edit, Trash2, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define a specific type for Supervisors if needed, inheriting from User
interface Supervisor extends User {}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const AdminSupervisorsPage = () => {
  const { t } = useTranslation();
  const { accessToken } = useAuth();
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
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
      try {
        // TODO: Add pagination handling if needed
        // TODO: Ideally filter on backend (?role=center_supervisor)
        const response = await fetch(`${API_BASE_URL}/accounts/users/`, { 
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(t('supervisors.fetchError') || 'Failed to fetch users'); // Add translation key
        }
        const data = await response.json();
        // Filter for center_supervisor role - adjust key if needed based on actual API response
        const filteredSupervisors = data.results.filter((user: User) => user.role === 'center_supervisor');
        setSupervisors(filteredSupervisors);
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
      <h1 className="text-3xl font-bold mb-6">{t('sidebar.supervisors')}</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>{t('supervisors.errorTitle')}</AlertTitle> {/* Add translation */} 
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
            <Loader2 className="mr-2 h-8 w-8 animate-spin" /> 
            <span>{t('supervisors.loading')}</span> {/* Add translation */} 
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">{t('table.avatar')}</TableHead> {/* Add translation */} 
                <TableHead>{t('table.fullName')}</TableHead> {/* Add translation */} 
                <TableHead>{t('table.center')}</TableHead> {/* Add translation */} 
                <TableHead>{t('table.phone')}</TableHead> {/* Add translation */} 
                <TableHead className="text-right">{t('table.actions')}</TableHead> {/* Add translation */} 
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
                      N/A {/* Placeholder - Center info not available from User API */}
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
                            <span>{t('actions.edit')}</span> {/* Add translation */} 
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(supervisor.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>{t('actions.delete')}</span> {/* Add translation */} 
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    {t('supervisors.noResults')} {/* Add translation */} 
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminSupervisorsPage; 