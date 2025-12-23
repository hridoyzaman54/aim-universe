import React, { useRef } from 'react';
import { motion } from 'framer-motion';
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
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-2 text-foreground">
              {t('courses.title')}
            </h2>
            <p className="text-muted-foreground text-lg">Find your perfect learning path</p>
          </div>
          
          {/* Navigation Arrows */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="rounded-full border-border hover:bg-secondary"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="rounded-full border-border hover:bg-secondary"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
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
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex-shrink-0 snap-start"
            >
              <Link to={category.id === 'tiny' ? '/tiny-explorers' : '/courses'}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className="group relative w-80 h-96 rounded-2xl overflow-hidden cursor-pointer shadow-card hover:shadow-elevated transition-all duration-300"
                >
                  {/* Background Image */}
                  <motion.img
                    src={category.image}
                    alt={t(category.titleKey)}
                    className="absolute inset-0 w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

                  {/* Category Badge */}
                  <div className={`absolute top-4 left-4 px-4 py-1.5 rounded-full ${category.color} text-primary-foreground text-sm font-semibold`}>
                    {category.courses} courses
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-display text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {t(category.titleKey)}
                    </h3>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{category.students} students</span>
                    </div>
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-foreground/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-foreground" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button - Mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
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
