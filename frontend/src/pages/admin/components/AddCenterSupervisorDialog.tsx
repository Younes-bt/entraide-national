import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import type { User } from '@/contexts/AuthContext'; // Using the main User type
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

interface AddCenterSupervisorDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSupervisorCreated: (newSupervisor: User) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const initialFormData = {
  first_name: '',
  last_name: '',
  Arabic_first_name: '', // Assuming these fields exist on User or will be added
  arabic_last_name: '',  // Assuming these fields exist on User or will be added
  phone_number: '',
  CIN_id: '',
  birth_date: '',
  birth_city: '',
  address: '',
  city: '',
};

const AddCenterSupervisorDialog: React.FC<AddCenterSupervisorDialogProps> = ({ isOpen, onOpenChange, onSupervisorCreated }) => {
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

  useEffect(() => {
    if (!isOpen) {
      setTimeout(resetForm, 300);
    } else {
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
      setError(t('supervisors.addError.authRequired', "Authentication required."));
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
    submissionFormData.append('role', 'center_supervisor'); // Key change here

    const firstNameNoSpaces = formData.first_name.replace(/\s+/g, '').toLowerCase();
    const lastNameNoSpaces = formData.last_name.replace(/\s+/g, '').toLowerCase();
    const email = `${lastNameNoSpaces}.${firstNameNoSpaces}@entraide-larache-center.com`; // Different email domain for center sup.
    const password = 'entraide2025larache'; // Consider a different default password or make it configurable

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
          throw new Error(errorMessages || t('supervisors.addError.genericCenterDialog', 'Failed to add center supervisor.'));
        }
        throw new Error(t('supervisors.addError.genericCenterDialog', 'Failed to add center supervisor.'));
      }
      
      setSuccessMessage(t('supervisors.addSuccess.messageCenterDialog', 'Center supervisor added successfully!'));
      onSupervisorCreated(responseData as User); 

    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDialogClose = (open: boolean) => {
    if (!open) {
        resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('supervisors.addNewCenterSupervisorDialogTitle', 'Add New Center Supervisor')}</DialogTitle>
          <DialogDescription>
            {t('supervisors.addNewCenterSupervisorDialogDescription', 'Fill in the details to create a new center supervisor. Email and password will be auto-generated.')}
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive" className="my-4">
            <AlertTitle>{t('supervisors.addError.titleCenterDialog', 'Error')}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {successMessage && !error && (
            <Alert variant="default" className="my-4 bg-green-100 border-green-400 text-green-700">
              <AlertTitle>{t('supervisors.addSuccess.titleCenterDialog', 'Success')}</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
        )}

        <form onSubmit={handleSubmit} id="add-center-supervisor-dialog-form" className="space-y-4 py-4">
          <div>
            <Label htmlFor="dialog_cs_first_name">{t('fields.firstNameFrench')} <span className="text-red-500">*</span></Label>
            <Input id="dialog_cs_first_name" name="first_name" type="text" value={formData.first_name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="dialog_cs_last_name">{t('fields.lastNameFrench')} <span className="text-red-500">*</span></Label>
            <Input id="dialog_cs_last_name" name="last_name" type="text" value={formData.last_name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="dialog_cs_Arabic_first_name">{t('fields.firstNameArabic')} <span className="text-red-500">*</span></Label>
            <Input id="dialog_cs_Arabic_first_name" name="Arabic_first_name" type="text" value={formData.Arabic_first_name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="dialog_cs_arabic_last_name">{t('fields.lastNameArabic')} <span className="text-red-500">*</span></Label>
            <Input id="dialog_cs_arabic_last_name" name="arabic_last_name" type="text" value={formData.arabic_last_name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="dialog_cs_phone_number">{t('fields.phoneNumberOptional')}</Label>
            <Input id="dialog_cs_phone_number" name="phone_number" type="tel" value={formData.phone_number} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="dialog_cs_CIN_id">{t('fields.cinOptional')}</Label>
            <Input id="dialog_cs_CIN_id" name="CIN_id" type="text" value={formData.CIN_id} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="dialog_cs_birth_date">{t('fields.birthDateOptional')}</Label>
            <Input id="dialog_cs_birth_date" name="birth_date" type="date" value={formData.birth_date} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="dialog_cs_birth_city">{t('fields.birthCityOptional')}</Label>
            <Input id="dialog_cs_birth_city" name="birth_city" type="text" value={formData.birth_city} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="dialog_cs_address">{t('fields.addressOptional')}</Label>
            <Input id="dialog_cs_address" name="address" type="text" value={formData.address} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="dialog_cs_city">{t('fields.cityOptional')}</Label>
            <Input id="dialog_cs_city" name="city" type="text" value={formData.city} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="dialog_cs_profile_picture">{t('fields.profilePictureOptional')}</Label>
            <Input id="dialog_cs_profile_picture" name="profile_picture" type="file" onChange={handleChange} accept="image/*" />
          </div>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
            {t('actions.cancel')}
          </Button>
          <Button type="submit" form="add-center-supervisor-dialog-form" disabled={isLoading || (!!successMessage && !error)}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (!!successMessage && !error) ? t('actions.added') : t('supervisors.addNewCenterSupervisor', 'Add Center Supervisor')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCenterSupervisorDialog; 