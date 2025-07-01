import React, { useState, useEffect } from 'react'; // useEffect for a potential use case
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import CenterDashboard from './pages/center/CenterDashboard';
import AssociationDashboard from './pages/association/AssociationDashboard';
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import TrainerStudentsPage from './pages/trainer/TrainerStudentsPage';
import StudentDashboard from './pages/student/StudentDashboard';
import AboutUsPage from './pages/AboutUsPage'; // New page
import ContactUsPage from './pages/ContactUsPage'; // New page
import FAQPage from './pages/FAQPage'; // New page
import DashboardLayout from '@/components/DashboardLayout'; // Import DashboardLayout
import { Button } from "@/components/ui/button";
import { ThemeProvider, useTheme } from '@/components/theme-provider';
import { Moon, Sun, User as UserIcon, LogOut as LogOutIcon, LogIn as LogInIcon } from "lucide-react"; // Import new icons
import { LanguageSwitcher } from '@/components/language-switcher';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from '@/contexts/AuthContext'; // Import AuthProvider and useAuth
import { ThemeToggleButton } from '@/components/ThemeToggleButton'; // Import from new location
import AdminSupervisorsPage from './pages/admin/AdminSupervisorsPage'; // Import the new page
import AdminCentersPage from './pages/admin/AdminCentersPage'; // Import AdminCentersPage
import AdminCenterDetailsPage from './pages/admin/AdminCenterDetailsPage'; // Import AdminCenterDetailsPage
import AdminRoomDetailsPage from './pages/admin/AdminRoomDetailsPage'; // Import AdminRoomDetailsPage
import AdminAddCenterPage from './pages/admin/AdminAddCenterPage'; // Import the new page
import AdminAssociationsPage from './pages/admin/AdminAssociationsPage';
import AdminAssociationDetailsPage from './pages/admin/AdminAssociationDetailsPage'; // Import the Association Details page
import AdminEditAssociationPage from './pages/admin/AdminEditAssociationPage'; // Import the Edit Association page
import AdminAddAssociationPage from './pages/admin/AdminAddAssociationPage'; // Import the Add Association page
import AdminAddSupervisorPage from './pages/admin/AdminAddSupervisorPage'; // Import the new Add Supervisor page
import AdminAddAssociationSupervisorPage from './pages/admin/AdminAddAssociationSupervisorPage'; // Import the Add Association Supervisor page
import AdminTrainersPage from './pages/admin/AdminTrainersPage'; // Import the new Trainers page
import CenterRoutes from './pages/center/CenterRoutes'; // Import CenterRoutes
import TrainingProgramsPage from './pages/admin/TrainingProgramsPage'; // Import the new Training Programs page
import AdminAddTrainingProgramPage from './pages/admin/AdminAddTrainingProgramPage'; // Import the Add Training Program page
import AdminTrainingCoursesPage from './pages/admin/AdminTrainingCoursesPage'; // Import the new Training Courses page
import AdminAddTrainingCoursePage from './pages/admin/AdminAddTrainingCoursePage'; // Import the Add Training Course page
import AdminCourseDetailsPage from './pages/admin/AdminCourseDetailsPage'; // Import the Course Details page
import AdminAddCoursePage from './pages/admin/AdminAddCoursePage'; // Import the Add Course page
import AdminAddUnitPage from './pages/admin/AdminAddUnitPage'; // Import the Add Unit page
import AdminEditUnitPage from './pages/admin/AdminEditUnitPage'; // Import the Edit Unit page
import AdminAddSectionPage from './pages/admin/AdminAddSectionPage'; // Import the Add Section page
import AdminAddLessonPage from './pages/admin/AdminAddLessonPage'; // Import the Add Lesson page
import AdminLessonViewPage from './pages/admin/AdminLessonViewPage'; // Import the Lesson View page
import logoImage from '@/assets/entraide-nationale-maroc-seeklogo.png'; // Import the logo
import logoImageDark from '@/assets/entraide-nationale-maroc-seeklogo-dark.png'; // Import the dark mode logo
import TrainerSchedulePage from './pages/trainer/TrainerSchedulePage';
import TrainerAttendancePage from './pages/trainer/TrainerAttendancePage';

// Helper to get dashboard path based on role
const getDashboardPath = (role: string | undefined): string => {
  switch (role) {
    case 'admin': return '/admin/dashboard';
    case 'center_supervisor': return '/center/dashboard';
    case 'association_supervisor': return '/association/dashboard';
    case 'trainer': return '/trainer/dashboard';
    case 'student': return '/student/dashboard';
    default: return '/'; // Fallback to home
  }
};

function AppContent() {
  const { t } = useTranslation();
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const location = useLocation(); // Added useLocation

  const handleLogout = () => {
    logout();
  };

  return (
    <Routes> {/* Moved Routes to be direct child for simplicity here, layout handled per-route */}
      {/* Public Routes with Navbar */}
      <Route path="/" element={<PublicLayout><MainPage /></PublicLayout>} />
      <Route
        path="/login"
        element={
          isAuthenticated() && user ? (
            // If authenticated, redirect to where they came from, or to their dashboard
            <Navigate to={location.state?.from?.pathname || getDashboardPath(user.role)} replace state={{ from: location.state?.from }} />
          ) : (
            <PublicLayout><LoginPage /></PublicLayout>
          )
        }
      />
      <Route path="/about" element={<PublicLayout><AboutUsPage /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><ContactUsPage /></PublicLayout>} />
      <Route path="/faq" element={<PublicLayout><FAQPage /></PublicLayout>} />
          
      {/* Dashboard Routes with Sidebar Layout */}
      <Route path="/admin/*" element={isAuthenticated() && user?.role === 'admin' ? <DashboardLayout><AdminRoutes /></DashboardLayout> : <Navigate to="/login" replace state={{ from: location }} />} />
      {/* Add similar routes for other roles using DashboardLayout */}
      <Route path="/center/*" element={isAuthenticated() && user?.role === 'center_supervisor' ? <DashboardLayout><CenterRoutes /></DashboardLayout> : <Navigate to="/login" replace state={{ from: location }} />} />
      <Route path="/trainer/*" element={isAuthenticated() && user?.role === 'trainer' ? <DashboardLayout><TrainerRoutes /></DashboardLayout> : <Navigate to="/login" replace state={{ from: location }} />} />
      {/* <Route path="/student/*" element={isAuthenticated() && user?.role === 'student' ? <DashboardLayout><StudentRoutes /></DashboardLayout> : <Navigate to="/login" replace state={{ from: location }} />} /> */}
      
      {/* Not Found Route */}
      <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} /> 
    </Routes>
  );
}

// Create a simple PublicLayout component containing the original navbar
const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme(); // Get the current theme
  
  const handleLogout = () => {
      logout();
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
        <nav className="bg-card text-card-foreground border-b sticky top-0 z-50 w-full shadow-sm">
            <div className="container mx-auto flex items-center h-16 px-4">
                <Link to="/" className="mr-6 flex items-center space-x-2">
                    <img src={theme === 'dark' ? logoImageDark : logoImage} alt={t('navbarLogo')} className="h-10 w-auto" />
                </Link>
                <div className="flex-1 flex justify-center items-center space-x-1 sm:space-x-4">
                    <Link to="/"><Button variant="ghost">{t('home')}</Button></Link>
                    <Link to="/about"><Button variant="ghost">{t('aboutUs')}</Button></Link>
                    <Link to="/contact"><Button variant="ghost">{t('contactUs')}</Button></Link>
                    <Link to="/faq"><Button variant="ghost">{t('faq')}</Button></Link>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                    <LanguageSwitcher />
                    <ThemeToggleButton />
                    {isLoading ? (
                        <span className="text-sm">Loading...</span>
                    ) : isAuthenticated() && user ? (
                        <>
                            <span className="text-sm hidden sm:inline">
                                {t('greeting', { firstName: user.first_name || '', lastName: user.last_name || '' }).trim() || user.email || 'User'}
                            </span>
                            <Button variant="outline" size="icon" onClick={handleLogout} aria-label={t('logout')}>
                                <LogOutIcon className="h-[1.2rem] w-[1.2rem]" />
                            </Button>
                        </>
                    ) : (
                        <Link to="/login">
                            <Button variant="outline">
                                <LogInIcon className="h-[1.2rem] w-[1.2rem] sm:mr-2" />
                                <span className="hidden sm:inline">{t('login')}</span>
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
        <main className="flex-grow container mx-auto px-4 py-8">
            {children}
        </main>
    </div>
  );
};

// Separate Routes for Admin Dashboard
const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} /> 
      <Route path="supervisors" element={<AdminSupervisorsPage />} />
      <Route path="supervisors/add" element={<AdminAddSupervisorPage />} /> {/* Added route for adding supervisors */}
      <Route path="supervisors/add-association" element={<AdminAddAssociationSupervisorPage />} /> {/* Added route for adding association supervisors */}
      <Route path="centers" element={<AdminCentersPage />} /> 
      <Route path="centers/add" element={<AdminAddCenterPage />} /> {/* Added route for adding centers */}
      <Route path="centers/details/:centerId" element={<AdminCenterDetailsPage />} /> {/* Added route for center details */}
      <Route path="centers/details/:centerId/rooms/:roomId" element={<AdminRoomDetailsPage />} /> {/* Added route for room details */}
      <Route path="associations" element={<AdminAssociationsPage />} /> {/* Added route for associations */}
      <Route path="associations/add" element={<AdminAddAssociationPage />} /> {/* Added route for adding associations */}
      <Route path="associations/details/:id" element={<AdminAssociationDetailsPage />} /> {/* Added route for association details */}
      <Route path="associations/edit/:id" element={<AdminEditAssociationPage />} /> {/* Added route for editing associations */}
      <Route path="training-programs" element={<TrainingProgramsPage />} /> {/* Added route for training programs */}
      <Route path="training-programs/add" element={<AdminAddTrainingProgramPage />} /> {/* Added route for adding training programs */}
      <Route path="courses/add" element={<AdminAddCoursePage />} /> {/* Added route for adding courses */}
      <Route path="courses/:courseId/units/add" element={<AdminAddUnitPage />} /> {/* Added route for adding units */}
      <Route path="courses/:courseId/units/:unitId/edit" element={<AdminEditUnitPage />} /> {/* Added route for editing units */}
      <Route path="courses/:courseId/units/:unitId/sections/add" element={<AdminAddSectionPage />} /> {/* Added route for adding sections */}
      <Route path="courses/:courseId/sections/:sectionId/lessons/add" element={<AdminAddLessonPage />} /> {/* Added route for adding lessons */}
      <Route path="courses/:courseId/lessons/:lessonId" element={<AdminLessonViewPage />} /> {/* Added route for lesson view */}
      <Route path="courses/:id" element={<AdminCourseDetailsPage />} /> {/* Added route for course details */}
      <Route path="training-courses" element={<AdminTrainingCoursesPage />} /> {/* Added route for training courses */}
      <Route path="training-courses/add" element={<AdminAddTrainingCoursePage />} /> {/* Added route for adding training courses */}
      <Route path="trainers" element={<AdminTrainersPage />} /> {/* Added route for trainers */}
      <Route path="*" element={<div>Admin Page Not Found</div>} />
    </Routes>
  );
};

// Separate Routes for Trainer Dashboard
const TrainerRoutes = () => {
  return (
    <Routes>
      <Route index element={<TrainerDashboard />} />
      <Route path="dashboard" element={<TrainerDashboard />} />
      <Route path="students" element={<TrainerStudentsPage />} />
      <Route path="schedule" element={<TrainerSchedulePage />} />
      <Route path="attendance" element={<TrainerAttendancePage />} />
      <Route path="*" element={<div>Trainer Page Not Found</div>} />
    </Routes>
  );
};

// Placeholder for NotFoundPage Component
const NotFoundPage = () => {
    const { t } = useTranslation();
    return <div className="text-center"><h2>{t('notFoundTitle')}</h2><Link to="/"><Button variant="link">{t('goHome')}</Button></Link></div>
};

// Main App component setup
function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
