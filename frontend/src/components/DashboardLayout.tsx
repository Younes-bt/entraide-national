import React, { useState } from 'react';
import Sidebar from './Sidebar';
import type { NavLink } from './Sidebar';
import { Button } from '@/components/ui/button';
import { Menu, LayoutDashboard, Building, Library, UsersRound, UserCog, GraduationCap, Home as HomeIcon, BookOpen, CheckSquare, Briefcase, CalendarDays, ClipboardCheck, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { user } = useAuth();

  let navLinks: NavLink[] = [];

  if (user?.role === 'admin') {
    navLinks = [
      { href: '/admin/dashboard', label: 'sidebar.dashboard', icon: LayoutDashboard },
      { href: '/admin/centers', label: 'sidebar.centers', icon: Building, section: 'hr' },
      { href: '/admin/associations', label: 'sidebar.associations', icon: Library, section: 'hr' },
      { href: '/admin/supervisors', label: 'sidebar.supervisors', icon: UsersRound, section: 'hr' },
      { href: '/admin/trainers', label: 'sidebar.trainers', icon: UserCog, section: 'hr' },
      { href: '/admin/students', label: 'sidebar.students', icon: GraduationCap, section: 'hr' },
      { href: '/admin/training-programs', label: 'sidebar.trainingPrograms', icon: Briefcase, section: 'trainings' },
      { href: '/admin/training-courses', label: 'sidebar.trainingCourses', icon: BookOpen, section: 'trainings' },
      { href: '/admin/annual-course-distribution', label: 'sidebar.annualCourseDistribution', icon: CalendarDays, section: 'trainings' },
      { href: '/admin/courses', label: 'sidebar.courses', icon: CheckSquare, section: 'trainings' },
      { href: '#', label: 'sidebar.exams.comingSoon', icon: CheckSquare, section: 'exams' },
    ];
  } else if (user?.role === 'center_supervisor') {
    navLinks = [
      { href: '/center/dashboard', label: 'sidebar.dashboard', icon: LayoutDashboard, section: 'overview' },
      { section: 'hr', href: '/center/students', label: 'sidebar.students', icon: GraduationCap },
      { section: 'hr', href: '/center/trainers', label: 'sidebar.trainers', icon: UserCog },
      { section: 'center', href: '/center/info', label: 'sidebar.centerInfo', icon: HomeIcon },
      { section: 'center', href: '/center/rooms', label: 'sidebar.rooms', icon: Building },
      { section: 'center', href: '/center/equipment', label: 'sidebar.equipment', icon: Briefcase },
      { section: 'center', href: '/center/groups', label: 'sidebar.groups', icon: Users },
      { section: 'programme', href: '/center/schedules', label: 'sidebar.schedules', icon: CalendarDays },
      { section: 'programme', href: '/center/attendance', label: 'sidebar.attendance', icon: ClipboardCheck },
    ];
  }

  return (
    <div className="relative flex min-h-screen bg-background">
      {/* Sidebar - Handles its own visibility based on screen size + mobile state */}
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        setIsMobileOpen={setIsMobileSidebarOpen} 
        navLinks={navLinks}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header for Mobile Toggle */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
          <Button 
            variant="outline" 
            size="icon" 
            className="md:hidden" // Only show on small screens
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </header>

        {/* Actual Page Content */}
        <main className="flex-1 p-4 md:p-8 pt-0 md:pt-8 md:ml-64"> {/* Add left margin on md+ screens */} 
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 