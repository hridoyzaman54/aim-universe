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
      <div className="min-h-screen w-full bg-background">
        {/* Sidebar - fixed position, hidden on mobile */}
        <div className="hidden lg:block fixed left-0 top-0 h-screen z-50">
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>
        
        {/* Main content - with margin to account for fixed sidebar */}
        <motion.main
          initial={false}
          animate={{ marginLeft: sidebarWidth }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="min-h-screen w-full"
        >
          {children}
        </motion.main>
      </div>
    </SidebarContext.Provider>
  );
};

export default Layout;
