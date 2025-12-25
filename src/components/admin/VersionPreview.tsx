import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Maximize2, Minimize2, Monitor, Smartphone, Tablet } from 'lucide-react';

interface VersionPreviewProps {
  versionData: any;
  versionNumber: number;
  versionName: string;
  onClose: () => void;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const VersionPreview: React.FC<VersionPreviewProps> = ({
  versionData,
  versionNumber,
  versionName,
  onClose,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [previewStartTime] = useState(Date.now());

  const deviceSizes = {
    desktop: 'w-full',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]',
  };

  useEffect(() => {
    // Track preview duration when component unmounts
    return () => {
      const duration = Math.floor((Date.now() - previewStartTime) / 1000);
      console.log(`Preview duration: ${duration} seconds`);
      // You can send this to your analytics or tracking system
    };
  }, [previewStartTime]);

  const renderPreviewContent = () => {
    // This is a simplified preview - in production, you'd render actual components
    const pages = versionData?.pages || {};
    
    return (
      <div className="space-y-6 p-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Preview Mode</h1>
          <Badge variant="outline">Version {versionNumber}: {versionName}</Badge>
        </div>

        {Object.entries(pages).map(([pageName, pageData]: [string, any]) => (
          <Card key={pageName} className="p-6">
            <h2 className="text-2xl font-semibold mb-4 capitalize">{pageName} Page</h2>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Components:</p>
              <div className="flex flex-wrap gap-2">
                {pageData.components?.map((component: string) => (
                  <Badge key={component} variant="secondary">
                    {component}
                  </Badge>
                ))}
              </div>
              {pageData.theme && (
                <p className="text-sm">
                  <strong>Theme:</strong> {pageData.theme}
                </p>
              )}
            </div>
          </Card>
        ))}

        {versionData?.globalSettings && (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Global Settings</h2>
            <pre className="bg-muted p-4 rounded text-xs overflow-auto">
              {JSON.stringify(versionData.globalSettings, null, 2)}
            </pre>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div
      className={`fixed inset-0 bg-background z-50 ${
        isFullscreen ? '' : 'p-4'
      } flex flex-col`}
    >
      {/* Header */}
      <div className="bg-card border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">
            Version {versionNumber}: {versionName}
          </h2>
          <Badge variant="outline">Preview Mode</Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Device Type Selector */}
          <div className="flex gap-1 border rounded-lg p-1">
            <Button
              variant={deviceType === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDeviceType('desktop')}
              className="gap-1"
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={deviceType === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDeviceType('tablet')}
              className="gap-1"
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={deviceType === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDeviceType('mobile')}
              className="gap-1"
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>

          {/* Fullscreen Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="gap-1"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="h-4 w-4" />
                Exit Fullscreen
              </>
            ) : (
              <>
                <Maximize2 className="h-4 w-4" />
                Fullscreen
              </>
            )}
          </Button>

          {/* Close Button */}
          <Button variant="outline" size="sm" onClick={onClose} className="gap-1">
            <X className="h-4 w-4" />
            Close Preview
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto bg-muted p-8">
        <div className={`mx-auto transition-all duration-300 ${deviceSizes[deviceType]}`}>
          <div className="bg-background rounded-lg shadow-2xl overflow-auto max-h-[calc(100vh-200px)]">
            {renderPreviewContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VersionPreview;
