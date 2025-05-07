import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen bg-background">
      {/* Sidebar - Handles its own visibility based on screen size + mobile state */}
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        setIsMobileOpen={setIsMobileSidebarOpen} 
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