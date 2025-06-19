import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Calendar, AlertCircle } from 'lucide-react';

interface Trainer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  full_name: string;
}

interface TrainingCourse {
  id: number;
  program: { id: number; name: string; duration_years: number };
  center: { id: number; name: string };
  academic_year: string;
}

interface Room { id: number; name: string; type: string; capacity: number }
interface Group { id: number; name: string; description: string; center: number }

interface ScheduleSession {
  id: number;
  day: string;
  start_time: string;
  end_time: string;
  academic_year: string;
  is_active: boolean;
  trainer: number;
  room: number | null;
  group: number | null;
  trainer_details: Trainer;
  room_details: Room | null;
  group_details: Group | null;
  training_course: number;
  training_course_details: TrainingCourse;
  created_at: string;
  updated_at: string;
}

interface TimeSlot { start: string; end: string; label: string }
interface TimetableCell { session: ScheduleSession | null; isEmpty: boolean }

const timeSlots: TimeSlot[] = [
  { start: '08:00', end: '10:30', label: '08:00 - 10:30' },
  { start: '10:30', end: '12:30', label: '10:30 - 12:30' },
  { start: '12:30', end: '14:30', label: '12:30 - 14:30' },
  { start: '14:30', end: '16:30', label: '14:30 - 16:30' },
  { start: '16:30', end: '18:30', label: '16:30 - 18:30' },
  { start: '18:30', end: '20:30', label: '18:30 - 20:30' },
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TrainerSchedulePage: React.FC = () => {
  const { t } = useTranslation();
  const { user, accessToken } = useAuth();

  const [academicYear, setAcademicYear] = useState<string>('');
  const [academicYears, setAcademicYears] = useState<string[]>([]);
  const [schedules, setSchedules] = useState<ScheduleSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingSchedules, setLoadingSchedules] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Generate last three academic years
  useEffect(() => {
    const today = new Date();
    const guessStartYear = today.getMonth() >= 7 ? today.getFullYear() : today.getFullYear() - 1; // academic year starts around Sept

    const years: string[] = [];
    for (let i = 0; i < 3; i++) {
      const y = guessStartYear - i;
      years.push(`${y}-${y + 1}`);
    }
    setAcademicYears(years);
    setAcademicYear(years[0]);
  }, []);

  // Fetch schedules whenever academic year changes (once we have user & token)
  useEffect(() => {
    if (!user || !accessToken || !academicYear) return;

    const fetchSchedules = async () => {
      setLoadingSchedules(true);
      setError(null);
      try {
        const { data } = await axios.get('/api/schedule/api/sessions/trainer_schedule/', {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { trainer_id: user.id, academic_year: academicYear },
        });
        setSchedules(data.schedules);
      } catch (err) {
        console.error('Error fetching trainer schedules:', err);
        setError(t('trainerSchedulePage.fetchError', 'Error fetching schedules'));
      } finally {
        setLoading(false);
        setLoadingSchedules(false);
      }
    };

    fetchSchedules();
  }, [user, accessToken, academicYear, t]);

  const sessionFitsInSlot = (session: ScheduleSession, slot: TimeSlot): boolean => {
    return session.start_time < slot.end && session.end_time > slot.start;
  };

  const buildTimetable = (): Map<string, Map<string, TimetableCell>> => {
    const timetable = new Map<string, Map<string, TimetableCell>>();
    daysOfWeek.forEach(day => {
      const dayMap = new Map<string, TimetableCell>();
      timeSlots.forEach(slot => dayMap.set(slot.label, { session: null, isEmpty: true }));
      timetable.set(day, dayMap);
    });

    schedules.forEach(session => {
      if (!session.is_active) return;
      const dayMap = timetable.get(session.day);
      if (!dayMap) return;
      const slot = timeSlots.find(s => sessionFitsInSlot(session, s));
      if (!slot) return;
      dayMap.set(slot.label, { session, isEmpty: false });
    });

    return timetable;
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('fr-FR', {
      hour: '2-digit', minute: '2-digit', hour12: false,
    });
  };

  const renderTimetableCell = (cell: TimetableCell) => {
    if (cell.isEmpty || !cell.session) return <div className="p-2 h-24 bg-background"></div>;
    const s = cell.session;
    return (
      <div className="p-2 h-24 flex flex-col justify-between bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors">
        {/* Group Name */}
        {s.group_details && (
          <div className="text-sm font-semibold text-blue-900 dark:text-blue-100 break-words" title={s.group_details.name}>{s.group_details.name}</div>
        )}
        {/* Room */}
        {s.room_details && (
          <div className="text-xs text-blue-600 dark:text-blue-300 break-words" title={s.room_details.name}>{s.room_details.name}</div>
        )}
        {/* Time */}
        <div className="text-xs text-muted-foreground">
          {formatTime(s.start_time)} - {formatTime(s.end_time)}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive"><AlertCircle className="h-5 w-5" />{t('trainerSchedulePage.errorTitle', 'Error')}</CardTitle>
          </CardHeader>
          <CardContent><p>{error}</p></CardContent>
        </Card>
      </div>
    );
  }

  const timetable = buildTimetable();
  const programNames = Array.from(new Set(schedules.map(s => s.training_course_details.program.name)));
  const trainerName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.email;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('trainerSchedulePage.title', 'My Weekly Schedule')}
          </h1>
          <p className="text-muted-foreground">
            {t('trainerSchedulePage.subtitle', 'Overview of your sessions')}
          </p>
        </div>
        <div>
          <Select value={academicYear} onValueChange={setAcademicYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('trainerSchedulePage.selectYear', 'Select Year')} />
            </SelectTrigger>
            <SelectContent>
              {academicYears.map(y => (
                <SelectItem key={y} value={y}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />{academicYear}</CardTitle>
          <CardDescription>{t('trainerSchedulePage.weeklyScheduleDescription', 'Weekly timetable')}</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingSchedules ? (
            <div className="flex items-center justify-center py-12"><RefreshCw className="h-8 w-8 animate-spin" /></div>
          ) : schedules.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('trainerSchedulePage.noSchedules', 'No schedules found')}</h3>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="border border-border bg-background rounded-lg overflow-hidden min-w-[800px]">
                <div className="grid grid-cols-7 gap-0">
                  <div className="bg-muted border-r border-b border-border p-3 font-semibold text-sm flex items-center justify-center text-foreground">
                    {t('trainerSchedulePage.day', 'Day')}
                  </div>
                  {timeSlots.map((slot, idx) => (
                    <div key={slot.label} className={`bg-muted border-b border-border p-3 font-semibold text-sm flex items-center justify-center text-foreground ${idx < timeSlots.length - 1 ? 'border-r border-border' : ''}`}>{slot.label}</div>
                  ))}
                  {daysOfWeek.map((day, dayIdx) => (
                    <React.Fragment key={day}>
                      <div className={`bg-muted/50 border-r border-border p-3 font-medium text-sm flex items-center text-foreground ${dayIdx < daysOfWeek.length - 1 ? 'border-b border-border' : ''}`}>{t(`days.${day.toLowerCase()}`, day)}</div>
                      {timeSlots.map((slot, slotIdx) => {
                        const cell = timetable.get(day)?.get(slot.label) || { session: null, isEmpty: true };
                        return (
                          <div key={`${day}-${slot.label}`} className={`${slotIdx < timeSlots.length - 1 ? 'border-r border-border' : ''} ${dayIdx < daysOfWeek.length - 1 ? 'border-b border-border' : ''}`}>{renderTimetableCell(cell)}</div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerSchedulePage;
