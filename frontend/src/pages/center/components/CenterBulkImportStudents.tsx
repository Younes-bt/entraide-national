import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { Upload, Download, FileSpreadsheet, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

interface BulkImportResult {
  total_rows: number;
  successful: number;
  failed: number;
  errors: string[];
}

interface TrainingProgram {
  id: string | number;
  name: string;
}

interface TrainingCourse {
  id: string | number;
  name: string;
}

interface Group {
  id: string | number;
  name: string;
}

interface Center {
  id: string | number;
  name: string;
}

const CenterBulkImportStudents: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState<BulkImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Dropdown states
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedTrainingCourse, setSelectedTrainingCourse] = useState<string>('');

  // Data for dropdowns
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [trainingCourses, setTrainingCourses] = useState<TrainingCourse[]>([]);

  // Added: keep track of supervisor's center so we can fetch groups/courses correctly
  const [currentCenter, setCurrentCenter] = useState<Center | null>(null);
  const [loadingCenter, setLoadingCenter] = useState(false);

  // Loading states
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const token = localStorage.getItem('accessToken');

  // Fetch training programs
  const fetchPrograms = async () => {
    if (!token) return;
    
    setLoadingPrograms(true);
    try {
      // Use the same endpoint as the Add-New-Student page
      const response = await fetch('http://localhost:8000/api/programs/trainingprogrames/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setPrograms(Array.isArray(data) ? data : data.results || []);
      }
    } catch (err) {
      console.error('Failed to fetch programs:', err);
    } finally {
      setLoadingPrograms(false);
    }
  };

  // Fetch the current center supervised by the logged-in user
  const fetchCurrentCenter = async () => {
    if (!user?.id || !token) return;

    setLoadingCenter(true);
    try {
      const response = await fetch(`http://localhost:8000/api/centers-app/centers/?supervisor=${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        const centers = Array.isArray(data) ? data : data.results || [];
        if (centers.length > 0) {
          setCurrentCenter(centers[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch supervised center:', err);
    } finally {
      setLoadingCenter(false);
    }
  };

  // Fetch groups for the center
  const fetchGroups = async (centerId: string | number) => {
    if (!token || !centerId) return;

    setLoadingGroups(true);
    try {
      const response = await fetch(`http://localhost:8000/api/centers-app/groups/?center=${centerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGroups(Array.isArray(data) ? data : data.results || []);
      }
    } catch (err) {
      console.error('Failed to fetch groups:', err);
    } finally {
      setLoadingGroups(false);
    }
  };

  // Fetch training courses for selected program
  const fetchTrainingCourses = async (programId: string) => {
    if (!token || !programId || !currentCenter?.id) return;

    setLoadingCourses(true);
    try {
      const response = await fetch(`http://localhost:8000/api/programs/trainingcourses/?program=${programId}&center=${currentCenter.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTrainingCourses(Array.isArray(data) ? data : data.results || []);
      }
    } catch (err) {
      console.error('Failed to fetch training courses:', err);
    } finally {
      setLoadingCourses(false);
    }
  };

  // Effect to load initial data: fetch center and programs
  useEffect(() => {
    fetchPrograms();
    fetchCurrentCenter();
  }, [token]);

  // Once we have the center, fetch its groups
  useEffect(() => {
    if (currentCenter?.id) {
      fetchGroups(currentCenter.id);
    }
  }, [currentCenter]);

  // Effect to load training courses when program changes
  useEffect(() => {
    if (selectedProgram) {
      fetchTrainingCourses(selectedProgram);
    } else {
      setTrainingCourses([]);
    }
  }, [selectedProgram, currentCenter]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        setError(t('bulkImport.errors.invalidFileType'));
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError(t('bulkImport.errors.fileTooLarge'));
        return;
      }
      
      setSelectedFile(file);
      setError(null);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !token) {
      setError(t('bulkImport.errors.noFileSelected'));
      return;
    }

    if (!selectedProgram) {
      setError(t('bulkImport.errors.noProgramSelected'));
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('program_id', selectedProgram);
    
    if (selectedGroup) {
      formData.append('group_id', selectedGroup);
    }
    
    if (selectedTrainingCourse) {
      formData.append('training_course_id', selectedTrainingCourse);
    }

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const response = await fetch('http://localhost:8000/api/students/students/bulk_import/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || t('bulkImport.errors.uploadFailed'));
      }

      const resultData: BulkImportResult = await response.json();
      setResult(resultData);
      
      // Reset file selection after successful upload
      setSelectedFile(null);
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (err) {
      setError(err instanceof Error ? err.message : t('bulkImport.errors.uploadFailed'));
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  const downloadTemplate = () => {
    // Create a proper Excel template with headers and sample data
    // (*) indicates required fields - program, group, training are now selected via dropdowns
    const headers = [
      'first_name*',
      'last_name*', 
      'arabic_first_name',
      'arabic_last_name',
      'academic_year*',
      'joining_date',
      'cin_id',
      'phone_number',
      'birth_date',
      'birth_city',
      'address',
      'city'
    ];
    
    const sampleData = [
      'Younes',
      'El bettate',
      'يونس',
      'البتات',
      '2024-2025',
      '2024-09-01',
      'AB123456',
      '0600000000',
      '1990-01-01',
      'Casablanca',
      '123 Main St',
      'Casablanca'
    ];

    // Create worksheet data (array of arrays)
    const worksheetData = [
      headers,        // Header row
      sampleData      // Sample row
    ];

    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths for better readability
    const columnWidths = [
      { wch: 15 }, // first_name
      { wch: 15 }, // last_name
      { wch: 20 }, // arabic_first_name
      { wch: 20 }, // arabic_last_name
      { wch: 15 }, // academic_year
      { wch: 15 }, // joining_date
      { wch: 12 }, // cin_id
      { wch: 15 }, // phone_number
      { wch: 15 }, // birth_date
      { wch: 15 }, // birth_city
      { wch: 20 }, // address
      { wch: 15 }  // city
    ];
    worksheet['!cols'] = columnWidths;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students Template');

    // Save the file
    XLSX.writeFile(workbook, 'students_bulk_import_template.xlsx');
  };

  if (!user) {
    return <p>{t('bulkImport.authRequired')}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6" />
            {t('bulkImport.title')}
          </CardTitle>
          <CardDescription>
            {t('bulkImport.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Download Template Section */}
          <div className="border rounded-lg p-4 bg-blue-50">
            <h3 className="font-semibold text-blue-900 mb-2">
              {t('bulkImport.template.title')}
            </h3>
            <p className="text-blue-700 text-sm mb-3">
              {t('bulkImport.template.description')}
            </p>
            <Button variant="outline" onClick={downloadTemplate} className="border-blue-200 text-blue-800 hover:bg-blue-100">
              <Download className="h-4 w-4 mr-2" />
              {t('bulkImport.template.download')}
            </Button>
          </div>

          {/* Assignment Section */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold text-gray-900 mb-2">
              {t('bulkImport.assignment.title')}
            </h3>
            <p className="text-gray-700 text-sm mb-4">
              {t('bulkImport.assignment.description')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Training Program Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="program-select" className="text-sm font-medium">
                  {t('bulkImport.assignment.program')} *
                </Label>
                <Select value={selectedProgram} onValueChange={setSelectedProgram} disabled={loadingPrograms}>
                  <SelectTrigger id="program-select">
                    <SelectValue placeholder={loadingPrograms ? t('common.loading') : t('bulkImport.assignment.selectProgram')} />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map((program) => (
                      <SelectItem key={program.id} value={program.id.toString()}>
                        {program.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Group Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="group-select" className="text-sm font-medium">
                  {t('bulkImport.assignment.group')} ({t('common.optional')})
                </Label>
                <Select value={selectedGroup} onValueChange={setSelectedGroup} disabled={loadingGroups}>
                  <SelectTrigger id="group-select">
                    <SelectValue placeholder={loadingGroups ? t('common.loading') : t('bulkImport.assignment.selectGroup')} />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id.toString()}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Training Course Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="course-select" className="text-sm font-medium">
                  {t('bulkImport.assignment.trainingCourse')} ({t('common.optional')})
                </Label>
                <Select 
                  value={selectedTrainingCourse} 
                  onValueChange={setSelectedTrainingCourse} 
                  disabled={loadingCourses || !selectedProgram}
                >
                  <SelectTrigger id="course-select">
                    <SelectValue placeholder={
                      !selectedProgram 
                        ? t('bulkImport.assignment.selectProgramFirst')
                        : loadingCourses 
                        ? t('common.loading') 
                        : t('bulkImport.assignment.selectCourse')
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {trainingCourses.map((course) => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="file-upload" className="text-base font-semibold">
                {t('bulkImport.selectFile')}
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                {t('bulkImport.fileRequirements')}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  id="file-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                />
              </div>
              
              <Button 
                onClick={handleUpload} 
                disabled={!selectedFile || isUploading}
                className="min-w-[120px]"
              >
                {isUploading ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                    {t('bulkImport.uploading')}
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    {t('bulkImport.upload')}
                  </>
                )}
              </Button>
            </div>

            {selectedFile && (
              <div className="text-sm text-muted-foreground">
                {t('bulkImport.selectedFile')}: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {isUploading && uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t('bulkImport.progress')}</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>{t('bulkImport.error')}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Results Display */}
          {result && (
            <div className="space-y-4">
              <Alert variant={result.failed === 0 ? "default" : "destructive"}>
                {result.failed === 0 ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {result.failed === 0 ? t('bulkImport.success') : t('bulkImport.partialSuccess')}
                </AlertTitle>
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="flex gap-4">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {t('bulkImport.results.total')}: {result.total_rows}
                      </Badge>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {t('bulkImport.results.successful')}: {result.successful}
                      </Badge>
                      {result.failed > 0 && (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          {t('bulkImport.results.failed')}: {result.failed}
                        </Badge>
                      )}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>

              {/* Error Details */}
              {result.errors.length > 0 && (
                <div className="border rounded-lg p-4 bg-red-50 max-h-60 overflow-y-auto">
                  <h4 className="font-semibold text-red-900 mb-2">
                    {t('bulkImport.errorDetails')}
                  </h4>
                  <ul className="space-y-1 text-sm text-red-700">
                    {result.errors.map((error, index) => (
                      <li key={index} className="font-mono">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => navigate(-1)}>
              {t('common.back')}
            </Button>
            {result && result.successful > 0 && (
              <Button onClick={() => navigate('/center/students')}>
                {t('bulkImport.viewStudents')}
              </Button>
            )}
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default CenterBulkImportStudents; 