import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Users, GraduationCap, BookOpen, Calendar } from 'lucide-react';

// Interface for Group data
interface Group {
  id: number;
  name: string;
  description?: string;
  center: number;
  created_at: string;
  updated_at: string;
}

// Interface for Student User data
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
  is_active?: boolean;
}

// Interface for Student data
interface Student {
  id: number;
  user: StudentUser;
  exam_id: string;
  center_code: string;
  center: number | string;
  program: string;
  academic_year: string;
  joining_date: string;
  training_course: string | null;
  group: number | null;
  created_at: string;
  updated_at: string;
}

// Interface for Teacher data to get current trainer info
interface Teacher {
  id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  center: number;
  program: number;
  program_name: string;
  groups: Group[];
  contract_with: 'entraide' | 'association';
  contract_start_date: string;
  contract_end_date: string;
}

const TrainerStudentsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [groups, setGroups] = useState<Group[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [trainerData, setTrainerData] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');

  const token = localStorage.getItem('accessToken');

  // Fetch trainer's data and groups
  useEffect(() => {
    const fetchTrainerData = async () => {
      if (!token || !user?.id) {
        setError(t('trainerStudentsPage.authError') || 'Authentication error');
        setLoading(false);
        return;
      }

      try {
        // Fetch current trainer data
        const trainerResponse = await fetch(`/api/teachers/teachers/?user=${user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!trainerResponse.ok) {
          throw new Error(`Failed to fetch trainer data: ${trainerResponse.status}`);
        }

        const trainerData = await trainerResponse.json();
        console.log('🔍 Full trainer API response:', trainerData);
        const trainerList = Array.isArray(trainerData) ? trainerData : (trainerData.results || []);
        console.log('📋 Trainer list:', trainerList);
        
        if (trainerList.length === 0) {
          throw new Error('Trainer profile not found');
        }

        const trainer = trainerList[0];
        console.log('👨‍🏫 Selected trainer:', trainer);
        console.log('👥 Trainer groups:', trainer.groups);
        setTrainerData(trainer);

        // Groups are now included in the trainer response as full objects
        if (trainer.groups && trainer.groups.length > 0) {
          setGroups(trainer.groups);
          
          // Select first group by default if groups exist
          setSelectedGroupId(trainer.groups[0].id.toString());
        }

        setLoading(false);
      } catch (err: any) {
        console.error('[TrainerStudentsPage] Error fetching trainer data:', err);
        setError(err.message || 'Failed to load trainer data');
        setLoading(false);
      }
    };

    fetchTrainerData();
  }, [token, user?.id]);

  // Fetch students for selected group
  useEffect(() => {
    const fetchStudentsForGroup = async () => {
      if (!selectedGroupId || !token) {
        setStudents([]);
        return;
      }

      setStudentsLoading(true);
      try {
        const response = await fetch(`/api/students/students/?group=${selectedGroupId}&page_size=1000`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch students: ${response.status}`);
        }

        const data = await response.json();
        const studentsList = Array.isArray(data) ? data : (data.results || []);
        setStudents(studentsList);
        setStudentsLoading(false);
      } catch (err: any) {
        console.error('[TrainerStudentsPage] Error fetching students:', err);
        setError(err.message || 'Failed to load students');
        setStudentsLoading(false);
      }
    };

    if (selectedGroupId) {
      fetchStudentsForGroup();
    }
  }, [selectedGroupId, token]);

  // Filter students based on search term
  const filteredStudents = students.filter(student => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      student.user.first_name.toLowerCase().includes(searchLower) ||
      student.user.last_name.toLowerCase().includes(searchLower) ||
      student.user.email.toLowerCase().includes(searchLower) ||
      student.exam_id.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleViewStudentDetails = (studentId: number) => {
    navigate(`/trainer/students/${studentId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>{t('trainerStudentsPage.loadingTrainerData') || 'Loading trainer data...'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <h3 className="text-lg font-semibold mb-2">{t('trainerStudentsPage.errorTitle') || 'Error'}</h3>
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (groups.length === 0 && trainerData) {
    return (
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            {t('trainerStudentsPage.title') || 'My Students'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('trainerStudentsPage.subtitle') || 'Manage and view your students by group'}
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {t('trainerStudentsPage.noGroupsTitle') || 'No Groups Assigned'}
              </h3>
              <p className="text-muted-foreground">
                {t('trainerStudentsPage.noGroupsDescription') || 'You are not currently assigned to any groups. Please contact your center supervisor.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <GraduationCap className="h-6 w-6" />
          {t('trainerStudentsPage.title') || 'My Students'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t('trainerStudentsPage.subtitle') || 'Manage and view your students by group'}
        </p>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('trainerStudentsPage.searchPlaceholder') || 'Search students by name, email, or exam ID...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Groups Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('trainerStudentsPage.groupsTitle') || 'Student Groups'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedGroupId} onValueChange={setSelectedGroupId} className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
              {groups.map((group) => (
                <TabsTrigger 
                  key={group.id} 
                  value={group.id.toString()}
                  className="flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  {group.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {groups.map((group) => (
              <TabsContent key={group.id} value={group.id.toString()} className="mt-6">
                <div className="space-y-4">
                  {/* Group Info */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">{group.name}</h3>
                    {group.description && (
                      <p className="text-muted-foreground text-sm mb-3">{group.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {filteredStudents.length} {t('trainerStudentsPage.studentsCount') || 'students'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {t('trainerStudentsPage.createdOn') || 'Created'}: {formatDate(group.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Students Loading */}
                  {studentsLoading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2">{t('trainerStudentsPage.loadingStudents') || 'Loading students...'}</span>
                    </div>
                  )}

                  {/* Students Table */}
                  {!studentsLoading && (
                    <>
                      {filteredStudents.length === 0 ? (
                        <div className="text-center py-8">
                          <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">
                            {searchTerm 
                              ? (t('trainerStudentsPage.noStudentsFound') || 'No students found')
                              : (t('trainerStudentsPage.noStudentsInGroup') || 'No students in this group')}
                          </h3>
                          <p className="text-muted-foreground">
                            {searchTerm 
                              ? (t('trainerStudentsPage.tryDifferentSearch') || 'Try a different search term')
                              : (t('trainerStudentsPage.groupEmpty') || 'This group currently has no students assigned')}
                          </p>
                        </div>
                      ) : (
                        <>
                          {/* Desktop Table */}
                          <div className="hidden md:block">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>{t('trainerStudentsPage.table.student') || 'Student'}</TableHead>
                                  <TableHead>{t('trainerStudentsPage.table.examId') || 'Exam ID'}</TableHead>
                                  <TableHead>{t('trainerStudentsPage.table.academicYear') || 'Academic Year'}</TableHead>
                                  <TableHead>{t('trainerStudentsPage.table.joiningDate') || 'Joining Date'}</TableHead>
                                  <TableHead>{t('trainerStudentsPage.table.status') || 'Status'}</TableHead>
                                  <TableHead>{t('trainerStudentsPage.table.actions') || 'Actions'}</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredStudents.map((student) => (
                                  <TableRow key={student.id}>
                                    <TableCell>
                                      <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                          <AvatarImage 
                                            src={student.user.profile_picture || undefined} 
                                            alt={`${student.user.first_name} ${student.user.last_name}`} 
                                          />
                                          <AvatarFallback className="text-xs">
                                            {getInitials(student.user.first_name, student.user.last_name)}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <div className="font-medium">
                                            {student.user.first_name} {student.user.last_name}
                                          </div>
                                          <div className="text-sm text-muted-foreground">
                                            {student.user.email}
                                          </div>
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">
                                      {student.exam_id}
                                    </TableCell>
                                    <TableCell>
                                      {student.academic_year}
                                    </TableCell>
                                    <TableCell>
                                      {formatDate(student.joining_date)}
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant={student.user.is_active ? "default" : "secondary"}>
                                        {student.user.is_active 
                                          ? (t('trainerStudentsPage.status.active') || 'Active')
                                          : (t('trainerStudentsPage.status.inactive') || 'Inactive')
                                        }
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewStudentDetails(student.id)}
                                      >
                                        {t('trainerStudentsPage.actions.viewDetails') || 'View Details'}
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>

                          {/* Mobile Cards */}
                          <div className="md:hidden space-y-3">
                            {filteredStudents.map((student) => (
                              <Card key={student.id} className="p-4">
                                <div className="flex items-center gap-3 mb-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage 
                                      src={student.user.profile_picture || undefined} 
                                      alt={`${student.user.first_name} ${student.user.last_name}`} 
                                    />
                                    <AvatarFallback>
                                      {getInitials(student.user.first_name, student.user.last_name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="font-semibold">
                                      {student.user.first_name} {student.user.last_name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {student.user.email}
                                    </div>
                                  </div>
                                  <Badge variant={student.user.is_active ? "default" : "secondary"}>
                                    {student.user.is_active 
                                      ? (t('trainerStudentsPage.status.active') || 'Active')
                                      : (t('trainerStudentsPage.status.inactive') || 'Inactive')
                                    }
                                  </Badge>
                                </div>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">{t('trainerStudentsPage.table.examId') || 'Exam ID'}:</span>
                                    <span className="font-mono">{student.exam_id}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">{t('trainerStudentsPage.table.academicYear') || 'Academic Year'}:</span>
                                    <span>{student.academic_year}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">{t('trainerStudentsPage.table.joiningDate') || 'Joining Date'}:</span>
                                    <span>{formatDate(student.joining_date)}</span>
                                  </div>
                                </div>
                                <div className="mt-3 pt-3 border-t">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewStudentDetails(student.id)}
                                    className="w-full"
                                  >
                                    {t('trainerStudentsPage.actions.viewDetails') || 'View Details'}
                                  </Button>
                                </div>
                              </Card>
                            ))}
                          </div>

                          {/* Results count */}
                          <div className="mt-4 text-sm text-muted-foreground text-center">
                            {searchTerm ? (
                              t('trainerStudentsPage.searchResults', { 
                                found: filteredStudents.length, 
                                total: students.length,
                                term: searchTerm
                              }) || `Found ${filteredStudents.length} of ${students.length} students matching "${searchTerm}"`
                            ) : (
                              t('trainerStudentsPage.totalStudents', { count: filteredStudents.length }) || 
                              `${filteredStudents.length} students in this group`
                            )}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerStudentsPage; 