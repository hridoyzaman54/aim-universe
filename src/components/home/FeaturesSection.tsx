import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Brain, Video, Heart, Tv, ArrowRight } from 'lucide-react';
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
  },
  {
    icon: Video,
    titleKey: 'features.live.title',
    descKey: 'features.live.description',
    image: 'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=600&h=400&fit=crop',
    link: '/dashboard',
  },
  {
    icon: Heart,
    titleKey: 'features.special.title',
    descKey: 'features.special.description',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop',
    link: '/courses',
  },
  {
    icon: Tv,
    titleKey: 'features.streaming.title',
    descKey: 'features.streaming.description',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
    link: '/aimverse',
  },
];

const FeaturesSection: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-secondary/30 relative overflow-hidden">
      {/* Parallax Background Elements */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-20 left-10 w-48 md:w-72 h-48 md:h-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 md:w-96 h-64 md:h-96 rounded-full bg-accent/5 blur-3xl" />
      </motion.div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <ScrollReveal animation="fadeUp" className="text-center mb-12 md:mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            {t('features.title')}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            {t('features.subtitle')}
          </p>
        </ScrollReveal>

        {/* Features Grid with Staggered Animations */}
        <div className="grid sm:grid-cols-2 gap-4 md:gap-8">
          {features.map((feature, index) => (
            <ScrollReveal 
              key={feature.titleKey} 
              animation={index % 2 === 0 ? 'fadeLeft' : 'fadeRight'} 
              delay={index * 0.1}
            >
              <Link to={feature.link}>
                <TiltCard
                  className="h-full"
                  glowColor="hsl(var(--primary))"
                  tiltIntensity={10}
                  glowIntensity={0.15}
                >
                  <div className="group relative bg-card border border-border rounded-2xl overflow-hidden cursor-pointer h-full">
                    {/* Image with Zoom Effect */}
                    <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden">
                      <img
                        src={feature.image}
                        alt={t(feature.titleKey)}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                      
                      {/* Icon Badge */}
                      <div className="absolute top-4 left-4 w-12 md:w-14 h-12 md:h-14 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                        <feature.icon className="w-6 md:w-7 h-6 md:h-7 text-primary-foreground" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 md:p-6">
                      <h3 className="font-display text-lg md:text-xl font-semibold mb-2 md:mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                        {t(feature.titleKey)}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-3 md:mb-4 line-clamp-2">
                        {t(feature.descKey)}
                      </p>

                      {/* Learn More with Arrow Animation */}
                      <div className="flex items-center text-primary text-sm font-medium">
                        <span>{t('common.learnMore')}</span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
