import React, { createContext, useContext, useState, useEffect } from 'react';
import Sidebar from './Sidebar';

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  isMobile: boolean;
  sidebarWidth: number;
}

const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  setCollapsed: () => {},
  isMobile: false,
  sidebarWidth: 280,
});

export const useSidebarContext = () => useContext(SidebarContext);

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sidebarWidth = isMobile ? 0 : (collapsed ? 80 : 280);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, isMobile, sidebarWidth }}>
      <div className="min-h-screen bg-background">
        {/* Fixed Sidebar - always visible on desktop */}
        {!isMobile && (
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        )}
        
        {/* Main content wrapper - pushes content to the right of sidebar */}
        <div 
          className="min-h-screen w-full transition-[margin-left] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ marginLeft: sidebarWidth }}
        >
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

export default Layout;
