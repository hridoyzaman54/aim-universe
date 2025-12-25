import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Award, Bell, Heart, Settings, Video, FileText, CheckCircle, TrendingUp } from 'lucide-react';
import { mockStudents, mockCourses, getStudentCourses, getStudentWishlist } from '@/lib/mockData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const StudentDashboard: React.FC = () => {
  // Mock current student - in real app, get from auth context
  const currentStudent = mockStudents[0];
  const enrolledCourses = getStudentCourses(currentStudent.id);
  const wishlistedCourses = getStudentWishlist(currentStudent.id);
  const [selectedTab, setSelectedTab] = useState('overview');

  // Calculate overall progress
  const overallProgress = Object.values(currentStudent.progress).reduce(
    (acc, prog) => acc + prog.progressPercentage, 0
  ) / Object.keys(currentStudent.progress).length || 0;

  // Get unread notifications
  const unreadNotifications = currentStudent.notifications.filter(n => !n.read).length;

  // Get upcoming assignments
  const upcomingAssignments = Object.values(currentStudent.progress)
    .flatMap(prog => prog.assignments)
    .filter(a => a.status === 'pending')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-accent to-primary text-white p-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold border-4 border-white/30">
                {currentStudent.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold">Welcome back, {currentStudent.name.split(' ')[0]}!</h1>
                <p className="text-white/80">Continue your learning journey</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="text-white hover:bg-white/20 relative">
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/20">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
              <div className="flex items-center justify-between mb-2">
                <BookOpen className="w-8 h-8 text-blue-500" />
                <Badge className="bg-blue-500">Active</Badge>
              </div>
              <div className="text-3xl font-bold text-foreground">{enrolledCourses.length}</div>
              <div className="text-sm text-muted-foreground">Enrolled Courses</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-green-500" />
                <Badge className="bg-green-500">{Math.round(overallProgress)}%</Badge>
              </div>
              <div className="text-3xl font-bold text-foreground">{Math.round(overallProgress)}%</div>
              <div className="text-sm text-muted-foreground">Overall Progress</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-8 h-8 text-orange-500" />
                <Badge className="bg-orange-500">Pending</Badge>
              </div>
              <div className="text-3xl font-bold text-foreground">{upcomingAssignments.length}</div>
              <div className="text-sm text-muted-foreground">Assignments Due</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
              <div className="flex items-center justify-between mb-2">
                <Heart className="w-8 h-8 text-purple-500" />
                <Badge className="bg-purple-500">Saved</Badge>
              </div>
              <div className="text-3xl font-bold text-foreground">{wishlistedCourses.length}</div>
              <div className="text-sm text-muted-foreground">Wishlist</div>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-3xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Continue Learning */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Continue Learning</h2>
              <div className="space-y-4">
                {enrolledCourses.map((course) => {
                  const progress = currentStudent.progress[course.id];
                  return (
                    <motion.div
                      key={course.id}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                    >
                      <img src={course.thumbnail} alt={course.title} className="w-24 h-16 object-cover rounded" />
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground">{course.title}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <Progress value={progress?.progressPercentage || 0} className="flex-1" />
                          <span className="text-sm font-semibold text-muted-foreground">
                            {progress?.progressPercentage || 0}%
                          </span>
                        </div>
                      </div>
                      <Button size="sm" className="bg-gradient-to-r from-primary to-accent">
                        <Video className="w-4 h-4 mr-2" />
                        Continue
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </Card>

            {/* Upcoming Deadlines */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Upcoming Deadlines</h2>
              <div className="space-y-3">
                {upcomingAssignments.slice(0, 3).map((assignment) => {
                  const daysUntilDue = Math.ceil(
                    (new Date(assignment.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  );
                  const isUrgent = daysUntilDue <= 2;

                  return (
                    <div
                      key={assignment.id}
                      className={`p-4 rounded-lg border ${
                        isUrgent ? 'bg-red-500/10 border-red-500/30' : 'bg-secondary/30 border-border'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{assignment.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{assignment.description}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={isUrgent ? 'bg-red-500' : 'bg-primary'}>
                            {daysUntilDue} {daysUntilDue === 1 ? 'day' : 'days'} left
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Recent Notifications</h2>
              <div className="space-y-3">
                {currentStudent.notifications.slice(0, 5).map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-lg border cursor-pointer hover:bg-secondary/50 transition-colors ${
                      notif.read ? 'bg-secondary/20 border-border' : 'bg-primary/10 border-primary/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        notif.type === 'assignment' ? 'bg-orange-500/20' :
                        notif.type === 'grade' ? 'bg-green-500/20' :
                        notif.type === 'reminder' ? 'bg-blue-500/20' : 'bg-purple-500/20'
                      }`}>
                        {notif.type === 'assignment' && <FileText className="w-4 h-4 text-orange-500" />}
                        {notif.type === 'grade' && <Award className="w-4 h-4 text-green-500" />}
                        {notif.type === 'reminder' && <Clock className="w-4 h-4 text-blue-500" />}
                        {notif.type === 'announcement' && <Bell className="w-4 h-4 text-purple-500" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{notif.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                        <span className="text-xs text-muted-foreground mt-2 block">
                          {new Date(notif.date).toLocaleString()}
                        </span>
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Other tabs content would go here */}
          <TabsContent value="courses">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">My Courses - Coming Soon</h2>
              <p className="text-muted-foreground">Detailed course viewer with lessons, materials, and progress tracking.</p>
            </Card>
          </TabsContent>

          <TabsContent value="assignments">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Assignments - Coming Soon</h2>
              <p className="text-muted-foreground">View all assignments, submit work, and check grades.</p>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">All Notifications - Coming Soon</h2>
              <p className="text-muted-foreground">Complete notification center with filters and settings.</p>
            </Card>
          </TabsContent>

          <TabsContent value="wishlist">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">My Wishlist</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistedCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    whileHover={{ y: -4 }}
                    className="bg-card border border-border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all"
                  >
                    <img src={course.thumbnail} alt={course.title} className="w-full h-32 object-cover" />
                    <div className="p-4">
                      <h3 className="font-bold text-foreground mb-2">{course.title}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-primary">৳{course.price.toLocaleString()}</span>
                        <Button size="sm">Enroll</Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;
