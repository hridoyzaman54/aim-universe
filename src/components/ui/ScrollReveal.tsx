import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';

type AnimationType = 
  | 'fadeUp' 
  | 'fadeDown' 
  | 'fadeLeft' 
  | 'fadeRight' 
  | 'scale' 
  | 'scaleUp'
  | 'rotate' 
  | 'blur'
  | 'flip'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'zoomIn'
  | 'zoomOut'
  | 'bounce';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
  stagger?: number;
}

const animations: Record<AnimationType, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -60 },
    visible: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.5, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0 },
  },
  rotate: {
    hidden: { opacity: 0, rotate: -10, scale: 0.9 },
    visible: { opacity: 1, rotate: 0, scale: 1 },
  },
  blur: {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: { opacity: 1, filter: 'blur(0px)' },
  },
  flip: {
    hidden: { opacity: 0, rotateX: 90, scale: 0.9 },
    visible: { opacity: 1, rotateX: 0, scale: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0 },
  },
  slideDown: {
    hidden: { opacity: 0, y: -100 },
    visible: { opacity: 1, y: 0 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
  },
  zoomIn: {
    hidden: { opacity: 0, scale: 0.3 },
    visible: { opacity: 1, scale: 1 },
  },
  zoomOut: {
    hidden: { opacity: 0, scale: 1.5 },
    visible: { opacity: 1, scale: 1 },
  },
  bounce: {
    hidden: { opacity: 0, y: 80, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }
    },
  },
};

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fadeUp',
  delay = 0,
  duration = 0.6,
  className = '',
  threshold = 0.1,
  once = true,
}) => {
  const { ref, isVisible } = useScrollReveal({ threshold, triggerOnce: once });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={animations[animation]}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1] as const,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger container for animating children in sequence
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  threshold?: number;
  once?: boolean;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className = '',
  staggerDelay = 0.1,
  threshold = 0.1,
  once = true,
}) => {
  const { ref, isVisible } = useScrollReveal({ threshold, triggerOnce: once });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger item to be used inside StaggerContainer
interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  animation?: AnimationType;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  className = '',
  animation = 'fadeUp',
}) => {
  return (
    <motion.div
      variants={animations[animation]}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Parallax scroll effect component
interface ParallaxScrollProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // -1 to 1, negative = slower, positive = faster
}

export const ParallaxScroll: React.FC<ParallaxScrollProps> = ({
  children,
  className = '',
  speed = 0.5,
}) => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0, triggerOnce: false });
  
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
      style={{
        willChange: 'transform',
      }}
    >
      {children}
    </motion.div>
  );
};

// Counter animation for numbers
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 2,
  className = '',
  suffix = '',
  prefix = '',
}) => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.5, triggerOnce: true });
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const startValue = 0;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(startValue + (value - startValue) * easeOutQuart);
      
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, value, duration]);

  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>} className={className}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
};

// Text reveal animation (word by word)
interface TextRevealProps {
  text: string;
  className?: string;
  wordDelay?: number;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className = '',
  wordDelay = 0.05,
}) => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.5, triggerOnce: true });
  const words = text.split(' ');

  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>} className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.4,
            delay: index * wordDelay,
            ease: [0.22, 1, 0.36, 1] as const,
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

export default ScrollReveal;
