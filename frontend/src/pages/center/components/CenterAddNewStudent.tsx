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

interface TrainingCourse {
  id: string | number;
  name: string; // Or whatever field holds the display name, e.g., program.name from serializer
}

interface Group {
  id: string | number;
  name: string;
}

interface Center {
  id: string | number;
  name: string;
}

const CenterAddNewStudent: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentCenter, setCurrentCenter] = useState<Center | null>(null);

  // Form fields state - exam_id and center_code are removed as they are backend generated
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [arabicFirstName, setArabicFirstName] = useState('');
  const [arabicLastName, setArabicLastName] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  // New state for User profile fields
  const [cinId, setCinId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthCity, setBirthCity] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  // Dropdown data
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [trainingCourses, setTrainingCourses] = useState<TrainingCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>(''); // Store ID
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>(''); // Store ID

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchSupervisedCenter = async () => {
      if (!user?.id || !token) {
        setError(t('centerAddNewStudent.errors.authError'));
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/api/centers-app/centers/?supervisor=${user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(t('centerAddNewStudent.errors.fetchCenterError'));
        const data = await response.json();
        const centers = Array.isArray(data) ? data : data.results || [];
        if (centers.length > 0) {
          setCurrentCenter(centers[0]);
        } else {
          setError(t('centerAddNewStudent.errors.noCenterAssigned'));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t('centerAddNewStudent.errors.fetchCenterError'));
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
        if (!response.ok) throw new Error(t('centerAddNewStudent.errors.fetchProgramsError'));
        const data = await response.json();
        setTrainingPrograms(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('centerAddNewStudent.errors.fetchProgramsError'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrainingPrograms();
  }, [token, t]);

  useEffect(() => {
    if (!currentCenter?.id || !token) return;
    const fetchGroups = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/api/centers-app/groups/?center=${currentCenter.id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(t('centerAddNewStudent.errors.fetchGroupsError'));
        const data = await response.json();
        setGroups(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('centerAddNewStudent.errors.fetchGroupsError'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchGroups();
  }, [currentCenter, token, t]);

  useEffect(() => {
    if (!selectedProgram || !currentCenter?.id || !token) {
      setTrainingCourses([]);
      setSelectedCourse('');
      return;
    }
    const fetchTrainingCourses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8000/api/programs/trainingcourses/?program=${selectedProgram}&center=${currentCenter.id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ detail: t('centerAddNewStudent.errors.fetchCoursesError') }));
          throw new Error(errorData.detail || t('centerAddNewStudent.errors.fetchCoursesError'));
        }
        const data = await response.json();
        setTrainingCourses(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('centerAddNewStudent.errors.fetchCoursesError'));
        setTrainingCourses([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrainingCourses();
  }, [selectedProgram, currentCenter, token, t]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentCenter) {
      setError(t('centerAddNewStudent.errors.centerNotLoaded'));
      return;
    }
    setIsLoading(true);
    setError(null);

    const studentData = {
      first_name: firstName,
      last_name: lastName,
      Arabic_first_name: arabicFirstName,
      arabic_last_name: arabicLastName,
      academic_year: academicYear,
      joining_date: joiningDate,
      program: selectedProgram, // This is the ID
      training_course: selectedCourse || undefined, // ID or undefined
      group: selectedGroup || undefined, // ID or undefined
      center: currentCenter.id, // Supervisor's center ID

      // Add new User profile fields to the payload
      CIN_id: cinId || undefined,
      phone_number: phoneNumber || undefined,
      birth_date: birthDate || undefined,
      birth_city: birthCity || undefined,
      address: address || undefined,
      city: city || undefined,
    };

    try {
      const response = await fetch('http://localhost:8000/api/students/students/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(studentData),
      });

      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Catch if response is not JSON
        let errorMessage = t('centerAddNewStudent.errors.submitError');
        if (Object.keys(errorData).length > 0) {
          Object.keys(errorData).forEach(key => {
            const message = Array.isArray(errorData[key]) ? errorData[key].join(', ') : errorData[key];
            errorMessage += ` ${key}: ${message}`;
          });
        } else if (response.status === 500) {
            errorMessage = t('centerAddNewStudent.errors.submitErrorUnknown') + " (Server Error)";
        } else {
            errorMessage = t('centerAddNewStudent.errors.submitErrorUnknown') + ` (Status: ${response.status})${await response.text()}`;
        }
        throw new Error(errorMessage);
      }
      
      alert(t('centerAddNewStudent.successMessage'));
      navigate(-1); 

    } catch (err) {
      setIsLoading(false);
      setError(err instanceof Error ? err.message : t('centerAddNewStudent.errors.submitErrorUnknown'));
    }
  };
  
  if (!user) {
    return <p>{t('centerAddNewStudent.authPrompt')}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{t('centerAddNewStudent.title')}</CardTitle>
          {currentCenter && <CardDescription>{t('centerAddNewStudent.centerInfo', { centerName: currentCenter.name })}</CardDescription>}
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 mb-4 break-all">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName">{t('centerAddNewStudent.labels.firstName')}</Label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="lastName">{t('centerAddNewStudent.labels.lastName')}</Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="arabicFirstName">{t('centerAddNewStudent.labels.arabicFirstName')}</Label>
                <Input id="arabicFirstName" value={arabicFirstName} onChange={(e) => setArabicFirstName(e.target.value)} required dir="rtl" />
              </div>
              <div>
                <Label htmlFor="arabicLastName">{t('centerAddNewStudent.labels.arabicLastName')}</Label>
                <Input id="arabicLastName" value={arabicLastName} onChange={(e) => setArabicLastName(e.target.value)} required dir="rtl" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="academicYear">{t('centerAddNewStudent.labels.academicYear')}</Label>
                <Input id="academicYear" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} placeholder={t('centerAddNewStudent.placeholders.academicYear')} required />
              </div>
              <div>
                <Label htmlFor="joiningDate">{t('centerAddNewStudent.labels.joiningDate')}</Label>
                <Input id="joiningDate" type="date" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} required />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="program">{t('centerAddNewStudent.labels.program')}</Label>
                <Select value={selectedProgram} onValueChange={setSelectedProgram} required>
                  <SelectTrigger id="program">
                    <SelectValue placeholder={t('centerAddNewStudent.placeholders.selectProgram')} />
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
                <Label htmlFor="trainingCourse">{t('centerAddNewStudent.labels.trainingCourse')}</Label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse} disabled={!selectedProgram || trainingCourses.length === 0}>
                  <SelectTrigger id="trainingCourse">
                    <SelectValue placeholder={t('centerAddNewStudent.placeholders.selectCourse')} />
                  </SelectTrigger>
                  <SelectContent>
                    {trainingCourses.length > 0 ? trainingCourses.map(course => (
                      <SelectItem key={course.id.toString()} value={course.id.toString()}>
                        {/* Adjust if course name is nested, e.g. course.program.name */}
                        {course.name || t('centerAddNewStudent.courseNameUnavailable')}
                      </SelectItem>
                    )) : <p className="p-2 text-sm text-muted-foreground">{t('centerAddNewStudent.noCoursesForProgram')}</p>}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="group">{t('centerAddNewStudent.labels.group')}</Label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger id="group">
                  <SelectValue placeholder={t('centerAddNewStudent.placeholders.selectGroup')} />
                </SelectTrigger>
                <SelectContent>
                  {groups.map(group => (
                    <SelectItem key={group.id.toString()} value={group.id.toString()}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* New User Profile Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="cinId">{t('centerAddNewStudent.labels.cinId', 'CIN ID')}</Label>
                <Input id="cinId" value={cinId} onChange={(e) => setCinId(e.target.value)} placeholder={t('centerAddNewStudent.placeholders.cinId', 'e.g., AB123456')} />
              </div>
              <div>
                <Label htmlFor="phoneNumber">{t('centerAddNewStudent.labels.phoneNumber', 'Phone Number')}</Label>
                <Input id="phoneNumber" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder={t('centerAddNewStudent.placeholders.phoneNumber', 'e.g., 0600000000')} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="birthDate">{t('centerAddNewStudent.labels.birthDate', 'Birth Date')}</Label>
                <Input id="birthDate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="birthCity">{t('centerAddNewStudent.labels.birthCity', 'Birth City')}</Label>
                <Input id="birthCity" value={birthCity} onChange={(e) => setBirthCity(e.target.value)} placeholder={t('centerAddNewStudent.placeholders.birthCity', 'e.g., Rabat')} />
              </div>
            </div>

            <div>
              <Label htmlFor="address">{t('centerAddNewStudent.labels.address', 'Address')}</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder={t('centerAddNewStudent.placeholders.address', 'e.g., 123 Main St, Apt 4B')} />
            </div>
             <div>
              <Label htmlFor="city">{t('centerAddNewStudent.labels.city', 'City')}</Label>
              <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder={t('centerAddNewStudent.placeholders.city', 'e.g., Casablanca')} />
            </div>
            {/* End New User Profile Fields */}

            <div className="flex justify-end gap-2 mt-8">
              <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isLoading}>
                {t('centerAddNewStudent.buttons.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? t('centerAddNewStudent.buttons.submitting') : t('centerAddNewStudent.buttons.submit')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CenterAddNewStudent; 