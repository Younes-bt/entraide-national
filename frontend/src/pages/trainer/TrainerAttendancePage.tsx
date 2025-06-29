import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RefreshCw, AlertCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Interfaces for relevant nested data (partial)
interface Program { id: number; name: string }
interface TrainingCourse { id: number; name: string; program: Program }
interface Group { id: number; name: string }

interface ScheduleSessionDetails {
  id: number;
  day: string;
  start_time: string;
  training_course_details?: TrainingCourse;
  group_details?: Group | null;
}

interface SessionTemplateDetails extends ScheduleSessionDetails {}

interface SessionInstanceDetails {
  id: number;
  specific_date: string;
  schedule_template_details: ScheduleSessionDetails;
}

interface AttendanceRecord {
  id: number;
  date: string;
  status: 'present' | 'absent' | 'late';
  notes: string;
  session_template_details?: SessionTemplateDetails | null;
  session_instance_details?: SessionInstanceDetails | null;
}

const TrainerAttendancePage: React.FC = () => {
  const { t } = useTranslation();
  const { accessToken, user } = useAuth();

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState<boolean>(true);
  const [attendanceBySession, setAttendanceBySession] = useState<Record<number, AttendanceRecord[]>>({});
  const [loadingSessionId, setLoadingSessionId] = useState<number | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      if (!accessToken) {
        setError('Authentication error');
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const dateStr = selectedDate.toISOString().substring(0,10);
        const response = await fetch(`/api/attendance/api/records/?trainer_id=me&date=${dateStr}&page_size=1000`, {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch attendance records: ${response.status}`);
        }
        const data = await response.json();
        const list: AttendanceRecord[] = Array.isArray(data) ? data : (data.results || []);
        setRecords(list);
      } catch (err: any) {
        console.error('[TrainerAttendancePage] Error:', err);
        setError(err.message || 'Failed to load attendance records');
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [accessToken, selectedDate]);

  useEffect(()=>{
    if(!accessToken) return;
    const fetchSch=async()=>{
      if(!user) {setSchedules([]); setLoadingSchedules(false); return;}
      try{
        const res=await fetch(`/api/schedule/api/sessions/trainer_schedule/?trainer_id=${user.id}&page_size=1000`,{
          headers:{Authorization:`Bearer ${accessToken}`}
        });
        if(!res.ok) throw new Error('Failed schedules');
        const data=await res.json();
        setSchedules(data.schedules||[]);
      }catch(e){console.error(e);}finally{setLoadingSchedules(false);}
    };
    fetchSch();
  },[accessToken, user]);

  const getDayName=(date:Date)=>['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][date.getDay()];

  const sessionsForDate = schedules.filter(s=>s.day===getDayName(selectedDate));

  const handleSessionClick = async (sessionId:number)=>{
     if(attendanceBySession[sessionId]){
       setAttendanceBySession(prev=>{
         const copy={...prev};
         delete copy[sessionId];
         return copy;
       });
       return;
     }
     setLoadingSessionId(sessionId);
     try{
        const dateStr=selectedDate.toISOString().substring(0,10);
        const res= await fetch(`/api/attendance/api/records/by_session/?session_template_id=${sessionId}&date=${dateStr}&page_size=1000`,{
          headers:{Authorization:`Bearer ${accessToken}`}
        });
        if(!res.ok) throw new Error('fetch attendance');
        const data=await res.json();
        setAttendanceBySession(prev=>({...prev,[sessionId]:data}));
     }catch(e){console.error(e);}finally{setLoadingSessionId(null);}
  };

  const filteredRecords = records.filter(rec => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      rec.notes?.toLowerCase().includes(searchLower) ||
      getSessionString(rec).toLowerCase().includes(searchLower)
    );
  });

  const monthDates: Date[] = [];
  const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    monthDates.push(new Date(d));
  }

  function getSessionString(rec: AttendanceRecord): string {
    if (rec.session_template_details) {
      const s = rec.session_template_details;
      const courseName = s.training_course_details?.name || '';
      const programName = s.training_course_details?.program?.name || '';
      return `${programName} - ${courseName} (${s.day} ${formatTime(s.start_time)})`;
    }
    if (rec.session_instance_details) {
      const inst = rec.session_instance_details;
      const tpl = inst.schedule_template_details;
      const courseName = tpl.training_course_details?.name || '';
      const programName = tpl.training_course_details?.program?.name || '';
      return `${programName} - ${courseName} (${formatDate(inst.specific_date)})`;
    }
    return t('trainerAttendancePage.noSession', 'No session');
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString();
  }

  function formatTime(timeStr: string) {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  function statusBadge(status: 'present' | 'absent' | 'late') {
    const colorMap: Record<typeof status, string> = {
      present: 'bg-green-500 text-white',
      absent: 'bg-red-500 text-white',
      late: 'bg-yellow-500 text-black dark:text-white',
    } as const;
    return (
      <Badge className={colorMap[status] + ' capitalize'}>{t(`attendance.status.${status}`, status)}</Badge>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive"><AlertCircle className="h-5 w-5" />{t('trainerAttendancePage.errorTitle', 'Error')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('trainerAttendancePage.title', 'Attendance')}
          </h1>
          <p className="text-muted-foreground">
            {t('trainerAttendancePage.subtitle', 'Pick a date to view attendance')}
          </p>
        </div>

        {/* Calendar */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
            <Button variant="ghost" size="icon" onClick={()=>setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth()-1,1))}><ChevronLeft className="h-4 w-4"/></Button>
            <CardTitle className="text-lg">{currentMonth.toLocaleString(undefined,{month:'long',year:'numeric'})}</CardTitle>
            <Button variant="ghost" size="icon" onClick={()=>setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth()+1,1))}><ChevronRight className="h-4 w-4"/></Button>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="grid grid-cols-7 text-center mb-2 text-sm font-medium">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>(<div key={d}>{t(`days.${d.toLowerCase()}`,d)}</div>))}
            </div>
            <div className="grid grid-cols-7 text-center gap-1">
              {(()=>{
                 const elems=[];
                 const firstWeekday=start.getDay();
                 for(let i=0;i<firstWeekday;i++) elems.push(<div key={'pad'+i}/>);
                 monthDates.forEach(date=>{
                   const dateStr=date.toISOString().substring(0,10);
                   const hasData=records.some(r=>r.date===dateStr);
                   const isSelected=date.toDateString()===selectedDate.toDateString();
                   elems.push(
                     <button key={dateStr} onClick={()=>setSelectedDate(new Date(date))} className={`rounded-full p-2 text-sm hover:bg-muted ${isSelected?'bg-primary text-primary-foreground':''}`}>{date.getDate()}</button>
                   );
                 });
                 return elems;
              })()}
            </div>
          </CardContent>
        </Card>

        {/* Search bar */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('trainerAttendancePage.searchPlaceholder', 'Search notes / session')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Sessions List for Day */}
      <div className="space-y-4">
        {loadingSchedules ? (
          <div className="flex items-center justify-center py-6"><RefreshCw className="h-6 w-6 animate-spin"/></div>
        ) : sessionsForDate.length===0 ? (
          <p className="text-muted-foreground text-center py-4">{t('trainerAttendancePage.noSessions', 'No sessions')}</p>
        ) : sessionsForDate.map(sess=>{
          const attendanceRecords=attendanceBySession[sess.id]||[];
          const isExpanded=!!attendanceBySession[sess.id];
          return (
            <Card key={sess.id} className="cursor-pointer" onClick={()=>handleSessionClick(sess.id)}>
              <CardHeader>
                <CardTitle>{`${sess.day} ${formatTime(sess.start_time)} - ${formatTime(sess.end_time)}`}</CardTitle>
                <CardDescription>{`${sess.training_course_details.program.name}${sess.training_course_details.name ? ' / '+sess.training_course_details.name : ''}`}</CardDescription>
              </CardHeader>
              {isExpanded && (
                <CardContent className="space-y-2">
                  {loadingSessionId===sess.id ? (
                    <div className="flex items-center justify-center py-4"><RefreshCw className="h-4 w-4 animate-spin"/></div>
                  ): attendanceRecords.length===0 ? (
                    <p className="text-muted-foreground">{t('trainerAttendancePage.noRecords', 'No records found')}</p>
                  ): attendanceRecords.map(r=>(
                    <div key={r.id} className="flex items-center justify-between border-b py-1 last:border-b-0">
                      <span>{(r as any).student_details ? `${(r as any).student_details.user.first_name} ${(r as any).student_details.user.last_name}`: r.student}</span>
                      {statusBadge(r.status)}
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TrainerAttendancePage; 