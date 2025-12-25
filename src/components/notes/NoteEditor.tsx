import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Check, Clock, FileText } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface NoteEditorProps {
  materialId: string;
  initialContent?: string;
  onSave?: (content: string) => void;
  placeholder?: string;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
  materialId,
  initialContent = '',
  onSave,
  placeholder = 'Take notes here...'
}) => {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-save functionality
  useEffect(() => {
    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Don't save if content hasn't changed from initial
    if (content === initialContent && !lastSaved) {
      return;
    }

    // Set new timeout for auto-save (2 seconds after user stops typing)
    saveTimeoutRef.current = setTimeout(() => {
      handleAutoSave();
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content]);

  const handleAutoSave = async () => {
    setIsSaving(true);

    // Simulate API call to save note
    await new Promise(resolve => setTimeout(resolve, 500));

    // Call the onSave callback
    onSave?.(content);

    // Update local storage as backup
    localStorage.setItem(`note_${materialId}`, JSON.stringify({
      content,
      timestamp: new Date().toISOString()
    }));

    setLastSaved(new Date());
    setIsSaving(false);
    setShowSavedIndicator(true);

    // Hide the "saved" indicator after 2 seconds
    setTimeout(() => {
      setShowSavedIndicator(false);
    }, 2000);
  };

  // Load saved note from local storage on mount
  useEffect(() => {
    const savedNote = localStorage.getItem(`note_${materialId}`);
    if (savedNote) {
      try {
        const parsed = JSON.parse(savedNote);
        setContent(parsed.content);
        setLastSaved(new Date(parsed.timestamp));
      } catch (error) {
        console.error('Error loading saved note:', error);
      }
    }
  }, [materialId]);

  const formatLastSaved = () => {
    if (!lastSaved) return '';
    
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return lastSaved.toLocaleDateString();
  };

  const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length;
  const charCount = content.length;

  return (
    <Card className="p-6 bg-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">My Notes</h3>
        </div>

        {/* Save Status */}
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            {isSaving ? (
              <motion.div
                key="saving"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Save className="w-4 h-4" />
                </motion.div>
                <span>Saving...</span>
              </motion.div>
            ) : showSavedIndicator ? (
              <motion.div
                key="saved"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 text-sm text-green-600"
              >
                <Check className="w-4 h-4" />
                <span>Saved</span>
              </motion.div>
            ) : lastSaved ? (
              <motion.div
                key="last-saved"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Clock className="w-4 h-4" />
                <span>{formatLastSaved()}</span>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* Note Editor */}
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="min-h-[300px] resize-y font-mono text-sm leading-relaxed"
        />

        {/* Character/Word Count */}
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>{wordCount} words • {charCount} characters</span>
          <Badge variant="outline" className="text-xs">
            Auto-save enabled
          </Badge>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
        <p className="text-xs text-muted-foreground">
          💡 <strong>Tip:</strong> Your notes are automatically saved as you type and synced across devices.
        </p>
      </div>
    </Card>
  );
};

export default NoteEditor;
