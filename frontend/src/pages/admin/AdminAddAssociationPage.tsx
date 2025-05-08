import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Assuming you have a Textarea component
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Import Dropdown components
import { ChevronDown } from 'lucide-react'; // For dropdown trigger icon
import { useAuth } from '@/contexts/AuthContext';
import type { User } from '@/contexts/AuthContext'; // Corrected import for User type

// Define an interface for the form data
interface AssociationFormData {
  name: string;
  description: string;
  logo?: File | null; // For file upload
  phone_number?: string;
  email?: string;
  address?: string;
  city?: string;
  maps_link?: string;
  website?: string;
  facebook_link?: string;
  instagram_link?: string;
  twitter_link?: string;
  supervisor: number | ''; // Supervisor ID - ensure it's number or empty string for initial state
  contract_start_date?: string;
  contract_end_date?: string;
  registration_number?: string;
}

const AdminAddAssociationPage: React.FC = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [formData, setFormData] = useState<AssociationFormData>({
    name: '',
    description: '',
    phone_number: '',
    email: '',
    address: '',
    city: '',
    maps_link: '',
    website: '',
    facebook_link: '',
    instagram_link: '',
    twitter_link: '',
    supervisor: '', // Initialized as empty string
    contract_start_date: '',
    contract_end_date: '',
    registration_number: '',
    logo: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [supervisorsList, setSupervisorsList] = useState<User[]>([]);
  const [selectedSupervisorName, setSelectedSupervisorName] = useState<string>('Select Supervisor');
  const [isFetchingSupervisors, setIsFetchingSupervisors] = useState<boolean>(false);

  useEffect(() => {
    const fetchAllUsers = async (page = 1, accumulatedUsers: User[] = []): Promise<User[]> => {
      if (!accessToken) return accumulatedUsers;
      setIsFetchingSupervisors(true);
      try {
        const response = await fetch(`/api/accounts/users/?page=${page}&page_size=100`, { // Fetch 100 per page
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          console.error("Failed to fetch users page", page, response.status);
          return accumulatedUsers; 
        }
        const data = await response.json();
        const newUsers = [...accumulatedUsers, ...data.results];
        
        if (data.next) { // If there's a next page, fetch it
          const nextPageNumber = new URL(data.next).searchParams.get('page');
          if (nextPageNumber) {
            return fetchAllUsers(parseInt(nextPageNumber), newUsers);
          }
        }
        return newUsers; // All pages fetched
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load potential supervisors.');
        return accumulatedUsers; 
      } finally {
        if (page === 1) setIsFetchingSupervisors(false); // Only set to false on the initial call's end
      }
    };

    if (accessToken) {
      fetchAllUsers().then(allUsers => {
        const filtered = allUsers.filter(user => user.role === 'association_supervisor');
        setSupervisorsList(filtered);
        if (filtered.length === 0) {
            setSelectedSupervisorName('No supervisors available');
        }
      });
    }
  }, [accessToken]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, logo: e.target.files![0] }));
    } else {
      setFormData(prev => ({...prev, logo: null}));
    }
  };
  
  const handleSupervisorSelect = (value: string) => {
    const supervisorId = parseInt(value, 10);
    const selected = supervisorsList.find(s => s.id === supervisorId);
    if (selected) {
        setFormData(prev => ({ ...prev, supervisor: supervisorId }));
        setSelectedSupervisorName(`${selected.first_name} ${selected.last_name} (ID: ${selected.id})`);
    } else {
        setFormData(prev => ({ ...prev, supervisor: '' }));
        setSelectedSupervisorName('Select Supervisor');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!accessToken) {
      setError("Authentication token not found. Please log in.");
      setIsLoading(false);
      return;
    }
    if (formData.supervisor === '') {
        setError("Please select a supervisor.");
        setIsLoading(false);
        return;
    }

    const submissionData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof File) {
        submissionData.append(key, value);
      } else if (key === 'supervisor' && typeof value === 'number') { // Ensure supervisor ID is sent
        submissionData.append(key, value.toString());
      } else if (typeof value === 'string' && value !== '') { // Append non-empty strings
        submissionData.append(key, value);
      }
      // Note: this logic might need to be adjusted if other fields can be numbers or booleans
    });
    
    // console.log("Submitting Supervisor ID:", formData.supervisor);
    // for (let pair of submissionData.entries()) {
    //    console.log(pair[0]+ ', ' + pair[1]); 
    // }

    try {
      const response = await fetch('/api/associations/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: submissionData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to create association. Server response not JSON.' }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      // const result = await response.json(); // Not strictly needed if not using the result immediately
      await response.json();
      setSuccessMessage('Association created successfully! Redirecting...');
      setFormData({ /* Reset form */
        name: '', description: '', supervisor: '', phone_number: '', email: '', address: '', city: '',
        maps_link: '', website: '', facebook_link: '', instagram_link: '', twitter_link: '',
        contract_start_date: '', contract_end_date: '', registration_number: '', logo: null,
      });
      setSelectedSupervisorName('Select Supervisor');
      setTimeout(() => {
        navigate('/admin/associations');
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error("Failed to create association:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Add New Association</h1>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">{error}</div>}
      {successMessage && <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded-md">{successMessage}</div>}

      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg shadow">
        <div>
          <Label htmlFor="name">Association Name <span className="text-red-500">*</span></Label>
          <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
          <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required className="mt-1" rows={4} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input id="phone_number" name="phone_number" type="tel" value={formData.phone_number} onChange={handleChange} className="mt-1" />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Input id="address" name="address" type="text" value={formData.address} onChange={handleChange} className="mt-1" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" type="text" value={formData.city} onChange={handleChange} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="registration_number">Registration Number</Label>
            <Input id="registration_number" name="registration_number" type="text" value={formData.registration_number} onChange={handleChange} className="mt-1" />
          </div>
        </div>
        
        <div>
          <Label htmlFor="supervisor">Supervisor <span className="text-red-500">*</span></Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between mt-1">
                {selectedSupervisorName}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
              <DropdownMenuLabel>Available Supervisors</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isFetchingSupervisors ? (
                <DropdownMenuItem disabled>Loading supervisors...</DropdownMenuItem>
              ) : supervisorsList.length > 0 ? (
                <DropdownMenuRadioGroup value={formData.supervisor?.toString()} onValueChange={handleSupervisorSelect}>
                  {supervisorsList.map((supervisor) => (
                    <DropdownMenuRadioItem key={supervisor.id} value={supervisor.id.toString()}>
                      {supervisor.first_name} {supervisor.last_name} (ID: {supervisor.id})
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              ) : (
                <DropdownMenuItem disabled>No association supervisors found.</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <Label htmlFor="logo">Logo</Label>
          <Input id="logo" name="logo" type="file" onChange={handleFileChange} className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" />
        </div>

        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 pt-4 border-t border-border">Contact & Social Links (Optional)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="website">Website URL</Label>
            <Input id="website" name="website" type="url" value={formData.website} onChange={handleChange} className="mt-1" placeholder="https://example.com" />
          </div>
          <div>
            <Label htmlFor="maps_link">Google Maps Link</Label>
            <Input id="maps_link" name="maps_link" type="url" value={formData.maps_link} onChange={handleChange} className="mt-1" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="facebook_link">Facebook URL</Label>
            <Input id="facebook_link" name="facebook_link" type="url" value={formData.facebook_link} onChange={handleChange} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="instagram_link">Instagram URL</Label>
            <Input id="instagram_link" name="instagram_link" type="url" value={formData.instagram_link} onChange={handleChange} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="twitter_link">Twitter URL</Label>
            <Input id="twitter_link" name="twitter_link" type="url" value={formData.twitter_link} onChange={handleChange} className="mt-1" />
          </div>
        </div>

        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 pt-4 border-t border-border">Contract Information (Optional)</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="contract_start_date">Contract Start Date</Label>
            <Input id="contract_start_date" name="contract_start_date" type="date" value={formData.contract_start_date} onChange={handleChange} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="contract_end_date">Contract End Date</Label>
            <Input id="contract_end_date" name="contract_end_date" type="date" value={formData.contract_end_date} onChange={handleChange} className="mt-1" />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/associations')} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Association'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddAssociationPage; 