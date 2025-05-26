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

// Define actual types based on your API responses
interface TrainingProgram {
  id: string | number;
  name: string;
}

interface TrainingCourse {
  id: string | number;
  name: string;
  program?: string | number; // For filtering/matching
}

interface Group {
  id: string | number;
  name: string;
}

interface Center {
  id: string | number;
  name: string;
}

interface StudentData {
  id: string | number;
  first_name: string;
  last_name: string;
  Arabic_first_name: string;
  arabic_last_name: string;
  academic_year: string;
  joining_date: string;
  program: string | number; // Store ID
  training_course?: string | number | null; // Store ID
  group?: string | number | null; // Store ID
  center: string | number; // Center ID
  // User profile fields from the nested user object
  user: {
    email: string;
    username?: string;
    CIN_id?: string | null;
    phone_number?: string | null;
    birth_date?: string | null;
    birth_city?: string | null;
    address?: string | null;
    city?: string | null;
    profile_picture?: string | null;
    // Include other user fields if needed for display or if they become editable
  };
  exam_id?: string; // Display only
  center_code?: string; // Display only
}


const CenterUpdateStudent: React.FC = () => {
  const { t } = useTranslation();
  const { user: authUser } = useAuth(); // Renamed to avoid conflict with student's user object
  const navigate = useNavigate();
  const { studentId } = useParams<{ studentId: string }>();

  const [currentCenter, setCurrentCenter] = useState<Center | null>(null);
  const [studentData, setStudentData] = useState<Partial<StudentData>>({});

  // Form fields state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [arabicFirstName, setArabicFirstName] = useState('');
  const [arabicLastName, setArabicLastName] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [cinId, setCinId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthCity, setBirthCity] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);

  // Dropdown data
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [trainingCourses, setTrainingCourses] = useState<TrainingCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingStudent, setIsFetchingStudent] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('accessToken');

  // Fetch supervised center (similar to AddNewStudent)
  useEffect(() => {
    const fetchSupervisedCenter = async () => {
      if (!authUser?.id || !token) {
        setError(t('centerAddNewStudent.errors.authError')); // Re-use existing translations if applicable
        return;
      }
      // This logic might be slightly different if the center context is needed differently for updates
      // For now, assuming it's similar to when adding a new student.
      try {
        const response = await fetch(`http://localhost:8000/api/centers-app/centers/?supervisor=${authUser.id}`, {
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
      }
    };
    fetchSupervisedCenter();
  }, [authUser, token, t]);


  // Fetch student details
  const fetchStudentDetails = useCallback(async () => {
    if (!studentId || !token) {
      setError(t('centerUpdateStudent.errors.missingInfo'));
      setIsFetchingStudent(false);
      return;
    }
    setIsFetchingStudent(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/api/students/students/${studentId}/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(t('centerUpdateStudent.errors.fetchStudentError'));
      }
      const data: StudentData = await response.json();
      setStudentData(data);
      
      // Pre-fill form states
      setFirstName(data.user?.first_name || '');
      setLastName(data.user?.last_name || '');
      setArabicFirstName(data.user?.Arabic_first_name || '');
      setArabicLastName(data.user?.arabic_last_name || '');
      setAcademicYear(data.academic_year || '');
      setJoiningDate(data.joining_date || '');
      setSelectedProgram(data.program?.toString() || '');
      setSelectedCourse(data.training_course?.toString() || '');
      setSelectedGroup(data.group?.toString() || '');

      // Pre-fill user profile fields
      setCinId(data.user?.CIN_id || '');
      setPhoneNumber(data.user?.phone_number || '');
      setBirthDate(data.user?.birth_date || '');
      setBirthCity(data.user?.birth_city || '');
      setAddress(data.user?.address || '');
      setCity(data.user?.city || '');
      setProfilePicturePreview(data.user?.profile_picture || null);

      // If center is part of student data and not fetched from supervisor context:
      // setCurrentCenter({ id: data.center, name: 'Center Name from Student Data' }); 
      // This needs adjustment based on how center info is managed.
      // For now, assuming currentCenter is from supervisor context.

    } catch (err) {
      setError(err instanceof Error ? err.message : t('centerUpdateStudent.errors.fetchStudentError'));
    } finally {
      setIsFetchingStudent(false);
    }
  }, [studentId, token, t]);

  useEffect(() => {
    fetchStudentDetails();
  }, [fetchStudentDetails]);

  // Fetch Training Programs (similar to AddNewStudent)
  useEffect(() => {
    const fetchTrainingPrograms = async () => {
      if (!token) return;
      // setIsLoading(true); // Manage loading state carefully with multiple fetches
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
        // setIsLoading(false);
      }
    };
    fetchTrainingPrograms();
  }, [token, t]);

  // Fetch Groups (similar to AddNewStudent, depends on currentCenter)
   useEffect(() => {
    if (!currentCenter?.id || !token) return;
    const fetchGroups = async () => {
      // setIsLoading(true);
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
        // setIsLoading(false);
      }
    };
    fetchGroups();
  }, [currentCenter, token, t]);

  // Fetch Training Courses (depends on selectedProgram and currentCenter)
  useEffect(() => {
    if (!selectedProgram || !currentCenter?.id || !token) {
      setTrainingCourses([]);
      // setSelectedCourse(''); // Don't clear if pre-filling from existing student
      return;
    }
    const fetchTrainingCourses = async () => {
      // setIsLoading(true);
      // setError(null); // Don't clear error if it's from student fetching
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
        //setError(err instanceof Error ? err.message : t('centerAddNewStudent.errors.fetchCoursesError'));
        console.error("Error fetching training courses:", err); // Log instead of overriding main error
        setTrainingCourses([]);
      } finally {
        // setIsLoading(false);
      }
    };
    fetchTrainingCourses();
  }, [selectedProgram, currentCenter, token, t]);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setProfilePictureFile(null);
      setProfilePicturePreview(studentData.user?.profile_picture || null); // Revert to original if selection cleared
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!studentId || !currentCenter) {
      setError(t('centerUpdateStudent.errors.missingInfoSubmit'));
      return;
    }
    setIsLoading(true);
    setError(null);

    const updatedStudentData = {
      first_name: firstName,
      last_name: lastName,
      Arabic_first_name: arabicFirstName,
      arabic_last_name: arabicLastName,
      academic_year: academicYear,
      joining_date: joiningDate,
      program: selectedProgram,
      training_course: selectedCourse || null, // Send null if empty
      group: selectedGroup || null, // Send null if empty
      center: currentCenter.id, // This might not be updatable or needed if center change is not allowed

      // User profile fields
      CIN_id: cinId || null,
      phone_number: phoneNumber || null,
      birth_date: birthDate || null,
      birth_city: birthCity || null,
      address: address || null,
      city: city || null,
    };

    const formData = new FormData();
    formData.append('first_name', updatedStudentData.first_name);
    formData.append('last_name', updatedStudentData.last_name);
    formData.append('Arabic_first_name', updatedStudentData.Arabic_first_name || '');
    formData.append('arabic_last_name', updatedStudentData.arabic_last_name || '');
    formData.append('academic_year', updatedStudentData.academic_year);
    formData.append('joining_date', updatedStudentData.joining_date);
    formData.append('program', updatedStudentData.program?.toString() || '');
    formData.append('training_course', updatedStudentData.training_course?.toString() || null);
    formData.append('group', updatedStudentData.group?.toString() || null);
    formData.append('center', updatedStudentData.center.toString());
    formData.append('CIN_id', updatedStudentData.CIN_id?.toString() || null);
    formData.append('phone_number', updatedStudentData.phone_number?.toString() || null);
    formData.append('birth_date', updatedStudentData.birth_date?.toString() || null);
    formData.append('birth_city', updatedStudentData.birth_city?.toString() || null);
    formData.append('address', updatedStudentData.address?.toString() || null);
    formData.append('city', updatedStudentData.city?.toString() || null);

    if (profilePictureFile) {
      formData.append('profile_picture', profilePictureFile);
    }

    try {
      const response = await fetch(`http://localhost:8000/api/students/students/${studentId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = t('centerUpdateStudent.errors.submitError');
        // ... (error handling similar to AddNewStudent)
        if (Object.keys(errorData).length > 0) {
          Object.keys(errorData).forEach(key => {
            const message = Array.isArray(errorData[key]) ? errorData[key].join(', ') : errorData[key];
            errorMessage += ` ${key}: ${message}`;
          });
        } else if (response.status === 500) {
            errorMessage = t('centerUpdateStudent.errors.submitErrorUnknown') + " (Server Error)";
        } else {
            errorMessage = t('centerUpdateStudent.errors.submitErrorUnknown') + ` (Status: ${response.status})${await response.text()}`;
        }
        throw new Error(errorMessage);
      }
      
      alert(t('centerUpdateStudent.successMessage'));
      navigate(-1); // Go back to the previous page (e.g., students list)

    } catch (err) {
      setIsLoading(false);
      setError(err instanceof Error ? err.message : t('centerUpdateStudent.errors.submitErrorUnknown'));
    }
  };
  
  if (!authUser) {
    return <p>{t('centerAddNewStudent.authPrompt')}</p>;
  }

  if (isFetchingStudent) {
    return <p>{t('centerUpdateStudent.loadingStudent')}</p>;
  }
  
  // JSX for the form (similar to CenterAddNewStudent, but with values bound and a different title)
  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{t('centerUpdateStudent.title')}</CardTitle>
          {studentData?.user?.email && <CardDescription>{t('centerUpdateStudent.editingFor', { studentEmail: studentData.user.email, examId: studentData.exam_id })}</CardDescription>}
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

            {/* User Profile Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="cinId">{t('centerAddNewStudent.labels.cinId')}</Label>
                <Input id="cinId" value={cinId} onChange={(e) => setCinId(e.target.value)} placeholder={t('centerAddNewStudent.placeholders.cinId')} />
              </div>
              <div>
                <Label htmlFor="phoneNumber">{t('centerAddNewStudent.labels.phoneNumber')}</Label>
                <Input id="phoneNumber" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder={t('centerAddNewStudent.placeholders.phoneNumber')} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="birthDate">{t('centerAddNewStudent.labels.birthDate')}</Label>
                <Input id="birthDate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="birthCity">{t('centerAddNewStudent.labels.birthCity')}</Label>
                <Input id="birthCity" value={birthCity} onChange={(e) => setBirthCity(e.target.value)} placeholder={t('centerAddNewStudent.placeholders.birthCity')} />
              </div>
            </div>
            <div>
              <Label htmlFor="address">{t('centerAddNewStudent.labels.address')}</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder={t('centerAddNewStudent.placeholders.address')} />
            </div>
            <div>
              <Label htmlFor="city">{t('centerAddNewStudent.labels.city')}</Label>
              <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder={t('centerAddNewStudent.placeholders.city')} />
            </div>
            {/* End User Profile Fields */}
            
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

            {/* Profile Picture Input */}
            <div className="col-span-1 md:col-span-2">
              <Label htmlFor="profilePicture">{t('fields.profilePictureOptional')}</Label>
              <div className="mt-2 flex items-center gap-x-3">
                {profilePicturePreview ? (
                  <img src={profilePicturePreview} alt="Profile Preview" className="h-16 w-16 rounded-full object-cover" />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    {t('adminCentersPage.noLogo')} {/* Re-use translation or add specific one */}
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

            <div className="flex justify-end gap-2 mt-8">
              <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isLoading}>
                {t('centerAddNewStudent.buttons.cancel')} 
              </Button>
              <Button type="submit" disabled={isLoading || isFetchingStudent}>
                {isLoading ? t('centerUpdateStudent.buttons.saving') : t('centerUpdateStudent.buttons.saveChanges')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CenterUpdateStudent; 