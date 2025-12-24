import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  FileText, 
  Headphones, 
  Play, 
  Pause,
  Volume2,
  VolumeX,
  X,
  ChevronDown,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface CourseMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'slides' | 'audio';
  size: string;
  url: string;
}

interface CourseMaterialsProps {
  courseId: number;
  courseTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

// Mock materials data
const getMaterialsForCourse = (courseId: number): CourseMaterial[] => {
  const baseMaterials: CourseMaterial[] = [
    {
      id: 'pdf-1',
      title: 'Chapter 1 - Introduction',
      type: 'pdf',
      size: '2.4 MB',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    {
      id: 'pdf-2',
      title: 'Chapter 2 - Core Concepts',
      type: 'pdf',
      size: '3.1 MB',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    {
      id: 'slides-1',
      title: 'Lecture Slides - Week 1',
      type: 'slides',
      size: '5.2 MB',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    {
      id: 'slides-2',
      title: 'Lecture Slides - Week 2',
      type: 'slides',
      size: '4.8 MB',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    {
      id: 'audio-1',
      title: 'Podcast - Course Overview',
      type: 'audio',
      size: '15.3 MB',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    },
    {
      id: 'audio-2',
      title: 'Podcast - Chapter 1 Summary',
      type: 'audio',
      size: '12.8 MB',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    },
  ];
  
  return baseMaterials;
};

const CourseMaterials: React.FC<CourseMaterialsProps> = ({
  courseId,
  courseTitle,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState('pdf');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  const materials = getMaterialsForCourse(courseId);
  const pdfMaterials = materials.filter(m => m.type === 'pdf');
  const slidesMaterials = materials.filter(m => m.type === 'slides');
  const audioMaterials = materials.filter(m => m.type === 'audio');

  const handleDownload = async (material: CourseMaterial) => {
    setDownloadingId(material.id);
    setDownloadProgress(0);

    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Trigger actual download
    const link = document.createElement('a');
    link.href = material.url;
    link.download = material.title + (material.type === 'pdf' || material.type === 'slides' ? '.pdf' : '.mp3');
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadingId(null);
    setDownloadProgress(0);
    toast.success(`Downloaded: ${material.title}`);
  };

  const toggleAudio = (material: CourseMaterial) => {
    if (playingAudioId === material.id) {
      audioRef?.pause();
      setPlayingAudioId(null);
      setAudioRef(null);
    } else {
      if (audioRef) {
        audioRef.pause();
      }
      const audio = new Audio(material.url);
      audio.play();
      audio.onended = () => {
        setPlayingAudioId(null);
        setAudioRef(null);
      };
      setAudioRef(audio);
      setPlayingAudioId(material.id);
    }
  };

  const MaterialCard: React.FC<{ material: CourseMaterial; index: number }> = ({ material, index }) => {
    const isDownloading = downloadingId === material.id;
    const isPlaying = playingAudioId === material.id;
    const isAudio = material.type === 'audio';

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="p-4 rounded-xl bg-secondary/50 border border-border flex items-center gap-4 group hover:border-primary/30 transition-colors"
      >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
          material.type === 'pdf' 
            ? 'bg-destructive/20 text-destructive' 
            : material.type === 'slides' 
              ? 'bg-warning/20 text-warning' 
              : 'bg-accent/20 text-accent'
        }`}>
          {material.type === 'audio' ? (
            <Headphones className="w-6 h-6" />
          ) : (
            <FileText className="w-6 h-6" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground truncate">{material.title}</h4>
          <p className="text-sm text-muted-foreground">{material.size}</p>
          {isDownloading && (
            <Progress value={downloadProgress} className="h-1 mt-2" />
          )}
        </div>

        <div className="flex gap-2">
          {isAudio && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => toggleAudio(material)}
              className="h-9 w-9 p-0"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDownload(material)}
            disabled={isDownloading}
            className="h-9"
          >
            {isDownloading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              />
            ) : (
              <>
                <Download className="w-4 h-4 mr-1" />
                Download
              </>
            )}
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Course Materials - {courseTitle}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="pdf" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              PDFs ({pdfMaterials.length})
            </TabsTrigger>
            <TabsTrigger value="slides" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Slides ({slidesMaterials.length})
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <Headphones className="w-4 h-4" />
              Audio ({audioMaterials.length})
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="pdf" className="space-y-3 m-0">
              {pdfMaterials.map((material, i) => (
                <MaterialCard key={material.id} material={material} index={i} />
              ))}
            </TabsContent>

            <TabsContent value="slides" className="space-y-3 m-0">
              {slidesMaterials.map((material, i) => (
                <MaterialCard key={material.id} material={material} index={i} />
              ))}
            </TabsContent>

            <TabsContent value="audio" className="space-y-3 m-0">
              {audioMaterials.map((material, i) => (
                <MaterialCard key={material.id} material={material} index={i} />
              ))}
            </TabsContent>
          </div>
        </Tabs>

        <div className="pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseMaterials;
