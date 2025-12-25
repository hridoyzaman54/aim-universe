import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title, onProgress, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState('720p');
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const qualities = ['360p', '480p', '720p', '1080p'];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      const progress = (video.currentTime / video.duration) * 100;
      onProgress?.(progress);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onComplete?.();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onProgress, onComplete]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = value[0];
    setVolume(newVolume);
    video.volume = newVolume / 100;
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (value[0] / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSpeedChange = (speed: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  const skipTime = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  // Check if URL is YouTube
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  const youtubeEmbedUrl = isYouTube 
    ? videoUrl.replace('watch?v=', 'embed/').split('&')[0]
    : null;

  return (
    <Card className="overflow-hidden bg-black">
      <div
        ref={containerRef}
        className="relative aspect-video bg-black group"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {/* Video Element or YouTube Embed */}
        {isYouTube ? (
          <iframe
            src={youtubeEmbedUrl || ''}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full"
            onClick={togglePlay}
          />
        )}

        {/* Play/Pause Overlay */}
        {!isYouTube && !isPlaying && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
            onClick={togglePlay}
          >
            <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center">
              <Play className="w-10 h-10 text-white ml-1" />
            </div>
          </motion.div>
        )}

        {/* Controls */}
        {!isYouTube && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showControls ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
          >
            {/* Progress Bar */}
            <Slider
              value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
              onValueChange={handleSeek}
              max={100}
              step={0.1}
              className="mb-4 cursor-pointer"
            />

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {/* Play/Pause */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlay}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>

                {/* Skip Backward */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => skipTime(-10)}
                  className="text-white hover:bg-white/20"
                >
                  <SkipBack className="w-5 h-5" />
                </Button>

                {/* Skip Forward */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => skipTime(10)}
                  className="text-white hover:bg-white/20"
                >
                  <SkipForward className="w-5 h-5" />
                </Button>

                {/* Volume */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    className="w-24"
                  />
                </div>

                {/* Time */}
                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Speed Control */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-white hover:bg-white/20 text-sm">
                      {playbackSpeed}x
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {speeds.map(speed => (
                      <DropdownMenuItem
                        key={speed}
                        onClick={() => handleSpeedChange(speed)}
                        className={playbackSpeed === speed ? 'bg-primary/20' : ''}
                      >
                        {speed}x
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Quality Control */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-white hover:bg-white/20 gap-1">
                      <Settings className="w-4 h-4" />
                      {quality}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {qualities.map(q => (
                      <DropdownMenuItem
                        key={q}
                        onClick={() => setQuality(q)}
                        className={quality === q ? 'bg-primary/20' : ''}
                      >
                        {q}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Fullscreen */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20"
                >
                  <Maximize className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Video Title */}
      <div className="p-4 bg-card">
        <h3 className="font-bold text-lg text-foreground">{title}</h3>
      </div>
    </Card>
  );
};

export default VideoPlayer;
