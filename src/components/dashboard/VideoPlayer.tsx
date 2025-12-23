import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, 
  SkipBack, SkipForward, Settings 
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface VideoPlayerProps {
  videoUrl?: string;
  title?: string;
  onComplete?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  title = 'Lesson Video',
  onComplete 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

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

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setCurrentTime(current);
      setProgress((current / total) * 100);
      
      if (current >= total && onComplete) {
        onComplete();
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressChange = (value: number[]) => {
    if (videoRef.current) {
      const newTime = (value[0] / 100) * duration;
      videoRef.current.currentTime = newTime;
      setProgress(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.volume = value[0] / 100;
      setVolume(value[0]);
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
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

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden bg-card border border-border"
    >
      <div className="relative group">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full aspect-video bg-black"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={togglePlay}
        />
        
        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Center Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-primary-foreground" />
              ) : (
                <Play className="w-8 h-8 text-primary-foreground ml-1" />
              )}
            </motion.button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
            {/* Progress Bar */}
            <Slider
              value={[progress]}
              onValueChange={handleProgressChange}
              max={100}
              step={0.1}
              className="cursor-pointer"
            />

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => skip(-10)} className="text-white hover:text-primary transition-colors">
                  <SkipBack className="w-5 h-5" />
                </button>
                <button onClick={togglePlay} className="text-white hover:text-primary transition-colors">
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                <button onClick={() => skip(10)} className="text-white hover:text-primary transition-colors">
                  <SkipForward className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-2">
                  <button onClick={toggleMute} className="text-white hover:text-primary transition-colors">
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <div className="w-20">
                    <Slider
                      value={[volume]}
                      onValueChange={handleVolumeChange}
                      max={100}
                      step={1}
                    />
                  </div>
                </div>
                
                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button className="text-white hover:text-primary transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
                <button onClick={toggleFullscreen} className="text-white hover:text-primary transition-colors">
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {title && (
        <div className="p-4 border-t border-border">
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
      )}
    </motion.div>
  );
};

export default VideoPlayer;
