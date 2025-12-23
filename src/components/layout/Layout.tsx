import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  isMobile: boolean;
}

const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  setCollapsed: () => {},
  isMobile: false,
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
    <SidebarContext.Provider value={{ collapsed, setCollapsed, isMobile }}>
      <div className="min-h-screen w-full bg-background relative">
        {/* Sidebar - rendered directly, it handles its own fixed positioning */}
        <div className="hidden lg:block">
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>
        
        {/* Main content - with padding to account for fixed sidebar */}
        <div 
          className="min-h-screen transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ paddingLeft: sidebarWidth }}
        >
          {children}
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

export default Layout;
