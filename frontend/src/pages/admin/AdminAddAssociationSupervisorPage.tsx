import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const AdminAddAssociationSupervisorPage: React.FC = () => {
  const { t } = useTranslation();
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
  });
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
      setError("Authentication required.");
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

    // Auto-generate email and set default password
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
            .map(([key, value]) => `${key}: ${(Array.isArray(value) ? value.join(', ') : value)}`)
            .join('; ');
          throw new Error(errorMessages || t('supervisors.addError.generic'));
        }
        throw new Error(t('supervisors.addError.generic') || 'Failed to add supervisor');
      }
      
      setSuccessMessage(t('supervisors.addSuccess') || 'Supervisor added successfully!');
      setFormData({ 
        first_name: '', last_name: '', Arabic_first_name: '', arabic_last_name: '',
        phone_number: '', CIN_id: '', birth_date: '', birth_city: '', 
        address: '', city: '',
      });
      setProfilePictureFile(null);
      setTimeout(() => navigate('/admin/supervisors'), 2000); 

    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{t('supervisors.addNewTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>{t('supervisors.addError.title')}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {successMessage && (
            <Alert variant="default" className="mb-4 bg-green-100 border-green-400 text-green-700">
              <AlertTitle>{t('supervisors.addSuccess.title')}</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="first_name">{t('fields.firstNameFrench', 'First Name (French)')}</Label>
              <Input
                id="first_name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="last_name">{t('fields.lastNameFrench', 'Last Name (French)')}</Label>
              <Input
                id="last_name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="Arabic_first_name">{t('fields.firstNameArabic', 'First Name (Arabic)')}</Label>
              <Input
                id="Arabic_first_name"
                name="Arabic_first_name"
                type="text"
                value={formData.Arabic_first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="arabic_last_name">{t('fields.lastNameArabic', 'Last Name (Arabic)')}</Label>
              <Input
                id="arabic_last_name"
                name="arabic_last_name"
                type="text"
                value={formData.arabic_last_name}
                onChange={handleChange}
                required
              />
            </div>
            {/* Optional Fields */}
            <div>
              <Label htmlFor="phone_number">{t('fields.phoneNumberOptional')}</Label>
              <Input
                id="phone_number"
                name="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="CIN_id">{t('fields.cinOptional')}</Label>
              <Input
                id="CIN_id"
                name="CIN_id"
                type="text"
                value={formData.CIN_id}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="birth_date">{t('fields.birthDateOptional')}</Label>
              <Input
                id="birth_date"
                name="birth_date"
                type="date"
                value={formData.birth_date}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="birth_city">{t('fields.birthCityOptional')}</Label>
              <Input
                id="birth_city"
                name="birth_city"
                type="text"
                value={formData.birth_city}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="address">{t('fields.addressOptional')}</Label>
              <Input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="city">{t('fields.cityOptional')}</Label>
              <Input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="profile_picture">{t('fields.profilePictureOptional', 'Profile Picture (Optional)')}</Label>
              <Input
                id="profile_picture"
                name="profile_picture"
                type="file"
                onChange={handleChange}
                accept="image/*"
              />
            </div>
            <CardFooter className="flex justify-end p-0 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/supervisors')} className="mr-2">
                {t('actions.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('actions.addSupervisor')}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAddAssociationSupervisorPage;