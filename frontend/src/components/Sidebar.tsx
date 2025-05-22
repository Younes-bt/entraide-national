import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Building, Library, Users, UserCog, GraduationCap, BookUser, X, LayoutDashboard, UsersRound, Home, BookOpen, CheckSquare, Briefcase, CalendarDays, ClipboardCheck } from 'lucide-react'; // Added more icons
import { LanguageSwitcher } from './language-switcher';
import { ThemeToggleButton } from './ThemeToggleButton';
import { cn } from "@/lib/utils";
import { useTheme } from '@/components/theme-provider';
import logoImage from '@/assets/entraide-nationale-maroc-seeklogo.png';
import logoImageDark from '@/assets/entraide-nationale-maroc-seeklogo-dark.png';

export interface NavLink {
  href: string;
  label: string; // This will be a translation key
  icon: React.ElementType;
  section?: string; // Optional section key for grouping
}

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navLinks: NavLink[];
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen, navLinks }) => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const { theme } = useTheme();

  const handleLinkClick = () => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const isActive = (path: string) => {
    // Exact match for dashboard/index routes, startsWith for others
    if (path.endsWith('dashboard') || path.endsWith('dashboard/')) {
      return location.pathname === path || location.pathname === `${path}/`;
    }
    return location.pathname.startsWith(path);
  };
  
  // Group links by section
  const groupedLinks: { [key: string]: NavLink[] } = {};
  navLinks.forEach(link => {
    const sectionKey = link.section || 'default';
    if (!groupedLinks[sectionKey]) {
      groupedLinks[sectionKey] = [];
    }
    groupedLinks[sectionKey].push(link);
  });

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

      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 flex flex-col h-screen bg-card text-card-foreground border-r p-4",
          "transition-transform duration-300 ease-in-out md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b mb-4">
          <div className="flex flex-col items-center gap-2 text-center w-full">
              <img 
                src={theme === 'dark' ? logoImageDark : logoImage} 
                alt="Entraide Nationale Logo" 
                className="h-12 w-auto mb-2"
              />
              <div className="flex flex-col items-center">
                <Avatar className="h-10 w-10 mb-1">
                  <AvatarImage src={user?.profile_picture || undefined} alt={`${user?.first_name} ${user?.last_name}`} />
                  <AvatarFallback>{user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                   <p className="font-semibold text-md leading-none">{user?.first_name} {user?.last_name}</p>
                   <p className="text-xs text-muted-foreground leading-none mt-1">{user?.role_display || user?.role}</p>
                </div>
              </div>
          </div>
           <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close sidebar</span>
           </Button>
        </div>

        <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
          {Object.entries(groupedLinks).map(([sectionKey, links]) => (
            <div key={sectionKey} className="mb-4">
              {sectionKey !== 'default' && (
                <h3 className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {t(`sidebar.sections.${sectionKey}`)}
                </h3>
              )}
              {links.map((link) => (
                <Link key={link.href} to={link.href} onClick={handleLinkClick}>
                  <Button 
                    variant={isActive(link.href) ? "secondary" : "ghost"} 
                    className="w-full justify-start"
                  >
                    <link.icon className="mr-2 h-4 w-4" />
                    {t(link.label)}
                  </Button>
                </Link>
              ))}
            </div>
          ))}
        </nav>

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