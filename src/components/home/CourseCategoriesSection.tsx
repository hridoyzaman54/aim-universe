import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const categories = [
  {
    id: 'english',
    titleKey: 'courses.english',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&h=350&fit=crop',
    students: '12,450',
    courses: 85,
    color: 'bg-primary',
  },
  {
    id: 'bangla',
    titleKey: 'courses.bangla',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&h=350&fit=crop',
    students: '28,300',
    courses: 120,
    color: 'bg-accent',
  },
  {
    id: 'medium',
    titleKey: 'courses.medium',
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=500&h=350&fit=crop',
    students: '8,750',
    courses: 65,
    color: 'bg-success',
  },
  {
    id: 'creative',
    titleKey: 'courses.creative',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=350&fit=crop',
    students: '5,200',
    courses: 40,
    color: 'bg-warning',
  },
  {
    id: 'special',
    titleKey: 'courses.special',
    image: 'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=500&h=350&fit=crop',
    students: '3,100',
    courses: 25,
    color: 'bg-energy',
  },
  {
    id: 'tiny',
    titleKey: 'courses.tiny',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500&h=350&fit=crop',
    students: '15,800',
    courses: 50,
    color: 'bg-tiny-orange',
  },
];

const CourseCategoriesSection: React.FC = () => {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const headerY = useTransform(scrollYProgress, [0, 0.5], ['30px', '0px']);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section ref={sectionRef} className="py-24 bg-background relative overflow-hidden">
      {/* Parallax Background */}
      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '15%']) }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-primary/5 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-accent/5 to-transparent" />
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header with Parallax */}
        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="font-display text-4xl md:text-5xl font-bold mb-2 text-foreground"
            >
              {t('courses.title')}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-muted-foreground text-lg"
            >
              Find your perfect learning path
            </motion.p>
          </div>
          
          {/* Navigation Arrows */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="hidden md:flex items-center gap-3"
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll('left')}
                className="rounded-full border-border hover:bg-secondary hover:border-primary/50"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll('right')}
                className="rounded-full border-border hover:bg-secondary hover:border-primary/50"
              >
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Horizontal Scroll Carousel */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: 60, rotateY: 15 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="flex-shrink-0 snap-start"
            >
              <Link to={category.id === 'tiny' ? '/tiny-explorers' : '/courses'}>
                <motion.div
                  whileHover={{ y: -15, scale: 1.02 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative w-80 h-[420px] rounded-2xl overflow-hidden cursor-pointer shadow-card hover:shadow-elevated transition-all duration-500"
                >
                  {/* Background Image with Parallax */}
                  <motion.div
                    className="absolute inset-0"
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.8 }}
                  >
                    <img
                      src={category.image}
                      alt={t(category.titleKey)}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                  {/* Category Badge */}
                  <motion.div 
                    initial={{ scale: 0, y: -20 }}
                    whileInView={{ scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.05, type: 'spring' }}
                    className={`absolute top-4 left-4 px-4 py-1.5 rounded-full ${category.color} text-primary-foreground text-sm font-semibold shadow-lg`}
                  >
                    {category.courses} courses
                  </motion.div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <motion.h3 
                      className="font-display text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300"
                    >
                      {t(category.titleKey)}
                    </motion.h3>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{category.students} students</span>
                    </div>
                  </div>

                  {/* Hover Arrow */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-foreground/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <ArrowRight className="w-5 h-5 text-foreground" />
                  </motion.div>

                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button - Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center md:hidden"
        >
          <Link to="/courses">
            <Button className="bg-primary text-primary-foreground">
              {t('common.viewAll')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CourseCategoriesSection;
