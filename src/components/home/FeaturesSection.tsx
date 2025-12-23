import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Video, Heart, Tv, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

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

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {t('features.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.titleKey}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link to={feature.link}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="group relative bg-card border border-border rounded-2xl overflow-hidden cursor-pointer transition-shadow duration-300 hover:shadow-elevated"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <motion.img
                      src={feature.image}
                      alt={t(feature.titleKey)}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                    />
                    <div className="absolute inset-0 bg-background/40" />
                    
                    {/* Icon Badge */}
                    <div className="absolute top-4 left-4 w-14 h-14 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                      <feature.icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-display text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                      {t(feature.titleKey)}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {t(feature.descKey)}
                    </p>

                    {/* Learn More */}
                    <div className="flex items-center text-primary text-sm font-medium">
                      <span>{t('common.learnMore')}</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
