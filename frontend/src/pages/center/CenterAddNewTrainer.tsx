import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

// Define actual types based on your API responses
interface TrainingProgram {
  id: string | number;
  name: string;
}

interface Center {
  id: string | number;
  name: string;
}

const CONTRACT_WITH_CHOICES = [
  { value: 'entraide', labelKey: 'centerAddNewTrainer.contractChoices.entraide' },
  { value: 'association', labelKey: 'centerAddNewTrainer.contractChoices.association' }
];

const CenterAddNewTrainer: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentCenter, setCurrentCenter] = useState<Center | null>(null);

  // Form fields state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [arabicFirstName, setArabicFirstName] = useState('');
  const [arabicLastName, setArabicLastName] = useState('');
  
  // New state for User profile fields
  const [cinId, setCinId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthCity, setBirthCity] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  // Trainer-specific fields
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [contractWith, setContractWith] = useState<string>('');
  const [contractStartDate, setContractStartDate] = useState('');
  const [contractEndDate, setContractEndDate] = useState('');

  // Dropdown data
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchSupervisedCenter = async () => {
      if (!user?.id || !token) {
        setError(t('centerAddNewTrainer.errors.authError'));
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/api/centers-app/centers/?supervisor=${user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(t('centerAddNewTrainer.errors.fetchCenterError'));
        const data = await response.json();
        const centers = Array.isArray(data) ? data : data.results || [];
        if (centers.length > 0) {
          setCurrentCenter(centers[0]);
        } else {
          setError(t('centerAddNewTrainer.errors.noCenterAssigned'));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t('centerAddNewTrainer.errors.fetchCenterError'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchSupervisedCenter();
  }, [user, token, t]);

  useEffect(() => {
    const fetchTrainingPrograms = async () => {
      if (!token) return;
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/programs/trainingprogrames/', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(t('centerAddNewTrainer.errors.fetchProgramsError'));
        const data = await response.json();
        setTrainingPrograms(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('centerAddNewTrainer.errors.fetchProgramsError'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrainingPrograms();
  }, [token, t]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentCenter) {
      setError(t('centerAddNewTrainer.errors.centerNotLoaded'));
      return;
    }
    setIsLoading(true);
    setError(null);

    const trainerData = {
      first_name: firstName,
      last_name: lastName,
      Arabic_first_name: arabicFirstName,
      arabic_last_name: arabicLastName,
      center: currentCenter.id, // Supervisor's center ID
      program: selectedProgram, // This is the ID
      contarct_with: contractWith, // Note: using same field name as in model (with typo)
      contract_start_date: contractStartDate,
      contract_end_date: contractEndDate,

      // Add User profile fields to the payload
      CIN_id: cinId || undefined,
      phone_number: phoneNumber || undefined,
      birth_date: birthDate || undefined,
      birth_city: birthCity || undefined,
      address: address || undefined,
      city: city || undefined,
    };

    try {
      const response = await fetch('http://localhost:8000/api/teachers/teachers/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(trainerData),
      });

      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Catch if response is not JSON
        let errorMessage = t('centerAddNewTrainer.errors.submitError');
        if (Object.keys(errorData).length > 0) {
          Object.keys(errorData).forEach(key => {
            const message = Array.isArray(errorData[key]) ? errorData[key].join(', ') : errorData[key];
            errorMessage += ` ${key}: ${message}`;
          });
        } else if (response.status === 500) {
            errorMessage = t('centerAddNewTrainer.errors.submitErrorUnknown') + " (Server Error)";
        } else {
            errorMessage = t('centerAddNewTrainer.errors.submitErrorUnknown') + ` (Status: ${response.status})${await response.text()}`;
        }
        throw new Error(errorMessage);
      }
      
      alert(t('centerAddNewTrainer.successMessage'));
      navigate(-1); 

    } catch (err) {
      setIsLoading(false);
      setError(err instanceof Error ? err.message : t('centerAddNewTrainer.errors.submitErrorUnknown'));
    }
  };
  
  if (!user) {
    return <p>{t('centerAddNewTrainer.authPrompt')}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{t('centerAddNewTrainer.title')}</CardTitle>
          {currentCenter && <CardDescription>{t('centerAddNewTrainer.centerInfo', { centerName: currentCenter.name })}</CardDescription>}
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

            <div className="flex justify-end gap-2 mt-8">
              <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isLoading}>
                {t('centerAddNewTrainer.buttons.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? t('centerAddNewTrainer.buttons.submitting') : t('centerAddNewTrainer.buttons.submit')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CenterAddNewTrainer; 