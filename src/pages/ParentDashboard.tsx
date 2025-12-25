import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, BookOpen, TrendingUp, Award, Clock, FileText, Bell, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { mockStudents, mockParents, getStudentById, getStudentCourses, Course } from '@/lib/mockData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ParentDashboard: React.FC = () => {
  // Mock: In real app, parent logs in with unique ID
  const currentParent = mockParents[0];
  const studentIds = currentParent.studentIds;
  const students = studentIds.map(id => getStudentById(id)).filter(Boolean);
  
  const [selectedStudentId, setSelectedStudentId] = useState(studentIds[0]);
  const selectedStudent = getStudentById(selectedStudentId);
  const studentCourses = selectedStudent ? getStudentCourses(selectedStudent.id) : [];

  if (!selectedStudent) return null;

  // Calculate overall metrics
  const overallProgress = Object.values(selectedStudent.progress).reduce(
    (acc, prog) => acc + prog.progressPercentage, 0
  ) / Object.keys(selectedStudent.progress).length || 0;

  const totalAssignments = Object.values(selectedStudent.progress)
    .flatMap(prog => prog.assignments).length;
  
  const completedAssignments = Object.values(selectedStudent.progress)
    .flatMap(prog => prog.assignments)
    .filter(a => a.status === 'graded' || a.status === 'submitted').length;

  const averageGrade = Object.values(selectedStudent.progress)
    .flatMap(prog => prog.assignments)
    .filter(a => a.grade !== undefined)
    .reduce((sum, a) => sum + (a.grade || 0), 0) / 
    Object.values(selectedStudent.progress).flatMap(prog => prog.assignments).filter(a => a.grade !== undefined).length || 0;

  const upcomingAssignments = Object.values(selectedStudent.progress)
    .flatMap(prog => prog.assignments)
    .filter(a => a.status === 'pending')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const recentQuizzes = Object.values(selectedStudent.progress)
    .flatMap(prog => prog.quizScores)
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white p-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Parent Dashboard</h1>
              <p className="text-white/80">Monitor your child's learning progress</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right mr-4">
                <div className="text-sm text-white/80">Logged in as</div>
                <div className="font-semibold">{currentParent.name}</div>
              </div>
              <Button variant="ghost" className="text-white hover:bg-white/20">
                <Bell className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Student Selector (if multiple children) */}
        {students.length > 1 && (
          <Card className="p-4 mb-6">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-muted-foreground">Select Student:</span>
              <div className="flex gap-2">
                {students.map((student) => (
                  <button
                    key={student?.id}
                    onClick={() => setSelectedStudentId(student?.id || '')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedStudentId === student?.id
                        ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                        : 'bg-secondary text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {student?.name}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Student Info Card */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-4xl font-bold">
              {selectedStudent.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">{selectedStudent.name}</h2>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <div className="font-semibold text-foreground">{selectedStudent.email}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Phone:</span>
                  <div className="font-semibold text-foreground">{selectedStudent.phone}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Enrolled Courses:</span>
                  <div className="font-semibold text-foreground">{selectedStudent.enrolledCourses.length}</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-foreground">{Math.round(overallProgress)}%</div>
              <div className="text-sm text-muted-foreground">Overall Progress</div>
              <Progress value={overallProgress} className="mt-2" />
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-foreground">{completedAssignments}/{totalAssignments}</div>
              <div className="text-sm text-muted-foreground">Assignments Completed</div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20">
              <div className="flex items-center justify-between mb-4">
                <Award className="w-8 h-8 text-yellow-500" />
              </div>
              <div className="text-3xl font-bold text-foreground">{Math.round(averageGrade)}%</div>
              <div className="text-sm text-muted-foreground">Average Grade</div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
              <div className="flex items-center justify-between mb-4">
                <BookOpen className="w-8 h-8 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-foreground">{studentCourses.length}</div>
              <div className="text-sm text-muted-foreground">Active Courses</div>
            </Card>
          </motion.div>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="progress" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="remarks">Remarks</TabsTrigger>
          </TabsList>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 text-foreground">Course Progress</h3>
              <div className="space-y-4">
                {studentCourses.map((course) => {
                  const progress = selectedStudent.progress[course.id];
                  return (
                    <div key={course.id} className="p-4 bg-secondary/30 rounded-lg">
                      <div className="flex items-start gap-4 mb-3">
                        <img src={course.thumbnail} alt={course.title} className="w-20 h-14 object-cover rounded" />
                        <div className="flex-1">
                          <h4 className="font-bold text-foreground">{course.title}</h4>
                          <p className="text-sm text-muted-foreground">{course.instructor}</p>
                        </div>
                        <Badge className={progress?.progressPercentage >= 75 ? 'bg-green-500' : progress?.progressPercentage >= 50 ? 'bg-yellow-500' : 'bg-orange-500'}>
                          {progress?.progressPercentage || 0}%
                        </Badge>
                      </div>
                      <Progress value={progress?.progressPercentage || 0} className="mb-2" />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{progress?.completedLessons.length || 0} of {course.totalLessons} lessons completed</span>
                        <span>Last accessed: {progress ? new Date(progress.lastAccessed).toLocaleDateString() : 'Never'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 text-foreground">Assignments & Projects</h3>
              <div className="space-y-3">
                {Object.values(selectedStudent.progress).flatMap(prog => 
                  prog.assignments.map(assignment => ({ ...assignment, courseId: prog.courseId }))
                ).map((assignment) => {
                  const daysUntilDue = Math.ceil(
                    (new Date(assignment.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  );
                  const isOverdue = daysUntilDue < 0 && assignment.status === 'pending';
                  const isUrgent = daysUntilDue <= 2 && daysUntilDue >= 0 && assignment.status === 'pending';

                  return (
                    <div
                      key={assignment.id}
                      className={`p-4 rounded-lg border ${
                        isOverdue ? 'bg-red-500/10 border-red-500/30' :
                        isUrgent ? 'bg-yellow-500/10 border-yellow-500/30' :
                        assignment.status === 'graded' ? 'bg-green-500/10 border-green-500/30' :
                        'bg-secondary/30 border-border'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-foreground">{assignment.title}</h4>
                            {assignment.status === 'pending' && (
                              <Badge variant="outline" className="text-xs">Pending</Badge>
                            )}
                            {assignment.status === 'submitted' && (
                              <Badge className="bg-blue-500 text-xs">Submitted</Badge>
                            )}
                            {assignment.status === 'late' && (
                              <Badge className="bg-orange-500 text-xs">Late Submission</Badge>
                            )}
                            {assignment.status === 'graded' && (
                              <Badge className="bg-green-500 text-xs">Graded</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{assignment.description}</p>
                        </div>
                        {assignment.grade !== undefined && (
                          <div className="text-right ml-4">
                            <div className="text-2xl font-bold text-green-600">{assignment.grade}%</div>
                            <div className="text-xs text-muted-foreground">Grade</div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          {isOverdue && <span className="text-red-500 ml-2 font-semibold">(Overdue)</span>}
                          {isUrgent && <span className="text-yellow-600 ml-2 font-semibold">(Urgent)</span>}
                        </span>
                        {assignment.submittedAt && (
                          <span className="text-muted-foreground">
                            Submitted: {new Date(assignment.submittedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {assignment.feedback && (
                        <div className="mt-3 p-3 bg-background/50 rounded border border-border">
                          <div className="text-xs font-semibold text-muted-foreground mb-1">Teacher Feedback:</div>
                          <p className="text-sm text-foreground">{assignment.feedback}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          {/* Quizzes Tab */}
          <TabsContent value="quizzes" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 text-foreground">Quiz Results</h3>
              <div className="space-y-3">
                {recentQuizzes.map((quiz, index) => {
                  const percentage = (quiz.score / quiz.totalQuestions) * 100;
                  return (
                    <div key={index} className="p-4 bg-secondary/30 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-foreground">Quiz #{quiz.quizId}</h4>
                          <p className="text-sm text-muted-foreground">
                            Completed: {new Date(quiz.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${
                            percentage >= 80 ? 'text-green-600' :
                            percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {Math.round(percentage)}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {quiz.score}/{quiz.totalQuestions} correct
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Time taken: {quiz.timeTaken}</span>
                        {percentage >= 80 ? (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            Excellent
                          </span>
                        ) : percentage >= 60 ? (
                          <span className="flex items-center gap-1 text-yellow-600">
                            <AlertCircle className="w-4 h-4" />
                            Good
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-600">
                            <XCircle className="w-4 h-4" />
                            Needs Improvement
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          {/* Remarks Tab */}
          <TabsContent value="remarks">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 text-foreground">Teacher Remarks & Feedback</h3>
              <p className="text-muted-foreground">Teacher remarks and personalized feedback will appear here.</p>
              <div className="mt-6 p-4 bg-secondary/30 rounded-lg border border-border text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No remarks available yet</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Missing Button import - add this
import { Button } from '@/components/ui/button';

export default ParentDashboard;
