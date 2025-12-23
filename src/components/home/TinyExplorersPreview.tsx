import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Baby, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const activities = [
  { icon: '🔤', label: 'Alphabets', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop' },
  { icon: '🔢', label: 'Numbers', image: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=300&h=200&fit=crop' },
  { icon: '🎨', label: 'Colors', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300&h=200&fit=crop' },
  { icon: '🎵', label: 'Rhymes', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=200&fit=crop' },
];

const TinyExplorersPreview: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-tiny-bg relative overflow-hidden">
      {/* Playful decorations */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-16 left-10 text-5xl hidden md:block"
      >
        ⭐
      </motion.div>
      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute bottom-16 right-10 text-5xl hidden md:block"
      >
        🌈
      </motion.div>

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tiny-orange/20 border border-tiny-orange/30 mb-6">
              <Baby className="w-5 h-5 text-tiny-orange" />
              <span className="font-display font-semibold text-tiny-orange">
                {t('tiny.title')} 🧸
              </span>
            </div>

            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {t('tiny.subtitle')}
            </h2>

            <p className="text-xl text-muted-foreground mb-8">
              {t('tiny.description')}
            </p>

            {/* Kid Photos */}
            <div className="flex -space-x-4 mb-8">
              {[
                'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=100&h=100&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1595429035839-c99c298ffdde?w=100&h=100&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1594608661623-aa0bd3a69799?w=100&h=100&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?w=100&h=100&fit=crop&crop=face',
              ].map((src, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="w-14 h-14 rounded-full border-4 border-tiny-bg overflow-hidden shadow-lg"
                >
                  <img src={src} alt="Happy kid" className="w-full h-full object-cover" />
                </motion.div>
              ))}
              <div className="w-14 h-14 rounded-full border-4 border-tiny-bg bg-tiny-pink flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold text-sm">15k+</span>
              </div>
            </div>

            <Link to="/tiny-explorers">
              <Button
                size="lg"
                className="group px-8 py-6 text-lg font-bold rounded-full bg-tiny-orange hover:bg-tiny-orange/90 text-primary-foreground shadow-lg transition-all duration-300"
              >
                <Sparkles className="mr-2 w-5 h-5" />
                Enter Tiny World
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Activity Cards Grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-4"
          >
            {activities.map((activity, index) => (
              <motion.div
                key={activity.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, rotate: index % 2 === 0 ? 2 : -2 }}
                className="relative rounded-3xl overflow-hidden shadow-lg cursor-pointer border-4 border-background"
                style={{ boxShadow: '0 10px 0 rgba(0,0,0,0.08)' }}
              >
                <img 
                  src={activity.image} 
                  alt={activity.label}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-3">
                  <span className="text-3xl">{activity.icon}</span>
                  <span className="font-display font-bold text-foreground">{activity.label}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TinyExplorersPreview;
