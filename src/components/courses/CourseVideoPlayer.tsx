import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  SkipBack, 
  SkipForward,
  X,
  Settings,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';

interface CourseVideoPlayerProps {
  courseTitle: string;
  videoTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

// Mock video URL - using a royalty-free video
const MOCK_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

const CourseVideoPlayer: React.FC<CourseVideoPlayerProps> = ({
  courseTitle,
  videoTitle,
  isOpen,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
      videoRef.current.playbackRate = playbackRate;
    }
  }, [volume, isMuted, playbackRate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(value[0] === 0);
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsPlaying(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background">
        <DialogHeader className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{courseTitle}</p>
              <DialogTitle className="font-display text-xl">{videoTitle}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div 
          className="relative aspect-video bg-black cursor-pointer group"
          onMouseMove={handleMouseMove}
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            src={MOCK_VIDEO_URL}
            className="w-full h-full"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />

          {/* Play/Pause Overlay */}
          <motion.div
            initial={false}
            animate={{ opacity: !isPlaying ? 1 : 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-lg"
            >
              {isPlaying ? (
                <Pause className="w-10 h-10 text-primary-foreground" />
              ) : (
                <Play className="w-10 h-10 text-primary-foreground ml-1" />
              )}
            </motion.div>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={false}
            animate={{ opacity: showControls ? 1 : 0 }}
            className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Progress Bar */}
            <div className="mb-3">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={handleSeek}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button size="sm" variant="ghost" onClick={togglePlay} className="text-white hover:bg-white/20">
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                
                <Button size="sm" variant="ghost" onClick={() => skip(-10)} className="text-white hover:bg-white/20">
                  <SkipBack className="w-5 h-5" />
                </Button>
                
                <Button size="sm" variant="ghost" onClick={() => skip(10)} className="text-white hover:bg-white/20">
                  <SkipForward className="w-5 h-5" />
                </Button>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={toggleMute} className="text-white hover:bg-white/20">
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={1}
                    step={0.1}
                    onValueChange={handleVolumeChange}
                    className="w-20"
                  />
                </div>

                <span className="text-sm text-white">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={playbackRate}
                  onChange={(e) => setPlaybackRate(Number(e.target.value))}
                  className="bg-transparent text-white text-sm border border-white/30 rounded px-2 py-1"
                >
                  <option value={0.5} className="bg-background text-foreground">0.5x</option>
                  <option value={1} className="bg-background text-foreground">1x</option>
                  <option value={1.25} className="bg-background text-foreground">1.25x</option>
                  <option value={1.5} className="bg-background text-foreground">1.5x</option>
                  <option value={2} className="bg-background text-foreground">2x</option>
                </select>

                <Button size="sm" variant="ghost" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
                  <Maximize className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="p-4 border-t border-border bg-secondary/30">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span>Mock video for testing - Big Buck Bunny (Open Source)</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseVideoPlayer;
