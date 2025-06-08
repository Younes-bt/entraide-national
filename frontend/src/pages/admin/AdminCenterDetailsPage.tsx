import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft, Edit, Trash2, Eye, ExternalLink, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Equipment interface
interface Equipment {
  id: number;
  name: string;
  description?: string;
  quantity?: number;
  is_functional?: boolean;
  condition?: 'new' | 'excellent' | 'good' | 'fair' | 'need_reparation' | 'damaged';
}

// Room interface
interface Room {
  id: number;
  name: string;
  description?: string;
  type?: 'classroom' | 'meeting_room' | 'auditorium' | 'lab' | 'other';
  capacity?: number;
  is_available?: boolean;
  picture?: string | null;
  picture_url?: string | null;
  equipments?: Equipment[];
  created_at?: string;
  updated_at?: string;
}

// Group interface
interface Group {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// Student interface
interface Student {
  id: number;
  exam_id: string;
  center_code?: string;
  academic_year: string;
  joining_date: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    is_active: boolean;
  };
  program: number;
  program_name: string;
  training_course?: number;
  group?: number;
  created_at: string;
  updated_at: string;
}

// Teacher interface
interface Teacher {
  id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    is_active: boolean;
  };
  center: number;
  program: number;
  program_name: string;
  contarct_with: 'entraide' | 'association';
  contract_start_date: string;
  contract_end_date: string;
  created_at: string;
  updated_at: string;
}

// Center interface
interface Center {
  id: string | number;
  name: string;
  description?: string;
  logo?: string;
  logo_url?: string;
  phone_number?: string;
  email?: string;
  address?: string;
  city?: string;
  maps_link?: string;
  website?: string;
  facebook_link?: string;
  instagram_link?: string;
  twitter_link?: string;
  association?: number | string | null;
  association_name?: string;
  affiliated_to: 'entraide' | 'association' | 'other' | string;
  other_affiliation?: string;
  is_active?: boolean;
  is_verified?: boolean;
  supervisor?: number | string | null;
  supervisor_username?: string;
  supervisor_first_name?: string;
  supervisor_last_name?: string;
  rooms?: Room[];
  groups?: Group[];
  created_at?: string;
  updated_at?: string;
}

const AdminCenterDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const { centerId } = useParams<{ centerId: string }>();
  const navigate = useNavigate();
  const auth = useAuth();
  const userAccessToken = auth.accessToken;

  const [center, setCenter] = useState<Center | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [studentsLoading, setStudentsLoading] = useState<boolean>(false);
  const [teachersLoading, setTeachersLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Students search and filter states
  const [studentSearchTerm, setStudentSearchTerm] = useState<string>('');
  const [studentStatusFilter, setStudentStatusFilter] = useState<string>('all');
  const [studentProgramFilter, setStudentProgramFilter] = useState<string>('all');
  
  // Trainers search and filter states
  const [trainerSearchTerm, setTrainerSearchTerm] = useState<string>('');
  const [trainerStatusFilter, setTrainerStatusFilter] = useState<string>('all');
  const [trainerContractFilter, setTrainerContractFilter] = useState<string>('all');
  const [trainerProgramFilter, setTrainerProgramFilter] = useState<string>('all');

  const fetchStudents = async () => {
    if (!centerId || !userAccessToken) return;
    
    try {
      setStudentsLoading(true);
      const url = `http://localhost:8000/api/students/students/?center=${centerId}`;
      console.log('Fetching students from URL:', url);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userAccessToken}`,
        },
      });

      console.log('Students response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Students API error:', errorText);
        throw new Error('Failed to fetch students');
      }

      const data = await response.json();
      console.log('Students API response:', data);
      console.log('Students array length:', Array.isArray(data) ? data.length : (data.results?.length || 0));
      
      setStudents(Array.isArray(data) ? data : data.results || []);
    } catch (err: any) {
      console.error('Error fetching students:', err);
    } finally {
      setStudentsLoading(false);
    }
  };

  const fetchTeachers = async () => {
    if (!centerId || !userAccessToken) return;
    
    try {
      setTeachersLoading(true);
      const url = `http://localhost:8000/api/teachers/teachers/?center=${centerId}`;
      console.log('Fetching teachers from URL:', url);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userAccessToken}`,
        },
      });

      console.log('Teachers response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Teachers API error:', errorText);
        throw new Error('Failed to fetch teachers');
      }

      const data = await response.json();
      console.log('Teachers API response:', data);
      console.log('Teachers array length:', Array.isArray(data) ? data.length : (data.results?.length || 0));
      
      setTeachers(Array.isArray(data) ? data : data.results || []);
    } catch (err: any) {
      console.error('Error fetching teachers:', err);
    } finally {
      setTeachersLoading(false);
    }
  };

  useEffect(() => {
    const fetchCenterDetails = async () => {
      if (!centerId) {
        setError(t('adminCenterDetailsPage.errorNoCenterId', 'Center ID not provided'));
        setLoading(false);
        return;
      }

      if (!userAccessToken) {
        setError(t('adminCenterDetailsPage.errorAuthRequired', 'Authentication required'));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/centers-app/centers/${centerId}/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userAccessToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch center details' }));
          throw new Error(errorData.detail || 'Failed to fetch center details');
        }

        const data = await response.json();
        setCenter(data);
        setError(null);
        
        // Add user info logging
        console.log('Current user from auth context:', auth.user);
        
        // Auto-load students and teachers data
        await Promise.all([
          fetchStudents(),
          fetchTeachers()
        ]);
        
      } catch (err: any) {
        console.error('Error fetching center details:', err);
        setError(err.message || t('adminCenterDetailsPage.errorFetchingDetails', 'Failed to fetch center details'));
      } finally {
        setLoading(false);
      }
    };

    fetchCenterDetails();
  }, [centerId, userAccessToken, t, auth.user]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAffiliationDisplay = (center: Center): string => {
    if (center.affiliated_to === 'other' && center.other_affiliation) {
      return center.other_affiliation;
    }
    const affiliationMap: { [key: string]: string } = {
      'entraide': t('adminCentersPage.affiliationEntraide', 'Entraide National'),
      'association': center.association_name || t('adminCentersPage.affiliationAssociation', 'Association'),
    };
    return affiliationMap[center.affiliated_to] || center.affiliated_to;
  };

  const handleEdit = () => {
    if (center) {
      navigate(`/admin/centers/edit/${center.id}`);
    }
  };

  const handleDelete = async () => {
    if (!center) return;
    
    if (window.confirm(t('adminCenterDetailsPage.confirmDelete', `Are you sure you want to delete "${center.name}"? This action cannot be undone.`))) {
      try {
        // TODO: Implement actual delete API call
        console.warn(`Delete center ${center.id}`);
        alert('Delete functionality to be implemented.');
        // navigate('/admin/centers');
      } catch (delErr: any) {
        setError(t('adminCenterDetailsPage.errorDeleting', 'Failed to delete center'));
      }
    }
  };

  // Filter students based on search term and filters
  const filteredStudents = students.filter(student => {
    const matchesSearchTerm = studentSearchTerm === '' || 
      student.user.first_name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
      student.user.last_name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
      student.user.email.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
      student.exam_id.toLowerCase().includes(studentSearchTerm.toLowerCase());
    
    const matchesStatus = studentStatusFilter === 'all' ||
      (studentStatusFilter === 'active' && student.user.is_active) ||
      (studentStatusFilter === 'inactive' && !student.user.is_active);
    
    const matchesProgram = studentProgramFilter === 'all' ||
      student.program.toString() === studentProgramFilter;
    
    return matchesSearchTerm && matchesStatus && matchesProgram;
  });

  // Get unique programs for filter dropdown
  const uniquePrograms = Array.from(new Set(students.map(student => student.program)))
    .map(programId => {
      const student = students.find(s => s.program === programId);
      return { id: programId, name: student?.program_name || `Program ${programId}` };
    });

  // Filter trainers based on search term and filters
  const filteredTrainers = teachers.filter(teacher => {
    const matchesSearchTerm = trainerSearchTerm === '' || 
      teacher.user.first_name.toLowerCase().includes(trainerSearchTerm.toLowerCase()) ||
      teacher.user.last_name.toLowerCase().includes(trainerSearchTerm.toLowerCase()) ||
      teacher.user.email.toLowerCase().includes(trainerSearchTerm.toLowerCase());
    
    const matchesStatus = trainerStatusFilter === 'all' ||
      (trainerStatusFilter === 'active' && teacher.user.is_active) ||
      (trainerStatusFilter === 'inactive' && !teacher.user.is_active);
    
    const matchesContract = trainerContractFilter === 'all' ||
      teacher.contarct_with === trainerContractFilter;
    
    const matchesProgram = trainerProgramFilter === 'all' ||
      teacher.program.toString() === trainerProgramFilter;
    
    return matchesSearchTerm && matchesStatus && matchesContract && matchesProgram;
  });

  // Get unique programs for trainers filter dropdown
  const uniqueTrainerPrograms = Array.from(new Set(teachers.map(teacher => teacher.program)))
    .map(programId => {
      const teacher = teachers.find(t => t.program === programId);
      return { id: programId, name: teacher?.program_name || `Program ${programId}` };
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-lg">{t('adminCenterDetailsPage.loadingDetails', 'Loading center details...')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertTitle>{t('login_details.errorTitle', 'Error')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => navigate('/admin/centers')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('adminCenterDetailsPage.backToCenters', 'Back to Centers')}
        </Button>
      </div>
    );
  }

  if (!center) {
    return (
      <div className="container mx-auto p-4">
        <Alert>
          <AlertTitle>{t('adminCenterDetailsPage.centerNotFoundTitle', 'Center Not Found')}</AlertTitle>
          <AlertDescription>{t('adminCenterDetailsPage.centerNotFoundDescription', 'The requested center could not be found.')}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => navigate('/admin/centers')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('adminCenterDetailsPage.backToCenters', 'Back to Centers')}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Back Button */}
      <Button variant="outline" onClick={() => navigate('/admin/centers')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('adminCenterDetailsPage.backToCenters', 'Back to Centers')}
      </Button>

      {/* Header Card */}
      <Card>
        <CardHeader className="flex flex-col items-center text-center space-y-4 pb-2">
          <Avatar className="h-24 w-24">
            <AvatarImage src={center.logo_url || center.logo || undefined} alt={center.name} />
            <AvatarFallback className="text-2xl font-bold">{center.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-3xl font-bold">{center.name}</CardTitle>
            <CardDescription className="text-lg">
              {center.city && `${center.city} • `}
              {getAffiliationDisplay(center)}
            </CardDescription>
          </div>
          
          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 justify-center">
            {center.is_active !== undefined && (
              <Badge variant={center.is_active ? "default" : "destructive"}>
                {center.is_active ? t('adminCentersPage.statusActive', 'Active') : t('adminCentersPage.statusInactive', 'Inactive')}
              </Badge>
            )}
            {center.is_verified !== undefined && (
              <Badge variant={center.is_verified ? "secondary" : "outline"}>
                {center.is_verified ? t('adminCentersPage.verifiedOnly', 'Verified') : t('adminCentersPage.unverifiedOnly', 'Unverified')}
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              {t('adminCenterDetailsPage.editCenter', 'Edit Center')}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              {t('adminCenterDetailsPage.deleteCenter', 'Delete Center')}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-2 text-center"> 
          {center.description && (
            <p className="text-muted-foreground mb-4">{center.description}</p>
          )}
        </CardContent>
      </Card>

      {/* General Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t('adminCenterDetailsPage.generalInfo.title', 'General Information')}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                {t('adminCenterDetailsPage.generalInfo.basicInfo', 'Basic Information')}
              </h4>
              <div className="space-y-2">
                <div><strong>{t('adminCenterDetailsPage.generalInfo.id', 'ID')}:</strong> {center.id}</div>
                <div><strong>{t('adminCenterDetailsPage.generalInfo.affiliation', 'Affiliation')}:</strong> {getAffiliationDisplay(center)}</div>
                {center.association_name && (
                  <div><strong>{t('adminCenterDetailsPage.generalInfo.association', 'Association')}:</strong> {center.association_name}</div>
                )}
                {center.affiliated_to === 'other' && center.other_affiliation && (
                  <div><strong>{t('adminCenterDetailsPage.generalInfo.otherAffiliation', 'Other Affiliation')}:</strong> {center.other_affiliation}</div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                {t('adminCenterDetailsPage.generalInfo.supervisor', 'Supervisor')}
              </h4>
              <div className="space-y-2">
                {center.supervisor_first_name && center.supervisor_last_name ? (
                  <div><strong>{t('adminCenterDetailsPage.generalInfo.supervisorName', 'Name')}:</strong> {center.supervisor_first_name} {center.supervisor_last_name}</div>
                ) : null}
                {center.supervisor_username && (
                  <div><strong>{t('adminCenterDetailsPage.generalInfo.supervisorUsername', 'Username')}:</strong> {center.supervisor_username}</div>
                )}
                {!center.supervisor_first_name && !center.supervisor_last_name && !center.supervisor_username && (
                  <div className="text-muted-foreground">{t('adminCenterDetailsPage.generalInfo.noSupervisor', 'No supervisor assigned')}</div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                {t('adminCenterDetailsPage.generalInfo.statistics', 'Statistics')}
              </h4>
              <div className="space-y-2">
                <div><strong>{t('adminCenterDetailsPage.generalInfo.roomsCount', 'Rooms')}:</strong> {center.rooms?.length || 0}</div>
                <div><strong>{t('adminCenterDetailsPage.generalInfo.groupsCount', 'Groups')}:</strong> {center.groups?.length || 0}</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                {t('adminCenterDetailsPage.generalInfo.timestamps', 'Timestamps')}
              </h4>
              <div className="space-y-2">
                <div><strong>{t('adminCenterDetailsPage.generalInfo.createdAt', 'Created')}:</strong> {formatDate(center.created_at)}</div>
                <div><strong>{t('adminCenterDetailsPage.generalInfo.updatedAt', 'Last Updated')}:</strong> {formatDate(center.updated_at)}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact & Links Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t('adminCenterDetailsPage.contact.title', 'Contact Information & Links')}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
              {t('adminCenterDetailsPage.contact.contactInfo', 'Contact Information')}
            </h4>
            <div className="space-y-3">
              <div>
                <strong>{t('adminCenterDetailsPage.contact.email', 'Email')}:</strong>
                {center.email ? (
                  <a href={`mailto:${center.email}`} className="ml-2 text-blue-600 hover:underline">
                    {center.email}
                  </a>
                ) : (
                  <span className="ml-2 text-muted-foreground">N/A</span>
                )}
              </div>
              <div>
                <strong>{t('adminCenterDetailsPage.contact.phone', 'Phone')}:</strong>
                {center.phone_number ? (
                  <a href={`tel:${center.phone_number}`} className="ml-2 text-blue-600 hover:underline">
                    {center.phone_number}
                  </a>
                ) : (
                  <span className="ml-2 text-muted-foreground">N/A</span>
                )}
              </div>
              <div>
                <strong>{t('adminCenterDetailsPage.contact.address', 'Address')}:</strong>
                <span className="ml-2">{center.address || 'N/A'}</span>
              </div>
              <div>
                <strong>{t('adminCenterDetailsPage.contact.city', 'City')}:</strong>
                <span className="ml-2">{center.city || 'N/A'}</span>
              </div>
              {center.maps_link && (
                <div>
                  <strong>{t('adminCenterDetailsPage.contact.location', 'Location')}:</strong>
                  <a href={center.maps_link} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline inline-flex items-center">
                    {t('adminCenterDetailsPage.contact.viewOnMap', 'View on Map')}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
              {t('adminCenterDetailsPage.contact.socialLinks', 'Website & Social Media')}
            </h4>
            <div className="space-y-3">
              {center.website && (
                <div>
                  <strong>{t('adminCenterDetailsPage.contact.website', 'Website')}:</strong>
                  <a href={center.website} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline inline-flex items-center">
                    {center.website}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              )}
              {center.facebook_link && (
                <div>
                  <strong>{t('adminCenterDetailsPage.contact.facebook', 'Facebook')}:</strong>
                  <a href={center.facebook_link} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline inline-flex items-center">
                    {t('adminCenterDetailsPage.contact.viewProfile', 'View Profile')}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              )}
              {center.instagram_link && (
                <div>
                  <strong>{t('adminCenterDetailsPage.contact.instagram', 'Instagram')}:</strong>
                  <a href={center.instagram_link} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline inline-flex items-center">
                    {t('adminCenterDetailsPage.contact.viewProfile', 'View Profile')}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              )}
              {center.twitter_link && (
                <div>
                  <strong>{t('adminCenterDetailsPage.contact.twitter', 'Twitter')}:</strong>
                  <a href={center.twitter_link} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline inline-flex items-center">
                    {t('adminCenterDetailsPage.contact.viewProfile', 'View Profile')}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              )}
              {!center.website && !center.facebook_link && !center.instagram_link && !center.twitter_link && (
                <div className="text-muted-foreground">{t('adminCenterDetailsPage.contact.noSocialLinks', 'No website or social media links available')}</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rooms Section */}
      <Card>
        <CardHeader>
          <CardTitle>Rooms ({center.rooms?.length || 0})</CardTitle>
          <CardDescription>{t('adminCenterDetailsPage.rooms.description', 'All rooms available in this center')}</CardDescription>
        </CardHeader>
        <CardContent>
          {center.rooms && center.rooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {center.rooms.map(room => (
                <Card 
                  key={room.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/admin/centers/details/${center.id}/rooms/${room.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{room.name}</CardTitle>
                      <Badge variant="outline">ID: {room.id}</Badge>
                    </div>
                    {room.type && (
                      <CardDescription>{t(`roomTypes.${room.type}`, room.type)}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {room.description && (
                      <p className="text-sm text-muted-foreground">{room.description}</p>
                    )}
                    <div className="text-sm space-y-1">
                      <div><strong>{t('adminCenterDetailsPage.rooms.capacity', 'Capacity')}:</strong> {room.capacity || 'N/A'}</div>
                      <div>
                        <strong>{t('adminCenterDetailsPage.rooms.available', 'Available')}:</strong>
                        <Badge variant={room.is_available ? "default" : "secondary"} className="ml-2">
                          {room.is_available ? t('common.yes', 'Yes') : t('common.no', 'No')}
                        </Badge>
                      </div>
                      {room.equipments && room.equipments.length > 0 && (
                        <div><strong>{t('adminCenterDetailsPage.rooms.equipment', 'Equipment')}:</strong> {room.equipments.length} {t('adminCenterDetailsPage.rooms.items', 'items')}</div>
                      )}
                    </div>
                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/centers/details/${center.id}/rooms/${room.id}`);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        {t('adminCenterDetailsPage.rooms.viewDetails', 'View Details')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t('adminCenterDetailsPage.rooms.noRooms', 'No rooms found for this center')}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Groups Section */}
      <Card>
        <CardHeader>
          <CardTitle>Groups ({center.groups?.length || 0})</CardTitle>
          <CardDescription>{t('adminCenterDetailsPage.groups.description', 'All student groups in this center')}</CardDescription>
        </CardHeader>
        <CardContent>
          {center.groups && center.groups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {center.groups.map(group => (
                <Card key={group.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <Badge variant="outline">ID: {group.id}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {group.description && (
                      <p className="text-sm text-muted-foreground">{group.description}</p>
                    )}
                    <div className="text-sm space-y-1">
                      <div><strong>{t('adminCenterDetailsPage.groups.createdAt', 'Created')}:</strong> {formatDate(group.created_at)}</div>
                      <div><strong>{t('adminCenterDetailsPage.groups.updatedAt', 'Updated')}:</strong> {formatDate(group.updated_at)}</div>
                    </div>
                    <div className="pt-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="mr-2 h-4 w-4" />
                        {t('adminCenterDetailsPage.groups.viewDetails', 'View Details')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t('adminCenterDetailsPage.groups.noGroups', 'No groups found for this center')}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Students Section */}
      <Card>
        <CardHeader>
          <CardTitle>Students ({filteredStudents.length})</CardTitle>
          <CardDescription>{t('adminCenterDetailsPage.students.description', 'All students enrolled in this center')}</CardDescription>
        </CardHeader>
        <CardContent>
          {studentsLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>{t('adminCenterDetailsPage.students.loading', 'Loading students...')}</span>
            </div>
          ) : students.length > 0 ? (
            <div className="space-y-4">
              {/* Search and Filter Section */}
              <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder={t('adminCenterDetailsPage.students.searchPlaceholder', 'Search by name, email, or exam ID...')}
                      value={studentSearchTerm}
                      onChange={(e) => setStudentSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={studentStatusFilter} onValueChange={setStudentStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('adminCenterDetailsPage.students.filterAll', 'All Status')}</SelectItem>
                      <SelectItem value="active">{t('adminCenterDetailsPage.students.filterActive', 'Active')}</SelectItem>
                      <SelectItem value="inactive">{t('adminCenterDetailsPage.students.filterInactive', 'Inactive')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={studentProgramFilter} onValueChange={setStudentProgramFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('adminCenterDetailsPage.students.filterAllPrograms', 'All Programs')}</SelectItem>
                      {uniquePrograms.map(program => (
                        <SelectItem key={program.id} value={program.id.toString()}>
                          {program.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Results summary */}
              {(studentSearchTerm || studentStatusFilter !== 'all' || studentProgramFilter !== 'all') && (
                <div className="text-sm text-muted-foreground">
                  {t('adminCenterDetailsPage.students.showingResults', 'Showing {{count}} of {{total}} students', {
                    count: filteredStudents.length,
                    total: students.length
                  })}
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">{t('adminCenterDetailsPage.students.examId', 'Exam ID')}</th>
                      <th className="text-left p-2 font-medium">{t('adminCenterDetailsPage.students.name', 'Name')}</th>
                      <th className="text-left p-2 font-medium">{t('adminCenterDetailsPage.students.email', 'Email')}</th>
                      <th className="text-left p-2 font-medium">{t('adminCenterDetailsPage.students.phone', 'Phone')}</th>
                      <th className="text-left p-2 font-medium">{t('adminCenterDetailsPage.students.program', 'Program')}</th>
                      <th className="text-left p-2 font-medium">{t('adminCenterDetailsPage.students.joiningDate', 'Joining Date')}</th>
                      <th className="text-left p-2 font-medium">{t('adminCenterDetailsPage.students.status', 'Status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map(student => (
                      <tr key={student.id} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-mono text-sm">{student.exam_id}</td>
                        <td className="p-2">{student.user.first_name} {student.user.last_name}</td>
                        <td className="p-2 text-sm text-muted-foreground">{student.user.email}</td>
                        <td className="p-2 text-sm">{student.user.phone_number || 'N/A'}</td>
                        <td className="p-2">{student.program_name}</td>
                        <td className="p-2">{new Date(student.joining_date).toLocaleDateString()}</td>
                        <td className="p-2">
                          <Badge variant={student.user.is_active ? "default" : "secondary"}>
                            {student.user.is_active ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t('adminCenterDetailsPage.students.noStudents', 'No students found for this center')}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trainers Section */}
      <Card>
        <CardHeader>
          <CardTitle>Trainers ({filteredTrainers.length})</CardTitle>
          <CardDescription>{t('adminCenterDetailsPage.trainers.description', 'All trainers working in this center')}</CardDescription>
        </CardHeader>
        <CardContent>
          {teachersLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>{t('adminCenterDetailsPage.trainers.loading', 'Loading trainers...')}</span>
            </div>
          ) : teachers.length > 0 ? (
            <div className="space-y-4">
              {/* Search and Filter Section */}
              <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder={t('adminCenterDetailsPage.trainers.searchPlaceholder', 'Search by name or email...')}
                      value={trainerSearchTerm}
                      onChange={(e) => setTrainerSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={trainerStatusFilter} onValueChange={setTrainerStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('adminCenterDetailsPage.trainers.filterAll', 'All Status')}</SelectItem>
                      <SelectItem value="active">{t('adminCenterDetailsPage.trainers.filterActive', 'Active')}</SelectItem>
                      <SelectItem value="inactive">{t('adminCenterDetailsPage.trainers.filterInactive', 'Inactive')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={trainerContractFilter} onValueChange={setTrainerContractFilter}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Contract" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('adminCenterDetailsPage.trainers.filterAllContracts', 'All Contracts')}</SelectItem>
                      <SelectItem value="entraide">{t('adminCenterDetailsPage.trainers.contractEntraide', 'Entraide')}</SelectItem>
                      <SelectItem value="association">{t('adminCenterDetailsPage.trainers.contractAssociation', 'Association')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={trainerProgramFilter} onValueChange={setTrainerProgramFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('adminCenterDetailsPage.trainers.filterAllPrograms', 'All Programs')}</SelectItem>
                      {uniqueTrainerPrograms.map(program => (
                        <SelectItem key={program.id} value={program.id.toString()}>
                          {program.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Results summary */}
              {(trainerSearchTerm || trainerStatusFilter !== 'all' || trainerContractFilter !== 'all' || trainerProgramFilter !== 'all') && (
                <div className="text-sm text-muted-foreground">
                  {t('adminCenterDetailsPage.trainers.showingResults', 'Showing {{count}} of {{total}} trainers', {
                    count: filteredTrainers.length,
                    total: teachers.length
                  })}
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">{t('adminCenterDetailsPage.trainers.name', 'Name')}</th>
                      <th className="text-left p-2 font-medium">{t('adminCenterDetailsPage.trainers.email', 'Email')}</th>
                      <th className="text-left p-2 font-medium">{t('adminCenterDetailsPage.trainers.phone', 'Phone')}</th>
                      <th className="text-left p-2 font-medium">{t('adminCenterDetailsPage.trainers.program', 'Program')}</th>
                      <th className="text-left p-2 font-medium">{t('adminCenterDetailsPage.trainers.contractWith', 'Contract With')}</th>
                      <th className="text-left p-2 font-medium">{t('adminCenterDetailsPage.trainers.contractPeriod', 'Contract Period')}</th>
                      <th className="text-left p-2 font-medium">{t('adminCenterDetailsPage.trainers.status', 'Status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTrainers.map(teacher => (
                      <tr key={teacher.id} className="border-b hover:bg-muted/50">
                        <td className="p-2">{teacher.user.first_name} {teacher.user.last_name}</td>
                        <td className="p-2 text-sm text-muted-foreground">{teacher.user.email}</td>
                        <td className="p-2 text-sm">{teacher.user.phone_number || 'N/A'}</td>
                        <td className="p-2">{teacher.program_name}</td>
                        <td className="p-2">
                          <Badge variant="outline">
                            {teacher.contarct_with === 'entraide' ? 'Entraide' : 'Association'}
                          </Badge>
                        </td>
                        <td className="p-2 text-sm">
                          {new Date(teacher.contract_start_date).toLocaleDateString()} - {new Date(teacher.contract_end_date).toLocaleDateString()}
                        </td>
                        <td className="p-2">
                          <Badge variant={teacher.user.is_active ? "default" : "secondary"}>
                            {teacher.user.is_active ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t('adminCenterDetailsPage.trainers.noTrainers', 'No trainers found for this center')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCenterDetailsPage; 