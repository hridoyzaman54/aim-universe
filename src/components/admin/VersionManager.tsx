import React, { useState } from 'react';
import VersionHistory from './VersionHistory';
import VersionPreview from './VersionPreview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useToast } from '@/hooks/use-toast';
import { Settings, History, Eye, Save, Clock } from 'lucide-react';

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

const VersionManager: React.FC = () => {
  const [previewVersion, setPreviewVersion] = useState<WebsiteVersion | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [autoSaveInterval, setAutoSaveInterval] = useState(5); // minutes
  const { toast } = useToast();

  const { manualSave } = useAutoSave({
    enabled: autoSaveEnabled,
    interval: autoSaveInterval * 60 * 1000,
    onSave: (versionId) => {
      console.log('Version saved:', versionId);
    },
    onError: (error) => {
      toast({
        title: 'Auto-save Error',
        description: 'Failed to auto-save version',
        variant: 'destructive',
      });
    },
  });

  const handlePreview = (version: WebsiteVersion) => {
    setPreviewVersion(version);
  };

  const handleRestore = (version: WebsiteVersion) => {
    toast({
      title: 'Restoring Version',
      description: `Restoring to version ${version.version_number}...`,
    });
    // The actual restore happens in VersionHistory component
  };

  const handleClosePreview = () => {
    setPreviewVersion(null);
  };

  const handleManualSave = async () => {
    await manualSave();
    toast({
      title: 'Manual Save',
      description: 'Current version has been saved successfully',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Version Control</h1>
        <p className="text-muted-foreground mt-2">
          Manage, preview, and restore different versions of your website
        </p>
      </div>

      <Tabs defaultValue="history" className="space-y-4">
        <TabsList>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            Version History
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            Auto-Save Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <VersionHistory onPreview={handlePreview} onRestore={handleRestore} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Auto-Save Configuration
                </CardTitle>
                <CardDescription>
                  Configure automatic version saving to protect your changes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-save">Enable Auto-Save</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically save versions at regular intervals
                    </p>
                  </div>
                  <Switch
                    id="auto-save"
                    checked={autoSaveEnabled}
                    onCheckedChange={setAutoSaveEnabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interval">Auto-Save Interval (minutes)</Label>
                  <Input
                    id="interval"
                    type="number"
                    min="1"
                    max="60"
                    value={autoSaveInterval}
                    onChange={(e) => setAutoSaveInterval(parseInt(e.target.value) || 5)}
                    disabled={!autoSaveEnabled}
                  />
                  <p className="text-sm text-muted-foreground">
                    Current setting: Save every {autoSaveInterval} minute{autoSaveInterval !== 1 ? 's' : ''}
                  </p>
                </div>

                <Button onClick={handleManualSave} className="w-full gap-2">
                  <Save className="h-4 w-4" />
                  Save Current Version Now
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Preview & Restore
                </CardTitle>
                <CardDescription>
                  How version preview and restore works
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Preview a Version</h4>
                  <p className="text-sm text-muted-foreground">
                    Click the "Preview" button on any version to see how your website looked at that point in time.
                    You can preview on desktop, tablet, and mobile views.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Restore a Version</h4>
                  <p className="text-sm text-muted-foreground">
                    Click the "Restore" button to rollback your website to a previous version. 
                    The current version is preserved and you can always restore back to it.
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                    💡 Pro Tip
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                    Always preview a version before restoring to ensure it contains the changes you want.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Version Control Best Practices</CardTitle>
              <CardDescription>
                Tips for managing your website versions effectively
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 list-disc list-inside text-sm">
                <li>Enable auto-save to ensure you never lose important changes</li>
                <li>Save manual versions before making major changes to your website</li>
                <li>Add descriptive names and tags to versions for easy identification</li>
                <li>Preview versions before restoring to avoid unexpected changes</li>
                <li>Keep your version history clean by removing old test versions</li>
                <li>Create a backup version before updating multiple pages</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Modal */}
      {previewVersion && (
        <VersionPreview
          versionData={previewVersion.content_snapshot}
          versionNumber={previewVersion.version_number}
          versionName={previewVersion.version_name}
          onClose={handleClosePreview}
        />
      )}
    </div>
  );
};

export default VersionManager;
