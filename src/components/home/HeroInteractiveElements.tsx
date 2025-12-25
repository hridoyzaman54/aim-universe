import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Rocket, 
  Target, 
  Zap, 
  Star, 
  Sparkles, 
  TrendingUp,
  Award,
  BookOpen,
  Lightbulb,
  Users,
  Globe
} from 'lucide-react';

// Floating interactive orb that follows mouse
export const FloatingOrb: React.FC<{ color: string; size: number; delay: number }> = ({ color, size, delay }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / 50);
      mouseY.set(e.clientY / 50);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        x,
        y,
        filter: 'blur(40px)',
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

// Particle system with interactive elements
export const ParticleField: React.FC = () => {
  const [particles] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// 3D rotating icon ring
export const IconRing: React.FC = () => {
  const icons = [
    { Icon: Brain, color: 'text-primary', label: 'AI Learning' },
    { Icon: Rocket, color: 'text-accent', label: 'Fast Growth' },
    { Icon: Target, color: 'text-energy', label: 'Goal Oriented' },
    { Icon: Zap, color: 'text-warning', label: 'Quick Results' },
    { Icon: Award, color: 'text-success', label: 'Achievements' },
    { Icon: Lightbulb, color: 'text-primary', label: 'Innovation' },
    { Icon: Users, color: 'text-accent', label: 'Community' },
    { Icon: Globe, color: 'text-energy', label: 'Global' },
  ];

  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {icons.map((item, index) => {
        const angle = (index * 360) / icons.length + rotation;
        const radius = 280;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;
        const scale = Math.cos((angle * Math.PI) / 180) * 0.5 + 0.7;
        const opacity = Math.cos((angle * Math.PI) / 180) * 0.4 + 0.6;

        return (
          <motion.div
            key={index}
            className={`absolute ${item.color}`}
            style={{
              transform: `translate(${x}px, ${y}px) scale(${scale})`,
              opacity,
              zIndex: Math.floor(scale * 10),
            }}
          >
            <motion.div
              whileHover={{ scale: 1.3, rotate: 360 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
              <item.Icon className="w-8 h-8 relative z-10" />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md"
              >
                {item.label}
              </motion.div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};

// Animated statistic counter
export const AnimatedStat: React.FC<{ 
  end: number; 
  duration?: number; 
  suffix?: string;
  prefix?: string;
}> = ({ end, duration = 2, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const increment = end / (duration * 60);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 1000 / 60);
        }
      },
      { threshold: 0.5 }
    );

    if (nodeRef.current) {
      observer.observe(nodeRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <div ref={nodeRef} className="tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
};

// Morphing blob shape
export const MorphingBlob: React.FC<{ className?: string; delay?: number }> = ({ 
  className = '', 
  delay = 0 
}) => {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      animate={{
        borderRadius: [
          '60% 40% 30% 70% / 60% 30% 70% 40%',
          '30% 60% 70% 40% / 50% 60% 30% 60%',
          '60% 40% 30% 70% / 60% 30% 70% 40%',
        ],
        scale: [1, 1.1, 1],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 20,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

// Interactive card that tilts on hover
export const TiltCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
};

// Animated achievement badge
export const AchievementBadge: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  delay?: number;
}> = ({ icon, label, value, color, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={isVisible ? { scale: 1, opacity: 1 } : {}}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 20 }}
      onViewportEnter={() => setIsVisible(true)}
      className={`relative group cursor-pointer`}
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
        className={`relative bg-gradient-to-br ${color} p-4 rounded-2xl shadow-lg backdrop-blur-sm border border-white/20`}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 opacity-20"
        >
          <Sparkles className="w-full h-full text-white" />
        </motion.div>
        
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="text-white text-2xl">{icon}</div>
          <div className="text-white font-bold text-xl">{value}</div>
          <div className="text-white/90 text-xs font-medium">{label}</div>
        </div>

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{
            boxShadow: [
              `0 0 20px ${color.includes('primary') ? 'hsl(var(--primary))' : 'hsl(var(--accent))'}`,
              `0 0 40px ${color.includes('primary') ? 'hsl(var(--primary))' : 'hsl(var(--accent))'}`,
              `0 0 20px ${color.includes('primary') ? 'hsl(var(--primary))' : 'hsl(var(--accent))'}`,
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  );
};

// Animated wave background
export const WaveBackground: React.FC = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none opacity-10">
      <motion.svg
        viewBox="0 0 1440 320"
        className="w-full"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.path
          fill="currentColor"
          className="text-primary"
          animate={{
            d: [
              'M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,149.3C672,139,768,149,864,170.7C960,192,1056,224,1152,224C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z',
              'M0,192L48,197.3C96,203,192,213,288,202.7C384,192,480,160,576,144C672,128,768,128,864,144C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z',
              'M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,149.3C672,139,768,149,864,170.7C960,192,1056,224,1152,224C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z',
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.svg>
    </div>
  );
};

export default {
  FloatingOrb,
  ParticleField,
  IconRing,
  AnimatedStat,
  MorphingBlob,
  TiltCard,
  AchievementBadge,
  WaveBackground,
};
