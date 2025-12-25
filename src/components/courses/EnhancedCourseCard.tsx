import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Clock, Users, Star, BookOpen, Calendar, Play, Info } from 'lucide-react';
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

  const levelColors = {
    beginner: 'bg-green-500/10 text-green-700 dark:text-green-400',
    intermediate: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    advanced: 'bg-red-500/10 text-red-700 dark:text-red-400'
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group relative bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-border"
      >
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

        {/* Animated Border Glow */}
        <motion.div
          animate={{
            opacity: isHovered ? 1 : 0
          }}
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, transparent, rgba(var(--primary), 0.1), transparent)',
            border: '2px solid transparent',
            backgroundClip: 'padding-box'
          }}
        />
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
