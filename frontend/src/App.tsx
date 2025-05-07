import React, { useState, useEffect } from 'react'; // useEffect for a potential use case
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import CenterDashboard from './pages/center/CenterDashboard';
import AssociationDashboard from './pages/association/AssociationDashboard';
import TrainerDashboard from './pages/trainer/TrainerDashboard';
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
            <Navigate to={getDashboardPath(user.role)} replace />
          ) : (
            <PublicLayout><LoginPage /></PublicLayout> 
          )
        }
      />
      <Route path="/about" element={<PublicLayout><AboutUsPage /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><ContactUsPage /></PublicLayout>} />
      <Route path="/faq" element={<PublicLayout><FAQPage /></PublicLayout>} />
          
      {/* Dashboard Routes with Sidebar Layout */}
      <Route path="/admin/*" element={isAuthenticated() && user?.role === 'admin' ? <DashboardLayout><AdminRoutes /></DashboardLayout> : <Navigate to="/login" replace />} />
      {/* Add similar routes for other roles using DashboardLayout */}
      {/* <Route path="/student/*" element={isAuthenticated() && user?.role === 'student' ? <DashboardLayout><StudentRoutes /></DashboardLayout> : <Navigate to="/login" replace />} /> */}
      
      {/* Not Found Route */}
      <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} /> 
    </Routes>
  );
}

// Create a simple PublicLayout component containing the original navbar
const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  
  const handleLogout = () => {
      logout();
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
        <nav className="bg-card text-card-foreground border-b sticky top-0 z-50 w-full shadow-sm">
            <div className="container mx-auto flex items-center h-16 px-4">
                <Link to="/" className="mr-6 flex items-center space-x-2">
                    <span className="font-bold sm:inline-block">{t('navbarLogo')}</span>
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
      <Route path="supervisors" element={<AdminSupervisorsPage />} /> {/* Added route */}
      {/* <Route path="centers" element={<AdminCentersPage />} /> */}
      {/* <Route path="students" element={<AdminStudentsPage />} /> */}
      <Route path="*" element={<div>Admin Page Not Found</div>} />
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
