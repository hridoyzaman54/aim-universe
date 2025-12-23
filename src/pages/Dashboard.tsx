import React from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Clock, 
  BookOpen, 
  Video, 
  FileText, 
  Trophy,
  Calendar,
  Bell,
  ArrowRight,
  Star,
  CheckCircle2
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import AIChatbot from '@/components/dashboard/AIChatbot';

// Sample enrolled courses
const enrolledCourses = [
  {
    id: 1,
    title: 'HSC Physics Complete Course',
    instructor: 'Dr. Rahman Khan',
    progress: 45,
    lastLesson: 'Chapter 5: Electromagnetic Waves',
    nextClass: 'Tomorrow, 4:00 PM',
    thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=225&fit=crop',
  },
  {
    id: 2,
    title: 'SSC Mathematics Mastery',
    instructor: 'Prof. Anika Das',
    progress: 72,
    lastLesson: 'Chapter 8: Trigonometry',
    nextClass: 'Today, 6:00 PM',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=225&fit=crop',
  },
];

const upcomingClasses = [
  {
    id: 1,
    title: 'SSC Mathematics - Live Doubt Session',
    time: 'Today, 6:00 PM',
    duration: '1.5 hours',
    isLive: true,
  },
  {
    id: 2,
    title: 'HSC Physics - Chapter 6 Introduction',
    time: 'Tomorrow, 4:00 PM',
    duration: '2 hours',
    isLive: false,
  },
  {
    id: 3,
    title: 'Creative Arts Workshop',
    time: 'Dec 25, 10:00 AM',
    duration: '3 hours',
    isLive: false,
  },
];

const notifications = [
  { id: 1, text: 'New lecture uploaded: Physics Chapter 6', time: '2 hours ago' },
  { id: 2, text: 'Quiz results available for Mathematics', time: '5 hours ago' },
  { id: 3, text: 'Live class starting in 30 minutes', time: 'Just now' },
];

const Dashboard: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Welcome back, <span className="gradient-text">Student</span>
            </h1>
            <p className="text-muted-foreground">Continue your learning journey</p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              { label: 'Courses Enrolled', value: '5', icon: BookOpen, color: 'text-primary' },
              { label: 'Hours Watched', value: '127', icon: Clock, color: 'text-accent' },
              { label: 'Quizzes Completed', value: '23', icon: Trophy, color: 'text-warning' },
              { label: 'Certificates', value: '2', icon: Star, color: 'text-energy' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="glass-card p-4"
              >
                <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
                <p className="text-3xl font-display font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Continue Learning */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                  <Play className="w-5 h-5 text-primary" />
                  Continue Learning
                </h2>
                <div className="space-y-4">
                  {enrolledCourses.map((course) => (
                    <motion.div
                      key={course.id}
                      whileHover={{ scale: 1.02 }}
                      className="glass-card p-4 flex gap-4 cursor-pointer group"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-40 h-24 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-background/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-10 h-10 text-primary" />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">{course.instructor}</p>
                        <p className="text-xs text-muted-foreground mb-3">
                          Last: {course.lastLesson}
                        </p>

                        {/* Progress Bar */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${course.progress}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                            />
                          </div>
                          <span className="text-sm font-medium text-primary">{course.progress}%</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Upcoming Live Classes */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                  <Video className="w-5 h-5 text-accent" />
                  Upcoming Live Classes
                </h2>
                <div className="space-y-3">
                  {upcomingClasses.map((cls, index) => (
                    <motion.div
                      key={cls.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="glass-card p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          cls.isLive ? 'bg-energy/20' : 'bg-secondary'
                        }`}>
                          {cls.isLive ? (
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="w-3 h-3 rounded-full bg-energy"
                            />
                          ) : (
                            <Calendar className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{cls.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {cls.time} • {cls.duration}
                          </p>
                        </div>
                      </div>
                      {cls.isLive ? (
                        <Button size="sm" className="bg-energy hover:bg-energy/90">
                          Join Now
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline">
                          Set Reminder
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Notifications */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card p-5"
              >
                <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-warning" />
                  Notifications
                </h3>
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-foreground">{notif.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-4 text-primary">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="glass-card p-5"
              >
                <h3 className="font-display font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Browse Courses', icon: BookOpen },
                    { label: 'My Quizzes', icon: FileText },
                    { label: 'Study Materials', icon: FileText },
                    { label: 'Certificates', icon: Trophy },
                  ].map((action) => (
                    <motion.button
                      key={action.label}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
                    >
                      <action.icon className="w-6 h-6 text-primary" />
                      <span className="text-xs text-center text-foreground">{action.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <AIChatbot />
    </Layout>
  );
};

export default Dashboard;
