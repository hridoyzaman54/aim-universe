import React, { useState, useEffect } from 'react';
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
  X,
  Sparkles,
  Download,
  FileText,
  Video,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TiltCard from '@/components/ui/TiltCard';
import CourseEnrollment from '@/components/courses/CourseEnrollment';
import CourseMaterials from '@/components/courses/CourseMaterials';
import CourseVideoPlayer from '@/components/courses/CourseVideoPlayer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Bangla', 'ICT', 'History', 'Geography', 'Arts', 'General'];

// Sample courses data with free course
export const coursesData = [
  {
    id: 0,
    title: 'Introduction to Learning - FREE',
    category: 'all',
    class: 'All Classes',
    subject: 'General',
    instructor: 'AIM Centre Team',
    rating: 5.0,
    students: 45000,
    duration: '15 hours',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=225&fit=crop',
    progress: 0,
    price: 'FREE',
    isFree: true,
    description: 'Start your learning journey with this comprehensive introduction course. Includes video lessons, downloadable PDFs, and audio podcasts.',
    lessons: [
      { id: 'L1', title: 'Welcome & Course Overview', duration: '10:00' },
      { id: 'L2', title: 'Getting Started with Learning', duration: '15:00' },
      { id: 'L3', title: 'Study Techniques', duration: '20:00' },
      { id: 'L4', title: 'Time Management', duration: '18:00' },
      { id: 'L5', title: 'Note Taking Skills', duration: '12:00' },
    ],
  },
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
    isFree: false,
    lessons: [
      { id: 'L1', title: 'Introduction to Physics', duration: '25:00' },
      { id: 'L2', title: 'Mechanics Fundamentals', duration: '30:00' },
      { id: 'L3', title: 'Thermodynamics', duration: '35:00' },
    ],
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
    isFree: false,
    lessons: [
      { id: 'L1', title: 'Algebra Basics', duration: '20:00' },
      { id: 'L2', title: 'Geometry', duration: '25:00' },
      { id: 'L3', title: 'Trigonometry', duration: '30:00' },
    ],
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
    isFree: false,
    lessons: [
      { id: 'L1', title: 'Basic Sketching', duration: '15:00' },
      { id: 'L2', title: 'Color Theory', duration: '20:00' },
    ],
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
    isFree: false,
    lessons: [
      { id: 'L1', title: 'Atomic Structure', duration: '25:00' },
      { id: 'L2', title: 'Chemical Bonding', duration: '30:00' },
    ],
  },
  {
    id: 5,
    title: 'Adaptive Learning: Focus Skills',
    category: 'special',
    class: 'All Classes',
    subject: 'General',
    instructor: 'Dr. Fatima Begum',
    rating: 5.0,
    students: 890,
    duration: '30 hours',
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=225&fit=crop',
    progress: 0,
    price: '৳1,800',
    isFree: false,
    lessons: [
      { id: 'L1', title: 'Understanding Focus', duration: '15:00' },
      { id: 'L2', title: 'Mindfulness Techniques', duration: '20:00' },
    ],
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
    isFree: false,
    lessons: [
      { id: 'L1', title: 'Poetry Analysis', duration: '25:00' },
      { id: 'L2', title: 'Prose & Fiction', duration: '30:00' },
    ],
  },
];

const Courses: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Enrollment state
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);
  const [enrollmentModal, setEnrollmentModal] = useState<{ isOpen: boolean; course: typeof coursesData[0] | null }>({
    isOpen: false,
    course: null,
  });
  const [materialsModal, setMaterialsModal] = useState<{ isOpen: boolean; courseId: number; courseTitle: string }>({
    isOpen: false,
    courseId: 0,
    courseTitle: '',
  });
  const [videoModal, setVideoModal] = useState<{ isOpen: boolean; courseTitle: string; videoTitle: string }>({
    isOpen: false,
    courseTitle: '',
    videoTitle: '',
  });

  // Fetch enrolled courses from Supabase
  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!user) {
        // Load from localStorage for non-authenticated users
        const saved = localStorage.getItem('enrolledCourses');
        if (saved) {
          setEnrolledCourses(JSON.parse(saved));
        }
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('course_enrollments')
          .select('course_id')
          .eq('user_id', user.id);

        if (error) throw error;

        const courseIds = data?.map(e => e.course_id) || [];
        setEnrolledCourses(courseIds);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
        // Fallback to localStorage
        const saved = localStorage.getItem('enrolledCourses');
        if (saved) {
          setEnrolledCourses(JSON.parse(saved));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrollments();
  }, [user]);

  const filteredCourses = coursesData.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory || course.category === 'all';
    const matchesClass = !selectedClass || course.class === selectedClass || course.class === 'All Classes';
    const matchesSubject = !selectedSubject || course.subject === selectedSubject;
    const matchesSearch = !searchQuery || course.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesClass && matchesSubject && matchesSearch;
  });

  const handleEnroll = async (courseId: number) => {
    const course = coursesData.find(c => c.id === courseId);
    if (!course) return;

    if (user) {
      try {
        const { error } = await supabase
          .from('course_enrollments')
          .insert({
            user_id: user.id,
            course_id: courseId,
            course_title: course.title,
          });

        if (error) throw error;
        
        setEnrolledCourses(prev => [...prev, courseId]);
        toast.success(`Enrolled in ${course.title}!`);
      } catch (error: any) {
        if (error.code === '23505') {
          // Already enrolled
          setEnrolledCourses(prev => [...prev, courseId]);
        } else {
          console.error('Error enrolling:', error);
          toast.error('Failed to enroll. Please try again.');
        }
      }
    } else {
      // Save to localStorage for non-authenticated users
      const newEnrollments = [...enrolledCourses, courseId];
      setEnrolledCourses(newEnrollments);
      localStorage.setItem('enrolledCourses', JSON.stringify(newEnrollments));
      toast.success(`Enrolled in ${course.title}!`);
    }
  };

  const isEnrolled = (courseId: number) => enrolledCourses.includes(courseId);

  const openEnrollment = (course: typeof coursesData[0]) => {
    setEnrollmentModal({ isOpen: true, course });
  };

  const openMaterials = (course: typeof coursesData[0]) => {
    setMaterialsModal({ isOpen: true, courseId: course.id, courseTitle: course.title });
  };

  const openVideo = (course: typeof coursesData[0]) => {
    const firstLesson = course.lessons?.[0];
    setVideoModal({ 
      isOpen: true, 
      courseTitle: course.title, 
      videoTitle: firstLesson?.title || 'Chapter 1: Introduction' 
    });
  };

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
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      {enrolledCourses.length} enrolled
                    </>
                  )}
                </div>
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
                      <TiltCard
                        className="h-full"
                        glowColor={course.isFree ? 'hsl(var(--success))' : 'hsl(var(--primary))'}
                        tiltIntensity={12}
                        glowIntensity={0.2}
                      >
                        <div className="group glass-card overflow-hidden h-full rounded-xl flex flex-col">
                          {/* Thumbnail */}
                          <div className="relative aspect-video overflow-hidden">
                            <motion.img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-full h-full object-cover"
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.5 }}
                            />
                            {/* Hover overlay */}
                            <motion.div 
                              className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent flex items-center justify-center"
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileHover={{ scale: 1, opacity: 1 }}
                                className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30"
                              >
                                <Play className="w-8 h-8 text-primary-foreground ml-1" />
                              </motion.div>
                            </motion.div>
                            
                            {/* Price Badge */}
                            <motion.div 
                              className={`absolute top-3 right-3 px-3 py-1 rounded-full backdrop-blur-sm text-sm font-semibold border ${
                                course.isFree 
                                  ? 'bg-success/20 text-success border-success/30' 
                                  : 'bg-background/80 text-primary border-primary/20'
                              }`}
                              whileHover={{ scale: 1.1 }}
                            >
                              {course.isFree ? (
                                <span className="flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" />
                                  FREE
                                </span>
                              ) : course.price}
                            </motion.div>

                            {/* Enrolled Badge */}
                            {isEnrolled(course.id) && (
                              <motion.div 
                                className="absolute top-3 left-3 px-3 py-1 rounded-full bg-success/90 text-white text-xs font-semibold flex items-center gap-1"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 500 }}
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                Enrolled
                              </motion.div>
                            )}

                            {/* Lesson count badge */}
                            <div className="absolute bottom-3 left-3 px-2 py-1 rounded-lg bg-background/80 backdrop-blur-sm text-xs font-medium text-foreground flex items-center gap-1">
                              <Video className="w-3 h-3" />
                              {course.lessons?.length || 0} lessons
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5 flex-1 flex flex-col">
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

                            <div className="flex items-center justify-between text-sm mb-4">
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

                            {/* Action Buttons */}
                            <div className="mt-auto space-y-2">
                              {isEnrolled(course.id) ? (
                                <div className="grid grid-cols-2 gap-2">
                                  <Button 
                                    size="sm" 
                                    onClick={() => openVideo(course)}
                                    className="w-full"
                                  >
                                    <Video className="w-4 h-4 mr-1" />
                                    Watch
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => openMaterials(course)}
                                    className="w-full"
                                  >
                                    <Download className="w-4 h-4 mr-1" />
                                    Materials
                                  </Button>
                                </div>
                              ) : (
                                <Button 
                                  onClick={() => openEnrollment(course)}
                                  className={`w-full ${course.isFree ? 'bg-success hover:bg-success/90' : ''}`}
                                >
                                  {course.isFree ? (
                                    <>
                                      <Sparkles className="w-4 h-4 mr-2" />
                                      Enroll Free
                                    </>
                                  ) : (
                                    <>
                                      <GraduationCap className="w-4 h-4 mr-2" />
                                      Enroll Now
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </TiltCard>
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

      {/* Modals */}
      {enrollmentModal.course && (
        <CourseEnrollment
          course={enrollmentModal.course}
          isOpen={enrollmentModal.isOpen}
          onClose={() => setEnrollmentModal({ isOpen: false, course: null })}
          onEnroll={handleEnroll}
        />
      )}

      <CourseMaterials
        courseId={materialsModal.courseId}
        courseTitle={materialsModal.courseTitle}
        isOpen={materialsModal.isOpen}
        onClose={() => setMaterialsModal({ isOpen: false, courseId: 0, courseTitle: '' })}
      />

      <CourseVideoPlayer
        courseTitle={videoModal.courseTitle}
        videoTitle={videoModal.videoTitle}
        isOpen={videoModal.isOpen}
        onClose={() => setVideoModal({ isOpen: false, courseTitle: '', videoTitle: '' })}
      />

      <Footer />
    </Layout>
  );
};

export default Courses;
