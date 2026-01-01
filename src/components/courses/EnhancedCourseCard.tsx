import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Heart, Clock, Users, Star, BookOpen, Play, Info, Sparkles } from 'lucide-react';
import { Course } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CourseDetailsModal from './CourseDetailsModal';

interface EnhancedCourseCardProps {
  course: Course;
  isWishlisted?: boolean;
  onWishlistToggle?: (courseId: string) => void;
  onEnroll?: (courseId: string) => void;
}

const EnhancedCourseCard: React.FC<EnhancedCourseCardProps> = ({
  course,
  isWishlisted = false,
  onWishlistToggle,
  onEnroll
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 300, damping: 30 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left - rect.width / 2) / rect.width);
    mouseY.set((e.clientY - rect.top - rect.height / 2) / rect.height);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const levelColors = {
    beginner: 'bg-success/15 text-success border border-success/20',
    intermediate: 'bg-warning/15 text-warning border border-warning/20',
    advanced: 'bg-destructive/15 text-destructive border border-destructive/20'
  };

  return (
    <>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          perspective: 1000,
        }}
        className="group relative overflow-hidden transition-all duration-500 will-change-transform"
      >
        {/* Animated gradient border */}
        <motion.div
          className="absolute -inset-[1px] rounded-2xl z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))',
            backgroundSize: '200% 200%',
          }}
          animate={isHovered ? { backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />

        {/* Glow effect */}
        <motion.div
          className="absolute -inset-4 rounded-3xl pointer-events-none z-0"
          animate={{ opacity: isHovered ? 0.4 : 0 }}
          style={{
            background: 'radial-gradient(circle at center, hsl(var(--primary) / 0.3), transparent 70%)',
            filter: 'blur(20px)',
          }}
        />

        {/* Main card content */}
        <div className="relative z-10 bg-gradient-to-br from-card via-card to-secondary/10 rounded-2xl border border-border/50 backdrop-blur-sm overflow-hidden shadow-xl group-hover:shadow-2xl transition-shadow duration-500">
        {/* Wishlist Heart Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onWishlistToggle?.(course.id)}
          className={`absolute top-4 right-4 z-10 p-2 rounded-full backdrop-blur-md transition-all ${
            isWishlisted 
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/50' 
              : 'bg-white/80 dark:bg-black/60 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-black/80'
          }`}
        >
          <Heart 
            className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} 
          />
        </motion.button>

        {/* Thumbnail with Overlay */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Animated Gradient Overlay */}
          <motion.div
            animate={{
              opacity: isHovered ? 0.9 : 0.4
            }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {course.isFree && (
              <Badge className="bg-green-500 text-white font-bold shadow-lg">
                FREE
              </Badge>
            )}
            <Badge className={levelColors[course.level]}>
              {course.level.toUpperCase()}
            </Badge>
          </div>

          {/* Hover Play Icon */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="bg-primary/90 backdrop-blur-sm rounded-full p-4 shadow-2xl">
                  <Play className="w-8 h-8 text-white fill-current" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Category & Rating */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">
              {course.category}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-bold text-foreground">{course.rating}</span>
              <span className="text-xs text-muted-foreground">({course.reviews})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>

          {/* Short Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {course.shortDescription}
          </p>

          {/* Instructor */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
              {course.instructor.charAt(0)}
            </div>
            <span>{course.instructor}</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{course.totalLessons} lessons</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              <span>{course.enrolledStudents}</span>
            </div>
          </div>

          {/* Price & Actions */}
          <div className="flex items-center justify-between pt-4">
            <div>
              {course.isFree ? (
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">FREE</span>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-primary">৳{course.price.toLocaleString()}</span>
                  {course.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ৳{course.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(true)}
                className="gap-1"
              >
                <Info className="w-4 h-4" />
                Details
              </Button>
              <Button
                size="sm"
                onClick={() => onEnroll?.(course.id)}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                Enroll Now
              </Button>
            </div>
          </div>
        </div>

          {/* Shimmer effect on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-20"
            initial={{ x: '-100%', opacity: 0 }}
            animate={isHovered ? { x: '200%', opacity: [0, 0.5, 0] } : { x: '-100%', opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{
              background: 'linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.1) 50%, transparent 100%)',
              width: '50%',
            }}
          />

          {/* Corner sparkle */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute top-3 right-14 z-30"
              >
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Course Details Modal */}
      <CourseDetailsModal
        course={course}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        onEnroll={onEnroll}
      />
    </>
  );
};

export default EnhancedCourseCard;
