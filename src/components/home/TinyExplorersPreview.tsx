import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const starY = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']);
  const rainbowY = useTransform(scrollYProgress, [0, 1], ['20%', '-20%']);
  const contentX = useTransform(scrollYProgress, [0, 0.5], ['-30px', '0px']);
  const cardsX = useTransform(scrollYProgress, [0, 0.5], ['30px', '0px']);

  return (
    <section ref={sectionRef} className="py-24 bg-tiny-bg relative overflow-hidden">
      {/* Parallax Decorations */}
      <motion.div
        style={{ y: starY }}
        className="absolute top-10 left-10 text-6xl hidden md:block"
      >
        <motion.span
          animate={{ rotate: [0, 20, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          ⭐
        </motion.span>
      </motion.div>
      <motion.div
        style={{ y: rainbowY }}
        className="absolute bottom-10 right-10 text-6xl hidden md:block"
      >
        <motion.span
          animate={{ rotate: [0, -10, 0], y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          🌈
        </motion.span>
      </motion.div>
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-1/3 right-1/4 text-4xl hidden lg:block"
      >
        🎈
      </motion.div>
      <motion.div
        animate={{ scale: [1, 1.3, 1], rotate: [0, -5, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute bottom-1/4 left-1/4 text-3xl hidden lg:block"
      >
        🦋
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content with Parallax */}
          <motion.div
            style={{ x: contentX }}
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Badge */}
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tiny-orange/20 border border-tiny-orange/30 mb-6"
            >
              <Baby className="w-5 h-5 text-tiny-orange" />
              <span className="font-display font-semibold text-tiny-orange">
                {t('tiny.title')} 🧸
              </span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground"
            >
              {t('tiny.subtitle')}
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-muted-foreground mb-8"
            >
              {t('tiny.description')}
            </motion.p>

            {/* Kid Photos with Stagger */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex -space-x-4 mb-8"
            >
              {[
                'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=100&h=100&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1595429035839-c99c298ffdde?w=100&h=100&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1594608661623-aa0bd3a69799?w=100&h=100&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?w=100&h=100&fit=crop&crop=face',
              ].map((src, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0, x: -20 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + index * 0.1, type: 'spring' }}
                  whileHover={{ scale: 1.15, zIndex: 10 }}
                  className="w-14 h-14 rounded-full border-4 border-tiny-bg overflow-hidden shadow-lg cursor-pointer"
                >
                  <img src={src} alt="Happy kid" className="w-full h-full object-cover" />
                </motion.div>
              ))}
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1, type: 'spring' }}
                whileHover={{ scale: 1.1 }}
                className="w-14 h-14 rounded-full border-4 border-tiny-bg bg-tiny-pink flex items-center justify-center shadow-lg"
              >
                <span className="text-primary-foreground font-bold text-sm">15k+</span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Link to="/tiny-explorers">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    className="group px-8 py-6 text-lg font-bold rounded-full bg-tiny-orange hover:bg-tiny-orange/90 text-primary-foreground shadow-lg transition-all duration-300"
                  >
                    <Sparkles className="mr-2 w-5 h-5" />
                    Enter Tiny World
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Activity Cards Grid with Parallax */}
          <motion.div
            style={{ x: cardsX }}
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 gap-4"
          >
            {activities.map((activity, index) => (
              <motion.div
                key={activity.label}
                initial={{ opacity: 0, y: 40, rotate: index % 2 === 0 ? -5 : 5 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.3 + index * 0.15,
                  ease: [0.16, 1, 0.3, 1]
                }}
                whileHover={{ 
                  y: -12, 
                  rotate: index % 2 === 0 ? 3 : -3,
                  scale: 1.05
                }}
                className="relative rounded-3xl overflow-hidden shadow-lg cursor-pointer border-4 border-background group"
                style={{ boxShadow: '0 10px 0 rgba(0,0,0,0.08)' }}
              >
                <motion.img 
                  src={activity.image} 
                  alt={activity.label}
                  className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-3">
                  <motion.span 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    className="text-3xl"
                  >
                    {activity.icon}
                  </motion.span>
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
