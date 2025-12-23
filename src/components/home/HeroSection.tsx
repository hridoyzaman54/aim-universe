import React, { useRef, useState, Suspense } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, Users, BookOpen, GraduationCap, Sparkles, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import AnimatedBackground from './AnimatedBackground';

// Interactive floating element that responds to mouse
const InteractiveCard: React.FC<{
  image: string;
  position: string;
  delay: number;
  baseRotate: number;
  index: number;
}> = ({ image, position, delay, baseRotate, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 100, rotate: 0, scale: 0.5 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        rotate: baseRotate,
        scale: 1
      }}
      transition={{ 
        duration: 1.4, 
        delay: 0.5 + delay, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      className={`absolute ${position} z-20`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        animate={{ 
          y: isHovered ? 0 : [0, -15, 0],
          rotate: isHovered ? 0 : [baseRotate, baseRotate + 3, baseRotate],
          scale: isHovered ? 1.15 : 1
        }}
        transition={{ 
          duration: isHovered ? 0.3 : 5 + index, 
          repeat: isHovered ? 0 : Infinity, 
          ease: 'easeInOut' 
        }}
        className="relative group cursor-pointer"
      >
        {/* Glow effect */}
        <motion.div 
          className="absolute -inset-2 rounded-3xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          animate={isHovered ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        
        <div className="relative w-56 h-40 rounded-2xl overflow-hidden shadow-2xl border-4 border-background/80 backdrop-blur-md">
          <img 
            src={image} 
            alt="Students learning"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Animated overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Shine sweep effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
            animate={isHovered ? { translateX: '200%' } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
          
          {/* Interactive badge */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 20 }}
                className="absolute bottom-3 left-3 px-3 py-1.5 bg-background/90 backdrop-blur-sm rounded-full text-xs font-semibold text-foreground flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-primary" />
                Learn More
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Floating particles around card */}
        {isHovered && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-primary"
                initial={{ 
                  x: 0, 
                  y: 0, 
                  opacity: 1,
                  scale: 0
                }}
                animate={{ 
                  x: (Math.random() - 0.5) * 100,
                  y: (Math.random() - 0.5) * 100,
                  opacity: 0,
                  scale: 1
                }}
                transition={{ 
                  duration: 1,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 0.5
                }}
                style={{ 
                  left: '50%', 
                  top: '50%' 
                }}
              />
            ))}
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

// Animated text that types out character by character
const TypedText: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  return (
    <span className="inline-flex flex-wrap">
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20, rotateX: 90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.4,
            delay: delay + index * 0.03,
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

// Morphing blob shapes
const MorphingBlob: React.FC<{ className?: string; delay?: number }> = ({ className, delay = 0 }) => {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      animate={{
        borderRadius: [
          '60% 40% 30% 70% / 60% 30% 70% 40%',
          '30% 60% 70% 40% / 50% 60% 30% 60%',
          '60% 40% 30% 70% / 60% 30% 70% 40%'
        ],
        scale: [1, 1.1, 1],
        rotate: [0, 180, 360]
      }}
      transition={{
        duration: 20,
        delay,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  );
};

const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  // Enhanced parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '60%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.85]);
  const blur = useTransform(scrollYProgress, [0, 0.5], [0, 10]);
  
  // Multiple parallax layers
  const layer1Y = useTransform(scrollYProgress, [0, 1], ['0%', '80%']);
  const layer2Y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const layer3Y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [0, -15]);

  // Mouse tracking for interactive elements
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = (e.clientX - rect.left - rect.width / 2) / 25;
      const y = (e.clientY - rect.top - rect.height / 2) / 25;
      mouseX.set(x);
      mouseY.set(y);
      setMousePosition({ x: e.clientX, y: e.clientY });
    }
  };

  const floatingCards = [
    { 
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
      delay: 0,
      position: 'top-28 right-[5%]',
      rotate: 8
    },
    { 
      image: 'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=400&h=300&fit=crop',
      delay: 0.15,
      position: 'top-64 right-[20%]',
      rotate: -6
    },
    { 
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop',
      delay: 0.3,
      position: 'bottom-40 right-[8%]',
      rotate: 4
    },
  ];

  const stats = [
    { icon: Users, value: '50,000+', label: 'Students', color: 'text-cyan-500' },
    { icon: BookOpen, value: '200+', label: 'Courses', color: 'text-teal-500' },
    { icon: GraduationCap, value: '15+', label: 'Expert Teachers', color: 'text-primary' },
  ];

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center overflow-hidden bg-background"
    >
      {/* Morphing background blobs - Layer 1 (furthest) */}
      <motion.div style={{ y: layer1Y }} className="absolute inset-0 overflow-hidden pointer-events-none">
        <MorphingBlob className="w-[600px] h-[600px] bg-primary/10 -top-40 -left-40" delay={0} />
        <MorphingBlob className="w-[500px] h-[500px] bg-cyan-500/10 top-1/2 -right-40" delay={5} />
        <MorphingBlob className="w-[400px] h-[400px] bg-teal-500/10 bottom-0 left-1/3" delay={10} />
      </motion.div>

      {/* WebGL Animated Background - Layer 2 */}
      <Suspense fallback={null}>
        <motion.div 
          style={{ y: layer2Y, x: springX, rotateY: springX }}
          className="absolute inset-0"
        >
          <AnimatedBackground />
        </motion.div>
      </Suspense>

      {/* Floating geometric shapes - Layer 2.5 */}
      <motion.div style={{ y: layer2Y }} className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          >
            {i % 3 === 0 ? (
              <Star className="w-4 h-4 text-primary/20" />
            ) : i % 3 === 1 ? (
              <Sparkles className="w-5 h-5 text-cyan-500/20" />
            ) : (
              <Zap className="w-4 h-4 text-teal-500/20" />
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background z-[1]" />

      {/* Interactive grid lines */}
      <motion.div 
        style={{ y: layer3Y }}
        className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none z-[2]"
      >
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--primary) / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary) / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
      </motion.div>

      {/* Mouse follower glow */}
      <motion.div
        className="fixed w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none z-0"
        animate={{
          x: mousePosition.x - 192,
          y: mousePosition.y - 192,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
      />

      {/* Floating Image Cards - Desktop Only - Layer 3 */}
      <motion.div style={{ y: layer3Y }} className="hidden lg:block z-10">
        {floatingCards.map((card, index) => (
          <InteractiveCard
            key={index}
            image={card.image}
            position={card.position}
            delay={card.delay}
            baseRotate={card.rotate}
            index={index}
          />
        ))}
      </motion.div>

      {/* Main Content */}
      <motion.div 
        style={{ 
          y: contentY, 
          opacity, 
          scale,
          x: springX,
          rotateX,
          filter: useTransform(blur, (v) => `blur(${v}px)`)
        }}
        className="relative z-10 container mx-auto px-6 py-20"
      >
        <div className="max-w-3xl">
          {/* Animated Tagline with pulse ring */}
          <motion.div
            initial={{ opacity: 0, x: -60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-md"
          >
            {/* Pulse rings */}
            <motion.span 
              className="absolute inset-0 rounded-full border border-primary/30"
              animate={{ scale: [1, 1.3], opacity: [1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.span 
              className="absolute inset-0 rounded-full border border-primary/20"
              animate={{ scale: [1, 1.5], opacity: [1, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            
            <motion.span 
              animate={{ scale: [1, 1.4, 1], boxShadow: ['0 0 0 0 hsl(var(--primary))', '0 0 20px 5px hsl(var(--primary) / 0.3)', '0 0 0 0 hsl(var(--primary))'] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative w-2.5 h-2.5 rounded-full bg-primary"
            />
            <span className="text-sm font-medium text-primary tracking-wide uppercase">
              {t('hero.tagline')}
            </span>
          </motion.div>

          {/* Main Title with character animation */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground leading-tight"
          >
            <TypedText text={t('hero.title')} delay={0.3} />
          </motion.h1>

          {/* Subtitle with slide up */}
          <motion.p
            initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-2xl text-muted-foreground font-medium mb-4"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-muted-foreground/80 mb-10 max-w-2xl"
          >
            {t('hero.description')}
          </motion.p>

          {/* CTA Buttons with magnetic effect */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-start gap-4 mb-16"
          >
            <Link to="/courses">
              <motion.div 
                whileHover={{ scale: 1.05, y: -3 }} 
                whileTap={{ scale: 0.97 }}
                className="relative group"
              >
                {/* Button glow */}
                <motion.div 
                  className="absolute -inset-1 bg-primary/50 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <Button 
                  size="lg" 
                  className="relative px-8 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-lg"
                >
                  <span className="relative z-10 flex items-center">
                    {t('hero.cta.explore')}
                    <motion.span
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.span>
                  </span>
                </Button>
              </motion.div>
            </Link>
            <Link to="/dashboard">
              <motion.div 
                whileHover={{ scale: 1.05, y: -3 }} 
                whileTap={{ scale: 0.97 }}
                className="relative group"
              >
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="relative px-8 py-6 text-lg font-semibold border-2 border-foreground/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 backdrop-blur-sm overflow-hidden"
                >
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                  />
                  <span className="relative z-10 flex items-center">
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Play className="mr-2 w-5 h-5" />
                    </motion.span>
                    {t('hero.cta.start')}
                  </span>
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Stats Row with stagger animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="flex flex-wrap gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 1.4 + index * 0.15,
                  ease: [0.16, 1, 0.3, 1]
                }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="group relative flex items-center gap-3 bg-secondary/50 backdrop-blur-md rounded-xl px-5 py-4 border border-border/50 cursor-pointer overflow-hidden"
              >
                {/* Hover gradient */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                
                <motion.div 
                  className={`relative w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center ${stat.color}`}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <stat.icon className="w-6 h-6" />
                </motion.div>
                <div className="relative">
                  <motion.p 
                    className="font-display text-2xl font-bold text-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6 + index * 0.2 }}
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        style={{ opacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Scroll</span>
          <motion.div
            className="w-7 h-12 rounded-full border-2 border-primary/40 flex items-start justify-center p-2 backdrop-blur-sm"
          >
            <motion.div
              animate={{ 
                y: [0, 18, 0], 
                opacity: [1, 0.3, 1],
                scale: [1, 0.8, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-3 rounded-full bg-primary"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
