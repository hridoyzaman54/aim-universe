import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Calendar, Shield, Save, ArrowLeft, LogOut, Camera } from 'lucide-react';
import { z } from 'zod';

const profileSchema = z.object({
  full_name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
});

const Profile: React.FC = () => {
  const { user, role, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [errors, setErrors] = useState<{ full_name?: string }>({});

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setFullName(data.full_name || '');
          setAvatarUrl(data.avatar_url || '');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleSave = async () => {
    const validation = profileSchema.safeParse({ full_name: fullName });
    
    if (!validation.success) {
      setErrors({ full_name: validation.error.errors[0]?.message });
      return;
    }
    
    setErrors({});
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName.trim() })
        .eq('user_id', user!.id);

      if (error) throw error;

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been saved successfully.',
      });
    } catch (err) {
      console.error('Error updating profile:', err);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getRoleBadgeColor = (role: string | null) => {
    switch (role) {
      case 'admin': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'parent': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  if (loading || isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-8 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-white">
                      {fullName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                    </span>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-secondary/80 transition-colors">
                  <Camera className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                {fullName || 'Your Profile'}
              </h1>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getRoleBadgeColor(role)}`}>
                <Shield className="w-3 h-3" />
                <span className="text-sm font-medium capitalize">{role || 'Student'}</span>
              </div>
            </div>

            {/* Profile Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-2xl bg-card border border-border"
            >
              <h2 className="text-lg font-semibold text-foreground mb-6">Profile Information</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        setErrors({});
                      }}
                      placeholder="Enter your full name"
                      className={`pl-10 bg-secondary/50 ${errors.full_name ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.full_name && (
                    <p className="text-sm text-destructive">{errors.full_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      value={user.email || ''}
                      disabled
                      className="pl-10 bg-secondary/30 text-muted-foreground cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Member Since</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      value={new Date(user.created_at || '').toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                      disabled
                      className="pl-10 bg-secondary/30 text-muted-foreground cursor-not-allowed"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {isSaving ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </motion.div>

            {/* Admin Link */}
            {role === 'admin' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-2xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">Admin Dashboard</h3>
                    <p className="text-sm text-muted-foreground">Manage users and platform settings</p>
                  </div>
                  <Button onClick={() => navigate('/admin')} variant="outline" className="border-red-500/50 text-red-500 hover:bg-red-500/10">
                    Open Dashboard
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Sign Out */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
