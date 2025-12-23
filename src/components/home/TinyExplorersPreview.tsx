import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Baby, Star, Sparkles, Music, Palette, BookOpen, ArrowRight, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const activities = [
  { icon: '🔤', label: 'Alphabets', color: 'bg-tiny-yellow' },
  { icon: '🔢', label: 'Numbers', color: 'bg-tiny-teal' },
  { icon: '🎨', label: 'Colors', color: 'bg-tiny-pink' },
  { icon: '🎵', label: 'Rhymes', color: 'bg-tiny-purple' },
  { icon: '🧪', label: 'Science', color: 'bg-tiny-green' },
  { icon: '📚', label: 'Stories', color: 'bg-tiny-orange' },
];

const TinyExplorersPreview: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Playful Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-tiny-yellow/10 via-background to-tiny-pink/10" />
      
      {/* Floating Decorations */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-20 left-10 text-6xl"
      >
        ⭐
      </motion.div>
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute bottom-20 right-10 text-6xl"
      >
        🌈
      </motion.div>
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-40 right-20 text-5xl"
      >
        🎈
      </motion.div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tiny-orange/20 border border-tiny-orange/30 mb-6"
              >
                <Baby className="w-5 h-5 text-tiny-orange" />
                <span className="font-display font-semibold text-tiny-orange">
                  {t('tiny.title')} 🧸
                </span>
              </motion.div>

              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-tiny-orange via-tiny-pink to-tiny-purple">
                  {t('tiny.subtitle')}
                </span>
              </h2>

              <p className="text-xl text-muted-foreground mb-8">
                {t('tiny.description')}
              </p>

              <Link to="/tiny-explorers">
                <Button
                  size="lg"
                  className="group px-8 py-6 text-lg font-bold rounded-full bg-gradient-to-r from-tiny-orange to-tiny-pink hover:shadow-lg hover:shadow-tiny-pink/30 transition-all duration-300"
                >
                  <Sparkles className="mr-2 w-5 h-5" />
                  Enter Tiny World
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            {/* Activity Cards */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-3 gap-4"
            >
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, rotate: [-2, 2, 0], y: -10 }}
                  className={`${activity.color} rounded-3xl p-4 text-center cursor-pointer shadow-lg`}
                  style={{ boxShadow: '0 8px 0 rgba(0,0,0,0.1)' }}
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    className="text-4xl mb-2"
                  >
                    {activity.icon}
                  </motion.div>
                  <p className="font-display font-bold text-sm text-foreground/90">
                    {activity.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TinyExplorersPreview;
