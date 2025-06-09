import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Calendar, Clock, MapPin, User, Users, Search, RefreshCw, GraduationCap, UserCheck } from "lucide-react";
import axios from 'axios';

// TypeScript interfaces
interface TrainingCourse {
  id: number;
  program: {
    id: number;
    name: string;
    duration_years: number;
  };
  center: {
    id: number;
    name: string;
  };
  academic_year: string;
}

interface Trainer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  full_name: string;
}

interface Room {
  id: number;
  name: string;
  type: string;
  capacity: number;
}

interface Group {
  id: number;
  name: string;
  description: string;
  center: number;
}

interface ScheduleSession {
  id: number;
  day: string;
  start_time: string;
  end_time: string;
  academic_year: string;
  is_active: boolean;
  trainer: number;
  trainer_details: Trainer;
  room: number | null;
  room_details: Room | null;
  group: number | null;
  group_details: Group | null;
  training_course: number;
  training_course_details: TrainingCourse;
  created_at: string;
  updated_at: string;
}

interface Center {
  id: number;
  name: string;
}

interface TimeSlot {
  start: string;
  end: string;
  label: string;
}

interface TimetableCell {
  session: ScheduleSession | null;
  isEmpty: boolean;
}

const CenterSchedulesPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [centerData, setCenterData] = useState<Center | null>(null);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [trainerSchedules, setTrainerSchedules] = useState<ScheduleSession[]>([]);
  const [groupSchedules, setGroupSchedules] = useState<ScheduleSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('trainers');
  
  // Search states
  const [trainerSearchTerm, setTrainerSearchTerm] = useState('');
  const [groupSearchTerm, setGroupSearchTerm] = useState('');

  // Days and time slots for the timetable grid
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Common time slots (adjusted to match typical schedule patterns)
  const timeSlots: TimeSlot[] = [
    { start: '08:00', end: '10:30', label: '08:00 - 10:30' },
    { start: '10:30', end: '12:30', label: '10:30 - 12:30' },
    { start: '12:30', end: '14:30', label: '12:30 - 14:30' },
    { start: '14:30', end: '16:30', label: '14:30 - 16:30' },
    { start: '16:30', end: '18:30', label: '16:30 - 18:30' },
    { start: '18:30', end: '20:30', label: '18:30 - 20:30' },
  ];

  useEffect(() => {
    if (!user || !accessToken) {
      setError(t('centerSchedulesPage.errorAuthNotAvailable'));
      setLoading(false);
      return;
    }

    if (user.role !== 'center_supervisor') {
      setError(t('centerSchedulesPage.accessDenied'));
      setLoading(false);
      return;
    }

    fetchInitialData();
  }, [user, accessToken, t]);

  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch center information first
      const centerResponse = await axios.get('/api/centers-app/centers/', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      const userCenters = centerResponse.data.results?.filter((center: any) => 
        center.supervisor === user?.id
      ) || [];

      if (userCenters.length === 0) {
        setError(t('centerSchedulesPage.noCenterAssigned'));
        setLoading(false);
        return;
      }

      const center = userCenters[0];
      setCenterData(center);

      // Fetch trainers and groups for this center
      await Promise.all([
        fetchTrainersForCenter(center.id),
        fetchGroupsForCenter(center.id)
      ]);

    } catch (err) {
      console.error('Error fetching initial data:', err);
      setError(t('centerSchedulesPage.errorFetching'));
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainersForCenter = async (centerId: number) => {
    try {
      const response = await axios.get('/api/schedule/api/sessions/trainers_by_center/', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { 
          center_id: centerId,
          academic_year: '2024-2025' // This should be dynamic
        }
      });
      setTrainers(response.data);
    } catch (err) {
      console.error('Error fetching trainers:', err);
    }
  };

  const fetchGroupsForCenter = async (centerId: number) => {
    try {
      const response = await axios.get('/api/schedule/api/sessions/groups_by_center/', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { 
          center_id: centerId,
          academic_year: '2024-2025' // This should be dynamic
        }
      });
      setGroups(response.data);
    } catch (err) {
      console.error('Error fetching groups:', err);
    }
  };

  const fetchTrainerSchedule = async (trainerId: number) => {
    setLoadingSchedules(true);
    try {
      const response = await axios.get('/api/schedule/api/sessions/trainer_schedule/', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { 
          trainer_id: trainerId,
          center_id: centerData?.id,
          academic_year: '2024-2025' // This should be dynamic
        }
      });
      setTrainerSchedules(response.data.schedules);
    } catch (err) {
      console.error('Error fetching trainer schedule:', err);
      setTrainerSchedules([]);
    } finally {
      setLoadingSchedules(false);
    }
  };

  const fetchGroupSchedule = async (groupId: number) => {
    setLoadingSchedules(true);
    try {
      const response = await axios.get('/api/schedule/api/sessions/group_schedule/', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { 
          group_id: groupId,
          center_id: centerData?.id,
          academic_year: '2024-2025' // This should be dynamic
        }
      });
      setGroupSchedules(response.data.schedules);
    } catch (err) {
      console.error('Error fetching group schedule:', err);
      setGroupSchedules([]);
    } finally {
      setLoadingSchedules(false);
    }
  };

  const handleTrainerSelect = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    fetchTrainerSchedule(trainer.id);
  };

  const handleGroupSelect = (group: Group) => {
    setSelectedGroup(group);
    fetchGroupSchedule(group.id);
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to check if a session overlaps with a time slot
  const sessionFitsInSlot = (session: ScheduleSession, slot: TimeSlot): boolean => {
    const sessionStart = session.start_time;
    const sessionEnd = session.end_time;
    
    // Check if session overlaps with this time slot (more flexible matching)
    // Session overlaps if it starts before slot ends and ends after slot starts
    return sessionStart < slot.end && sessionEnd > slot.start;
  };

  // Build the timetable grid for trainer schedules
  const buildTrainerTimetable = (): Map<string, Map<string, TimetableCell>> => {
    const timetable = new Map<string, Map<string, TimetableCell>>();
    
    // Initialize empty timetable
    daysOfWeek.forEach(day => {
      const daySchedule = new Map<string, TimetableCell>();
      timeSlots.forEach(slot => {
        daySchedule.set(slot.label, { session: null, isEmpty: true });
      });
      timetable.set(day, daySchedule);
    });

    // Fill with actual sessions
    trainerSchedules.forEach(session => {
      if (!session.is_active) return;
      
      const daySchedule = timetable.get(session.day);
      if (daySchedule) {
        // Find the appropriate time slot
        const matchingSlot = timeSlots.find(slot => sessionFitsInSlot(session, slot));
        if (matchingSlot) {
          daySchedule.set(matchingSlot.label, { session, isEmpty: false });
        }
      }
    });

    return timetable;
  };

  // Build the timetable grid for group schedules
  const buildGroupTimetable = (): Map<string, Map<string, TimetableCell>> => {
    const timetable = new Map<string, Map<string, TimetableCell>>();
    
    // Initialize empty timetable
    daysOfWeek.forEach(day => {
      const daySchedule = new Map<string, TimetableCell>();
      timeSlots.forEach(slot => {
        daySchedule.set(slot.label, { session: null, isEmpty: true });
      });
      timetable.set(day, daySchedule);
    });

    // Fill with actual sessions
    groupSchedules.forEach(session => {
      if (!session.is_active) return;
      
      const daySchedule = timetable.get(session.day);
      if (daySchedule) {
        // Find the appropriate time slot
        const matchingSlot = timeSlots.find(slot => sessionFitsInSlot(session, slot));
        if (matchingSlot) {
          daySchedule.set(matchingSlot.label, { session, isEmpty: false });
        }
      }
    });

    return timetable;
  };

  // Filter functions
  const filteredTrainers = trainers.filter(trainer => 
    trainer.full_name.toLowerCase().includes(trainerSearchTerm.toLowerCase()) ||
    trainer.email.toLowerCase().includes(trainerSearchTerm.toLowerCase())
  );

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(groupSearchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(groupSearchTerm.toLowerCase())
  );

  // Render a timetable cell
  const renderTimetableCell = (cell: TimetableCell, isGroupView: boolean = false) => {
    if (cell.isEmpty || !cell.session) {
      return <div className="p-2 h-16 bg-background"></div>;
    }

    const session = cell.session;
    return (
      <div className="p-2 h-16 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors cursor-pointer">
        <div className="text-xs font-medium text-blue-900 dark:text-blue-100 truncate" title={session.training_course_details.program.name}>
          {session.training_course_details.program.name}
        </div>
        <div className="text-xs text-blue-700 dark:text-blue-200 truncate mt-1" title={isGroupView ? session.trainer_details.full_name : (session.group_details?.name || 'No Group')}>
          {isGroupView 
            ? session.trainer_details.full_name
            : session.group_details?.name || 'No Group'
          }
        </div>
        {session.room_details && (
          <div className="text-xs text-blue-600 dark:text-blue-300 truncate" title={session.room_details.name}>
            {session.room_details.name}
          </div>
        )}
        <div className="text-xs text-muted-foreground truncate">
          {formatTime(session.start_time)} - {formatTime(session.end_time)}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">{t('centerSchedulesPage.loadingMessage')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              {t('centerSchedulesPage.errorTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!centerData) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('centerSchedulesPage.noCenterDataTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{t('centerSchedulesPage.noCenterDataDescription')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('centerSchedulesPage.pageTitle', { centerName: centerData.name })}
          </h1>
          <p className="text-muted-foreground">
            {t('centerSchedulesPage.pageSubtitle', { 
              trainersCount: trainers.length,
              groupsCount: groups.length 
            })}
          </p>
        </div>
      </div>

      {/* Tabs for Trainers and Groups */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="trainers" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            {t('centerSchedulesPage.trainersSchedulesTab')} ({trainers.length})
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t('centerSchedulesPage.groupsSchedulesTab')} ({groups.length})
          </TabsTrigger>
        </TabsList>

        {/* Trainers Schedules Tab */}
        <TabsContent value="trainers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Trainers List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    {t('centerSchedulesPage.trainersListTitle')}
                  </CardTitle>
                  <CardDescription>
                    {t('centerSchedulesPage.trainersListDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('centerSchedulesPage.searchTrainers')}
                      value={trainerSearchTerm}
                      onChange={(e) => setTrainerSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {/* Trainers List */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredTrainers.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        {t('centerSchedulesPage.noTrainersFound')}
                      </p>
                    ) : (
                      filteredTrainers.map((trainer) => (
                        <Card 
                          key={trainer.id} 
                          className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                            selectedTrainer?.id === trainer.id ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => handleTrainerSelect(trainer)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <User className="h-8 w-8 text-muted-foreground" />
                              <div className="flex-1">
                                <h4 className="font-semibold">{trainer.full_name}</h4>
                                <p className="text-sm text-muted-foreground">{trainer.email}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trainer Timetable */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {selectedTrainer 
                      ? t('centerSchedulesPage.trainerScheduleTitle', { trainerName: selectedTrainer.full_name })
                      : t('centerSchedulesPage.selectTrainerTitle')
                    }
                  </CardTitle>
                  {selectedTrainer && (
                    <CardDescription>
                      {t('centerSchedulesPage.weeklyScheduleDescription')}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {!selectedTrainer ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <UserCheck className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        {t('centerSchedulesPage.selectTrainerMessage')}
                      </h3>
                      <p className="text-muted-foreground text-center">
                        {t('centerSchedulesPage.selectTrainerDescription')}
                      </p>
                    </div>
                  ) : loadingSchedules ? (
                    <div className="flex items-center justify-center py-12">
                      <RefreshCw className="h-8 w-8 animate-spin" />
                      <span className="ml-2">{t('centerSchedulesPage.loadingSchedule')}</span>
                    </div>
                  ) : trainerSchedules.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        {t('centerSchedulesPage.noSchedulesFound')}
                      </h3>
                      <p className="text-muted-foreground text-center">
                        {t('centerSchedulesPage.noSchedulesDescription')}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <div className="border border-border bg-background rounded-lg overflow-hidden min-w-[800px]">
                        {/* Create a proper table structure */}
                        <div className="grid grid-cols-7 gap-0">
                          {/* Header Row */}
                          <div className="bg-muted border-r border-b border-border p-3 font-semibold text-sm flex items-center justify-center text-foreground">
                            {t('centerSchedulesPage.day')}
                          </div>
                          {timeSlots.map((slot, index) => (
                            <div key={slot.label} className={`bg-muted border-b border-border p-3 font-semibold text-sm text-center flex items-center justify-center text-foreground ${index < timeSlots.length - 1 ? 'border-r border-border' : ''}`}>
                              {slot.label}
                            </div>
                          ))}
                          
                          {/* Timetable Rows */}
                          {(() => {
                            const timetable = buildTrainerTimetable();
                            return daysOfWeek.map((day, dayIndex) => (
                              <React.Fragment key={day}>
                                <div className={`bg-muted/50 border-r border-border p-3 font-medium text-sm flex items-center text-foreground ${dayIndex < daysOfWeek.length - 1 ? 'border-b border-border' : ''}`}>
                                  {t(`days.${day.toLowerCase()}`)}
                                </div>
                                {timeSlots.map((slot, slotIndex) => {
                                  const daySchedule = timetable.get(day);
                                  const cell = daySchedule?.get(slot.label) || { session: null, isEmpty: true };
                                  return (
                                    <div key={`${day}-${slot.label}`} className={`${slotIndex < timeSlots.length - 1 ? 'border-r border-border' : ''} ${dayIndex < daysOfWeek.length - 1 ? 'border-b border-border' : ''}`}>
                                      {renderTimetableCell(cell, false)}
                                    </div>
                                  );
                                })}
                              </React.Fragment>
                            ));
                          })()}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Groups Schedules Tab */}
        <TabsContent value="groups" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Groups List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {t('centerSchedulesPage.groupsListTitle')}
                  </CardTitle>
                  <CardDescription>
                    {t('centerSchedulesPage.groupsListDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('centerSchedulesPage.searchGroups')}
                      value={groupSearchTerm}
                      onChange={(e) => setGroupSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {/* Groups List */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredGroups.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        {t('centerSchedulesPage.noGroupsFound')}
                      </p>
                    ) : (
                      filteredGroups.map((group) => (
                        <Card 
                          key={group.id} 
                          className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                            selectedGroup?.id === group.id ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => handleGroupSelect(group)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <Users className="h-8 w-8 text-muted-foreground" />
                              <div className="flex-1">
                                <h4 className="font-semibold">{group.name}</h4>
                                <p className="text-sm text-muted-foreground">{group.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Group Timetable */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {selectedGroup 
                      ? t('centerSchedulesPage.groupScheduleTitle', { groupName: selectedGroup.name })
                      : t('centerSchedulesPage.selectGroupTitle')
                    }
                  </CardTitle>
                  {selectedGroup && (
                    <CardDescription>
                      {t('centerSchedulesPage.weeklyScheduleDescription')}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {!selectedGroup ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Users className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        {t('centerSchedulesPage.selectGroupMessage')}
                      </h3>
                      <p className="text-muted-foreground text-center">
                        {t('centerSchedulesPage.selectGroupDescription')}
                      </p>
                    </div>
                  ) : loadingSchedules ? (
                    <div className="flex items-center justify-center py-12">
                      <RefreshCw className="h-8 w-8 animate-spin" />
                      <span className="ml-2">{t('centerSchedulesPage.loadingSchedule')}</span>
                    </div>
                  ) : groupSchedules.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        {t('centerSchedulesPage.noSchedulesFound')}
                      </h3>
                      <p className="text-muted-foreground text-center">
                        {t('centerSchedulesPage.noSchedulesDescription')}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <div className="border border-border bg-background rounded-lg overflow-hidden min-w-[800px]">
                        {/* Create a proper table structure */}
                        <div className="grid grid-cols-7 gap-0">
                          {/* Header Row */}
                          <div className="bg-muted border-r border-b border-border p-3 font-semibold text-sm flex items-center justify-center text-foreground">
                            {t('centerSchedulesPage.day')}
                          </div>
                          {timeSlots.map((slot, index) => (
                            <div key={slot.label} className={`bg-muted border-b border-border p-3 font-semibold text-sm text-center flex items-center justify-center text-foreground ${index < timeSlots.length - 1 ? 'border-r border-border' : ''}`}>
                              {slot.label}
                            </div>
                          ))}
                          
                          {/* Timetable Rows */}
                          {(() => {
                            const timetable = buildGroupTimetable();
                            return daysOfWeek.map((day, dayIndex) => (
                              <React.Fragment key={day}>
                                <div className={`bg-muted/50 border-r border-border p-3 font-medium text-sm flex items-center text-foreground ${dayIndex < daysOfWeek.length - 1 ? 'border-b border-border' : ''}`}>
                                  {t(`days.${day.toLowerCase()}`)}
                                </div>
                                {timeSlots.map((slot, slotIndex) => {
                                  const daySchedule = timetable.get(day);
                                  const cell = daySchedule?.get(slot.label) || { session: null, isEmpty: true };
                                  return (
                                    <div key={`${day}-${slot.label}`} className={`${slotIndex < timeSlots.length - 1 ? 'border-r border-border' : ''} ${dayIndex < daysOfWeek.length - 1 ? 'border-b border-border' : ''}`}>
                                      {renderTimetableCell(cell, true)}
                                    </div>
                                  );
                                })}
                              </React.Fragment>
                            ));
                          })()}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CenterSchedulesPage; 