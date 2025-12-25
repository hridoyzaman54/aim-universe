import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AutoSaveOptions {
  enabled: boolean;
  interval?: number; // in milliseconds, default 5 minutes
  onSave?: (versionId: string) => void;
  onError?: (error: any) => void;
}

interface WebsiteState {
  pages: Record<string, any>;
  globalSettings: Record<string, any>;
  timestamp: string;
}

/**
 * Custom hook to automatically save website versions at regular intervals
 */
export const useAutoSave = (options: AutoSaveOptions) => {
  const { enabled, interval = 5 * 60 * 1000, onSave, onError } = options;
  const { toast } = useToast();
  const lastSaveRef = useRef<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const captureWebsiteState = useCallback((): WebsiteState => {
    // Capture current website state
    // In a real implementation, you'd capture actual component states
    return {
      pages: {
        home: {
          components: [
            'HeroSection',
            'FeaturesSection',
            'CourseCategoriesSection',
            'TinyExplorersPreview',
            'TestimonialsSection',
            'CTASection',
          ],
          theme: 'default',
        },
        courses: {
          components: ['CourseList', 'CourseFilters'],
          theme: 'default',
        },
        dashboard: {
          components: ['ProgressTracker', 'VideoPlayer', 'QuizModule', 'AIChatbot'],
          theme: 'default',
        },
      },
      globalSettings: {
        theme: localStorage.getItem('theme') || 'default',
        language: localStorage.getItem('language') || 'en',
      },
      timestamp: new Date().toISOString(),
    };
  }, []);

  const saveVersion = useCallback(async () => {
    try {
      const currentState = captureWebsiteState();
      const stateString = JSON.stringify(currentState);

      // Check if state has changed since last save
      if (stateString === lastSaveRef.current) {
        console.log('No changes detected, skipping auto-save');
        return;
      }

      const { data, error } = await supabase.rpc('create_website_version', {
        p_version_name: `Auto-save ${new Date().toLocaleString()}`,
        p_description: 'Automatically saved version',
        p_content_snapshot: currentState,
        p_tags: ['auto-save'],
      });

      if (error) throw error;

      lastSaveRef.current = stateString;

      toast({
        title: 'Auto-saved',
        description: 'Website version saved automatically',
        duration: 2000,
      });

      if (onSave && data) {
        onSave(data);
      }
    } catch (error) {
      console.error('Auto-save error:', error);
      if (onError) {
        onError(error);
      }
    }
  }, [captureWebsiteState, toast, onSave, onError]);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Initial save
    saveVersion();

    // Set up periodic saves
    intervalRef.current = setInterval(() => {
      saveVersion();
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, interval, saveVersion]);

  const manualSave = useCallback(async () => {
    await saveVersion();
  }, [saveVersion]);

  return { manualSave };
};

export default useAutoSave;
