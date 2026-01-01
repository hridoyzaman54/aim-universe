import React, { Suspense, lazy, useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LoadingScreen from './LoadingScreen';
import CustomCursor from '@/components/ui/CustomCursor';

// Lazy load pages for better performance
const Index = lazy(() => import('@/pages/Index'));
const Courses = lazy(() => import('@/pages/CoursesNew'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const StudentDashboard = lazy(() => import('@/pages/StudentDashboard'));
const ParentDashboard = lazy(() => import('@/pages/ParentDashboard'));
const TinyExplorers = lazy(() => import('@/pages/TinyExplorers'));
const SpecialNeeds = lazy(() => import('@/pages/SpecialNeeds'));
const Counselling = lazy(() => import('@/pages/Counselling'));
const Auth = lazy(() => import('@/pages/Auth'));
const ParentAuth = lazy(() => import('@/pages/ParentAuth'));
const Profile = lazy(() => import('@/pages/Profile'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Smooth fade with subtle scale
const fadeScaleVariants = {
  initial: {
    opacity: 0,
    scale: 0.98,
  },
  enter: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

// Slide from right
const slideRightVariants = {
  initial: {
    opacity: 0,
    x: 60,
  },
  enter: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    x: -60,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

// Slide up with fade
const slideUpVariants = {
  initial: {
    opacity: 0,
    y: 40,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -40,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

// Special Tiny Explorers transition - magical morph
const tinyExplorersVariants = {
  initial: {
    opacity: 0,
    scale: 0.92,
    filter: 'blur(10px) saturate(0.5)',
  },
  enter: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px) saturate(1)',
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    scale: 1.08,
    filter: 'blur(10px) saturate(0.5)',
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

type TransitionVariant = 'fadeScale' | 'slideRight' | 'slideUp' | 'tinyExplorers';

const variantMap = {
  fadeScale: fadeScaleVariants,
  slideRight: slideRightVariants,
  slideUp: slideUpVariants,
  tinyExplorers: tinyExplorersVariants,
};

// Page wrapper with animation
const AnimatedPage: React.FC<{ 
  children: React.ReactNode; 
  variant?: TransitionVariant;
}> = ({ children, variant = 'fadeScale' }) => {
  const variants = variantMap[variant];
  
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={variants}
      className="min-h-screen w-full"
    >
      {children}
    </motion.div>
  );
};

// Smooth transition overlay with theme-aware colors
const TransitionOverlay: React.FC<{ isVisible: boolean; isTinyExplorers: boolean }> = ({ 
  isVisible, 
  isTinyExplorers 
}) => (
  <AnimatePresence>
    {isVisible && (
      <>
        {/* Primary overlay - adapts to theme */}
        <motion.div
          initial={{ scaleY: 0, originY: 0 }}
          animate={{ scaleY: 1 }}
          exit={{ scaleY: 0, originY: 1 }}
          transition={{ 
            duration: 0.5, 
            ease: [0.22, 1, 0.36, 1],
          }}
          className={`fixed inset-0 z-[200] ${
            isTinyExplorers 
              ? 'bg-gradient-to-b from-amber-100 via-orange-100 to-pink-100' 
              : 'bg-gradient-to-b from-primary/90 to-accent/90'
          }`}
        />
        {/* Decorative elements for Tiny Explorers */}
        {isTinyExplorers && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="fixed inset-0 z-[201] flex items-center justify-center pointer-events-none"
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-8xl"
            >
              ✨
            </motion.div>
          </motion.div>
        )}
        {/* Secondary overlay for depth */}
        <motion.div
          initial={{ scaleY: 0, originY: 0 }}
          animate={{ scaleY: 1 }}
          exit={{ scaleY: 0, originY: 1 }}
          transition={{ 
            duration: 0.5, 
            delay: 0.05,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={`fixed inset-0 z-[199] ${
            isTinyExplorers 
              ? 'bg-gradient-to-b from-yellow-50 to-orange-50' 
              : 'bg-primary/30'
          }`}
        />
      </>
    )}
  </AnimatePresence>
);

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const isFirstRender = useRef(true);
  const previousPath = useRef(location.pathname);

  // Check if navigating to/from Tiny Explorers
  const isTinyExplorersTransition = 
    location.pathname === '/tiny-explorers' || 
    previousPath.current === '/tiny-explorers';

  // Initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      isFirstRender.current = false;
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Route change transition - only trigger on actual navigation
  useEffect(() => {
    if (!isLoading && !isFirstRender.current && previousPath.current !== location.pathname) {
      setShowOverlay(true);
      // Longer transition for Tiny Explorers for smoother theme blend
      const duration = isTinyExplorersTransition ? 600 : 450;
      const timer = setTimeout(() => setShowOverlay(false), duration);
      previousPath.current = location.pathname;
      return () => clearTimeout(timer);
    }
    previousPath.current = location.pathname;
  }, [location.pathname, isLoading, isTinyExplorersTransition]);

  return (
    <>
      {/* Custom Cursor */}
      <CustomCursor />
      
      {/* Loading Screen */}
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loading" />}
      </AnimatePresence>

      {/* Transition Overlay */}
      <TransitionOverlay 
        isVisible={showOverlay} 
        isTinyExplorers={isTinyExplorersTransition} 
      />

      {/* Routes with AnimatePresence for exit animations */}
      <AnimatePresence mode="wait">
        <Suspense
          fallback={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex items-center justify-center bg-background"
            >
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full"
                />
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-muted-foreground text-sm"
                >
                  Loading...
                </motion.p>
              </div>
            </motion.div>
          }
        >
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <AnimatedPage variant="fadeScale">
                  <Index />
                </AnimatedPage>
              }
            />
            <Route
              path="/courses"
              element={
                <AnimatedPage variant="slideRight">
                  <Courses />
                </AnimatedPage>
              }
            />
            <Route
              path="/dashboard"
              element={
                <AnimatedPage variant="slideUp">
                  <Dashboard />
                </AnimatedPage>
              }
            />
            <Route
              path="/tiny-explorers"
              element={
                <AnimatedPage variant="tinyExplorers">
                  <TinyExplorers />
                </AnimatedPage>
              }
            />
            <Route
              path="/special-needs"
              element={
                <AnimatedPage variant="slideUp">
                  <SpecialNeeds />
                </AnimatedPage>
              }
            />
            <Route
              path="/counselling"
              element={
                <AnimatedPage variant="slideRight">
                  <Counselling />
                </AnimatedPage>
              }
            />
            <Route
              path="/auth"
              element={
                <AnimatedPage variant="fadeScale">
                  <Auth />
                </AnimatedPage>
              }
            />
            <Route
              path="/parent-auth"
              element={
                <AnimatedPage variant="fadeScale">
                  <ParentAuth />
                </AnimatedPage>
              }
            />
            <Route
              path="/profile"
              element={
                <AnimatedPage variant="slideUp">
                  <Profile />
                </AnimatedPage>
              }
            />
            <Route
              path="/student-dashboard"
              element={
                <AnimatedPage variant="slideUp">
                  <StudentDashboard />
                </AnimatedPage>
              }
            />
            <Route
              path="/parent-dashboard"
              element={
                <AnimatedPage variant="slideUp">
                  <ParentDashboard />
                </AnimatedPage>
              }
            />
            <Route
              path="/admin"
              element={
                <AnimatedPage variant="slideUp">
                  <AdminDashboard />
                </AnimatedPage>
              }
            />
            <Route
              path="*"
              element={
                <AnimatedPage variant="fadeScale">
                  <NotFound />
                </AnimatedPage>
              }
            />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </>
  );
};

export default AnimatedRoutes;
