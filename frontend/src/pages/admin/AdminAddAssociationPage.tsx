import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation
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
import { ChevronDown, PlusCircle } from 'lucide-react'; // Added PlusCircle
import { useAuth } from '@/contexts/AuthContext';
import type { User } from '@/contexts/AuthContext'; // Corrected import for User type
import AddSupervisorDialog from './components/AddSupervisorDialog'; // Import the new dialog

// Define the city keys
const cityKeys = [
  "ksarElKebir", "larache", "boujdian", "ksarBjir", "laouamra", 
  "soukLQolla", "tatoft", "zouada", "ayacha", "bniArouss", 
  "bniGarfett", "zaaroura", "ouladOuchih", "rissanaChamalia", 
  "rissanaJanoubia", "sahel", "souaken", "soukTolba"
];

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
  const { t } = useTranslation(); // Initialize useTranslation
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
  const [selectedSupervisorName, setSelectedSupervisorName] = useState<string>(t('adminCentersPage.adminAddAssociationPage.supervisorDropdown.select'));
  const [selectedCityName, setSelectedCityName] = useState<string>(t('adminCentersPage.adminAddAssociationPage.selectCity')); // For displaying selected city
  const [isFetchingSupervisors, setIsFetchingSupervisors] = useState<boolean>(false);
  const [isAddSupervisorDialogOpen, setIsAddSupervisorDialogOpen] = useState(false); // State for dialog

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
        setError(t('adminCentersPage.adminAddAssociationPage.messages.loadingSupervisorsError'));
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
            setSelectedSupervisorName(t('adminCentersPage.adminAddAssociationPage.supervisorDropdown.noneAvailable'));
        } else {
            // Ensure "Select Supervisor" is shown if no supervisor is initially selected or form is reset
            if (!formData.supervisor) {
                 setSelectedSupervisorName(t('adminCentersPage.adminAddAssociationPage.supervisorDropdown.select'));
            }
        }
      }).catch(() => {
        setError(t('adminCentersPage.adminAddAssociationPage.messages.loadingSupervisorsError'));
      });
    }
  // formData.supervisor is removed from dependencies to prevent re-triggering when form is reset and supervisor becomes ''
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [accessToken, t]); // Added t to dependencies


  useEffect(() => {
    // Update supervisor name if language changes
    if (formData.supervisor) {
        const selected = supervisorsList.find(s => s.id === formData.supervisor);
        if (selected) {
            setSelectedSupervisorName(t('adminCentersPage.adminAddAssociationPage.messages.supervisorNameDisplayWithArabic', { 
                firstName: selected.first_name, 
                lastName: selected.last_name, 
                arabicFirstName: selected.arabic_first_name,
                arabicLastName: selected.arabic_last_name
            }));
        }
    } else {
        // if form data for supervisor is empty (e.g. after reset), set to placeholder
        setSelectedSupervisorName(t('adminCentersPage.adminAddAssociationPage.supervisorDropdown.select'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, formData.supervisor, supervisorsList]); // formData.supervisor ensures this runs if supervisor selection changes

  useEffect(() => {
    // Update city name if language changes or if formData.city is reset
    if (formData.city && cityKeys.includes(formData.city)) {
        setSelectedCityName(t(`adminCentersPage.adminAddAssociationPage.cities.${formData.city}`));
    } else {
        setSelectedCityName(t('adminCentersPage.adminAddAssociationPage.selectCity'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, formData.city]);

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
  
  const handleCitySelect = (cityKey: string) => {
    setFormData(prev => ({ ...prev, city: cityKey }));
    setSelectedCityName(t(`adminCentersPage.adminAddAssociationPage.cities.${cityKey}`));
  };

  const handleSupervisorSelect = (value: string) => {
    const supervisorId = parseInt(value, 10);
    const selected = supervisorsList.find(s => s.id === supervisorId);
    if (selected) {
        setFormData(prev => ({ ...prev, supervisor: supervisorId }));
        setSelectedSupervisorName(t('adminCentersPage.adminAddAssociationPage.messages.supervisorNameDisplayWithArabic', { 
            firstName: selected.first_name, 
            lastName: selected.last_name, 
            arabicFirstName: selected.arabic_first_name,
            arabicLastName: selected.arabic_last_name
        }));
    } else {
        setFormData(prev => ({ ...prev, supervisor: '' }));
        // If value is empty or not found, reset to placeholder
        setSelectedSupervisorName(t('adminCentersPage.adminAddAssociationPage.supervisorDropdown.select'));
    }
  };

  const handleSupervisorCreated = (newSupervisor: User) => {
    setSupervisorsList(prev => {
      // Avoid duplicates and sort
      const newList = prev.filter(s => s.id !== newSupervisor.id);
      newList.push(newSupervisor);
      return newList.sort((a, b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`));
    });
    setFormData(prev => ({ ...prev, supervisor: newSupervisor.id }));
    setSelectedSupervisorName(t('adminCentersPage.adminAddAssociationPage.messages.supervisorNameDisplayWithArabic', { 
        firstName: newSupervisor.first_name, 
        lastName: newSupervisor.last_name, 
        arabicFirstName: newSupervisor.arabic_first_name,
        arabicLastName: newSupervisor.arabic_last_name
    }));
    setIsAddSupervisorDialogOpen(false); // Close dialog
    setSuccessMessage(t('adminCentersPage.adminAddAssociationPage.messages.supervisorAddedSuccessfully', 'New supervisor added and selected.'));
    // Clear supervisor-specific success message after a few seconds
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!accessToken) {
      setError(t('adminCentersPage.adminAddAssociationPage.messages.authTokenNotFound'));
      setIsLoading(false);
      return;
    }
    if (formData.supervisor === '') {
        setError(t('adminCentersPage.adminAddAssociationPage.messages.supervisorNotSelected'));
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
        const errorData = await response.json().catch(() => ({ detail: t('adminCentersPage.adminAddAssociationPage.messages.creationErrorDefault') }));
        throw new Error(errorData.detail || 'HTTP error! status: ' + response.status);
      }

      // const result = await response.json(); // Not strictly needed if not using the result immediately
      await response.json();
      setSuccessMessage(t('adminCentersPage.adminAddAssociationPage.messages.creationSuccess'));
      setFormData({ /* Reset form */
        name: '', description: '', supervisor: '', phone_number: '', email: '', address: '', city: '',
        maps_link: '', website: '', facebook_link: '', instagram_link: '', twitter_link: '',
        contract_start_date: '', contract_end_date: '', registration_number: '', logo: null,
      });
      // setSelectedSupervisorName(t('adminCentersPage.adminAddAssociationPage.supervisorDropdown.select')); // Already handled by useEffect for formData.supervisor
      // setSelectedCityName(t('adminCentersPage.adminAddAssociationPage.selectCity')); // Already handled by useEffect for formData.city
      setTimeout(() => {
        navigate('/admin/associations');
      }, 2000);

    } catch (err) {
      if (err instanceof Error && (err.message.includes('Failed to create association') || err.message.includes('HTTP error'))) {
        setError(err.message); // Keep specific backend/HTTP errors
      } else if (err instanceof Error) {
        const errorMessage = t('adminCentersPage.adminAddAssociationPage.messages.unknownError') + (err.message ? ': ' + err.message : '');
        setError(errorMessage);
      } else {
        setError(t('adminCentersPage.adminAddAssociationPage.messages.unknownError'));
      }
      console.error("Failed to create association:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">{t('adminCentersPage.adminAddAssociationPage.title')}</h1>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">{error}</div>}
      {successMessage && <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded-md">{successMessage}</div>}

      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg shadow">
        <div>
          <Label htmlFor="name">{t('adminCentersPage.adminAddAssociationPage.labels.name')} <span className="text-red-500">{t('adminCentersPage.adminAddAssociationPage.requiredField')}</span></Label>
          <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="description">{t('adminCentersPage.adminAddAssociationPage.labels.description')} <span className="text-red-500">{t('adminCentersPage.adminAddAssociationPage.requiredField')}</span></Label>
          <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required className="mt-1" rows={4} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="email">{t('adminCentersPage.adminAddAssociationPage.labels.email')}</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="phone_number">{t('adminCentersPage.adminAddAssociationPage.labels.phoneNumber')}</Label>
            <Input id="phone_number" name="phone_number" type="tel" value={formData.phone_number} onChange={handleChange} className="mt-1" />
          </div>
        </div>

        <div>
          <Label htmlFor="address">{t('adminCentersPage.adminAddAssociationPage.labels.address')}</Label>
          <Input id="address" name="address" type="text" value={formData.address} onChange={handleChange} className="mt-1" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="city">{t('adminCentersPage.adminAddAssociationPage.labelCity')}</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between mt-1">
                  {selectedCityName}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                <DropdownMenuLabel>{t('adminCentersPage.adminAddAssociationPage.selectCity')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={formData.city} onValueChange={handleCitySelect}>
                  {cityKeys.map((cityKey) => (
                    <DropdownMenuRadioItem key={cityKey} value={cityKey}>
                      {t(`adminCentersPage.adminAddAssociationPage.cities.${cityKey}`)}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div>
            <Label htmlFor="registration_number">{t('adminCentersPage.adminAddAssociationPage.labels.registrationNumber')}</Label>
            <Input id="registration_number" name="registration_number" type="text" value={formData.registration_number} onChange={handleChange} className="mt-1" />
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <Label htmlFor="supervisor">
              {t('adminCentersPage.adminAddAssociationPage.labels.supervisor')} <span className="text-red-500">{t('adminCentersPage.adminAddAssociationPage.requiredField')}</span>
            </Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAddSupervisorDialogOpen(true)}
              className="p-1 h-auto text-sm"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              {t('adminCentersPage.adminAddAssociationPage.buttons.addSupervisorShort', 'Add New')}
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between mt-1">
                {selectedSupervisorName}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
              <DropdownMenuLabel>{t('adminCentersPage.adminAddAssociationPage.supervisorDropdown.availableSupervisorsLabel')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isFetchingSupervisors ? (
                <DropdownMenuItem disabled>{t('adminCentersPage.adminAddAssociationPage.supervisorDropdown.loading')}</DropdownMenuItem>
              ) : supervisorsList.length > 0 ? (
                <DropdownMenuRadioGroup value={formData.supervisor?.toString()} onValueChange={handleSupervisorSelect}>
                  {supervisorsList.map((supervisor) => (
                    <DropdownMenuRadioItem key={supervisor.id} value={supervisor.id.toString()}>
                      {t('adminCentersPage.adminAddAssociationPage.messages.supervisorNameDisplayWithArabic', { 
                          firstName: supervisor.first_name, 
                          lastName: supervisor.last_name, 
                          arabicFirstName: supervisor.arabic_first_name,
                          arabicLastName: supervisor.arabic_last_name
                      })}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              ) : (
                <DropdownMenuItem disabled>{t('adminCentersPage.adminAddAssociationPage.supervisorDropdown.noAssociationSupervisors')}</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <Label htmlFor="logo">{t('adminCentersPage.adminAddAssociationPage.labels.logo')}</Label>
          <Input id="logo" name="logo" type="file" onChange={handleFileChange} className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" />
        </div>

        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 pt-4 border-t border-border">{t('adminCentersPage.adminAddAssociationPage.sections.contactSocialTitle')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="website">{t('adminCentersPage.adminAddAssociationPage.labels.website')}</Label>
            <Input id="website" name="website" type="url" value={formData.website} onChange={handleChange} className="mt-1" placeholder={t('adminCentersPage.adminAddAssociationPage.placeholders.websiteExample')} />
          </div>
          <div>
            <Label htmlFor="maps_link">{t('adminCentersPage.adminAddAssociationPage.labels.mapsLink')}</Label>
            <Input id="maps_link" name="maps_link" type="url" value={formData.maps_link} onChange={handleChange} className="mt-1" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="facebook_link">{t('adminCentersPage.adminAddAssociationPage.labels.facebookLink')}</Label>
            <Input id="facebook_link" name="facebook_link" type="url" value={formData.facebook_link} onChange={handleChange} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="instagram_link">{t('adminCentersPage.adminAddAssociationPage.labels.instagramLink')}</Label>
            <Input id="instagram_link" name="instagram_link" type="url" value={formData.instagram_link} onChange={handleChange} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="twitter_link">{t('adminCentersPage.adminAddAssociationPage.labels.twitterLink')}</Label>
            <Input id="twitter_link" name="twitter_link" type="url" value={formData.twitter_link} onChange={handleChange} className="mt-1" />
          </div>
        </div>

        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 pt-4 border-t border-border">{t('adminCentersPage.adminAddAssociationPage.sections.contractInfoTitle')}</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="contract_start_date">{t('adminCentersPage.adminAddAssociationPage.labels.contractStartDate')}</Label>
            <Input id="contract_start_date" name="contract_start_date" type="date" value={formData.contract_start_date} onChange={handleChange} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="contract_end_date">{t('adminCentersPage.adminAddAssociationPage.labels.contractEndDate')}</Label>
            <Input id="contract_end_date" name="contract_end_date" type="date" value={formData.contract_end_date} onChange={handleChange} className="mt-1" />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/associations')} disabled={isLoading}>
            {t('adminCentersPage.adminAddAssociationPage.buttons.cancel')}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? t('adminCentersPage.adminAddAssociationPage.buttons.creating') : t('adminCentersPage.adminAddAssociationPage.buttons.createAssociation')}
          </Button>
        </div>
      </form>

      <AddSupervisorDialog
        isOpen={isAddSupervisorDialogOpen}
        onOpenChange={setIsAddSupervisorDialogOpen}
        onSupervisorCreated={handleSupervisorCreated}
      />
    </div>
  );
};

export default AdminAddAssociationPage; 