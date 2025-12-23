import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LoadingScreen from './LoadingScreen';
import CustomCursor from '@/components/ui/CustomCursor';

// Lazy load pages for better performance
const Index = lazy(() => import('@/pages/Index'));
const Courses = lazy(() => import('@/pages/Courses'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const TinyExplorers = lazy(() => import('@/pages/TinyExplorers'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const pageVariants = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.98,
    filter: 'blur(10px)',
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -30,
    scale: 1.02,
    filter: 'blur(10px)',
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const slideVariants = {
  initial: {
    opacity: 0,
    x: 100,
  },
  enter: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    x: -100,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

// Page wrapper with animation
const AnimatedPage: React.FC<{ children: React.ReactNode; variant?: 'fade' | 'slide' }> = ({ 
  children, 
  variant = 'fade' 
}) => {
  const variants = variant === 'slide' ? slideVariants : pageVariants;
  
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={variants}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
};

// Route transition overlay
const TransitionOverlay: React.FC<{ isVisible: boolean }> = ({ isVisible }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'top' }}
        className="fixed inset-0 z-50 bg-primary"
      />
    )}
  </AnimatePresence>
);

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);

  // Initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Route change transition
  useEffect(() => {
    if (!isLoading) {
      setShowOverlay(true);
      const timer = setTimeout(() => setShowOverlay(false), 300);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <>
      {/* Custom Cursor */}
      <CustomCursor />
      
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loading" />}
      </AnimatePresence>

      <TransitionOverlay isVisible={showOverlay} />

      <AnimatePresence mode="wait">
        <Suspense
          fallback={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-screen flex items-center justify-center bg-background"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
              />
            </motion.div>
          }
        >
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <AnimatedPage>
                  <Index />
                </AnimatedPage>
              }
            />
            <Route
              path="/courses"
              element={
                <AnimatedPage variant="slide">
                  <Courses />
                </AnimatedPage>
              }
            />
            <Route
              path="/dashboard"
              element={
                <AnimatedPage variant="slide">
                  <Dashboard />
                </AnimatedPage>
              }
            />
            <Route
              path="/tiny-explorers"
              element={
                <AnimatedPage>
                  <TinyExplorers />
                </AnimatedPage>
              }
            />
            <Route
              path="*"
              element={
                <AnimatedPage>
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
