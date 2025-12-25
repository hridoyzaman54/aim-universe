import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Users, Award, GraduationCap, Baby, Heart, Palette } from 'lucide-react';
import { mockCourses, courseCategories } from '@/lib/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnhancedCourseCard from '@/components/courses/EnhancedCourseCard';

const CoursesNew: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mainCategory, setMainCategory] = useState<'all' | 'academic' | 'tinyExplorers' | 'specialNeeds' | 'creativeExtra'>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedMedium, setSelectedMedium] = useState<string>('all');
  const [wishlist, setWishlist] = useState<string[]>([]);

  const categoryIcons = {
    academic: GraduationCap,
    tinyExplorers: Baby,
    specialNeeds: Heart,
    creativeExtra: Palette
  };

  // Filter courses
  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (mainCategory === 'all') return matchesSearch;
    
    const matchesCategory = mainCategory === 'academic' ? course.category === 'Academic' :
                           mainCategory === 'tinyExplorers' ? course.category === 'Tiny Explorers' :
                           mainCategory === 'specialNeeds' ? course.category === 'Special Needs' :
                           mainCategory === 'creativeExtra' ? course.category === 'Creative & Extra' : true;
    
    const matchesClass = selectedClass === 'all' || course.classLevel === selectedClass;
    const matchesMedium = selectedMedium === 'all' || course.medium === selectedMedium;
    
    return matchesSearch && matchesCategory && matchesClass && matchesMedium;
  });

  const handleWishlistToggle = (courseId: string) => {
    setWishlist(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-20 px-4 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        
        <div className="container mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-7xl font-extrabold mb-6"
          >
            Discover Your Perfect Course
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl mb-10 max-w-3xl mx-auto opacity-90"
          >
            From Play to Grade 10, Tiny Explorers to Special Needs - we've got you covered
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search courses by name, subject, or instructor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-16 pr-6 py-8 text-xl bg-card border-none shadow-2xl rounded-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Categories */}
      <div className="container mx-auto px-4 -mt-12 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Object.entries(courseCategories).map(([key, cat], index) => {
            const Icon = categoryIcons[key as keyof typeof categoryIcons];
            const isActive = mainCategory === key;
            
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  onClick={() => setMainCategory(key as any)}
                  className={`p-8 cursor-pointer transition-all hover:scale-105 ${
                    isActive ? 'ring-4 ring-primary bg-primary/10' : ''
                  }`}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                  }`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground">{cat.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Filters Section */}
      <div className="container mx-auto px-4 mb-8">
        <Card className="p-6">
          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant={mainCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setMainCategory('all')}
            >
              All Courses
            </Button>

            {/* Academic Filters */}
            {mainCategory === 'academic' && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-muted-foreground">Class:</span>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                  >
                    <option value="all">All Classes</option>
                    {courseCategories.academic.classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-muted-foreground">Medium:</span>
                  <select
                    value={selectedMedium}
                    onChange={(e) => setSelectedMedium(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                  >
                    <option value="all">All Mediums</option>
                    {courseCategories.academic.mediums.map(medium => (
                      <option key={medium.id} value={medium.id}>
                        {medium.icon} {medium.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="ml-auto text-sm text-muted-foreground">
              <strong>{filteredCourses.length}</strong> courses found
            </div>
          </div>
        </Card>
      </div>

      {/* Courses Grid */}
      <div className="container mx-auto px-4 pb-20">
        <AnimatePresence mode="wait">
          {filteredCourses.length > 0 ? (
            <motion.div
              key="courses-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <EnhancedCourseCard
                    course={course}
                    isWishlisted={wishlist.includes(course.id)}
                    onWishlistToggle={handleWishlistToggle}
                    onEnroll={(id) => console.log('Enroll:', id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-20"
            >
              <BookOpen className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
              <h3 className="text-3xl font-bold text-foreground mb-4">No courses found</h3>
              <p className="text-lg text-muted-foreground mb-8">
                Try adjusting your filters or search query
              </p>
              <Button
                size="lg"
                onClick={() => {
                  setSearchQuery('');
                  setMainCategory('all');
                  setSelectedClass('all');
                  setSelectedMedium('all');
                }}
              >
                Clear All Filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CoursesNew;
