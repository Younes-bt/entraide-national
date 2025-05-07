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
import { Button } from "@/components/ui/button";
import { ThemeProvider, useTheme } from '@/components/theme-provider';
import { Moon, Sun, User as UserIcon, LogOut as LogOutIcon, LogIn as LogInIcon } from "lucide-react"; // Import new icons
import { LanguageSwitcher } from '@/components/language-switcher';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from '@/contexts/AuthContext'; // Import AuthProvider and useAuth

// Theme toggle button component
function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();

  return (
    <Button 
      variant="outline" 
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

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
  // const navigate = useNavigate(); // Keep if needed elsewhere

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <nav 
           className="bg-card text-card-foreground border-b sticky top-0 z-50 w-full shadow-sm"
      >
        <div className="container mx-auto flex items-center h-16 px-4">
          {/* Left: Logo */}
          <Link to="/" className="mr-6 flex items-center space-x-2">
            {/* <img src="/logo.svg" alt="Entraide Logo" className="h-6 w-6" /> Placeholder for actual logo */}
            <span className="font-bold sm:inline-block">{t('navbarLogo')}</span>
          </Link>

          {/* Center: Navigation Links */}
          <div className="flex-1 flex justify-center items-center space-x-1 sm:space-x-4">
            <Link to="/"><Button variant="ghost">{t('home')}</Button></Link>
            <Link to="/about"><Button variant="ghost">{t('aboutUs')}</Button></Link>
            <Link to="/contact"><Button variant="ghost">{t('contactUs')}</Button></Link>
            <Link to="/faq"><Button variant="ghost">{t('faq')}</Button></Link>
            {/* Example admin/student links - to be moved or conditionally rendered later */}
            {user?.role === 'admin' && (
                 <Link to="/admin/dashboard"><Button variant="ghost">{t('adminDashboard')}</Button></Link>
            )}
            {user?.role === 'center_supervisor' && (
                 <Link to="/center/dashboard"><Button variant="ghost">{t('centerDashboard')}</Button></Link>
            )}
            {user?.role === 'association_supervisor' && (
                 <Link to="/association/dashboard"><Button variant="ghost">{t('associationDashboard')}</Button></Link>
            )}
            {user?.role === 'trainer' && (
                 <Link to="/trainer/dashboard"><Button variant="ghost">{t('trainerDashboard')}</Button></Link>
            )}
            {user?.role === 'student' && (
                 <Link to="/student/dashboard"><Button variant="ghost">{t('studentDashboard')}</Button></Link>
            )}
          </div>

          {/* Right: Actions & User */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <LanguageSwitcher />
            <ThemeToggleButton />
            {isLoading ? (
              <span className="text-sm">Loading...</span> // Simple loading indicator
            ) : isAuthenticated() && user ? (
              <>
                <span className="text-sm hidden sm:inline">
                  {t('greeting', { 
                    firstName: user.first_name || '', 
                    lastName: user.last_name || '' 
                  }).trim() || user.email || 'User'}
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

      {/* Main content area */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route 
            path="/login" 
            element={
              isAuthenticated() && user ? (
                <Navigate to={getDashboardPath(user.role)} replace />
              ) : (
                <LoginPage /> 
              )
            }
          />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/faq" element={<FAQPage />} />
          
          {/* Protected Routes */}
          <Route path="/admin/dashboard" element={isAuthenticated() && user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" replace />} />
          <Route path="/center/dashboard" element={isAuthenticated() && user?.role === 'center_supervisor' ? <CenterDashboard /> : <Navigate to="/login" replace />} />
          <Route path="/association/dashboard" element={isAuthenticated() && user?.role === 'association_supervisor' ? <AssociationDashboard /> : <Navigate to="/login" replace />} />
          <Route path="/trainer/dashboard" element={isAuthenticated() && user?.role === 'trainer' ? <TrainerDashboard /> : <Navigate to="/login" replace />} />
          <Route path="/student/dashboard" element={isAuthenticated() && user?.role === 'student' ? <StudentDashboard /> : <Navigate to="/login" replace />} />
          
          <Route path="*" element={<div className="text-center"><h2>{t('notFoundTitle')}</h2><Link to="/"><Button variant="link">{t('goHome')}</Button></Link></div>} />
        </Routes>
      </main>
    </div>
  );
}

// App wrapper with ThemeProvider and BrowserRouter
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
