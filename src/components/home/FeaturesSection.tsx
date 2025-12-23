import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Video, Heart, Tv, Gamepad2, Baby, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const features = [
  {
    icon: Brain,
    titleKey: 'features.ai.title',
    descKey: 'features.ai.description',
    gradient: 'from-primary to-accent',
    link: '/courses',
  },
  {
    icon: Video,
    titleKey: 'features.live.title',
    descKey: 'features.live.description',
    gradient: 'from-accent to-success',
    link: '/dashboard',
  },
  {
    icon: Heart,
    titleKey: 'features.special.title',
    descKey: 'features.special.description',
    gradient: 'from-energy to-warning',
    link: '/courses',
  },
  {
    icon: Tv,
    titleKey: 'features.streaming.title',
    descKey: 'features.streaming.description',
    gradient: 'from-warning to-primary',
    link: '/aimverse',
  },
];

const FeaturesSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="relative z-10 container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">{t('features.title')}</span>
          </h2>
          <p className="text-xl text-muted-foreground">{t('features.subtitle')}</p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  whileHover={{ scale: 1.03, y: -8 }}
                  whileTap={{ scale: 0.98 }}
                  className="group h-full glass-card p-6 cursor-pointer"
                >
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5`}
                  >
                    <feature.icon className="w-7 h-7 text-foreground" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="font-display text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {t(feature.descKey)}
                  </p>

                  {/* Learn More */}
                  <div className="flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>{t('common.learnMore')}</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
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
