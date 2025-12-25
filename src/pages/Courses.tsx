import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid, List, Star, Clock, Users, BookOpen, TrendingUp, Award } from 'lucide-react';
import { mockCourses } from '@/lib/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnhancedCourseCard from '@/components/courses/EnhancedCourseCard';

const Courses: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'price-low' | 'price-high'>('popular');
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(mockCourses.map(c => c.category)))];
  const levels = ['all', 'beginner', 'intermediate', 'advanced'];

  // Filter and sort courses
  const filteredCourses = mockCourses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
      const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
      return matchesSearch && matchesCategory && matchesLevel;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.enrolledStudents - a.enrolledStudents;
        case 'newest':
          return 0; // Mock: would sort by date
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        default:
          return 0;
      }
    });

  const handleWishlistToggle = (courseId: string) => {
    setWishlist(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleEnroll = (courseId: string) => {
    console.log('Enroll in course:', courseId);
    // Navigate to enrollment page
  };

  // Stats
  const stats = [
    { icon: BookOpen, label: 'Total Courses', value: mockCourses.length, color: 'from-blue-500 to-blue-600' },
    { icon: Users, label: 'Active Students', value: '10,000+', color: 'from-green-500 to-green-600' },
    { icon: Award, label: 'Expert Instructors', value: '50+', color: 'from-purple-500 to-purple-600' },
    { icon: Star, label: 'Avg Rating', value: '4.8', color: 'from-yellow-500 to-yellow-600' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-16 px-4">
        <div className="container mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-4"
          >
            Explore Our Courses
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto"
          >
            Discover world-class education with expert instructors and comprehensive learning materials
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg bg-card border-none shadow-xl"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="p-6 text-center bg-card hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Filters and Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="w-full md:w-auto">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="w-full md:w-auto">
                {categories.map(cat => (
                  <TabsTrigger key={cat} value={cat} className="capitalize">
                    {cat}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {levels.map(level => (
                <option key={level} value={level} className="capitalize">
                  {level === 'all' ? 'All Levels' : level}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            {/* View Toggle */}
            <div className="flex gap-1 border border-border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="px-3"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="px-3"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing <span className="font-bold text-foreground">{filteredCourses.length}</span> courses
          </p>
        </div>

        {/* Courses Grid/List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-6'
            }
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
                  onEnroll={handleEnroll}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or search query
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedLevel('all');
            }}>
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Courses;
