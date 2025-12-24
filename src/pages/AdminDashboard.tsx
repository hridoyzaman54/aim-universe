import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import BackButton from '@/components/ui/BackButton';
import Logo from '@/components/ui/Logo';
import {
  Users, Shield, BookOpen, GraduationCap, TrendingUp,
  Search, RefreshCw, MoreHorizontal, Bell, Megaphone,
  UserCheck, Plus, Edit, Trash2, FileText, Video,
  Link as LinkIcon, Upload, Eye, EyeOff, Save, X,
  AlertCircle, CheckCircle2, Clock, Settings
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserData {
  id: string;
  user_id: string;
  full_name: string | null;
  created_at: string;
  role: 'student' | 'parent' | 'admin';
}

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  is_active: boolean;
  created_at: string;
  target_roles: string[];
}

interface AdminCourse {
  id: string;
  course_id: number;
  title: string;
  category: string;
  class: string;
  subject: string;
  instructor: string;
  description: string | null;
  thumbnail_url: string | null;
  video_url: string | null;
  duration: string | null;
  price: string;
  is_free: boolean;
  is_published: boolean;
}

interface CourseMaterial {
  id: string;
  course_id: number;
  title: string;
  type: string;
  file_url: string;
  file_size: string | null;
}

const AdminDashboard: React.FC = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<UserData[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Modal states
  const [announcementModal, setAnnouncementModal] = useState<{ isOpen: boolean; data: Partial<Announcement> | null }>({ isOpen: false, data: null });
  const [courseModal, setCourseModal] = useState<{ isOpen: boolean; data: Partial<AdminCourse> | null }>({ isOpen: false, data: null });
  const [materialModal, setMaterialModal] = useState<{ isOpen: boolean; courseId: number | null; data: Partial<CourseMaterial> | null }>({ isOpen: false, courseId: null, data: null });

  const [stats, setStats] = useState({
    totalUsers: 0,
    students: 0,
    parents: 0,
    admins: 0,
    totalCourses: 0,
    activeAnnouncements: 0,
  });

  // Check admin access
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (role !== 'admin') {
        uiToast({
          title: 'Access Denied',
          description: 'You do not have permission to access this page.',
          variant: 'destructive',
        });
        navigate('/dashboard');
      }
    }
  }, [user, role, loading, navigate, uiToast]);

  // Fetch all data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch users
      const { data: profiles } = await supabase.from('profiles').select('id, user_id, full_name, created_at');
      const { data: roles } = await supabase.from('user_roles').select('user_id, role');

      const mergedUsers: UserData[] = (profiles || []).map(profile => {
        const userRole = roles?.find(r => r.user_id === profile.user_id);
        return { ...profile, role: (userRole?.role as 'student' | 'parent' | 'admin') || 'student' };
      });
      setUsers(mergedUsers);

      // Fetch announcements
      const { data: announcementsData } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      setAnnouncements(announcementsData || []);

      // Fetch courses
      const { data: coursesData } = await supabase
        .from('admin_courses')
        .select('*')
        .order('created_at', { ascending: false });
      setCourses(coursesData || []);

      // Fetch materials
      const { data: materialsData } = await supabase
        .from('course_materials')
        .select('*')
        .order('created_at', { ascending: false });
      setMaterials(materialsData || []);

      // Calculate stats
      setStats({
        totalUsers: mergedUsers.length,
        students: mergedUsers.filter(u => u.role === 'student').length,
        parents: mergedUsers.filter(u => u.role === 'parent').length,
        admins: mergedUsers.filter(u => u.role === 'admin').length,
        totalCourses: coursesData?.length || 0,
        activeAnnouncements: (announcementsData || []).filter(a => a.is_active).length,
      });
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (role === 'admin') {
      fetchData();
    }
  }, [role]);

  // User role change
  const handleRoleChange = async (userId: string, newRole: 'student' | 'parent' | 'admin') => {
    try {
      const { error } = await supabase.from('user_roles').update({ role: newRole }).eq('user_id', userId);
      if (error) throw error;
      toast.success(`User role changed to ${newRole}`);
      fetchData();
    } catch (err) {
      toast.error('Failed to update user role');
    }
  };

  // Announcement CRUD
  const saveAnnouncement = async () => {
    if (!announcementModal.data?.title || !announcementModal.data?.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (announcementModal.data.id) {
        const { error } = await supabase
          .from('announcements')
          .update({
            title: announcementModal.data.title,
            message: announcementModal.data.message,
            type: announcementModal.data.type || 'info',
            priority: announcementModal.data.priority || 'normal',
            is_active: announcementModal.data.is_active ?? true,
            target_roles: announcementModal.data.target_roles || ['student', 'parent'],
          })
          .eq('id', announcementModal.data.id);
        if (error) throw error;
        toast.success('Announcement updated');
      } else {
        const { error } = await supabase
          .from('announcements')
          .insert({
            title: announcementModal.data.title,
            message: announcementModal.data.message,
            type: announcementModal.data.type || 'info',
            priority: announcementModal.data.priority || 'normal',
            is_active: announcementModal.data.is_active ?? true,
            target_roles: announcementModal.data.target_roles || ['student', 'parent'],
            created_by: user!.id,
          });
        if (error) throw error;
        toast.success('Announcement created');
      }
      setAnnouncementModal({ isOpen: false, data: null });
      fetchData();
    } catch (err) {
      toast.error('Failed to save announcement');
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      const { error } = await supabase.from('announcements').delete().eq('id', id);
      if (error) throw error;
      toast.success('Announcement deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete announcement');
    }
  };

  // Course CRUD
  const saveCourse = async () => {
    if (!courseModal.data?.title || !courseModal.data?.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (courseModal.data.id) {
        const { error } = await supabase
          .from('admin_courses')
          .update({
            title: courseModal.data.title,
            category: courseModal.data.category,
            class: courseModal.data.class || 'All Classes',
            subject: courseModal.data.subject || 'General',
            instructor: courseModal.data.instructor || 'TBA',
            description: courseModal.data.description,
            thumbnail_url: courseModal.data.thumbnail_url,
            video_url: courseModal.data.video_url,
            duration: courseModal.data.duration,
            price: courseModal.data.price || 'FREE',
            is_free: courseModal.data.is_free ?? true,
            is_published: courseModal.data.is_published ?? true,
          })
          .eq('id', courseModal.data.id);
        if (error) throw error;
        toast.success('Course updated');
      } else {
        const maxCourseId = courses.reduce((max, c) => Math.max(max, c.course_id), 100);
        const { error } = await supabase
          .from('admin_courses')
          .insert({
            course_id: maxCourseId + 1,
            title: courseModal.data.title,
            category: courseModal.data.category,
            class: courseModal.data.class || 'All Classes',
            subject: courseModal.data.subject || 'General',
            instructor: courseModal.data.instructor || 'TBA',
            description: courseModal.data.description,
            thumbnail_url: courseModal.data.thumbnail_url,
            video_url: courseModal.data.video_url,
            duration: courseModal.data.duration,
            price: courseModal.data.price || 'FREE',
            is_free: courseModal.data.is_free ?? true,
            is_published: courseModal.data.is_published ?? true,
            created_by: user!.id,
          });
        if (error) throw error;
        toast.success('Course created');
      }
      setCourseModal({ isOpen: false, data: null });
      fetchData();
    } catch (err) {
      toast.error('Failed to save course');
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      const { error } = await supabase.from('admin_courses').delete().eq('id', id);
      if (error) throw error;
      toast.success('Course deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete course');
    }
  };

  // Material CRUD
  const saveMaterial = async () => {
    if (!materialModal.data?.title || !materialModal.data?.file_url || !materialModal.courseId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (materialModal.data.id) {
        const { error } = await supabase
          .from('course_materials')
          .update({
            title: materialModal.data.title,
            type: materialModal.data.type || 'pdf',
            file_url: materialModal.data.file_url,
            file_size: materialModal.data.file_size,
          })
          .eq('id', materialModal.data.id);
        if (error) throw error;
        toast.success('Material updated');
      } else {
        const { error } = await supabase
          .from('course_materials')
          .insert({
            course_id: materialModal.courseId,
            title: materialModal.data.title,
            type: materialModal.data.type || 'pdf',
            file_url: materialModal.data.file_url,
            file_size: materialModal.data.file_size,
            created_by: user!.id,
          });
        if (error) throw error;
        toast.success('Material added');
      }
      setMaterialModal({ isOpen: false, courseId: null, data: null });
      fetchData();
    } catch (err) {
      toast.error('Failed to save material');
    }
  };

  const deleteMaterial = async (id: string) => {
    try {
      const { error } = await supabase.from('course_materials').delete().eq('id', id);
      if (error) throw error;
      toast.success('Material deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete material');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.user_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-destructive/10 text-destructive';
      case 'parent': return 'bg-blue-500/10 text-blue-500';
      default: return 'bg-primary/10 text-primary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-destructive/10 text-destructive border-destructive/30';
      case 'high': return 'bg-warning/10 text-warning border-warning/30';
      default: return 'bg-primary/10 text-primary border-primary/30';
    }
  };

  if (loading || (user && role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackButton fallbackPath="/dashboard" />
            <Logo size="sm" />
            <div className="h-6 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-destructive" />
              <h1 className="text-lg font-display font-semibold text-foreground hidden sm:block">Admin Dashboard</h1>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
        >
          {[
            { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-primary to-accent' },
            { label: 'Students', value: stats.students, icon: GraduationCap, color: 'from-green-500 to-emerald-500' },
            { label: 'Parents', value: stats.parents, icon: UserCheck, color: 'from-blue-500 to-cyan-500' },
            { label: 'Admins', value: stats.admins, icon: Shield, color: 'from-red-500 to-orange-500' },
            { label: 'Courses', value: stats.totalCourses, icon: BookOpen, color: 'from-purple-500 to-pink-500' },
            { label: 'Announcements', value: stats.activeAnnouncements, icon: Megaphone, color: 'from-yellow-500 to-amber-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-xl bg-card border border-border"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="announcements" className="flex items-center gap-2">
              <Megaphone className="w-4 h-4" />
              <span className="hidden sm:inline">Announcements</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Courses</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Announcements */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-xl bg-card border border-border p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-warning" />
                    Recent Announcements
                  </h3>
                  <Button size="sm" variant="ghost" onClick={() => setActiveTab('announcements')}>
                    View All
                  </Button>
                </div>
                <div className="space-y-3">
                  {announcements.slice(0, 5).map((ann) => (
                    <div key={ann.id} className={`p-3 rounded-lg border ${getPriorityColor(ann.priority)}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-foreground">{ann.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{ann.message}</p>
                        </div>
                        {ann.is_active ? (
                          <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                  {announcements.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No announcements yet</p>
                  )}
                </div>
              </motion.div>

              {/* Recent Users */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-xl bg-card border border-border p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Recent Users
                  </h3>
                  <Button size="sm" variant="ghost" onClick={() => setActiveTab('users')}>
                    View All
                  </Button>
                </div>
                <div className="space-y-3">
                  {users.slice(0, 5).map((u) => (
                    <div key={u.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <span className="text-sm font-semibold text-white">
                          {u.full_name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{u.full_name || 'Unnamed'}</p>
                        <p className="text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(u.role)}`}>
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-card border border-border overflow-hidden"
            >
              <div className="p-6 border-b border-border">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">User Management</h2>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
                    </div>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="w-full sm:w-32">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="p-12 flex items-center justify-center">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-secondary/30">
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">User</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Role</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Joined</th>
                        <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((userData) => (
                        <tr key={userData.id} className="border-b border-border hover:bg-secondary/20">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                <span className="text-sm font-semibold text-white">{userData.full_name?.charAt(0)?.toUpperCase() || '?'}</span>
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{userData.full_name || 'Unnamed User'}</p>
                                <p className="text-xs text-muted-foreground truncate max-w-[200px]">{userData.user_id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(userData.role)}`}>{userData.role}</span>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">{new Date(userData.created_at).toLocaleDateString()}</td>
                          <td className="p-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleRoleChange(userData.user_id, 'student')}>
                                  <GraduationCap className="w-4 h-4 mr-2" />Set as Student
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRoleChange(userData.user_id, 'parent')}>
                                  <UserCheck className="w-4 h-4 mr-2" />Set as Parent
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRoleChange(userData.user_id, 'admin')}>
                                  <Shield className="w-4 h-4 mr-2" />Set as Admin
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-card border border-border">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Announcements</h2>
                <Button onClick={() => setAnnouncementModal({ isOpen: true, data: { type: 'info', priority: 'normal', is_active: true, target_roles: ['student', 'parent'] } })}>
                  <Plus className="w-4 h-4 mr-2" />New Announcement
                </Button>
              </div>
              <div className="p-6 space-y-4">
                {announcements.map((ann) => (
                  <motion.div key={ann.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-4 rounded-xl border ${getPriorityColor(ann.priority)}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">{ann.title}</h3>
                          {!ann.is_active && <span className="px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground">Inactive</span>}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{ann.message}</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="px-2 py-1 rounded bg-secondary text-muted-foreground">{ann.type}</span>
                          <span className="px-2 py-1 rounded bg-secondary text-muted-foreground">{ann.priority}</span>
                          <span className="px-2 py-1 rounded bg-secondary text-muted-foreground">{ann.target_roles?.join(', ')}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => setAnnouncementModal({ isOpen: true, data: ann })}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteAnnouncement(ann.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {announcements.length === 0 && (
                  <div className="text-center py-12">
                    <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No announcements yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-card border border-border">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Course Management</h2>
                <Button onClick={() => setCourseModal({ isOpen: true, data: { is_free: true, is_published: true, category: 'all', class: 'All Classes', subject: 'General' } })}>
                  <Plus className="w-4 h-4 mr-2" />Add Course
                </Button>
              </div>
              <div className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <motion.div key={course.id} whileHover={{ y: -2 }} className="rounded-xl border border-border overflow-hidden bg-card">
                    <div className="aspect-video bg-secondary relative">
                      {course.thumbnail_url ? (
                        <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex gap-1">
                        {course.is_free && <span className="px-2 py-1 rounded bg-success/90 text-white text-xs font-medium">FREE</span>}
                        {!course.is_published && <span className="px-2 py-1 rounded bg-muted text-muted-foreground text-xs">Draft</span>}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground line-clamp-1">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{course.instructor}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          <span className="px-2 py-1 rounded bg-secondary text-xs text-muted-foreground">{course.category}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" onClick={() => setMaterialModal({ isOpen: true, courseId: course.course_id, data: {} })}>
                            <FileText className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => setCourseModal({ isOpen: true, data: course })}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteCourse(course.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {courses.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No courses yet. Add your first course!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Announcement Modal */}
      <Dialog open={announcementModal.isOpen} onOpenChange={(open) => !open && setAnnouncementModal({ isOpen: false, data: null })}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{announcementModal.data?.id ? 'Edit Announcement' : 'New Announcement'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input value={announcementModal.data?.title || ''} onChange={(e) => setAnnouncementModal({ ...announcementModal, data: { ...announcementModal.data, title: e.target.value } })} placeholder="Announcement title" />
            </div>
            <div>
              <Label>Message *</Label>
              <Textarea value={announcementModal.data?.message || ''} onChange={(e) => setAnnouncementModal({ ...announcementModal, data: { ...announcementModal.data, message: e.target.value } })} placeholder="Announcement message" rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Select value={announcementModal.data?.type || 'info'} onValueChange={(v) => setAnnouncementModal({ ...announcementModal, data: { ...announcementModal.data, type: v } })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select value={announcementModal.data?.priority || 'normal'} onValueChange={(v) => setAnnouncementModal({ ...announcementModal, data: { ...announcementModal.data, priority: v } })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch checked={announcementModal.data?.is_active ?? true} onCheckedChange={(v) => setAnnouncementModal({ ...announcementModal, data: { ...announcementModal.data, is_active: v } })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAnnouncementModal({ isOpen: false, data: null })}>Cancel</Button>
            <Button onClick={saveAnnouncement}><Save className="w-4 h-4 mr-2" />Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Course Modal */}
      <Dialog open={courseModal.isOpen} onOpenChange={(open) => !open && setCourseModal({ isOpen: false, data: null })}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{courseModal.data?.id ? 'Edit Course' : 'Add Course'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Title *</Label>
                <Input value={courseModal.data?.title || ''} onChange={(e) => setCourseModal({ ...courseModal, data: { ...courseModal.data, title: e.target.value } })} placeholder="Course title" />
              </div>
              <div>
                <Label>Category *</Label>
                <Select value={courseModal.data?.category || 'all'} onValueChange={(v) => setCourseModal({ ...courseModal, data: { ...courseModal.data, category: v } })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="english">English Version</SelectItem>
                    <SelectItem value="bangla">Bangla Version</SelectItem>
                    <SelectItem value="medium">English Medium</SelectItem>
                    <SelectItem value="creative">Creative Studio</SelectItem>
                    <SelectItem value="special">Special Needs</SelectItem>
                    <SelectItem value="tiny">Tiny Explorers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Class</Label>
                <Input value={courseModal.data?.class || ''} onChange={(e) => setCourseModal({ ...courseModal, data: { ...courseModal.data, class: e.target.value } })} placeholder="e.g. Class 10" />
              </div>
              <div>
                <Label>Subject</Label>
                <Input value={courseModal.data?.subject || ''} onChange={(e) => setCourseModal({ ...courseModal, data: { ...courseModal.data, subject: e.target.value } })} placeholder="e.g. Physics" />
              </div>
              <div>
                <Label>Instructor</Label>
                <Input value={courseModal.data?.instructor || ''} onChange={(e) => setCourseModal({ ...courseModal, data: { ...courseModal.data, instructor: e.target.value } })} placeholder="Instructor name" />
              </div>
              <div>
                <Label>Duration</Label>
                <Input value={courseModal.data?.duration || ''} onChange={(e) => setCourseModal({ ...courseModal, data: { ...courseModal.data, duration: e.target.value } })} placeholder="e.g. 30 hours" />
              </div>
              <div>
                <Label>Price</Label>
                <Input value={courseModal.data?.price || ''} onChange={(e) => setCourseModal({ ...courseModal, data: { ...courseModal.data, price: e.target.value } })} placeholder="e.g. ৳2000 or FREE" />
              </div>
              <div className="col-span-2">
                <Label>Description</Label>
                <Textarea value={courseModal.data?.description || ''} onChange={(e) => setCourseModal({ ...courseModal, data: { ...courseModal.data, description: e.target.value } })} placeholder="Course description" rows={3} />
              </div>
              <div className="col-span-2">
                <Label>Thumbnail URL</Label>
                <Input value={courseModal.data?.thumbnail_url || ''} onChange={(e) => setCourseModal({ ...courseModal, data: { ...courseModal.data, thumbnail_url: e.target.value } })} placeholder="https://..." />
              </div>
              <div className="col-span-2">
                <Label>Video URL</Label>
                <Input value={courseModal.data?.video_url || ''} onChange={(e) => setCourseModal({ ...courseModal, data: { ...courseModal.data, video_url: e.target.value } })} placeholder="https://..." />
              </div>
              <div className="flex items-center justify-between">
                <Label>Free Course</Label>
                <Switch checked={courseModal.data?.is_free ?? true} onCheckedChange={(v) => setCourseModal({ ...courseModal, data: { ...courseModal.data, is_free: v } })} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Published</Label>
                <Switch checked={courseModal.data?.is_published ?? true} onCheckedChange={(v) => setCourseModal({ ...courseModal, data: { ...courseModal.data, is_published: v } })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCourseModal({ isOpen: false, data: null })}>Cancel</Button>
            <Button onClick={saveCourse}><Save className="w-4 h-4 mr-2" />Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Material Modal */}
      <Dialog open={materialModal.isOpen} onOpenChange={(open) => !open && setMaterialModal({ isOpen: false, courseId: null, data: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{materialModal.data?.id ? 'Edit Material' : 'Add Material'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input value={materialModal.data?.title || ''} onChange={(e) => setMaterialModal({ ...materialModal, data: { ...materialModal.data, title: e.target.value } })} placeholder="Material title" />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={materialModal.data?.type || 'pdf'} onValueChange={(v) => setMaterialModal({ ...materialModal, data: { ...materialModal.data, type: v } })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="slides">Slides</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="link">External Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>File URL *</Label>
              <Input value={materialModal.data?.file_url || ''} onChange={(e) => setMaterialModal({ ...materialModal, data: { ...materialModal.data, file_url: e.target.value } })} placeholder="https://..." />
            </div>
            <div>
              <Label>File Size</Label>
              <Input value={materialModal.data?.file_size || ''} onChange={(e) => setMaterialModal({ ...materialModal, data: { ...materialModal.data, file_size: e.target.value } })} placeholder="e.g. 2.5 MB" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMaterialModal({ isOpen: false, courseId: null, data: null })}>Cancel</Button>
            <Button onClick={saveMaterial}><Save className="w-4 h-4 mr-2" />Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
