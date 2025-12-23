import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, BookOpen, Clock, Trophy, 
  Target, Flame, Calendar 
} from 'lucide-react';
import { Card } from '@/components/ui/card';

interface CourseProgress {
  id: string;
  title: string;
  progress: number;
  lessonsCompleted: number;
  totalLessons: number;
  lastAccessed: string;
}

const mockCourses: CourseProgress[] = [
  {
    id: '1',
    title: 'Introduction to Programming',
    progress: 75,
    lessonsCompleted: 6,
    totalLessons: 8,
    lastAccessed: '2 hours ago'
  },
  {
    id: '2',
    title: 'HSC Physics',
    progress: 45,
    lessonsCompleted: 9,
    totalLessons: 20,
    lastAccessed: 'Yesterday'
  },
  {
    id: '3',
    title: 'SSC Mathematics',
    progress: 90,
    lessonsCompleted: 18,
    totalLessons: 20,
    lastAccessed: '3 days ago'
  }
];

const ProgressTracker: React.FC = () => {
  const weeklyStats = {
    hoursLearned: 12.5,
    lessonsCompleted: 8,
    quizzesPassed: 5,
    streak: 7
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-display font-bold text-foreground">
          Your Progress
        </h2>
      </div>

      {/* Weekly Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Hours Learned', value: weeklyStats.hoursLearned, icon: Clock, color: 'text-primary', suffix: 'hrs' },
          { label: 'Lessons Done', value: weeklyStats.lessonsCompleted, icon: BookOpen, color: 'text-accent' },
          { label: 'Quizzes Passed', value: weeklyStats.quizzesPassed, icon: Trophy, color: 'text-warning' },
          { label: 'Day Streak', value: weeklyStats.streak, icon: Flame, color: 'text-energy', suffix: '🔥' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 text-center">
              <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
              <p className="text-2xl font-bold text-foreground">
                {stat.value}{stat.suffix && <span className="text-sm ml-1">{stat.suffix}</span>}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Course Progress */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Course Progress
        </h3>

        <div className="space-y-6">
          {mockCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">{course.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {course.lessonsCompleted}/{course.totalLessons} lessons • {course.lastAccessed}
                  </p>
                </div>
                <span className={`text-sm font-semibold ${
                  course.progress >= 90 ? 'text-green-500' :
                  course.progress >= 50 ? 'text-primary' :
                  'text-warning'
                }`}>
                  {course.progress}%
                </span>
              </div>

              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${course.progress}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                  className={`h-full rounded-full ${
                    course.progress >= 90 ? 'bg-green-500' :
                    course.progress >= 50 ? 'bg-primary' :
                    'bg-warning'
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Weekly Activity */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          This Week's Activity
        </h3>

        <div className="flex items-end justify-between h-32 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
            const heights = [60, 80, 45, 90, 70, 30, 50];
            const isToday = index === 4; // Friday as example
            
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: heights[index] }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`w-full rounded-t-lg ${
                    isToday ? 'bg-primary' : 'bg-primary/30'
                  }`}
                />
                <span className={`text-xs ${isToday ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
};

export default ProgressTracker;
