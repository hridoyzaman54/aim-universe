import React, { createContext, useContext, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import AIChatbot from '@/components/dashboard/AIChatbot';
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
      <div className="min-h-screen bg-background flex">
        {/* Fixed Sidebar - always visible on desktop */}
        {!isMobile && (
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        )}
        
        {/* Main content wrapper - uses flex to fill remaining space */}
        <main 
          className="flex-1 min-h-screen transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ 
            marginLeft: isMobile ? 0 : sidebarWidth,
            width: isMobile ? '100%' : `calc(100% - ${sidebarWidth}px)`
          }}
        >
          <div className="w-full max-w-full overflow-x-hidden">
            {children}
          </div>
        </main>

        {/* AI Chatbot - appears on all pages */}
        <AIChatbot />
      </div>
    </SidebarContext.Provider>
  );
};

export default Layout;
