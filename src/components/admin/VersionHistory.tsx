import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Eye, RotateCcw, Save, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface WebsiteVersion {
  id: string;
  version_number: number;
  version_name: string;
  description: string;
  created_at: string;
  is_current: boolean;
  tags?: string[];
}

interface VersionHistoryProps {
  onPreview?: (version: WebsiteVersion) => void;
  onRestore?: (version: WebsiteVersion) => void;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({ onPreview, onRestore }) => {
  const { toast } = useToast();
  
  // Mock data for version history (can be replaced with actual database integration later)
  const [versions] = useState<WebsiteVersion[]>([
    {
      id: '1',
      version_number: 1,
      version_name: 'Initial Release',
      description: 'First version of the website',
      created_at: new Date().toISOString(),
      is_current: true,
      tags: ['release'],
    },
  ]);

  const handlePreview = (version: WebsiteVersion) => {
    if (onPreview) {
      onPreview(version);
    }
    toast({
      title: 'Preview',
      description: `Previewing version ${version.version_number}`,
    });
  };

  const handleRestore = (version: WebsiteVersion) => {
    if (onRestore) {
      onRestore(version);
    }
    toast({
      title: 'Restore',
      description: `Version ${version.version_number} would be restored`,
    });
  };

  const handleSaveCurrentVersion = () => {
    toast({
      title: 'Version Saved',
      description: 'Current website state has been saved',
    });
  };

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
    </div>
  );
};

export default VersionHistory;