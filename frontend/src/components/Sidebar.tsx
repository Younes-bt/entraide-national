import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Building, Library, Users, UserCog, GraduationCap, BookUser, X, LayoutDashboard, UsersRound } from 'lucide-react'; // Added LayoutDashboard and UsersRound icons
import { LanguageSwitcher } from './language-switcher';
import { ThemeToggleButton } from './ThemeToggleButton';
import { cn } from "@/lib/utils"; // Assuming you have this from shadcn setup for class merging

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();

  // Close sidebar when a link is clicked on mobile
  const handleLinkClick = () => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  // Define sidebar links based on user role (for admin)
  // TODO: Adapt links based on actual user role if Sidebar becomes generic
  const navLinks = [
    { href: '/admin', label: 'sidebar.dashboard', icon: LayoutDashboard },
    { href: '/admin/centers', label: 'sidebar.centers', icon: Building },
    { href: '/admin/associations', label: 'sidebar.associations', icon: Library },
    { href: '/admin/supervisors', label: 'sidebar.supervisors', icon: UsersRound },
    { href: '/admin/trainers', label: 'sidebar.trainers', icon: UserCog },
    { href: '/admin/students', label: 'sidebar.students', icon: GraduationCap },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden" 
          onClick={() => setIsMobileOpen(false)} 
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 flex flex-col h-screen bg-card text-card-foreground border-r p-4",
          "transition-transform duration-300 ease-in-out md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header with Mobile Close Button */}
        <div className="flex items-center justify-between p-4 border-b mb-4">
          <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.profile_picture || undefined} alt={`${user?.first_name} ${user?.last_name}`} />
                <AvatarFallback>{user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                 <p className="font-semibold text-md leading-none">{user?.first_name} {user?.last_name}</p>
                 <p className="text-xs text-muted-foreground leading-none mt-1">{user?.role_display || user?.role}</p>
              </div>
          </div>
           <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close sidebar</span>
           </Button>
        </div>

        {/* Body: Navigation Links */}
        <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href} onClick={handleLinkClick}>
              <Button 
                variant={isActive(link.href) ? "secondary" : "ghost"} 
                className="w-full justify-start"
              >
                <link.icon className="mr-2 h-4 w-4" />
                {t(link.label)} {/* Assuming labels are translation keys */}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t space-y-2 px-2">
          <div className="flex justify-around items-center mb-2">
            <ThemeToggleButton /> 
            <LanguageSwitcher />
          </div>
          <Button variant="ghost" className="w-full justify-start" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            {t('logout')}
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar; 