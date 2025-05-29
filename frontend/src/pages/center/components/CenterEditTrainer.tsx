import React, { useState, useEffect, useCallback } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate, useParams } from 'react-router-dom';

// Define types based on API responses
interface TrainingProgram {
  id: string | number;
  name: string;
}

interface Center {
  id: string | number;
  name: string;
}

interface TrainerData {
  id: string | number;
  center: string | number;
  program: string | number;
  contarct_with: string;
  contract_start_date: string;
  contract_end_date: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    username?: string;
    Arabic_first_name?: string | null;
    arabic_last_name?: string | null;
    profile_picture?: string | null;
    birth_date?: string | null;
    birth_city?: string | null;
    CIN_id?: string | null;
    phone_number?: string | null;
    address?: string | null;
    city?: string | null;
    role_display?: string;
    is_active?: boolean;
  };
}

const CONTRACT_WITH_CHOICES = [
  { value: 'entraide', labelKey: 'centerAddNewTrainer.contractChoices.entraide' },
  { value: 'association', labelKey: 'centerAddNewTrainer.contractChoices.association' }
];

const CenterEditTrainer: React.FC = () => {
  const { t } = useTranslation();
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const { trainerId } = useParams<{ trainerId: string }>();

  const [currentCenter, setCurrentCenter] = useState<Center | null>(null);
  const [trainerData, setTrainerData] = useState<Partial<TrainerData>>({});

  // Form fields state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [arabicFirstName, setArabicFirstName] = useState('');
  const [arabicLastName, setArabicLastName] = useState('');
  const [cinId, setCinId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthCity, setBirthCity] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);

  // Trainer-specific fields
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [contractWith, setContractWith] = useState<string>('');
  const [contractStartDate, setContractStartDate] = useState('');
  const [contractEndDate, setContractEndDate] = useState('');

  // Dropdown data
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingTrainer, setIsFetchingTrainer] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('accessToken');

  // Fetch supervised center
  useEffect(() => {
    const fetchSupervisedCenter = async () => {
      if (!authUser?.id || !token) {
        setError(t('centerEditTrainer.errors.authError'));
        return;
      }
      try {
        const response = await fetch(`http://localhost:8000/api/centers-app/centers/?supervisor=${authUser.id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(t('centerEditTrainer.errors.fetchCenterError'));
        const data = await response.json();
        const centers = Array.isArray(data) ? data : data.results || [];
        if (centers.length > 0) {
          setCurrentCenter(centers[0]);
        } else {
          setError(t('centerEditTrainer.errors.noCenterAssigned'));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t('centerEditTrainer.errors.fetchCenterError'));
      }
    };
    fetchSupervisedCenter();
  }, [authUser, token, t]);

  // Fetch trainer details
  const fetchTrainerDetails = useCallback(async () => {
    if (!trainerId || !token) {
      setError(t('centerEditTrainer.errors.missingInfo'));
      setIsFetchingTrainer(false);
      return;
    }
    setIsFetchingTrainer(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/api/teachers/teachers/${trainerId}/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(t('centerEditTrainer.errors.fetchTrainerError'));
      }
      const data: TrainerData = await response.json();
      setTrainerData(data);
      
      // Pre-fill form states
      setFirstName(data.user?.first_name || '');
      setLastName(data.user?.last_name || '');
      setArabicFirstName(data.user?.Arabic_first_name || '');
      setArabicLastName(data.user?.arabic_last_name || '');
      setContractWith(data.contarct_with || '');
      setContractStartDate(data.contract_start_date || '');
      setContractEndDate(data.contract_end_date || '');

      // Pre-fill user profile fields
      setCinId(data.user?.CIN_id || '');
      setPhoneNumber(data.user?.phone_number || '');
      setBirthDate(data.user?.birth_date || '');
      setBirthCity(data.user?.birth_city || '');
      setAddress(data.user?.address || '');
      setCity(data.user?.city || '');
      setProfilePicturePreview(data.user?.profile_picture || null);

    } catch (err) {
      setError(err instanceof Error ? err.message : t('centerEditTrainer.errors.fetchTrainerError'));
    } finally {
      setIsFetchingTrainer(false);
    }
  }, [trainerId, token, t]);

  useEffect(() => {
    fetchTrainerDetails();
  }, [fetchTrainerDetails]);

  // Fetch Training Programs
  useEffect(() => {
    const fetchTrainingPrograms = async () => {
      if (!token) return;
      try {
        const response = await fetch('http://localhost:8000/api/programs/trainingprogrames/', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(t('centerEditTrainer.errors.fetchProgramsError'));
        const data = await response.json();
        setTrainingPrograms(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('centerEditTrainer.errors.fetchProgramsError'));
      }
    };
    fetchTrainingPrograms();
  }, [token, t]);

  // Set selected program after both trainer data and programs are loaded
  useEffect(() => {
    if (trainerData.program && trainingPrograms.length > 0) {
      // Convert program ID to string and set it
      const programId = trainerData.program.toString();
      console.log('Setting program ID:', programId, 'Available programs:', trainingPrograms.map(p => p.id.toString()));
      setSelectedProgram(programId);
    }
  }, [trainerData.program, trainingPrograms]);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!trainerId || !currentCenter) {
      setError(t('centerEditTrainer.errors.missingInfoSubmit'));
      return;
    }
    setIsLoading(true);
    setError(null);

    // Use FormData for file upload
    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('Arabic_first_name', arabicFirstName || '');
    formData.append('arabic_last_name', arabicLastName || '');
    formData.append('center', currentCenter.id.toString());
    formData.append('program', selectedProgram);
    formData.append('contarct_with', contractWith);
    formData.append('contract_start_date', contractStartDate);
    formData.append('contract_end_date', contractEndDate);
    formData.append('CIN_id', cinId || '');
    formData.append('phone_number', phoneNumber || '');
    formData.append('birth_date', birthDate || '');
    formData.append('birth_city', birthCity || '');
    formData.append('address', address || '');
    formData.append('city', city || '');

    if (profilePictureFile) {
      formData.append('profile_picture', profilePictureFile);
    }

    try {
      const response = await fetch(`http://localhost:8000/api/teachers/teachers/${trainerId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = t('centerEditTrainer.errors.submitError');
        if (Object.keys(errorData).length > 0) {
          Object.keys(errorData).forEach(key => {
            const message = Array.isArray(errorData[key]) ? errorData[key].join(', ') : errorData[key];
            errorMessage += ` ${key}: ${message}`;
          });
        } else if (response.status === 500) {
            errorMessage = t('centerEditTrainer.errors.submitErrorUnknown') + " (Server Error)";
        } else {
            errorMessage = t('centerEditTrainer.errors.submitErrorUnknown') + ` (Status: ${response.status})${await response.text()}`;
        }
        throw new Error(errorMessage);
      }
      
      alert(t('centerEditTrainer.successMessage'));
      navigate(-1); // Go back to the previous page

    } catch (err) {
      setIsLoading(false);
      setError(err instanceof Error ? err.message : t('centerEditTrainer.errors.submitErrorUnknown'));
    }
  };
  
  if (!authUser) {
    return <p>{t('centerEditTrainer.authPrompt')}</p>;
  }

  if (isFetchingTrainer) {
    return <p>{t('centerEditTrainer.loadingTrainer')}</p>;
  }
  
  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{t('centerEditTrainer.title')}</CardTitle>
          {trainerData?.user?.email && <CardDescription>{t('centerEditTrainer.editingFor', { trainerEmail: trainerData.user.email })}</CardDescription>}
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 mb-4 break-all">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName">{t('centerAddNewTrainer.labels.firstName')}</Label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="lastName">{t('centerAddNewTrainer.labels.lastName')}</Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="arabicFirstName">{t('centerAddNewTrainer.labels.arabicFirstName')}</Label>
                <Input id="arabicFirstName" value={arabicFirstName} onChange={(e) => setArabicFirstName(e.target.value)} required dir="rtl" />
              </div>
              <div>
                <Label htmlFor="arabicLastName">{t('centerAddNewTrainer.labels.arabicLastName')}</Label>
                <Input id="arabicLastName" value={arabicLastName} onChange={(e) => setArabicLastName(e.target.value)} required dir="rtl" />
              </div>
            </div>

            {/* Personal Information Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="cinId">{t('centerAddNewTrainer.labels.cinId')}</Label>
                <Input id="cinId" value={cinId} onChange={(e) => setCinId(e.target.value)} placeholder={t('centerAddNewTrainer.placeholders.cinId')} />
              </div>
              <div>
                <Label htmlFor="phoneNumber">{t('centerAddNewTrainer.labels.phoneNumber')}</Label>
                <Input id="phoneNumber" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder={t('centerAddNewTrainer.placeholders.phoneNumber')} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="birthDate">{t('centerAddNewTrainer.labels.birthDate')}</Label>
                <Input id="birthDate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="birthCity">{t('centerAddNewTrainer.labels.birthCity')}</Label>
                <Input id="birthCity" value={birthCity} onChange={(e) => setBirthCity(e.target.value)} placeholder={t('centerAddNewTrainer.placeholders.birthCity')} />
              </div>
            </div>
            <div>
              <Label htmlFor="address">{t('centerAddNewTrainer.labels.address')}</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder={t('centerAddNewTrainer.placeholders.address')} />
            </div>
            <div>
              <Label htmlFor="city">{t('centerAddNewTrainer.labels.city')}</Label>
              <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder={t('centerAddNewTrainer.placeholders.city')} />
            </div>

            {/* Profile Picture Input */}
            <div className="col-span-1 md:col-span-2">
              <Label htmlFor="profilePicture">{t('fields.profilePictureOptional')}</Label>
              <div className="mt-2 flex items-center gap-x-3">
                {profilePicturePreview ? (
                  <img src={profilePicturePreview} alt="Profile Preview" className="h-16 w-16 rounded-full object-cover" />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    {t('adminCentersPage.noLogo')}
                  </div>
                )}
                <Input
                  id="profilePicture"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                />
              </div>
            </div>

            {/* Program and Contract Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="program">{t('centerAddNewTrainer.labels.program')}</Label>
                <Select value={selectedProgram} onValueChange={setSelectedProgram} required>
                  <SelectTrigger id="program">
                    <SelectValue placeholder={t('centerAddNewTrainer.placeholders.selectProgram')} />
                  </SelectTrigger>
                  <SelectContent>
                    {trainingPrograms.map(program => (
                      <SelectItem key={program.id.toString()} value={program.id.toString()}>
                        {program.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="contractWith">{t('centerAddNewTrainer.labels.contractWith')}</Label>
                <Select value={contractWith} onValueChange={setContractWith} required>
                  <SelectTrigger id="contractWith">
                    <SelectValue placeholder={t('centerAddNewTrainer.placeholders.selectContractWith')} />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTRACT_WITH_CHOICES.map(choice => (
                      <SelectItem key={choice.value} value={choice.value}>
                        {t(choice.labelKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Contract Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="contractStartDate">{t('centerAddNewTrainer.labels.contractStartDate')}</Label>
                <Input id="contractStartDate" type="date" value={contractStartDate} onChange={(e) => setContractStartDate(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="contractEndDate">{t('centerAddNewTrainer.labels.contractEndDate')}</Label>
                <Input id="contractEndDate" type="date" value={contractEndDate} onChange={(e) => setContractEndDate(e.target.value)} required />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-8">
              <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isLoading}>
                {t('centerAddNewTrainer.buttons.cancel')} 
              </Button>
              <Button type="submit" disabled={isLoading || isFetchingTrainer}>
                {isLoading ? t('centerEditTrainer.buttons.saving') : t('centerEditTrainer.buttons.saveChanges')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CenterEditTrainer; 