import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, BookOpen, Video, Trophy, Bell, 
  Mic, Brain, TrendingUp, FileText
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VideoPlayer from '@/components/dashboard/VideoPlayer';
import QuizModule from '@/components/dashboard/QuizModule';
import PodcastGenerator from '@/components/dashboard/PodcastGenerator';
import ProgressTracker from '@/components/dashboard/ProgressTracker';
import NotificationsPanel from '@/components/dashboard/NotificationsPanel';
import AIChatbot from '@/components/dashboard/AIChatbot';

const enrolledCourses = [
  {
    id: 1,
    title: 'HSC Physics Complete Course',
    instructor: 'Dr. Rahman Khan',
    progress: 45,
    lastLesson: 'Chapter 5: Electromagnetic Waves',
    thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=225&fit=crop',
  },
  {
    id: 2,
    title: 'Introduction to Programming',
    instructor: 'Prof. Sarah Ahmed',
    progress: 75,
    lastLesson: 'Lesson 6: Functions & Methods',
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=225&fit=crop',
  },
];

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

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

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 h-auto bg-transparent">
              {[
                { value: 'overview', label: 'Overview', icon: TrendingUp },
                { value: 'lessons', label: 'Lessons', icon: Video },
                { value: 'quizzes', label: 'Quizzes', icon: Brain },
                { value: 'content', label: 'AI Content', icon: Mic },
                { value: 'notifications', label: 'Updates', icon: Bell },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-3"
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <ProgressTracker />
                </div>
                <div>
                  <NotificationsPanel />
                </div>
              </div>
            </TabsContent>

            {/* Lessons Tab */}
            <TabsContent value="lessons" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <h2 className="text-xl font-display font-bold flex items-center gap-2">
                    <Video className="w-5 h-5 text-primary" />
                    Current Lesson
                  </h2>
                  <VideoPlayer title="Chapter 5: Electromagnetic Waves" />
                  
                  <h3 className="text-lg font-semibold mt-6">Continue Learning</h3>
                  <div className="space-y-4">
                    {enrolledCourses.map((course) => (
                      <motion.div
                        key={course.id}
                        whileHover={{ scale: 1.02 }}
                        className="glass-card p-4 flex gap-4 cursor-pointer group"
                      >
                        <div className="relative w-32 h-20 rounded-xl overflow-hidden flex-shrink-0">
                          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-background/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-8 h-8 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{course.title}</h3>
                          <p className="text-sm text-muted-foreground">{course.lastLesson}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${course.progress}%` }} />
                            </div>
                            <span className="text-sm font-medium text-primary">{course.progress}%</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-accent" />
                    Study Materials
                  </h3>
                  <div className="space-y-3">
                    {['Lecture Slides.pdf', 'Practice Problems.pdf', 'Summary Notes.pdf'].map((file, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ x: 5 }}
                        className="p-3 rounded-xl bg-secondary flex items-center gap-3 cursor-pointer"
                      >
                        <FileText className="w-5 h-5 text-primary" />
                        <span className="text-sm text-foreground">{file}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Quizzes Tab */}
            <TabsContent value="quizzes">
              <div className="max-w-3xl mx-auto">
                <QuizModule />
              </div>
            </TabsContent>

            {/* AI Content Tab */}
            <TabsContent value="content">
              <div className="max-w-3xl mx-auto">
                <PodcastGenerator lessonTitle="Electromagnetic Waves - Chapter 5" />
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <div className="max-w-2xl mx-auto">
                <NotificationsPanel />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <AIChatbot />
      <Footer />
    </Layout>
  );
};

export default Dashboard;
