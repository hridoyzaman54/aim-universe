import React, { useEffect, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

type CursorType = 'default' | 'hover' | 'click' | 'text' | 'link';

const CustomCursor: React.FC = () => {
  const [cursorType, setCursorType] = useState<CursorType>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const moveCursor = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
  }, [cursorX, cursorY]);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      moveCursor(e);
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.closest('button') || target.closest('[role="button"]')) {
        setCursorType('hover');
      } else if (target.closest('a') || target.closest('[data-cursor="link"]')) {
        setCursorType('link');
      } else if (target.closest('input') || target.closest('textarea') || target.closest('[contenteditable]')) {
        setCursorType('text');
      } else {
        setCursorType('default');
      }
    };

    const handleMouseDown = () => setCursorType('click');
    const handleMouseUp = () => setCursorType('default');

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('resize', checkMobile);
    };
  }, [moveCursor, isMobile]);

  if (isMobile) return null;

  const getCursorStyles = () => {
    switch (cursorType) {
      case 'hover':
        return {
          width: 60,
          height: 60,
          backgroundColor: 'hsl(var(--primary) / 0.2)',
          borderColor: 'hsl(var(--primary))',
          mixBlendMode: 'difference' as const,
        };
      case 'link':
        return {
          width: 80,
          height: 80,
          backgroundColor: 'hsl(var(--accent) / 0.15)',
          borderColor: 'hsl(var(--accent))',
          borderRadius: '30%',
        };
      case 'text':
        return {
          width: 4,
          height: 32,
          backgroundColor: 'hsl(var(--primary))',
          borderColor: 'transparent',
          borderRadius: '2px',
        };
      case 'click':
        return {
          width: 16,
          height: 16,
          backgroundColor: 'hsl(var(--primary))',
          borderColor: 'hsl(var(--primary))',
        };
      default:
        return {
          width: 20,
          height: 20,
          backgroundColor: 'transparent',
          borderColor: 'hsl(var(--foreground))',
        };
    }
  };

  const styles = getCursorStyles();

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Main cursor */}
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border-2"
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
              translateX: '-50%',
              translateY: '-50%',
            }}
            animate={{
              width: styles.width,
              height: styles.height,
              backgroundColor: styles.backgroundColor,
              borderColor: styles.borderColor,
              borderRadius: styles.borderRadius || '50%',
              mixBlendMode: styles.mixBlendMode || 'normal',
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          />

          {/* Cursor dot */}
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999] w-1 h-1 rounded-full bg-primary"
            style={{
              x: cursorX,
              y: cursorY,
              translateX: '-50%',
              translateY: '-50%',
            }}
            animate={{
              scale: cursorType === 'click' ? 0 : 1,
              opacity: cursorType === 'text' ? 0 : 1,
            }}
          />

          {/* Trail effect */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="fixed top-0 left-0 pointer-events-none z-[9998] w-2 h-2 rounded-full bg-primary/20"
              style={{
                x: cursorXSpring,
                y: cursorYSpring,
                translateX: '-50%',
                translateY: '-50%',
              }}
              animate={{
                scale: cursorType === 'hover' ? 1.5 - i * 0.3 : 1 - i * 0.2,
                opacity: 0.3 - i * 0.1,
              }}
              transition={{
                duration: 0.3,
                delay: i * 0.05,
              }}
            />
          ))}
        </>
      )}
    </AnimatePresence>
  );
};

export default CustomCursor;
