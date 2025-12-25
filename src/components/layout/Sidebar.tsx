import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  BookOpen,
  LayoutDashboard,
  Baby,
  Gamepad2,
  Tv,
  Heart,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Languages,
  Plus,
  Search,
  MessageCircle,
  HelpCircle,
  Mail,
  X,
  Accessibility,
  LogIn,
  User,
  Shield,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import Logo from '@/components/ui/Logo';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

const quickActions = [
  { icon: Search, label: 'Search Courses', href: '/courses' },
  { icon: BookOpen, label: 'Browse Courses', href: '/courses' },
  { icon: MessageCircle, label: 'Live Chat', onClick: () => console.log('Open chat') },
  { icon: HelpCircle, label: 'Help Center', href: '/dashboard' },
  { icon: Mail, label: 'Contact Us', onClick: () => window.location.href = 'mailto:support@shikkhok.com' },
];

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, role } = useAuth();
  const location = useLocation();
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);

  const navItems = [
    { path: '/', icon: Home, label: t('nav.home') },
    { path: '/courses', icon: BookOpen, label: t('nav.courses') },
    { path: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { path: '/tiny-explorers', icon: Baby, label: t('nav.tinyExplorers') },
    { path: '/special-needs', icon: Accessibility, label: 'Special Needs' },
    { path: '/counselling', icon: Heart, label: 'Counselling' },
    { path: '/quest-lab', icon: Gamepad2, label: t('nav.questLab') },
    { path: '/aimverse', icon: Tv, label: t('nav.aimverse') },
    // Admin link for admins
    ...(role === 'admin' 
      ? [{ path: '/admin', icon: Shield, label: 'Admin' }]
      : []
    ),
  ];

  // Separate auth/profile item - always visible at bottom
  const authItem = user 
    ? { path: '/profile', icon: User, label: 'Profile' }
    : { path: '/auth', icon: LogIn, label: 'Login / Sign Up' };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-[100] flex flex-col"
    >
      {/* Logo */}
      <div className="px-3 py-2 flex items-center gap-2 border-b border-sidebar-border min-h-[80px]">
        <Logo collapsed={collapsed} showText={!collapsed} size="sm" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-primary')} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="font-medium text-sm whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Quick Actions Menu */}
      <div className="px-2 pb-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setQuickMenuOpen(!quickMenuOpen)}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200',
            quickMenuOpen
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
          )}
        >
          <motion.div
            animate={{ rotate: quickMenuOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {quickMenuOpen ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-medium text-sm whitespace-nowrap"
              >
                Quick Actions
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        <AnimatePresence>
          {quickMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-2 space-y-1">
                {quickActions.map((action) => {
                  const ActionWrapper = action.href ? Link : 'button';
                  const wrapperProps = action.href
                    ? { to: action.href }
                    : { onClick: action.onClick };

                  return (
                    <ActionWrapper
                      key={action.label}
                      {...(wrapperProps as any)}
                      onClick={() => {
                        action.onClick?.();
                        setQuickMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                    >
                      <action.icon className="w-4 h-4 flex-shrink-0" />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-sm whitespace-nowrap"
                          >
                            {action.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </ActionWrapper>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        {/* Auth/Profile Button - Always visible - PROMINENT */}
        <Link to={authItem.path}>
          <motion.div
            whileHover={{ scale: 1.03, boxShadow: '0 8px 16px rgba(0,0,0,0.15)' }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              'w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl transition-all shadow-md',
              location.pathname === authItem.path
                ? 'bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground font-bold'
                : 'bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold hover:shadow-lg'
            )}
          >
            <authItem.icon className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-bold whitespace-nowrap tracking-wide"
                >
                  {authItem.label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </Link>

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm whitespace-nowrap"
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Language Toggle */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <Languages className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm whitespace-nowrap"
              >
                {language === 'en' ? <span className="font-bangla">বাংলা</span> : 'English'}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Collapse Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
