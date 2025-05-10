import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import type { User } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface AddSupervisorDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSupervisorCreated: (newSupervisor: User) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const initialFormData = {
  first_name: '',
  last_name: '',
  Arabic_first_name: '',
  arabic_last_name: '',
  phone_number: '',
  CIN_id: '',
  birth_date: '',
  birth_city: '',
  address: '',
  city: '',
};

const AddSupervisorDialog: React.FC<AddSupervisorDialogProps> = ({ isOpen, onOpenChange, onSupervisorCreated }) => {
  const { t } = useTranslation();
  const { accessToken } = useAuth();

  const [formData, setFormData] = useState(initialFormData);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetForm = () => {
    setFormData(initialFormData);
    setProfilePictureFile(null);
    setError(null);
    setSuccessMessage(null);
  };

  // Reset form when dialog is closed or opened
  useEffect(() => {
    if (!isOpen) {
      // Allow a brief moment for the closing animation before resetting,
      // or reset immediately if preferred.
      setTimeout(resetForm, 300); 
    } else {
      // Reset form if it's being opened, in case it wasn't reset properly before
      resetForm();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "profile_picture") {
      if (e.target.files && e.target.files[0]) {
        setProfilePictureFile(e.target.files[0]);
      } else {
        setProfilePictureFile(null);
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!accessToken) {
      setError(t('supervisors.addError.authRequired', "Authentication required.")); // New translation
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const submissionFormData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        submissionFormData.append(key, value);
      }
    });
    if (profilePictureFile) {
      submissionFormData.append('profile_picture', profilePictureFile);
    }
    submissionFormData.append('role', 'association_supervisor');

    const firstNameNoSpaces = formData.first_name.replace(/\s+/g, '').toLowerCase();
    const lastNameNoSpaces = formData.last_name.replace(/\s+/g, '').toLowerCase();
    const email = `${lastNameNoSpaces}.${firstNameNoSpaces}@entraide-larache.com`;
    const password = 'entraide2025larache';

    submissionFormData.append('email', email);
    submissionFormData.append('password', password);

    try {
      const response = await fetch(`${API_BASE_URL}/accounts/users/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: submissionFormData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (responseData && typeof responseData === 'object') {
          const errorMessages = Object.entries(responseData)
            .map(([key, value]) => `${key}: ${(Array.isArray(value) ? value.join(', ') : String(value))}`)
            .join('; ');
          throw new Error(errorMessages || t('supervisors.addError.genericDialog', 'Failed to add supervisor in dialog.'));
        }
        throw new Error(t('supervisors.addError.genericDialog', 'Failed to add supervisor in dialog.'));
      }
      
      setSuccessMessage(t('supervisors.addSuccessDialog', 'Supervisor added successfully!'));
      onSupervisorCreated(responseData as User); // Pass the new user data back
      // Dialog will be closed by parent via onOpenChange or by user action

    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDialogClose = (open: boolean) => {
    if (!open) { // If dialog is being closed
        resetForm(); // Reset the form fields
    }
    onOpenChange(open); // Propagate the change
  };


  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('supervisors.addNewDialogTitle', 'Add New Association Supervisor')}</DialogTitle>
          <DialogDescription>
            {t('supervisors.addNewDialogDescription', 'Fill in the details to create a new supervisor. Email and password will be auto-generated.')}
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive" className="my-4">
            <AlertTitle>{t('supervisors.addError.titleDialog', 'Error')}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {successMessage && !error && ( // Only show success if no error
            <Alert variant="default" className="my-4 bg-green-100 border-green-400 text-green-700">
              <AlertTitle>{t('supervisors.addSuccess.titleDialog', 'Success')}</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
        )}

        <form onSubmit={handleSubmit} id="add-supervisor-dialog-form" className="space-y-4 py-4">
          <div>
            <Label htmlFor="dialog_first_name">{t('fields.firstNameFrench', 'First Name (French)')} <span className="text-red-500">*</span></Label>
            <Input id="dialog_first_name" name="first_name" type="text" value={formData.first_name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="dialog_last_name">{t('fields.lastNameFrench', 'Last Name (French)')} <span className="text-red-500">*</span></Label>
            <Input id="dialog_last_name" name="last_name" type="text" value={formData.last_name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="dialog_Arabic_first_name">{t('fields.firstNameArabic', 'First Name (Arabic)')} <span className="text-red-500">*</span></Label>
            <Input id="dialog_Arabic_first_name" name="Arabic_first_name" type="text" value={formData.Arabic_first_name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="dialog_arabic_last_name">{t('fields.lastNameArabic', 'Last Name (Arabic)')} <span className="text-red-500">*</span></Label>
            <Input id="dialog_arabic_last_name" name="arabic_last_name" type="text" value={formData.arabic_last_name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="dialog_phone_number">{t('fields.phoneNumberOptional', 'Phone Number (Optional)')}</Label>
            <Input id="dialog_phone_number" name="phone_number" type="tel" value={formData.phone_number} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="dialog_CIN_id">{t('fields.cinOptional', 'CIN (Optional)')}</Label>
            <Input id="dialog_CIN_id" name="CIN_id" type="text" value={formData.CIN_id} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="dialog_birth_date">{t('fields.birthDateOptional', 'Birth Date (Optional)')}</Label>
            <Input id="dialog_birth_date" name="birth_date" type="date" value={formData.birth_date} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="dialog_birth_city">{t('fields.birthCityOptional', 'Birth City (Optional)')}</Label>
            <Input id="dialog_birth_city" name="birth_city" type="text" value={formData.birth_city} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="dialog_address">{t('fields.addressOptional', 'Address (Optional)')}</Label>
            <Input id="dialog_address" name="address" type="text" value={formData.address} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="dialog_city">{t('fields.cityOptional', 'City (Optional)')}</Label>
            <Input id="dialog_city" name="city" type="text" value={formData.city} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="dialog_profile_picture">{t('fields.profilePictureOptional', 'Profile Picture (Optional)')}</Label>
            <Input id="dialog_profile_picture" name="profile_picture" type="file" onChange={handleChange} accept="image/*" />
          </div>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
            {t('actions.cancel', 'Cancel')}
          </Button>
          <Button type="submit" form="add-supervisor-dialog-form" disabled={isLoading || (!!successMessage && !error)}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (!!successMessage && !error) ? t('actions.added', 'Added') : t('actions.addSupervisor', 'Add Supervisor')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSupervisorDialog; 