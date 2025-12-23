import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Smile, Frown, Meh, Zap, Heart, Cloud, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Mood {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  greeting: string;
  bgGradient: string;
}

const moods: Mood[] = [
  { 
    id: 'happy', 
    label: 'Happy', 
    icon: Smile, 
    color: 'text-yellow-500',
    bgGradient: 'from-yellow-500/20 to-orange-500/20',
    greeting: "Wonderful! Your positive energy is contagious! Keep spreading those good vibes! 🌟"
  },
  { 
    id: 'calm', 
    label: 'Calm', 
    icon: Cloud, 
    color: 'text-blue-400',
    bgGradient: 'from-blue-400/20 to-cyan-400/20',
    greeting: "Peace is a superpower. You're in a great state of mind for learning! 🧘"
  },
  { 
    id: 'excited', 
    label: 'Excited', 
    icon: Zap, 
    color: 'text-orange-500',
    bgGradient: 'from-orange-500/20 to-red-500/20',
    greeting: "Channel that excitement into something amazing today! You've got this! ⚡"
  },
  { 
    id: 'anxious', 
    label: 'Anxious', 
    icon: Meh, 
    color: 'text-purple-400',
    bgGradient: 'from-purple-400/20 to-pink-400/20',
    greeting: "It's okay to feel anxious. Take a deep breath. We're here to support you. 💜"
  },
  { 
    id: 'sad', 
    label: 'Sad', 
    icon: Frown, 
    color: 'text-blue-500',
    bgGradient: 'from-blue-500/20 to-indigo-500/20',
    greeting: "It's okay to feel sad sometimes. Would you like to talk to a counsellor? 💙"
  },
  { 
    id: 'stressed', 
    label: 'Stressed', 
    icon: Heart, 
    color: 'text-red-400',
    bgGradient: 'from-red-400/20 to-pink-400/20',
    greeting: "Take it one step at a time. You're stronger than you know! 💪"
  },
];

const MoodTracker: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [note, setNote] = useState('');
  const [showGreeting, setShowGreeting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentMoods, setRecentMoods] = useState<any[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchRecentMoods();
    }
  }, [user]);

  const fetchRecentMoods = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(7);
    
    if (data) {
      setRecentMoods(data);
    }
  };

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    setShowGreeting(true);
  };

  const handleSubmit = async () => {
    if (!selectedMood || !user) return;
    
    setIsSubmitting(true);
    
    const { error } = await supabase
      .from('mood_logs')
      .insert({
        user_id: user.id,
        mood: selectedMood.id,
        note: note || null,
      });
    
    if (error) {
      toast({
        title: 'Error',
        description: 'Could not save your mood. Please try again.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Mood Logged!',
        description: 'Your mood has been recorded. Take care! 💕',
      });
      setNote('');
      fetchRecentMoods();
    }
    
    setIsSubmitting(false);
  };

  const getMoodIcon = (moodId: string) => {
    const mood = moods.find(m => m.id === moodId);
    return mood ? mood.icon : Meh;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 rounded-3xl bg-card border border-border overflow-hidden relative"
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-accent/10 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-6 h-6 text-primary" />
          </motion.div>
          <h3 className="text-xl font-display font-bold text-foreground">
            How are you feeling today?
          </h3>
        </div>

        {/* Mood Selection */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
          {moods.map((mood, index) => (
            <motion.button
              key={mood.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMoodSelect(mood)}
              className={`p-4 rounded-2xl border-2 transition-all ${
                selectedMood?.id === mood.id
                  ? `border-primary bg-gradient-to-br ${mood.bgGradient}`
                  : 'border-border bg-secondary/30 hover:border-primary/50'
              }`}
            >
              <motion.div
                animate={selectedMood?.id === mood.id ? { 
                  rotate: [0, -10, 10, 0],
                  scale: [1, 1.1, 1]
                } : {}}
                transition={{ duration: 0.5 }}
              >
                <mood.icon className={`w-8 h-8 mx-auto mb-2 ${mood.color}`} />
              </motion.div>
              <span className="text-xs font-medium text-foreground">{mood.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Greeting Message */}
        <AnimatePresence>
          {showGreeting && selectedMood && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              className={`p-4 rounded-xl bg-gradient-to-r ${selectedMood.bgGradient} border border-primary/20 mb-6`}
            >
              <p className="text-foreground text-center font-medium">
                {selectedMood.greeting}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Note Input */}
        {user && selectedMood && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <Textarea
              placeholder="Want to share more about how you're feeling? (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="bg-secondary/50 border-border min-h-[80px]"
            />
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Saving...' : 'Log My Mood'}
            </Button>
          </motion.div>
        )}

        {!user && (
          <p className="text-muted-foreground text-center text-sm">
            Sign in to track your mood history
          </p>
        )}

        {/* Recent Mood History */}
        {recentMoods.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 pt-6 border-t border-border"
          >
            <p className="text-sm text-muted-foreground mb-3">Your recent moods:</p>
            <div className="flex gap-2 flex-wrap">
              {recentMoods.map((log, index) => {
                const MoodIcon = getMoodIcon(log.mood);
                const mood = moods.find(m => m.id === log.mood);
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-2 rounded-lg bg-secondary/50 ${mood?.color || ''}`}
                    title={new Date(log.created_at).toLocaleDateString()}
                  >
                    <MoodIcon className="w-5 h-5" />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MoodTracker;
