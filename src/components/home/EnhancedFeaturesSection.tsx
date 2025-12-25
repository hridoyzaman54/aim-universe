import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Brain, Video, Heart, Tv, ArrowRight, Sparkles, Zap, Target, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import ScrollReveal from '@/components/ui/ScrollReveal';
import TiltCard from '@/components/ui/TiltCard';

const features = [
  {
    icon: Brain,
    titleKey: 'features.ai.title',
    descKey: 'features.ai.description',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop',
    link: '/courses',
    gradient: 'from-blue-500 to-cyan-500',
    iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    badge: 'AI Powered',
  },
  {
    icon: Video,
    titleKey: 'features.live.title',
    descKey: 'features.live.description',
    image: 'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=600&h=400&fit=crop',
    link: '/dashboard',
    gradient: 'from-purple-500 to-pink-500',
    iconBg: 'bg-gradient-to-br from-purple-500 to-pink-500',
    badge: 'Live Classes',
  },
  {
    icon: Heart,
    titleKey: 'features.special.title',
    descKey: 'features.special.description',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop',
    link: '/special-needs',
    gradient: 'from-rose-500 to-orange-500',
    iconBg: 'bg-gradient-to-br from-rose-500 to-orange-500',
    badge: 'Inclusive',
  },
  {
    icon: Tv,
    titleKey: 'features.streaming.title',
    descKey: 'features.streaming.description',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
    link: '/courses',
    gradient: 'from-emerald-500 to-teal-500',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-500',
    badge: 'On Demand',
  },
];

const EnhancedFeaturesSection: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section 
      ref={sectionRef} 
      className="relative overflow-hidden"
      style={{
        marginTop: '-10vh',
        paddingTop: '15vh',
        paddingBottom: '8rem',
        background: 'linear-gradient(to bottom, transparent 0%, hsl(var(--background)) 15%, hsl(var(--secondary) / 0.2) 50%, hsl(var(--background)) 100%)'
      }}
    >
      {/* Enhanced Parallax Background Elements */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-energy/5 blur-3xl" />
      </motion.div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
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

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Enhanced Section Header */}
        <ScrollReveal animation="fadeUp" className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Our Features</span>
          </motion.div>
          
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {t('features.title')}
            </motion.span>
          </h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4"
          >
            {t('features.subtitle')}
          </motion.p>
        </ScrollReveal>

        {/* Enhanced Features Grid with Advanced Animations */}
        <div className="grid sm:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <ScrollReveal 
              key={feature.titleKey} 
              animation={index % 2 === 0 ? 'fadeLeft' : 'fadeRight'} 
              delay={index * 0.15}
            >
              <Link to={feature.link}>
                <TiltCard
                  className="h-full"
                  glowColor="hsl(var(--primary))"
                  tiltIntensity={8}
                  glowIntensity={0.2}
                >
                  <motion.div 
                    className="group relative bg-card border border-border rounded-3xl overflow-hidden cursor-pointer h-full shadow-xl hover:shadow-2xl transition-all duration-500"
                    whileHover={{ y: -8 }}
                  >
                    {/* Image with Advanced Effects */}
                    <div className="relative h-56 md:h-64 overflow-hidden">
                      <motion.img
                        src={feature.image}
                        alt={t(feature.titleKey)}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.15 }}
                        transition={{ duration: 0.6 }}
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
                      
                      {/* Animated Gradient Overlay on Hover */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                      />

                      {/* Badge */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="absolute top-4 right-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border text-xs font-semibold text-foreground"
                      >
                        {feature.badge}
                      </motion.div>
                      
                      {/* Animated Icon Badge */}
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="absolute top-4 left-4"
                      >
                        <div className={`w-16 h-16 rounded-2xl ${feature.iconBg} flex items-center justify-center shadow-2xl relative overflow-hidden`}>
                          {/* Animated shine effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                          />
                          <feature.icon className="w-8 h-8 text-white relative z-10" />
                        </div>
                      </motion.div>

                      {/* Floating elements on hover */}
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        {[...Array(8)].map((_, i) => (
                          <motion.div
                            key={i}
                            className={`absolute w-1 h-1 rounded-full ${feature.iconBg}`}
                            style={{
                              left: `${20 + i * 10}%`,
                              top: `${30 + (i % 3) * 20}%`,
                            }}
                            animate={{
                              y: [0, -20, 0],
                              opacity: [0, 1, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </motion.div>
                    </div>

                    {/* Enhanced Content */}
                    <div className="p-6 md:p-8">
                      <motion.h3 
                        className="font-display text-xl md:text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300"
                        whileHover={{ x: 5 }}
                      >
                        {t(feature.titleKey)}
                      </motion.h3>
                      
                      <p className="text-muted-foreground text-base leading-relaxed mb-6">
                        {t(feature.descKey)}
                      </p>

                      {/* Enhanced Learn More Button */}
                      <motion.div 
                        className="flex items-center text-primary font-semibold text-sm gap-2 group-hover:gap-4 transition-all duration-300"
                        whileHover={{ x: 5 }}
                      >
                        <span>{t('common.learnMore')}</span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Decorative corner accents */}
                    <div className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <motion.div
                        className={`absolute top-0 right-0 w-full h-full bg-gradient-to-br ${feature.gradient} opacity-20 rounded-bl-full`}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  </motion.div>
                </TiltCard>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* Call to Action */}
        <ScrollReveal animation="fadeUp" delay={0.6} className="text-center mt-16">
          <Link to="/courses">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 bg-gradient-to-r from-primary via-accent to-energy text-white font-semibold rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-energy via-primary to-accent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative flex items-center gap-2">
                Explore All Features
                <Zap className="w-5 h-5" />
              </span>
            </motion.button>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default EnhancedFeaturesSection;
