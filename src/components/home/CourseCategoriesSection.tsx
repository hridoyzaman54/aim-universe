import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  BookText, 
  GraduationCap, 
  Palette, 
  Heart, 
  Baby,
  ArrowRight,
  Users
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const categories = [
  {
    id: 'english',
    titleKey: 'courses.english',
    icon: BookOpen,
    color: 'from-primary to-accent',
    students: '12,450',
    courses: 85,
  },
  {
    id: 'bangla',
    titleKey: 'courses.bangla',
    icon: BookText,
    color: 'from-accent to-success',
    students: '28,300',
    courses: 120,
  },
  {
    id: 'medium',
    titleKey: 'courses.medium',
    icon: GraduationCap,
    color: 'from-success to-warning',
    students: '8,750',
    courses: 65,
  },
  {
    id: 'creative',
    titleKey: 'courses.creative',
    icon: Palette,
    color: 'from-warning to-energy',
    students: '5,200',
    courses: 40,
  },
  {
    id: 'special',
    titleKey: 'courses.special',
    icon: Heart,
    color: 'from-energy to-primary',
    students: '3,100',
    courses: 25,
  },
  {
    id: 'tiny',
    titleKey: 'courses.tiny',
    icon: Baby,
    color: 'from-tiny-orange to-tiny-pink',
    students: '15,800',
    courses: 50,
  },
];

const CourseCategoriesSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 relative">
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
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-2">
              <span className="gradient-text">{t('courses.title')}</span>
            </h2>
            <p className="text-muted-foreground text-lg">Find your perfect learning path</p>
          </div>
          <Link to="/courses">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-medium transition-colors"
            >
              {t('common.viewAll')}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link to={category.id === 'tiny' ? '/tiny-explorers' : '/courses'}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative overflow-hidden rounded-2xl bg-card border border-border p-6 cursor-pointer"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-5 group-hover:opacity-10 transition-opacity`} />

                  <div className="relative z-10 flex items-start gap-4">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center flex-shrink-0`}
                    >
                      <category.icon className="w-8 h-8 text-foreground" />
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {t(category.titleKey)}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {category.students}
                        </span>
                        <span>{category.courses} courses</span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center md:hidden"
        >
          <Link to="/courses">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
            >
              {t('common.viewAll')}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CourseCategoriesSection;
