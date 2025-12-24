import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, BookOpen, Trophy, Calendar, 
  CheckCircle, X, AlertCircle, Sparkles,
  Megaphone, Info, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
  isAnnouncement?: boolean;
  priority?: string;
}

const NotificationsPanel: React.FC = () => {
  const { user, role } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock notifications for demo
  const mockNotifications: Notification[] = [
    {
      id: 'mock-1',
      title: 'New Assignment',
      message: 'Chapter 6 Quiz has been assigned. Due in 3 days.',
      type: 'assignment',
      read: false,
      created_at: new Date().toISOString()
    },
    {
      id: 'mock-2',
      title: 'Course Update',
      message: 'New lesson added to Introduction to Programming',
      type: 'course',
      read: false,
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'mock-3',
      title: 'Achievement Unlocked!',
      message: "You've completed 10 lessons this week! 🎉",
      type: 'achievement',
      read: true,
      created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'mock-4',
      title: 'Live Class Reminder',
      message: 'Physics live session starts in 30 minutes',
      type: 'reminder',
      read: true,
      created_at: new Date(Date.now() - 172800000).toISOString()
    }
  ];

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      let allNotifications: Notification[] = [];

      try {
        // Fetch announcements (visible to all)
        const { data: announcements, error: annError } = await supabase
          .from('announcements')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(5);

        if (!annError && announcements) {
          const announcementNotifs: Notification[] = announcements
            .filter(a => !role || a.target_roles?.includes(role) || a.target_roles?.includes('student'))
            .map(a => ({
              id: `ann-${a.id}`,
              title: a.title,
              message: a.message,
              type: 'announcement',
              read: false,
              created_at: a.created_at,
              isAnnouncement: true,
              priority: a.priority,
            }));
          allNotifications = [...announcementNotifs];
        }

        // Fetch user notifications if logged in
        if (user) {
          const { data: userNotifs, error: notifError } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10);

          if (!notifError && userNotifs) {
            allNotifications = [...allNotifications, ...userNotifs];
          }
        }

        // Sort by date and add mock notifications if none exist
        allNotifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        if (allNotifications.length === 0) {
          allNotifications = mockNotifications;
        }

        setNotifications(allNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications(mockNotifications);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user, role]);

  const markAsRead = async (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );

    if (user && !id.startsWith('ann-') && !id.startsWith('mock-')) {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
    }
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notification dismissed');
  };

  const getIcon = (type: string, priority?: string) => {
    if (type === 'announcement') {
      if (priority === 'urgent') return <AlertTriangle className="w-5 h-5 text-destructive" />;
      if (priority === 'high') return <Megaphone className="w-5 h-5 text-warning" />;
      return <Info className="w-5 h-5 text-primary" />;
    }
    switch (type) {
      case 'assignment':
        return <BookOpen className="w-5 h-5 text-primary" />;
      case 'course':
        return <Sparkles className="w-5 h-5 text-accent" />;
      case 'achievement':
        return <Trophy className="w-5 h-5 text-warning" />;
      case 'reminder':
        return <Calendar className="w-5 h-5 text-energy" />;
      default:
        return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getPriorityStyle = (priority?: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-4 border-l-destructive bg-destructive/5';
      case 'high': return 'border-l-4 border-l-warning bg-warning/5';
      default: return '';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell className="w-6 h-6 text-primary" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-energy text-[10px] text-white rounded-full flex items-center justify-center font-bold"
              >
                {unreadCount}
              </motion.span>
            )}
          </div>
          <h2 className="text-xl font-display font-bold text-foreground">
            Notifications
          </h2>
        </div>
        
        {unreadCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
          >
            Mark all read
          </Button>
        )}
      </div>

      <Card className="divide-y divide-border overflow-hidden">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="p-8 flex items-center justify-center">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : notifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center"
            >
              <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">You're all caught up!</p>
            </motion.div>
          ) : (
            notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 flex items-start gap-3 group relative cursor-pointer hover:bg-secondary/30 transition-colors ${
                  !notification.read ? 'bg-primary/5' : ''
                } ${notification.isAnnouncement ? getPriorityStyle(notification.priority) : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  notification.isAnnouncement 
                    ? notification.priority === 'urgent' 
                      ? 'bg-destructive/10' 
                      : notification.priority === 'high' 
                        ? 'bg-warning/10' 
                        : 'bg-primary/10'
                    : !notification.read ? 'bg-primary/10' : 'bg-secondary'
                }`}>
                  {getIcon(notification.type, notification.priority)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </h4>
                        {notification.isAnnouncement && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
                            Announcement
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissNotification(notification.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-secondary rounded flex-shrink-0"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getTimeAgo(notification.created_at)}
                  </p>
                </div>

                {!notification.read && (
                  <motion.div
                    layoutId={`unread-${notification.id}`}
                    className="w-2 h-2 rounded-full bg-primary absolute right-4 top-1/2 -translate-y-1/2"
                  />
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default NotificationsPanel;
