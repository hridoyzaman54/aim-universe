import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  Brain, 
  BookOpen, 
  GraduationCap, 
  Lightbulb, 
  Trophy, 
  Users,
  Sparkles,
  Zap,
  Target,
  Rocket
} from 'lucide-react';

// Floating educational icons with parallax
const ParallaxIcon: React.FC<{
  Icon: React.ElementType;
  scrollYProgress: any;
  offsetRange: [number, number];
  yRange: [string, string];
  xRange?: [string, string];
  rotateRange?: [number, number];
  scale?: number;
  color: string;
  delay?: number;
  className?: string;
}> = ({ 
  Icon, 
  scrollYProgress, 
  offsetRange, 
  yRange, 
  xRange = ['0%', '0%'], 
  rotateRange = [0, 0],
  scale = 1,
  color,
  delay = 0,
  className = ''
}) => {
  const y = useTransform(scrollYProgress, offsetRange, yRange);
  const x = useTransform(scrollYProgress, offsetRange, xRange);
  const rotate = useTransform(scrollYProgress, offsetRange, rotateRange);
  const opacity = useTransform(scrollYProgress, offsetRange, [1, 0]);

  const ySpring = useSpring(y, { stiffness: 100, damping: 30 });
  const xSpring = useSpring(x, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      style={{ y: ySpring, x: xSpring, rotate, opacity, scale }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 20 }}
      className={`absolute ${className}`}
    >
      <motion.div
        whileHover={{ scale: 1.2, rotate: 360 }}
        transition={{ duration: 0.6 }}
        className={`${color} backdrop-blur-xl bg-card/80 border-2 border-primary/20 rounded-2xl p-4 shadow-2xl hover:shadow-primary/50 cursor-pointer`}
      >
        <Icon className="w-8 h-8" />
        
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 hover:opacity-100 transition-opacity"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  );
};

// Animated learning path visualization
const LearningPathLine: React.FC<{ scrollYProgress: any }> = ({ scrollYProgress }) => {
  const pathLength = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none" 
      viewBox="0 0 400 600"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        d="M 50 50 Q 200 150 150 300 T 350 550"
        fill="none"
        stroke="url(#gradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="10 5"
        style={{ 
          pathLength,
          opacity,
        }}
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
          <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(var(--energy))" stopOpacity="0.6" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// 3D Book stack with parallax
const BookStack: React.FC<{ scrollYProgress: any }> = ({ scrollYProgress }) => {
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '80%']);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 0.9]);

  return (
    <motion.div
      style={{ y, rotateX, scale }}
      className="absolute top-1/4 right-12 perspective-1000"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    >
      <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="absolute w-32 h-40 bg-gradient-to-br from-primary via-accent to-energy rounded-lg shadow-2xl border border-white/20"
            style={{
              transform: `translateZ(${-index * 20}px) translateY(${index * -10}px) rotateY(${index * 5}deg)`,
              zIndex: 3 - index,
            }}
            animate={{
              rotateY: [index * 5, index * 5 + 2, index * 5],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
          >
            <div className="absolute inset-2 bg-background/90 rounded-md flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-primary" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Floating achievement badges
const AchievementBadge: React.FC<{ 
  scrollYProgress: any; 
  position: { top?: string; bottom?: string; left?: string; right?: string };
  delay: number;
  icon: React.ElementType;
  label: string;
  gradient: string;
}> = ({ scrollYProgress, position, delay, icon: Icon, label, gradient }) => {
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '120%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <motion.div
      style={{ y, scale, ...position }}
      className="absolute z-20"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 360 }}
        className={`bg-gradient-to-br ${gradient} p-1 rounded-2xl shadow-2xl cursor-pointer`}
      >
        <div className="bg-background/95 backdrop-blur-xl rounded-xl p-4 flex flex-col items-center gap-2">
          <motion.div
            style={{ rotate }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Icon className="w-8 h-8 text-primary" />
          </motion.div>
          <span className="text-xs font-bold text-foreground whitespace-nowrap">{label}</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main component
const HeroParallaxVisual: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Central gradient orb that responds to scroll
  const orbScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.5]);
  const orbOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0]);
  const orbRotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  return (
    <div ref={containerRef} className="relative h-full w-full flex items-center justify-center">
      {/* Central Gradient Orb */}
      <motion.div
        style={{ scale: orbScale, opacity: orbOpacity, rotate: orbRotate }}
        className="absolute z-10 w-96 h-96 rounded-full bg-gradient-to-br from-primary/30 via-accent/20 to-energy/30 blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Learning Path Visualization */}
      <LearningPathLine scrollYProgress={scrollYProgress} />

      {/* 3D Book Stack */}
      <BookStack scrollYProgress={scrollYProgress} />

      {/* Floating Educational Icons with Parallax */}
      <ParallaxIcon
        Icon={Brain}
        scrollYProgress={scrollYProgress}
        offsetRange={[0, 1]}
        yRange={['0%', '150%']}
        xRange={['0%', '-20%']}
        rotateRange={[0, 45]}
        color="text-primary"
        delay={0.2}
        className="top-1/4 left-8"
      />

      <ParallaxIcon
        Icon={Lightbulb}
        scrollYProgress={scrollYProgress}
        offsetRange={[0, 1]}
        yRange={['0%', '100%']}
        xRange={['0%', '15%']}
        rotateRange={[0, -30]}
        color="text-energy"
        delay={0.3}
        className="top-16 right-20"
      />

      <ParallaxIcon
        Icon={GraduationCap}
        scrollYProgress={scrollYProgress}
        offsetRange={[0, 1]}
        yRange={['0%', '130%']}
        xRange={['0%', '10%']}
        rotateRange={[0, 60]}
        color="text-accent"
        delay={0.4}
        className="bottom-32 left-16"
      />

      <ParallaxIcon
        Icon={Rocket}
        scrollYProgress={scrollYProgress}
        offsetRange={[0, 1]}
        yRange={['0%', '90%']}
        xRange={['0%', '-15%']}
        rotateRange={[0, -45]}
        color="text-primary"
        delay={0.5}
        className="bottom-20 right-24"
      />

      <ParallaxIcon
        Icon={Sparkles}
        scrollYProgress={scrollYProgress}
        offsetRange={[0, 1]}
        yRange={['0%', '110%']}
        xRange={['0%', '20%']}
        rotateRange={[0, 90]}
        color="text-energy"
        delay={0.35}
        scale={0.8}
        className="top-1/3 right-32"
      />

      {/* Achievement Badges */}
      <AchievementBadge
        scrollYProgress={scrollYProgress}
        position={{ top: '10%', left: '15%' }}
        delay={0.6}
        icon={Trophy}
        label="Excellence"
        gradient="from-yellow-500 to-orange-500"
      />

      <AchievementBadge
        scrollYProgress={scrollYProgress}
        position={{ bottom: '15%', right: '10%' }}
        delay={0.7}
        icon={Target}
        label="Goals Achieved"
        gradient="from-primary to-accent"
      />

      <AchievementBadge
        scrollYProgress={scrollYProgress}
        position={{ top: '50%', left: '5%' }}
        delay={0.65}
        icon={Users}
        label="Community"
        gradient="from-accent to-energy"
      />

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
};

export default HeroParallaxVisual;
