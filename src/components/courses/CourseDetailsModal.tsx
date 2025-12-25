import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Users, Star, BookOpen, Calendar, CheckCircle, Award, Download, Video } from 'lucide-react';
import { Course } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CourseDetailsModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onEnroll?: (courseId: string) => void;
}

const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({
  course,
  isOpen,
  onClose,
  onEnroll
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        {/* Header with Thumbnail */}
        <div className="relative h-64 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary text-white font-bold">
                {course.category}
              </Badge>
              {course.isFree && (
                <Badge className="bg-green-500 text-white font-bold">
                  FREE COURSE
                </Badge>
              )}
            </div>
            <h2 className="text-3xl font-bold mb-2">{course.title}</h2>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-current text-yellow-400" />
                {course.rating} ({course.reviews} reviews)
              </span>
              <span>{course.enrolledStudents} students enrolled</span>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(90vh-16rem)]">
          <div className="p-6 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-secondary/30 rounded-lg p-4 text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-sm text-muted-foreground">Duration</div>
                <div className="font-bold">{course.duration}</div>
              </div>
              <div className="bg-secondary/30 rounded-lg p-4 text-center">
                <BookOpen className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-sm text-muted-foreground">Lessons</div>
                <div className="font-bold">{course.totalLessons}</div>
              </div>
              <div className="bg-secondary/30 rounded-lg p-4 text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-sm text-muted-foreground">Students</div>
                <div className="font-bold">{course.enrolledStudents}</div>
              </div>
              <div className="bg-secondary/30 rounded-lg p-4 text-center">
                <Award className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-sm text-muted-foreground">Level</div>
                <div className="font-bold capitalize">{course.level}</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Course Description</h3>
              <p className="text-muted-foreground leading-relaxed">{course.description}</p>
            </div>

            {/* What You'll Learn */}
            <div>
              <h3 className="text-xl font-bold mb-3 text-foreground">What You'll Learn</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {course.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor */}
            <div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Instructor</h3>
              <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
                  {course.instructor.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-lg text-foreground">{course.instructor}</div>
                  <div className="text-sm text-muted-foreground">Expert Instructor</div>
                </div>
              </div>
            </div>

            {/* Live Class Schedule */}
            <div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Live Class Schedule</h3>
              <div className="bg-secondary/30 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">{course.schedule.liveClasses}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Timezone: {course.schedule.timezone}
                </div>
              </div>
            </div>

            {/* Syllabus Preview */}
            {course.syllabus.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Course Syllabus</h3>
                <div className="space-y-3">
                  {course.syllabus.map((week, index) => (
                    <div key={index} className="border border-border rounded-lg overflow-hidden">
                      <div className="bg-secondary/30 p-4">
                        <div className="font-bold text-foreground">Week {week.week}: {week.title}</div>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="text-sm text-muted-foreground font-semibold mb-2">Topics:</div>
                        <ul className="space-y-1 ml-4">
                          {week.topics.map((topic, topicIndex) => (
                            <li key={topicIndex} className="text-sm text-foreground list-disc">
                              {topic}
                            </li>
                          ))}
                        </ul>
                        {week.materials.length > 0 && (
                          <>
                            <div className="text-sm text-muted-foreground font-semibold mt-3 mb-2">Materials:</div>
                            <div className="space-y-1">
                              {week.materials.map((material) => (
                                <div key={material.id} className="flex items-center gap-2 text-sm text-foreground">
                                  {material.type === 'video' && <Video className="w-4 h-4 text-primary" />}
                                  {material.type === 'pdf' && <Download className="w-4 h-4 text-accent" />}
                                  <span>{material.title}</span>
                                  {material.duration && (
                                    <span className="text-xs text-muted-foreground">({material.duration})</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price & Enrollment */}
            <div className="sticky bottom-0 bg-card border-t border-border pt-4 flex items-center justify-between">
              <div>
                {course.isFree ? (
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">FREE</div>
                ) : (
                  <div>
                    <div className="text-3xl font-bold text-primary">৳{course.price.toLocaleString()}</div>
                    {course.originalPrice && (
                      <div className="text-sm text-muted-foreground line-through">
                        ৳{course.originalPrice.toLocaleString()}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <Button
                size="lg"
                onClick={() => {
                  onEnroll?.(course.id);
                  onClose();
                }}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg px-8"
              >
                Enroll Now
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CourseDetailsModal;
