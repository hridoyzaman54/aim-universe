import { useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AutoSaveOptions {
  enabled: boolean;
  interval?: number; // in milliseconds, default 5 minutes
  onSave?: (versionId: string) => void;
  onError?: (error: Error) => void;
}

interface WebsiteState {
  pages: Record<string, unknown>;
  globalSettings: Record<string, unknown>;
  timestamp: string;
}

/**
 * Custom hook to automatically save website versions at regular intervals
 * Currently uses local storage - can be extended to use database later
 */
export const useAutoSave = (options: AutoSaveOptions) => {
  const { enabled, interval = 5 * 60 * 1000, onSave, onError } = options;
  const { toast } = useToast();
  const lastSaveRef = useRef<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const captureWebsiteState = useCallback((): WebsiteState => {
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

      // Save to localStorage for now
      const versionId = `version_${Date.now()}`;
      const existingVersions = JSON.parse(localStorage.getItem('website_versions') || '[]');
      existingVersions.push({
        id: versionId,
        name: `Auto-save ${new Date().toLocaleString()}`,
        description: 'Automatically saved version',
        state: currentState,
        tags: ['auto-save'],
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('website_versions', JSON.stringify(existingVersions));

      lastSaveRef.current = stateString;

      toast({
        title: 'Auto-saved',
        description: 'Website version saved automatically',
        duration: 2000,
      });

      if (onSave) {
        onSave(versionId);
      }
    } catch (error) {
      console.error('Auto-save error:', error);
      if (onError && error instanceof Error) {
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