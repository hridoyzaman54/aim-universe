import { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

export const useScrollAnimation = (threshold: number = 0.1) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });

  return { ref, isInView };
};

export const useParallax = (speed: number = 0.5) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const element = ref.current;
      const rect = element.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * speed;
      
      element.style.transform = `translateY(${rate}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return ref;
};

export default { useScrollAnimation, useParallax };
