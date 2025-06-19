import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2, Filter, Users, FileSpreadsheet } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Define these constants at the top level of your module
const ALL_PROGRAMS_VALUE = '__ALL_PROGRAMS_FILTER__';
const ALL_GROUPS_VALUE = '__ALL_GROUPS_FILTER__';

// Expanded User interface to include fields from UserProfileSerializer
interface StudentUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username?: string; // From UserSerializer base
  Arabic_first_name?: string | null;
  arabic_last_name?: string | null;
  profile_picture?: string | null; // URL from CloudinaryField
  birth_date?: string | null;
  birth_city?: string | null;
  CIN_id?: string | null;
  phone_number?: string | null;
  address?: string | null;
  city?: string | null;
  role_display?: string; // From UserProfileSerializer to_representation
  is_active?: boolean;
  // Add other fields from UserProfileSerializer as needed, e.g., date_joined
}

interface Student {
  id: number;
  user: StudentUser; // Use the expanded StudentUser interface
  exam_id: string;
  center_code: string;
  center: Center | string; // Center can be a full object or just a name string
  program: string;
  academic_year: string;
  joining_date: string;
  training_course: string | null;
  group: string | null;
  created_at: string;
  updated_at: string;
}

interface Center {
  id: number;
  name: string;
  description?: string; // Optional based on your Center model
}

// Define types for full program and group objects
interface ProgramData {
  id: string | number;
  name: string;
}

interface GroupData {
  id: string | number;
  name: string;
  // Add other group properties if needed, e.g., center_id
}

// Mobile Student Card Component
const StudentCard = ({ student, onViewDetails, onEdit, getInitials, t, getProgramNameById }: {
  student: Student;
  onViewDetails: (studentId: number) => void;
  onEdit: (studentId: number) => void;
  formatDate: (date: string) => string;
  getInitials: (first: string, last: string) => string;
  t: any;
  getProgramNameById: (programId: string | number | undefined | null) => string;
}) => (
  <Card className="w-full">
    <CardContent className="p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <Avatar className="h-9 w-9 flex-shrink-0">
            <AvatarImage src={student.user.profile_picture || undefined} alt={`${student.user.first_name} ${student.user.last_name}`} />
            <AvatarFallback className="text-xs">
              {getInitials(student.user.first_name, student.user.last_name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-sm truncate">
              {student.user.first_name} {student.user.last_name}
            </div>
            <div className="text-xs text-muted-foreground font-light truncate">
              {getProgramNameById(student.program)}
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-7 w-7 p-0 flex-shrink-0">
              <span className="sr-only">{t('centerStudentsPage.openMenu')}</span>
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewDetails(student.id)}>
              <Eye className="mr-2 h-4 w-4" />
              {t('centerStudentsPage.actions.viewDetails')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(student.id)}>
              <Edit className="mr-2 h-4 w-4" />
              {t('centerStudentsPage.actions.edit')}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              {t('centerStudentsPage.actions.delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardContent>
  </Card>
);

const CenterStudentsPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [centerData, setCenterData] = useState<Center | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<string>(''); // Will store Program ID
  const [selectedGroup, setSelectedGroup] = useState<string>(''); // Will store Group ID

  // State for holding full program and group objects
  const [allProgramsData, setAllProgramsData] = useState<ProgramData[]>([]);
  const [allGroupsData, setAllGroupsData] = useState<GroupData[]>([]);

  const token = localStorage.getItem('accessToken'); // Moved token for broader scope

  // Fetch all training programs
  useEffect(() => {
    const fetchAllPrograms = async () => {
      if (!token) return;
      try {
        const response = await fetch('http://localhost:8000/api/programs/trainingprogrames/', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
          console.error('[CenterStudentsPage] Failed to fetch all programs list status:', response.status);
          setAllProgramsData([]); 
          return;
        }
        const data = await response.json();
        setAllProgramsData(Array.isArray(data) ? data : (data.results || []));
      } catch (err) {
        console.error('[CenterStudentsPage] Error fetching all programs:', err);
        setAllProgramsData([]);
      }
    };
    fetchAllPrograms();
  }, [token]);

  // Fetch all groups for the current center
  useEffect(() => {
    if (!centerData?.id || !token) {
      setAllGroupsData([]);
      return;
    }
    const fetchAllGroupsForCenter = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/centers-app/groups/?center=${centerData.id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
          console.error(`[CenterStudentsPage] Failed to fetch groups for center ${centerData.id} status:`, response.status);
          setAllGroupsData([]);
          return;
        }
        const data = await response.json();
        setAllGroupsData(Array.isArray(data) ? data : (data.results || []));
      } catch (err) {
        console.error(`[CenterStudentsPage] Error fetching groups for center ${centerData.id}:`, err);
        setAllGroupsData([]);
      }
    };
    fetchAllGroupsForCenter();
  }, [centerData, token]);

  const getProgramNameById = (programId: string | number | undefined | null): string => {
    if (programId === null || programId === undefined) return 'N/A';
    const program = allProgramsData.find(p => p.id.toString() === programId.toString());
    return program ? program.name : t('centerStudentsPage.unknownProgram');
  };

  const getGroupNameById = (groupId: string | number | undefined | null): string => {
    if (groupId === null || groupId === undefined) return t('centerStudentsPage.noGroup'); // Consistent with existing noGroup text
    const group = allGroupsData.find(g => g.id.toString() === groupId.toString());
    return group ? group.name : t('centerStudentsPage.unknownGroup');
  };

  // Get unique programs and groups for filters
  const uniquePrograms = [
    ...new Set(
      students.map(student => student.program).filter(p => typeof p === 'string' && p.trim() !== '')
    )
  ].sort();
  const uniqueGroups = [
    ...new Set(
      students.map(student => student.group).filter(g => typeof g === 'string' && g.trim() !== '')
    )
  ].sort();

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.exam_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProgram = !selectedProgram || String(student.program) === String(selectedProgram);
    const matchesGroup = !selectedGroup || String(student.group) === String(selectedGroup);
    
    return matchesSearch && matchesProgram && matchesGroup;
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    console.log('[CenterStudentsPage] fetchData initiated');
    if (!user?.id) {
      console.error('[CenterStudentsPage] Access Denied: User ID not found.');
      setError(t('centerStudentsPage.accessDenied'));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setStudents([]);

    if (!token) {
      console.error('[CenterStudentsPage] Auth Error: Token not available.');
      setError(t('centerStudentsPage.errorAuthNotAvailable'));
      setLoading(false);
      return;
    }

    try {
      console.log(`[CenterStudentsPage] Fetching center for supervisor ID: ${user.id}`);
      const supervisedCentersResponse = await fetch(`http://localhost:8000/api/centers-app/centers/?supervisor=${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      console.log('[CenterStudentsPage] Supervisor centers response status:', supervisedCentersResponse.status);

      if (!supervisedCentersResponse.ok) {
        const errorText = await supervisedCentersResponse.text();
        console.error('[CenterStudentsPage] Failed to fetch supervised center:', errorText);
        setError(t('centerStudentsPage.noCenterAssigned'));
        throw new Error('Failed to fetch supervised center');
      }

      const supervisedCentersData = await supervisedCentersResponse.json();
      console.log('[CenterStudentsPage] Supervised centers data received:', supervisedCentersData);
      const centers = Array.isArray(supervisedCentersData) ? supervisedCentersData : supervisedCentersData.results || [];

      if (centers.length === 0) {
        console.warn('[CenterStudentsPage] Supervisor is not assigned to any center.');
        setError(t('centerStudentsPage.noCenterAssigned'));
        setLoading(false);
        return;
      }
      
      const currentCenter = centers[0] as Center;
      setCenterData(currentCenter);
      console.log('[CenterStudentsPage] Current center set:', currentCenter);

      if (!currentCenter.id) {
        console.error('[CenterStudentsPage] Current center ID is missing!');
        setError(t('centerStudentsPage.errorFetchingDetail'));
        setLoading(false);
        return;
      }

      console.log(`[CenterStudentsPage] Fetching students for center ID: ${currentCenter.id}`);
      // Fetch all students in one request by requesting a large page_size
      const studentsResponse = await fetch(`http://localhost:8000/api/students/students/?center=${currentCenter.id}&page_size=1000`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('[CenterStudentsPage] Students response status (for center):', studentsResponse.status);

      if (!studentsResponse.ok) {
        const errorText = await studentsResponse.text();
        console.error('[CenterStudentsPage] Failed to fetch students for center ${currentCenter.id}: ', errorText);
        setError(t('centerStudentsPage.errorFetchingStudentsForCenter', { centerName: currentCenter.name })); 
        throw new Error('Failed to fetch students for center');
      }

      const studentsData = await studentsResponse.json();
      console.log('[CenterStudentsPage] Students data received (for center):', studentsData);
      let allStudentsRaw: Student[] = []; // Explicitly type
      if (Array.isArray(studentsData)) {
        allStudentsRaw = studentsData;
      } else if (studentsData && studentsData.results) {
        allStudentsRaw = studentsData.results;
      }
      
      // Filter students to only include those whose user is active
      const activeStudents = allStudentsRaw.filter(student => student.user && student.user.is_active === true);
      
      setStudents(activeStudents);
      console.log('[CenterStudentsPage] Processed and set active students (for center):', activeStudents);
      if (activeStudents.length === 0) {
        console.log('[CenterStudentsPage] No active students found in center:', currentCenter.name);
      }

    } catch (err) {
      console.error('[CenterStudentsPage] General error in fetchData:', err);
      if (!error) {
          setError(t('centerStudentsPage.errorFetchingDetail'));
      }
    } finally {
      console.log('[CenterStudentsPage] fetchData finished.');
      setLoading(false);
    }
  };

  const handleEditStudent = (studentId: number) => {
    navigate(`/center/students/edit/${studentId}`);
  };

  const handleViewStudentDetails = (studentId: number) => {
    navigate(`/center/students/${studentId}`);
  };

  const handleDeactivateStudent = async (studentId: number) => {
    // Confirmation dialog
    if (!window.confirm(t('centerStudentsPage.actions.confirmDeactivate'))) {
      return;
    }

    if (!token) {
      setError(t('centerStudentsPage.errorAuthNotAvailable'));
      console.error('[CenterStudentsPage] Deactivate failed: Auth token not available.');
      return;
    }

    try {
      const payload = { user: { is_active: false } }; // Payload for deactivation

      const response = await fetch(`http://localhost:8000/api/students/students/${studentId}/`, {
        method: 'PATCH', // Changed to PATCH
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json', // Added Content-Type for PATCH
        },
        body: JSON.stringify(payload), // Send payload as JSON
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to deactivate student. The server did not provide a specific error message.' }));
        const errorMessage = errorData.detail || `Failed to deactivate student. Status: ${response.status}`;
        console.error('[CenterStudentsPage] Deactivate failed:', errorMessage);
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      setStudents(prevStudents => prevStudents.filter(student => student.id !== studentId));
      console.log(`[CenterStudentsPage] Student ${studentId} deactivated successfully (user.is_active set to false).`);

    } catch (err) {
      console.error('[CenterStudentsPage] Error during student deactivation:', err);
      if (!(err instanceof Error && err.message.startsWith('Failed to deactivate student'))) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred while deactivating the student.');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Generate PDF of current filtered students list
  const handleDownloadPDF = () => {
    // Use built-in SiyamRuqa font for Arabic support
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });

    // Header
    const pageWidth = doc.internal.pageSize.getWidth();
    const title = `${t('centerStudentsPage.pdfTitle', 'Students List')} - ${centerData?.name || ''}`;
    doc.setFontSize(14);
    doc.text(title, pageWidth / 2, 40, { align: 'center' });

    // Table data
    const head = [[
      t('centerStudentsPage.tableHeaders.student'),
      t('centerStudentsPage.tableHeaders.examId'),
      t('centerStudentsPage.tableHeaders.program'),
      t('centerStudentsPage.tableHeaders.group'),
      t('centerStudentsPage.tableHeaders.academicYear'),
      t('centerStudentsPage.tableHeaders.joiningDate'),
    ]];

    const body = filteredStudents.map((s) => [
      `${s.user.first_name} ${s.user.last_name}`,
      s.exam_id,
      getProgramNameById(s.program),
      s.group ? getGroupNameById(s.group) : t('centerStudentsPage.noGroup'),
      s.academic_year,
      formatDate(s.joining_date),
    ]);

    autoTable(doc, {
      head,
      body,
      startY: 60,
      styles: { fontSize: 8, cellPadding: 4, font: 'SiyamRuqa' },
      headStyles: { fillColor: [60, 141, 188] },
      didDrawPage: () => {
        // Footer with page number
        doc.setFontSize(8);
        const str = `${t('centerStudentsPage.page', 'Page')} ${doc.internal.getNumberOfPages()}`;
        doc.text(str, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
      },
      margin: { top: 60 },
    });

    doc.save('students_list.pdf');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-3 md:p-4">
        <div className="flex justify-center items-center py-10">
          <span className="text-sm md:text-base">{t('centerStudentsPage.loadingMessage')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-3 md:p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600 text-lg md:text-xl">
              {centerData ? t('centerStudentsPage.noStudentsTitle', { centerName: centerData.name }) : t('centerStudentsPage.noCenterDataTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm md:text-base">
              {centerData ? t('centerStudentsPage.noStudentsDescription') : t('centerStudentsPage.noCenterDataDescription')}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!centerData) {
    return (
      <div className="container mx-auto p-3 md:p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600 text-lg md:text-xl">{t('centerStudentsPage.noCenterDataTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm md:text-base">{t('centerStudentsPage.noCenterDataDescription')}</p>
            <p className="text-muted-foreground text-sm md:text-base">{t('centerStudentsPage.noCenterAssigned')}</p> 
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-3 md:p-4 space-y-4 md:space-y-6">
      <div className="flex flex-col gap-3 md:gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl md:text-3xl font-bold break-words leading-tight">{t('centerStudentsPage.pageTitle', { centerName: centerData.name })}</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              {t('centerStudentsPage.pageSubtitle', { count: filteredStudents.length })}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Link to="add" className="w-full sm:w-auto">
              <Button className="flex items-center justify-center gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                <span className="sm:inline">{t('centerStudentsPage.addNewStudentButton')}</span>
              </Button>
            </Link>
            <Link to="bulk-import" className="w-full sm:w-auto">
              <Button variant="outline" className="flex items-center justify-center gap-2 w-full sm:w-auto">
                <FileSpreadsheet className="h-4 w-4" />
                <span className="sm:inline">{t('centerStudentsPage.bulkImportButton')}</span>
              </Button>
            </Link>
            <Button variant="secondary" onClick={handleDownloadPDF} className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4" />
              {t('centerStudentsPage.downloadPdf')}
            </Button>
          </div>
        </div>
      </div>

      <Card className="w-full">
        <CardContent className="pt-4 md:pt-6">
          <div className="space-y-3 md:space-y-0 md:flex md:flex-row md:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t('centerStudentsPage.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-none md:flex gap-3 md:gap-4">
              <Select 
                value={selectedProgram === '' ? ALL_PROGRAMS_VALUE : selectedProgram}
                onValueChange={(value) => setSelectedProgram(value === ALL_PROGRAMS_VALUE ? '' : value)}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder={t('centerStudentsPage.filterByProgram')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_PROGRAMS_VALUE}>{t('centerStudentsPage.allPrograms')}</SelectItem>
                  {allProgramsData.map((program) => (
                    <SelectItem key={`program-${program.id}`} value={program.id.toString()}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select 
                value={selectedGroup === '' ? ALL_GROUPS_VALUE : selectedGroup}
                onValueChange={(value) => setSelectedGroup(value === ALL_GROUPS_VALUE ? '' : value)}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder={t('centerStudentsPage.filterByGroup')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_GROUPS_VALUE}>{t('centerStudentsPage.allGroups')}</SelectItem>
                  {allGroupsData.map((group) => (
                    <SelectItem key={`group-${group.id}`} value={group.id.toString()}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('centerStudentsPage.studentsListTitle')} ({filteredStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredStudents.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || selectedProgram || selectedGroup 
                  ? t('centerStudentsPage.noStudentsMatchFilter')
                  : t('centerStudentsPage.noStudentsFound')}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('centerStudentsPage.tableHeaders.student')}</TableHead>
                    <TableHead>{t('centerStudentsPage.tableHeaders.examId')}</TableHead>
                    <TableHead>{t('centerStudentsPage.tableHeaders.program')}</TableHead>
                    <TableHead>{t('centerStudentsPage.tableHeaders.group')}</TableHead>
                    <TableHead>{t('centerStudentsPage.tableHeaders.academicYear')}</TableHead>
                    <TableHead>{t('centerStudentsPage.tableHeaders.joiningDate')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.user.first_name} {student.user.last_name}</TableCell>
                      <TableCell>{student.exam_id}</TableCell>
                      <TableCell>{getProgramNameById(student.program)}</TableCell>
                      <TableCell>{student.group ? getGroupNameById(student.group) : t('centerStudentsPage.noGroup')}</TableCell>
                      <TableCell>{student.academic_year}</TableCell>
                      <TableCell>{formatDate(student.joining_date)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CenterStudentsPage;