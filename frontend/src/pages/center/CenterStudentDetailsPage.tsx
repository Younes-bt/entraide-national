import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// Interfaces (can be shared or imported from a common types file)
interface StudentUser {
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
}

interface StudentDetailsData {
  id: number;
  user: StudentUser;
  exam_id: string;
  center_code: string;
  center: { id: number; name: string; } | string; // Assuming center might be an object or just name string
  program: string;
  academic_year: string;
  joining_date: string;
  training_course: string | null;
  group: string | null;
  created_at: string;
  updated_at: string;
}

const CenterStudentDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const { studentId } = useParams<{ studentId: string }>();
  const { user: authUser } = useAuth();
  const [student, setStudent] = useState<StudentDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('accessToken');

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return 'U'; // Unknown
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const fetchStudentDetails = useCallback(async () => {
    if (!studentId || !token) {
      setError(t('centerStudentDetailsPage.errors.missingInfo'));
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/api/students/students/${studentId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(t('centerStudentDetailsPage.errors.fetchStudentError'));
      }
      const data: StudentDetailsData = await response.json();
      setStudent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('centerStudentDetailsPage.errors.fetchStudentErrorUnknown'));
    } finally {
      setIsLoading(false);
    }
  }, [studentId, token, t]);

  useEffect(() => {
    fetchStudentDetails();
  }, [fetchStudentDetails]);

  if (isLoading) {
    return <div className="container mx-auto p-4 text-center">{t('centerStudentDetailsPage.loading')}</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">{error}</div>;
  }

  if (!student) {
    return <div className="container mx-auto p-4 text-center">{t('centerStudentDetailsPage.noData')}</div>;
  }

  const centerName = typeof student.center === 'object' ? student.center.name : student.center;

  return (
    <div className="container mx-auto p-4">
      <Button variant="outline" asChild className="mb-6">
        <Link to="/center/students">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('common.backToList')}
        </Link>
      </Button>

      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-col items-center pt-6 pb-4">
            {student.user.profile_picture && (
                <Avatar className="h-[150px] w-[150px] mb-4">
                    <AvatarImage src={student.user.profile_picture} alt={`${student.user.first_name} ${student.user.last_name}`} />
                    <AvatarFallback>{getInitials(student.user.first_name, student.user.last_name)}</AvatarFallback>
                </Avatar>
            )}
            <div className="text-center">
                <CardTitle className="text-2xl">
                    {student.user.first_name} {student.user.last_name}
                </CardTitle>
                <CardDescription>
                    {t('centerStudentDetailsPage.description', { email: student.user.email, examId: student.exam_id })}
                </CardDescription>
            </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Personal Information Section */}
          <section>
            <h3 className="text-xl font-semibold border-b pb-2 mb-4">{t('centerStudentsPage.dialogSections.personalInfo')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div><LabelValue label={t('centerStudentsPage.dialogLabels.user.email')} value={student.user.email} /></div>
              <div><LabelValue label={t('centerStudentsPage.dialogLabels.user.username')} value={student.user.username || 'N/A'} /></div>
              <div><LabelValue label={t('centerStudentsPage.dialogLabels.user.arabicFirstName')} value={student.user.Arabic_first_name || '-'} isRtl={true} /></div>
              <div><LabelValue label={t('centerStudentsPage.dialogLabels.user.arabicLastName')} value={student.user.arabic_last_name || '-'} isRtl={true} /></div>
              <div><LabelValue label={t('centerStudentsPage.dialogLabels.user.birthDate')} value={formatDate(student.user.birth_date)} /></div>
              <div><LabelValue label={t('centerStudentsPage.dialogLabels.user.birthCity')} value={student.user.birth_city || '-'} /></div>
              <div><LabelValue label={t('centerStudentsPage.dialogLabels.user.cin')} value={student.user.CIN_id || '-'} /></div>
              <div><LabelValue label={t('centerStudentsPage.dialogLabels.user.role')} value={student.user.role_display || '-'} /></div>
            </div>
          </section>

          {/* Contact Information Section */}
          <section>
            <h3 className="text-xl font-semibold border-b pb-2 mb-4">{t('centerStudentsPage.dialogSections.contactInfo')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div><LabelValue label={t('centerStudentsPage.dialogLabels.user.phoneNumber')} value={student.user.phone_number || '-'} /></div>
              <div><LabelValue label={t('centerStudentsPage.dialogLabels.user.address')} value={student.user.address || '-'} /></div>
              <div><LabelValue label={t('centerStudentsPage.dialogLabels.user.city')} value={student.user.city || '-'} /></div>
            </div>
          </section>

          {/* Student Information Section */}
          <section>
            <h3 className="text-xl font-semibold border-b pb-2 mb-4">{t('centerStudentsPage.dialogSections.studentInfo')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div><LabelValue label={t('centerStudentsPage.dialogLabels.examId')} value={student.exam_id} /></div>
              <div><LabelValue label={t('centerStudentsPage.dialogLabels.centerCode')} value={student.center_code || 'N/A'} /></div>
              <div><LabelValue label={t('centerStudentsPage.dialogLabels.program')} value={student.program} /></div>
              <div><LabelValue label={t('centerStudentsPage.dialogLabels.group')} value={student.group || t('centerStudentsPage.noGroup')} /></div>
              <div><LabelValue label={t('centerStudentsPage.dialogLabels.academicYear')} value={student.academic_year} /></div>
              <div><LabelValue label={t('centerStudentsPage.dialogLabels.joiningDate')} value={formatDate(student.joining_date)} /></div>
              <div><LabelValue label={t('centerStudentsPage.dialogLabels.trainingCourse')} value={student.training_course || t('centerStudentsPage.noCourse')} /></div>
              <div><LabelValue label={t('adminCentersPage.dialogCity')} value={centerName} /></div> {/* Reusing translation for Center */} 
            </div>
          </section>

           {/* Timestamps - Optional */}
           <section>
             <h3 className="text-xl font-semibold border-b pb-2 mb-4">{t('centerRoomDetailsPage.sectionTitles.timestamps')}</h3> {/* Re-use translations */} 
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div><LabelValue label={t('centerRoomDetailsPage.fields.createdAt')} value={formatDate(student.created_at)} /></div>
                <div><LabelValue label={t('centerRoomDetailsPage.fields.updatedAt')} value={formatDate(student.updated_at)} /></div>
             </div>
           </section>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper component for displaying label-value pairs
const LabelValue: React.FC<{ label: string; value: string | number | null | undefined; isRtl?: boolean }> = ({ label, value, isRtl = false }) => (
  <div>
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <p className={`font-semibold text-base ${isRtl ? 'dir-rtl' : ''}`}>{value || '-'}</p>
  </div>
);

export default CenterStudentDetailsPage; 