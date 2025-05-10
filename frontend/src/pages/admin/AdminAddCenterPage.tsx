import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { PlusCircle, ChevronDown } from 'lucide-react'; // Import PlusCircle & ChevronDown
import AddCenterSupervisorDialog from './components/AddCenterSupervisorDialog'; // Import the new dialog
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
// TODO: Import Input, Textarea, Select from ShadCN if you replace basic HTML form elements

// Based on typical Django REST framework behavior, FKs (association, supervisor) expect IDs.
interface NewCenterData {
  name: string;
  description?: string;
  phone_number?: string;
  email?: string;
  address?: string;
  city?: string;
  // logo?: string; // This will now be handled by a separate File state
  affiliated_to?: 'entraide' | 'association' | 'other' | string;
  other_affiliation?: string;
  association?: number | null; // Expects Association ID
  supervisor?: number | null;  // Expects User (supervisor) ID
}

// Define interfaces for fetched data
interface Association {
  id: number;
  name: string;
  // Add other relevant fields if needed from API response
}

interface Supervisor {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  email?: string; // Assuming email might be useful for display
  // Add other relevant fields if needed from API response
}

// This is the User type from AuthContext, which the dialog will return
import type { User as AuthUser } from '@/contexts/AuthContext';

const API_BASE_URL = 'http://localhost:8000/api'; // Duplicated for now, consider a shared config

// Function to create a new center
async function createCenterAPI(centerData: NewCenterData | FormData, token: string | null): Promise<any> { 
  if (!token) {
    throw new Error('Authentication token not available for creating center.');
  }

  const isFormData = centerData instanceof FormData;
  const headers: HeadersInit = {
    'Authorization': `Bearer ${token}`,
  };
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const apiUrl = `${API_BASE_URL}/centers-app/centers/`; // Store URL in a variable
  console.log('Attempting to POST to URL:', apiUrl); // Log the URL

  const response = await fetch(apiUrl, { // Use the variable
    method: 'POST',
    headers: headers,
    body: isFormData ? centerData : JSON.stringify(centerData),
  });
  if (!response.ok) {
    // Log the response status and URL again on error for clarity
    console.error(`Error fetching ${response.url}, status: ${response.status}`); 
    const errorData = await response.json().catch(() => ({ detail: 'Failed to create center' }));
    throw new Error(errorData.detail || `Failed to create center. Status: ${response.status}`);
  }
  return response.json();
}

// Function to fetch associations
async function fetchAssociationsAPI(token: string | null): Promise<Association[]> {
  if (!token) {
    throw new Error('Authentication token not available for fetching associations.');
  }
  const response = await fetch(`${API_BASE_URL}/associations/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch associations' }));
    throw new Error(errorData.detail || `Failed to fetch associations. Status: ${response.status}`);
  }
  // Assuming the API returns a list directly, or adjust if it's under a "results" key for pagination
  const data = await response.json();
  return Array.isArray(data) ? data : (data.results || []);
}

// Function to fetch supervisors (users with 'center_supervisor' role)
async function fetchSupervisorsAPI(token: string | null): Promise<Supervisor[]> {
  if (!token) {
    throw new Error('Authentication token not available for fetching supervisors.');
  }
  // Fetch all users, then filter client-side, as API might not support ?role=center_supervisor filter directly
  const response = await fetch(`${API_BASE_URL}/accounts/users/`, { // Removed ?role=center_supervisor from here
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch supervisors' }));
    throw new Error(errorData.detail || `Failed to fetch supervisors. Status: ${response.status}`);
  }
  const data = await response.json();
  // Assuming the full user list might be paginated under 'results'
  const allUsers: any[] = Array.isArray(data) ? data : (data.results || []); 
  
  // Client-side filtering
  // Ensure the Supervisor interface or a more general User interface includes the 'role' property.
  const supervisors = allUsers.filter((user: { role?: string; [key: string]: any }): user is Supervisor => user.role === 'center_supervisor');
  
  return supervisors;
}

// Add other relevant fields if needed from API response

// Define the city keys (copied from AdminAddAssociationPage for now)
const cityKeys = [
  "ksarElKebir", "larache", "boujdian", "ksarBjir", "laouamra", 
  "soukLQolla", "tatoft", "zouada", "ayacha", "bniArouss", 
  "bniGarfett", "zaaroura", "ouladOuchih", "rissanaChamalia", 
  "rissanaJanoubia", "sahel", "souaken", "soukTolba"
];

const AdminAddCenterPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const initialNewCenterData: NewCenterData = {
    name: '',
    description: '',
    phone_number: '',
    email: '',
    address: '',
    city: '',
    affiliated_to: 'entraide', // Default value
    other_affiliation: '',
    association: null,
    supervisor: null,
  };
  const [newCenterData, setNewCenterData] = useState<NewCenterData>(initialNewCenterData);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [associations, setAssociations] = useState<Association[]>([]);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [dataLoadingError, setDataLoadingError] = useState<string | null>(null);
  const [isAddCenterSupervisorDialogOpen, setIsAddCenterSupervisorDialogOpen] = useState(false); // Dialog state
  const [supervisorAddedMessage, setSupervisorAddedMessage] = useState<string | null>(null);
  const [selectedCityName, setSelectedCityName] = useState<string>(""); // For displaying selected city
  const [logoFile, setLogoFile] = useState<File | null>(null); // State for logo file

  useEffect(() => {
    // Initialize selectedCityName with translated placeholder
    setSelectedCityName(t('adminCentersPage.addDialog.selectCityPlaceholder', 'Select City'));
  }, [t]);

  useEffect(() => {
    const loadDropdownData = async () => {
      setDataLoadingError(null);
      try {
        if (accessToken) {
          const [fetchedAssociations, fetchedSupervisors] = await Promise.all([
            fetchAssociationsAPI(accessToken),
            fetchSupervisorsAPI(accessToken)
          ]);
          setAssociations(fetchedAssociations);
          setSupervisors(fetchedSupervisors);
        }
      } catch (err: any) {
        console.error('Failed to load associations or supervisors:', err);
        setDataLoadingError(err.message || 'Failed to load data for dropdowns.');
        // TODO: Show error notification to user (e.g., using a toast library)
      }
    };

    loadDropdownData();
  }, [accessToken]);

  useEffect(() => {
    // Update city name if language changes or if newCenterData.city is reset
    if (newCenterData.city && cityKeys.includes(newCenterData.city)) {
        setSelectedCityName(t(`adminCentersPage.adminAddAssociationPage.cities.${newCenterData.city}`));
    } else {
        setSelectedCityName(t('adminCentersPage.addDialog.selectCityPlaceholder', 'Select City'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, newCenterData.city]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let processedValue: string | number | null = value;

    if (type === 'number') {
      processedValue = value === '' ? null : Number(value);
    }

    setNewCenterData(prev => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleCitySelect = (cityKey: string) => {
    setNewCenterData(prev => ({ ...prev, city: cityKey }));
    // setSelectedCityName is handled by the useEffect watching newCenterData.city and t
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    } else {
      setLogoFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!newCenterData.name) {
      setSubmitError(t('adminCentersPage.addDialog.errorNameRequired'));
      return;
    }
    try {
      setLoading(true);

      let submissionData: NewCenterData | FormData = newCenterData;

      if (logoFile) {
        const formData = new FormData();
        // Append all string/number fields from newCenterData
        Object.entries(newCenterData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formData.append(key, String(value)); // Ensure value is string for FormData
          }
        });
        formData.append('logo', logoFile);
        submissionData = formData;
      } else {
        // If no logo, ensure newCenterData doesn't accidentally have a `logo` property from previous state if it was a string
        const { ...dataWithoutLogoProperty } = newCenterData as any; // Type assertion to allow delete
        delete dataWithoutLogoProperty.logo; 
        submissionData = dataWithoutLogoProperty as NewCenterData;
      }

      await createCenterAPI(submissionData, accessToken);
      alert(t('adminCentersPage.addDialog.successMessage')); 
      navigate('/admin/centers'); 
    } catch (err: any) {
      console.error('Failed to create center:', err);
      setSubmitError(err.message || t('adminCentersPage.addDialog.errorCreateCenter'));
    } finally {
      setLoading(false);
    }
  };

  const handleCenterSupervisorCreated = (newSupervisor: AuthUser) => {
    // Map AuthUser to the local Supervisor interface
    const newSupervisorEntry: Supervisor = {
      id: newSupervisor.id,
      username: newSupervisor.username || `${newSupervisor.first_name}${newSupervisor.last_name}`.toLowerCase(), // Fallback for username
      first_name: newSupervisor.first_name,
      last_name: newSupervisor.last_name,
      email: newSupervisor.email,
      // Add arabic names here if/when Supervisor interface supports them
    };

    setSupervisors(prev => {
        const newList = prev.filter(s => s.id !== newSupervisorEntry.id);
        newList.push(newSupervisorEntry);
        // Sort alphabetically by first name, then last name, then username
        return newList.sort((a, b) => {
            const nameA = `${a.first_name || ''} ${a.last_name || ''}`.trim() || a.username;
            const nameB = `${b.first_name || ''} ${b.last_name || ''}`.trim() || b.username;
            return nameA.localeCompare(nameB);
        });
    });
    setNewCenterData(prev => ({ ...prev, supervisor: newSupervisorEntry.id }));
    setIsAddCenterSupervisorDialogOpen(false); // Close dialog
    setSupervisorAddedMessage(t('adminCentersPage.addDialog.messages.centerSupervisorAddedSuccessfully', 'New center supervisor added and selected.'));
    setTimeout(() => setSupervisorAddedMessage(null), 3000); // Clear message after 3s
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('adminCentersPage.addDialog.title')}</h1>
        <Button variant="outline" onClick={() => navigate('/admin/centers')}>
          {t('common.backToList')}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg shadow">
        {/* Name Field (Required) */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium">{t('adminCentersPage.addDialog.labelName')} <span className="text-red-500">*</span></label>
          <input type="text" name="name" id="name" value={newCenterData.name} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium">{t('adminCentersPage.addDialog.labelDescription')}</label>
          <textarea name="description" id="description" value={newCenterData.description || ''} onChange={handleInputChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"></textarea>
        </div>

        {/* Phone Number Field */}
        <div>
          <label htmlFor="phone_number" className="block text-sm font-medium">{t('adminCentersPage.addDialog.labelPhone')}</label>
          <input type="text" name="phone_number" id="phone_number" value={newCenterData.phone_number || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium">{t('adminCentersPage.addDialog.labelEmail')}</label>
          <input type="email" name="email" id="email" value={newCenterData.email || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
        </div>

        {/* Address Field */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium">{t('adminCentersPage.addDialog.labelAddress')}</label>
          <input type="text" name="address" id="address" value={newCenterData.address || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
        </div>

        {/* City Field */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium">{t('adminCentersPage.addDialog.labelCity')}</label>
          {/* <input type="text" name="city" id="city" value={newCenterData.city || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" /> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between mt-1">
                {selectedCityName}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
              <DropdownMenuLabel>{t('adminCentersPage.addDialog.selectCityPlaceholder', 'Select City')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={newCenterData.city} onValueChange={handleCitySelect}>
                {cityKeys.map((cityKey) => (
                  <DropdownMenuRadioItem key={cityKey} value={cityKey}>
                    {t(`adminCentersPage.adminAddAssociationPage.cities.${cityKey}`)} 
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Affiliated To Select Field */}
        <div>
          <label htmlFor="affiliated_to" className="block text-sm font-medium">{t('adminCentersPage.addDialog.labelAffiliatedTo')}</label>
          <select name="affiliated_to" id="affiliated_to" value={newCenterData.affiliated_to || 'entraide'} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
            <option value="entraide">{t('adminCentersPage.affiliationEntraide')}</option>
            <option value="association">{t('adminCentersPage.affiliationAssociation')}</option>
            <option value="other">{t('adminCentersPage.addDialog.affiliationOther')}</option>
          </select>
        </div>

        {/* Other Affiliation Field (Conditional) */}
        {newCenterData.affiliated_to === 'other' && (
          <div>
            <label htmlFor="other_affiliation" className="block text-sm font-medium">{t('adminCentersPage.addDialog.labelOtherAffiliation')}</label>
            <input type="text" name="other_affiliation" id="other_affiliation" value={newCenterData.other_affiliation || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
          </div>
        )}

        {/* Association Select Field */}
        <div>
          <label htmlFor="association" className="block text-sm font-medium">{t('adminCentersPage.addDialog.labelAssociation')} ({t('common.optional')})</label>
          <select
            name="association"
            id="association"
            value={newCenterData.association === null ? '' : newCenterData.association}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          >
            <option value="">{t('adminCentersPage.addDialog.selectAssociation')}</option>
            {associations.map(assoc => (
              <option key={assoc.id} value={assoc.id}>
                {assoc.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Supervisor Select Field */}
         <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="supervisor" className="block text-sm font-medium">
                {t('adminCentersPage.addDialog.labelSupervisor')} ({t('common.optional')})
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAddCenterSupervisorDialogOpen(true)}
                className="p-1 h-auto text-sm"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                {t('adminCentersPage.addDialog.buttons.addSupervisorShort', 'Add New')}
              </Button>
            </div>
          <select
            name="supervisor"
            id="supervisor"
            value={newCenterData.supervisor === null ? '' : newCenterData.supervisor}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          >
            <option value="">{t('adminCentersPage.addDialog.selectSupervisor')}</option>
            {supervisors.map(sup => (
              <option key={sup.id} value={sup.id}>
                {sup.first_name && sup.last_name ? `${sup.first_name} ${sup.last_name}` : sup.username} ({sup.email})
              </option>
            ))}
          </select>
        </div>
        
        {/* Logo Upload Field */}
        <div>
          <label htmlFor="logo" className="block text-sm font-medium">{t('adminCentersPage.addDialog.labelLogo', 'Center Logo')} ({t('common.optional')})</label>
          <input 
            type="file" 
            name="logo" 
            id="logo" 
            onChange={handleLogoChange} 
            accept="image/*" 
            className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" 
          />
        </div>

        {dataLoadingError && <p className="text-sm text-red-600 mt-2 text-center">{dataLoadingError}</p>}
        {submitError && <p className="text-sm text-red-600 mt-2 text-center">{submitError}</p>}
        {supervisorAddedMessage && <p className="text-sm text-green-600 mt-2 text-center">{supervisorAddedMessage}</p>}
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/centers')} disabled={loading}>
            {t('common.cancelButton')}
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? t('common.loading') : t('adminCentersPage.addDialog.submitButton')}
          </Button>
        </div>
      </form>

      <AddCenterSupervisorDialog
        isOpen={isAddCenterSupervisorDialogOpen}
        onOpenChange={setIsAddCenterSupervisorDialogOpen}
        onSupervisorCreated={handleCenterSupervisorCreated}
      />
    </div>
  );
};

export default AdminAddCenterPage; 