import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, AlertCircle, Info, Award, FileText, Calendar, Settings } from 'lucide-react';
import { Notification } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const unreadCount = notifications.filter(n => !n.read).length;
  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'assignment':
        return FileText;
      case 'quiz':
        return AlertCircle;
      case 'grade':
        return Award;
      case 'reminder':
        return Calendar;
      case 'announcement':
        return Info;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'assignment':
        return 'from-orange-500 to-orange-600';
      case 'quiz':
        return 'from-red-500 to-red-600';
      case 'grade':
        return 'from-green-500 to-green-600';
      case 'reminder':
        return 'from-blue-500 to-blue-600';
      case 'announcement':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
    const Icon = getNotificationIcon(notification.type);
    const color = getNotificationColor(notification.type);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        className={`p-4 rounded-lg cursor-pointer transition-colors ${
          notification.read ? 'bg-secondary/20' : 'bg-primary/10 border border-primary/20'
        } hover:bg-secondary/40`}
        onClick={() => !notification.read && onMarkAsRead(notification.id)}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${color} text-white flex-shrink-0`}>
            <Icon className="w-4 h-4" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="font-semibold text-foreground text-sm line-clamp-1">
                {notification.title}
              </h4>
              {!notification.read && (
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1"></div>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {notification.message}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{formatDate(notification.date)}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNotification(notification.id);
                }}
                className="h-6 px-2 text-xs"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative" size="icon">
          <Bell className="w-5 h-5" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-[420px] p-0" align="end">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAllAsRead}
                className="text-xs gap-1"
              >
                <Check className="w-3 h-3" />
                Mark all read
              </Button>
            )}
          </div>
          <Badge variant="outline">
            {unreadCount} unread
          </Badge>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="p-4 max-h-[500px] overflow-y-auto space-y-2">
            <AnimatePresence>
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))
              ) : (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No notifications</p>
                </div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="unread" className="p-4 max-h-[500px] overflow-y-auto space-y-2">
            <AnimatePresence>
              {unreadNotifications.length > 0 ? (
                unreadNotifications.map(notification => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))
              ) : (
                <div className="text-center py-12">
                  <Check className="w-12 h-12 mx-auto text-green-500 mb-3" />
                  <p className="text-muted-foreground">All caught up!</p>
                  <p className="text-sm text-muted-foreground mt-1">No unread notifications</p>
                </div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="settings" className="p-4 space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-semibold">All Notifications</Label>
                  <p className="text-xs text-muted-foreground">Enable or disable all notifications</p>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-semibold">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                  disabled={!notificationsEnabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-semibold">Push Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive push notifications</p>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                  disabled={!notificationsEnabled}
                />
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-semibold mb-3">Notification Types</h4>
                <div className="space-y-3">
                  {[
                    { type: 'assignment', label: 'Assignments', icon: FileText },
                    { type: 'quiz', label: 'Quizzes', icon: AlertCircle },
                    { type: 'grade', label: 'Grades', icon: Award },
                    { type: 'reminder', label: 'Reminders', icon: Calendar },
                    { type: 'announcement', label: 'Announcements', icon: Info },
                  ].map(item => (
                    <div key={item.type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <item.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <Switch defaultChecked disabled={!notificationsEnabled} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
