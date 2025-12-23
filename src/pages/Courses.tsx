import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  BookOpen, 
  BookText, 
  GraduationCap, 
  Palette, 
  Heart, 
  Baby,
  Star,
  Users,
  Clock,
  Play,
  ChevronDown,
  X
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const categories = [
  { id: 'all', label: 'All Courses', icon: BookOpen },
  { id: 'english', label: 'English Version', icon: BookOpen },
  { id: 'bangla', label: 'Bangla Version (NCTB)', icon: BookText },
  { id: 'medium', label: 'English Medium', icon: GraduationCap },
  { id: 'creative', label: 'Creative Studio', icon: Palette },
  { id: 'special', label: 'Special Needs', icon: Heart },
  { id: 'tiny', label: 'Tiny Explorers', icon: Baby },
];

const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Bangla', 'ICT', 'History', 'Geography', 'Arts'];

// Sample courses data
const coursesData = [
  {
    id: 1,
    title: 'HSC Physics Complete Course',
    category: 'bangla',
    class: 'Class 12',
    subject: 'Physics',
    instructor: 'Dr. Rahman Khan',
    rating: 4.9,
    students: 12500,
    duration: '120 hours',
    thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=225&fit=crop',
    progress: 0,
    price: '৳2,500',
  },
  {
    id: 2,
    title: 'SSC Mathematics Mastery',
    category: 'bangla',
    class: 'Class 10',
    subject: 'Mathematics',
    instructor: 'Prof. Anika Das',
    rating: 4.8,
    students: 18200,
    duration: '90 hours',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=225&fit=crop',
    progress: 0,
    price: '৳2,000',
  },
  {
    id: 3,
    title: 'Creative Drawing & Arts',
    category: 'creative',
    class: 'All Classes',
    subject: 'Arts',
    instructor: 'Artist Mehedi',
    rating: 4.9,
    students: 5600,
    duration: '45 hours',
    thumbnail: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=225&fit=crop',
    progress: 0,
    price: '৳1,500',
  },
  {
    id: 4,
    title: 'O-Level Chemistry',
    category: 'medium',
    class: 'Class 10',
    subject: 'Chemistry',
    instructor: 'Dr. Sarah Ahmed',
    rating: 4.7,
    students: 3400,
    duration: '80 hours',
    thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=225&fit=crop',
    progress: 0,
    price: '৳3,500',
  },
  {
    id: 5,
    title: 'Adaptive Learning: Focus Skills',
    category: 'special',
    class: 'All Classes',
    subject: 'Special Education',
    instructor: 'Dr. Fatima Begum',
    rating: 5.0,
    students: 890,
    duration: '30 hours',
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=225&fit=crop',
    progress: 0,
    price: '৳1,800',
  },
  {
    id: 6,
    title: 'English Literature Advanced',
    category: 'english',
    class: 'Class 11',
    subject: 'English',
    instructor: 'Prof. James Miller',
    rating: 4.8,
    students: 7800,
    duration: '60 hours',
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=225&fit=crop',
    progress: 0,
    price: '৳2,200',
  },
];

const Courses: React.FC = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredCourses = coursesData.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesClass = !selectedClass || course.class === selectedClass;
    const matchesSubject = !selectedSubject || course.subject === selectedSubject;
    const matchesSearch = !searchQuery || course.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesClass && matchesSubject && matchesSearch;
  });

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Header */}
        <section className="py-12 border-b border-border">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">{t('courses.title')}</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Discover courses tailored for your learning journey
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar - Desktop */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-8 space-y-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Categories */}
                <div className="glass-card p-4">
                  <h3 className="font-display font-semibold mb-4 text-foreground">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <motion.button
                        key={cat.id}
                        whileHover={{ x: 4 }}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === cat.id
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-secondary'
                        }`}
                      >
                        <cat.icon className="w-4 h-4" />
                        <span className="text-sm">{cat.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Class Filter */}
                <div className="glass-card p-4">
                  <h3 className="font-display font-semibold mb-4 text-foreground">Class</h3>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground"
                  >
                    <option value="">All Classes</option>
                    {classes.map((cls) => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                {/* Subject Filter */}
                <div className="glass-card p-4">
                  <h3 className="font-display font-semibold mb-4 text-foreground">Subject</h3>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground"
                  >
                    <option value="">All Subjects</option>
                    {subjects.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                {(selectedCategory !== 'all' || selectedClass || selectedSubject || searchQuery) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedClass('');
                      setSelectedSubject('');
                      setSearchQuery('');
                    }}
                    className="w-full"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </aside>

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 space-y-4 overflow-hidden"
                  >
                    {/* Mobile Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Mobile Category Pills */}
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`px-4 py-2 rounded-full text-sm transition-colors ${
                            selectedCategory === cat.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-muted-foreground'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Course Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  {filteredCourses.length} courses found
                </p>
              </div>

              <motion.div
                layout
                className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {filteredCourses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <motion.div
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="group glass-card overflow-hidden cursor-pointer"
                      >
                        {/* Thumbnail */}
                        <div className="relative aspect-video overflow-hidden">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <motion.div
                              initial={{ scale: 0 }}
                              whileHover={{ scale: 1 }}
                              className="w-16 h-16 rounded-full bg-primary flex items-center justify-center"
                            >
                              <Play className="w-8 h-8 text-primary-foreground ml-1" />
                            </motion.div>
                          </div>
                          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-sm font-semibold text-primary">
                            {course.price}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <span className="px-2 py-1 rounded-full bg-secondary">{course.class}</span>
                            <span className="px-2 py-1 rounded-full bg-secondary">{course.subject}</span>
                          </div>

                          <h3 className="font-display font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {course.title}
                          </h3>

                          <p className="text-sm text-muted-foreground mb-4">
                            by {course.instructor}
                          </p>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1 text-warning">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="font-medium">{course.rating}</span>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {course.students.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {course.duration}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {filteredCourses.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-display text-xl font-semibold mb-2">No courses found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default Courses;
