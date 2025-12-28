import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence, MotionValue } from 'framer-motion';
import { 
  ArrowRight, 
  Play, 
  Sparkles,
  Brain,
  BookOpen,
  GraduationCap,
  Target,
  Trophy,
  Rocket,
  Zap,
  Users,
  Award,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import AnimatedBackground from './AnimatedBackground';
import GradientMesh from './GradientMesh';
import LogoHero from './LogoHero';
import { 
  AnimatedStat,
  TiltCard
} from './HeroInteractiveElements';

// Animated text with character-by-character reveal
const TypedText: React.FC<{ text: string; delay?: number; className?: string }> = ({ 
  text, 
  delay = 0,
  className = ''
}) => {
  return (
    <span className={`inline-flex flex-wrap ${className}`}>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20, rotateX: 90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + index * 0.04,
            ease: [0.16, 1, 0.3, 1]
          }}
          className={char === ' ' ? 'mr-2' : ''}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

// Enhanced gradient text with refined shimmer effect
const ShimmerText: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <motion.span
      className={`relative inline-block ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* For light mode: solid readable color. For dark mode: keep gradient bg-clip text. */}
      <span className="relative z-30 text-slate-900 dark:bg-gradient-to-r dark:from-primary dark:via-accent dark:to-energy dark:bg-clip-text dark:text-transparent">
        {children}
      </span>

      {/* Very subtle shimmer overlay sitting behind text */}
      <motion.span
        className="absolute inset-0 pointer-events-none z-0"
        animate={{
          x: ['-180%', '180%'],
          opacity: [0, 0.08, 0]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)', filter: 'blur(6px)', mixBlendMode: 'screen' }}
      />

      {/* Secondary soft glow behind text to add depth (very low opacity) */}
      <motion.span
        className="absolute inset-0 pointer-events-none z-0"
        animate={{ x: ['-200%', '200%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1, delay: 0.1 }}
        style={{ background: 'linear-gradient(90deg, rgba(124,58,237,0.06), rgba(6,182,212,0.06))', filter: 'blur(10px)', mixBlendMode: 'screen' }}
      />
    </motion.span>
  );
};

const EnhancedHeroSection: React.FC = () => {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const scale = useSpring(
    useTransform(scrollYProgress, [0, 1], [1, 1.1]),
    { stiffness: 100, damping: 30 }
  );
  const blur = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const content = {
    en: {
      badge: 'Transform Your Learning Journey',
      titleHighlight: 'AIM Centre 360',
      subtitle: 'Aim High, Achieve Infinity',
      description: 'Experience next-generation education with AI-powered learning, expert counseling, and comprehensive support for students of all abilities.',
      cta: 'Start Learning',
      explore: 'Explore Courses',
      stats: {
        students: { value: '10000', label: 'Active Students' },
        courses: { value: '500', label: 'Expert Courses' },
        success: { value: '98', label: 'Success Rate' },
        satisfaction: { value: '95', label: 'Satisfaction' },
      }
    },
    bn: {
      badge: 'আপনার শেখার যাত্রা রূপান্তরিত করুন',
      titleHighlight: 'AIM Centre 360',
      subtitle: 'উচ্চ লক্ষ্য, অসীম সাফল্য',
      description: 'এআই-চালিত শিক্ষা, বিশেষজ্ঞ পরামর্শ এবং সকল ক্ষমতার শিক্ষার্থীদের জন্য ব্যাপক সহায়তা সহ পরবর্তী প্রজন্মের শিক্ষা অনুভব করুন।',
      cta: 'শেখা শুরু করুন',
      explore: 'কোর্স অন্বেষণ করুন',
      stats: {
        students: { value: '10000', label: 'সক্রিয় শিক্ষার্থী' },
        courses: { value: '500', label: 'বিশেষজ্ঞ কোর্স' },
        success: { value: '98', label: 'সাফল্যের হার' },
        satisfaction: { value: '95', label: 'সন্তুষ্টি' },
      }
    },
  };

  const t = content[language];

  return (
    <section
      ref={containerRef}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-background"
      style={{
        maskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)'
      }}
    >
      {/* Interactive Mouse Background */}
      {/* Animated Background Layers */}
      <div className="absolute inset-0 z-0">
        <AnimatedBackground />
        <GradientMesh />
      </div>

      {/* Right-side animated logo hero will render inside the right grid column */}

      {/* Background Parallax Layer */}
      <motion.div
        style={{ scale, filter: `blur(${blur}px)` }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5" />
      </motion.div>

      {/* Main Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-40 container mx-auto px-6 py-12 lg:py-16"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="space-y-6 text-center lg:text-left relative z-50">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="w-4 h-4 text-primary" />
                  </motion.div>
                  <span className="text-sm font-medium text-primary">{t.badge}</span>
                </div>
              </motion.div>

              {/* Main Title */}
              <div className="space-y-3">
                <motion.h1 
                  className="text-4xl lg:text-6xl font-display font-bold leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.span 
                    className="text-5xl lg:text-7xl cursor-pointer"
                    whileHover={{ 
                      scale: 1.05,
                      textShadow: "0 0 30px hsl(var(--primary) / 0.5)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <ShimmerText>
                      {t.titleHighlight}
                    </ShimmerText>
                  </motion.span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-lg lg:text-xl font-semibold bg-gradient-to-r from-accent via-primary to-energy bg-clip-text text-transparent"
                >
                  {t.subtitle}
                </motion.p>
              </div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-base text-muted-foreground max-w-2xl leading-relaxed"
              >
                {t.description}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link to="/auth">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button
                      size="lg"
                      className="group relative overflow-hidden bg-primary dark:bg-primary hover:bg-primary/90 text-white font-semibold text-base px-6 py-5 rounded-2xl shadow-lg hover:shadow-primary/40 hover:shadow-2xl transition-all duration-300"
                      onMouseEnter={() => setCursorVariant('button')}
                      onMouseLeave={() => setCursorVariant('default')}
                    >
                      {/* Animated background gradient */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      />
                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                      />
                      <span className="relative flex items-center gap-2 z-10">
                        {t.cta}
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.div>
                      </span>
                    </Button>
                  </motion.div>
                </Link>

                <Link to="/courses">
                  <Button
                    size="lg"
                    variant="outline"
                    className="group relative font-semibold text-base px-6 py-5 rounded-2xl border-2 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-300"
                  >
                    <span className="flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      {t.explore}
                    </span>
                  </Button>
                </Link>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6"
              >
                {Object.entries(t.stats).map(([key, stat], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      delay: 1.1 + index * 0.15,
                      duration: 0.6,
                      type: 'spring',
                      stiffness: 200,
                      damping: 15
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -4,
                      transition: { duration: 0.2 }
                    }}
                    className="text-center lg:text-left relative group"
                  >
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 rounded-xl bg-primary/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                    
                    {/* Content - Optimized without heavy animations */}
                    <div className="relative z-10">
                      <div className="text-2xl font-bold text-primary">
                        <AnimatedStat end={parseInt(stat.value)} suffix={key === 'students' || key === 'courses' ? '+' : '%'} />
                      </div>
                      <motion.div 
                        className="text-xs text-muted-foreground font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.3 + index * 0.15 }}
                      >
                        {stat.label}
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right Side - Large Logo with animated rings */}
            <div className="relative h-[600px] hidden lg:flex items-center justify-center">
              <div className="w-full h-full flex items-center justify-end pr-12">
                <div className="w-full max-w-[520px] h-full flex items-center justify-center relative z-10">
                  <LogoHero />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs font-medium">Scroll to explore</span>
          <motion.div
            animate={{ scaleY: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full p-1"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-primary rounded-full mx-auto"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default EnhancedHeroSection;
