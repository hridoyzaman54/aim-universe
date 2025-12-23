import React, { Suspense, lazy, useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LoadingScreen from './LoadingScreen';
import CustomCursor from '@/components/ui/CustomCursor';

// Lazy load pages for better performance
const Index = lazy(() => import('@/pages/Index'));
const Courses = lazy(() => import('@/pages/Courses'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const TinyExplorers = lazy(() => import('@/pages/TinyExplorers'));
const SpecialNeeds = lazy(() => import('@/pages/SpecialNeeds'));
const Counselling = lazy(() => import('@/pages/Counselling'));
const Auth = lazy(() => import('@/pages/Auth'));
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
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
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
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
  exit: {
    opacity: 0,
    x: -60,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
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
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -40,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

type TransitionVariant = 'fadeScale' | 'slideRight' | 'slideUp';

const variantMap = {
  fadeScale: fadeScaleVariants,
  slideRight: slideRightVariants,
  slideUp: slideUpVariants,
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

// Smooth transition overlay with wipe effect
const TransitionOverlay: React.FC<{ isVisible: boolean }> = ({ isVisible }) => (
  <AnimatePresence>
    {isVisible && (
      <>
        {/* Primary overlay */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ scaleX: 0 }}
          transition={{ 
            duration: 0.4, 
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{ transformOrigin: 'left' }}
          className="fixed inset-0 z-[200] bg-primary"
        />
        {/* Secondary overlay for depth */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ scaleX: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: 0.05,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{ transformOrigin: 'left' }}
          className="fixed inset-0 z-[199] bg-primary/50"
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
      const timer = setTimeout(() => setShowOverlay(false), 400);
      previousPath.current = location.pathname;
      return () => clearTimeout(timer);
    }
    previousPath.current = location.pathname;
  }, [location.pathname, isLoading]);

  return (
    <>
      {/* Custom Cursor */}
      <CustomCursor />
      
      {/* Loading Screen */}
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loading" />}
      </AnimatePresence>

      {/* Transition Overlay */}
      <TransitionOverlay isVisible={showOverlay} />

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
                <AnimatedPage variant="fadeScale">
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
              path="/profile"
              element={
                <AnimatedPage variant="slideUp">
                  <Profile />
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
