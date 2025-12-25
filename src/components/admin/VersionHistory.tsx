import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Clock, Eye, RotateCcw, Save, Tag, User, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface WebsiteVersion {
  id: string;
  version_number: number;
  version_name: string;
  description: string;
  created_by: string;
  created_at: string;
  is_current: boolean;
  content_snapshot: any;
  thumbnail_url?: string;
  tags?: string[];
}

interface VersionHistoryProps {
  onPreview?: (version: WebsiteVersion) => void;
  onRestore?: (version: WebsiteVersion) => void;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({ onPreview, onRestore }) => {
  const [versions, setVersions] = useState<WebsiteVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<WebsiteVersion | null>(null);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchVersions();
  }, []);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('website_versions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVersions(data || []);
    } catch (error) {
      console.error('Error fetching versions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load version history',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (version: WebsiteVersion) => {
    setSelectedVersion(version);
    setShowPreviewDialog(true);
    if (onPreview) {
      onPreview(version);
    }

    // Track the preview
    trackPreview(version.id);
  };

  const trackPreview = async (versionId: string) => {
    try {
      await supabase.rpc('track_version_preview', {
        p_version_id: versionId,
      });
    } catch (error) {
      console.error('Error tracking preview:', error);
    }
  };

  const handleRestore = async (version: WebsiteVersion) => {
    setSelectedVersion(version);
    setShowRestoreDialog(true);
  };

  const confirmRestore = async () => {
    if (!selectedVersion) return;

    try {
      const { data, error } = await supabase.rpc('restore_website_version', {
        p_version_id: selectedVersion.id,
      });

      if (error) throw error;

      toast({
        title: 'Version Restored',
        description: `Successfully restored to version ${selectedVersion.version_number}: ${selectedVersion.version_name}`,
      });

      // Refresh versions list
      await fetchVersions();

      if (onRestore) {
        onRestore(selectedVersion);
      }

      setShowRestoreDialog(false);
      setSelectedVersion(null);

      // Optionally reload the page to reflect changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error restoring version:', error);
      toast({
        title: 'Error',
        description: 'Failed to restore version',
        variant: 'destructive',
      });
    }
  };

  const handleSaveCurrentVersion = async () => {
    try {
      // Capture current website state
      const currentState = {
        pages: {
          home: {
            components: ['HeroSection', 'FeaturesSection', 'CourseCategoriesSection', 'TinyExplorersPreview', 'TestimonialsSection', 'CTASection'],
            theme: 'default',
          },
          // Add other pages as needed
        },
        globalSettings: {
          theme: 'default',
          language: 'en',
        },
        timestamp: new Date().toISOString(),
      };

      const { data, error } = await supabase.rpc('create_website_version', {
        p_version_name: `Version ${versions.length + 1}`,
        p_description: `Auto-saved on ${format(new Date(), 'PPpp')}`,
        p_content_snapshot: currentState,
        p_tags: ['auto-save'],
      });

      if (error) throw error;

      toast({
        title: 'Version Saved',
        description: 'Current website state has been saved successfully',
      });

      await fetchVersions();
    } catch (error) {
      console.error('Error saving version:', error);
      toast({
        title: 'Error',
        description: 'Failed to save current version',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Version History</h2>
          <p className="text-muted-foreground">
            View, preview, and restore previous versions of your website
          </p>
        </div>
        <Button onClick={handleSaveCurrentVersion} className="gap-2">
          <Save className="h-4 w-4" />
          Save Current Version
        </Button>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-4">
          {versions.map((version) => (
            <Card key={version.id} className={version.is_current ? 'border-primary border-2' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      Version {version.version_number}: {version.version_name}
                      {version.is_current && (
                        <Badge variant="default" className="ml-2">
                          Current
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{version.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(version)}
                      className="gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                    {!version.is_current && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleRestore(version)}
                        className="gap-1"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Restore
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {format(new Date(version.created_at), 'PPpp')}
                  </div>
                  {version.tags && version.tags.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      {version.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              Preview: Version {selectedVersion?.version_number} - {selectedVersion?.version_name}
            </DialogTitle>
            <DialogDescription>{selectedVersion?.description}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[500px] w-full rounded-md border p-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Content Snapshot</h3>
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto">
                  {JSON.stringify(selectedVersion?.content_snapshot, null, 2)}
                </pre>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Version Information</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Created:</strong> {selectedVersion && format(new Date(selectedVersion.created_at), 'PPpp')}
                  </p>
                  {selectedVersion?.tags && (
                    <p>
                      <strong>Tags:</strong> {selectedVersion.tags.join(', ')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
              Close
            </Button>
            {selectedVersion && !selectedVersion.is_current && (
              <Button onClick={() => {
                setShowPreviewDialog(false);
                handleRestore(selectedVersion);
              }}>
                Restore This Version
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Confirmation Dialog */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Confirm Version Restore
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to restore to Version {selectedVersion?.version_number}:{' '}
              {selectedVersion?.version_name}? This will replace the current website state.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">
              <strong>Note:</strong> The current version will be preserved in history, and you can always restore back to it later.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRestoreDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRestore} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Restore Version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VersionHistory;
