import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Music, Play, Pause, Volume2, VolumeX, 
  X, ChevronUp, ChevronDown, SkipForward, SkipBack,
  Repeat, Shuffle
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const calmTracks = [
  { id: 1, title: 'Peaceful Ambience', duration: '∞', color: 'from-blue-400 to-cyan-500' },
  { id: 2, title: 'Relaxing Piano', duration: '∞', color: 'from-green-400 to-emerald-500' },
  { id: 3, title: 'Soft Meditation', duration: '∞', color: 'from-purple-400 to-pink-500' },
  { id: 4, title: 'Calm Acoustic', duration: '∞', color: 'from-yellow-400 to-orange-500' },
  { id: 5, title: 'Gentle Waves', duration: '∞', color: 'from-indigo-400 to-violet-500' },
  { id: 6, title: 'Nature Sounds', duration: '∞', color: 'from-teal-400 to-cyan-500' },
];

// Long calm music - royalty-free working URLs
const audioUrls: Record<number, string> = {
  1: 'https://cdn.pixabay.com/audio/2024/11/29/audio_69e8e36c24.mp3', // Peaceful ambient
  2: 'https://cdn.pixabay.com/audio/2024/02/14/audio_08bce41b9c.mp3', // Relaxing piano
  3: 'https://cdn.pixabay.com/audio/2022/05/16/audio_1808fbf07a.mp3', // Meditation music
  4: 'https://cdn.pixabay.com/audio/2023/10/30/audio_5e524277e0.mp3', // Calm acoustic
  5: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3', // Lofi chill
  6: 'https://cdn.pixabay.com/audio/2024/09/10/audio_6e1f8d3de0.mp3', // Nature ambience
};

const AudioJukebox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(calmTracks[0]);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = volume / 100;
    audio.preload = 'auto';
    
    audio.addEventListener('loadstart', () => setIsLoading(true));
    audio.addEventListener('canplay', () => setIsLoading(false));
    audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
    audio.addEventListener('ended', () => {
      if (!isLooping) {
        nextTrack();
      }
    });
    audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      setIsLoading(false);
    });
    
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, [isLooping]);

  const handlePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        setIsLoading(true);
        if (audioRef.current.src !== audioUrls[currentTrack.id]) {
          audioRef.current.src = audioUrls[currentTrack.id];
        }
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error playing audio:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleTrackChange = async (track: typeof calmTracks[0]) => {
    setCurrentTrack(track);
    if (audioRef.current) {
      const wasPlaying = isPlaying;
      audioRef.current.pause();
      audioRef.current.src = audioUrls[track.id];
      setCurrentTime(0);
      
      if (wasPlaying) {
        try {
          setIsLoading(true);
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error('Error playing audio:', error);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const nextTrack = () => {
    const currentIndex = calmTracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % calmTracks.length;
    handleTrackChange(calmTracks[nextIndex]);
  };

  const prevTrack = () => {
    const currentIndex = calmTracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + calmTracks.length) % calmTracks.length;
    handleTrackChange(calmTracks[prevIndex]);
  };

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setIsPlaying(false);
    setIsOpen(false);
    setCurrentTime(0);
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current && duration) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time: number) => {
    if (!isFinite(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Floating button when closed
  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg flex items-center justify-center z-50"
      >
        <Music className="w-7 h-7 text-white" />
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/30"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-success flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span className="text-[8px] text-white font-bold">♪</span>
        </motion.div>
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className={`bg-card border border-border rounded-2xl shadow-2xl overflow-hidden ${
          isMinimized ? 'w-72' : 'w-80'
        }`}>
          {/* Header */}
          <div className={`bg-gradient-to-r ${currentTrack.color} p-4 flex items-center justify-between relative overflow-hidden`}>
            {/* Animated background bars */}
            {isPlaying && (
              <div className="absolute inset-0 opacity-20 flex items-end justify-around px-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 bg-white rounded-full"
                    animate={{ height: [8, Math.random() * 30 + 10, 8] }}
                    transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, delay: i * 0.05 }}
                  />
                ))}
              </div>
            )}
            
            <div className="flex items-center gap-3 relative z-10">
              <motion.div
                animate={isPlaying ? { rotate: 360 } : {}}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
              >
                <Music className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <p className="text-xs text-white/80 font-medium">Now Playing</p>
                <p className="font-semibold text-white">{currentTrack.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 relative z-10">
              <button
                onClick={() => setIsLooping(!isLooping)}
                className={`p-1.5 rounded-lg transition-colors ${isLooping ? 'bg-white/30' : 'hover:bg-white/20'}`}
                title={isLooping ? 'Loop On' : 'Loop Off'}
              >
                <Repeat className={`w-4 h-4 ${isLooping ? 'text-white' : 'text-white/70'}`} />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                {isMinimized ? (
                  <ChevronUp className="w-4 h-4 text-white" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-white" />
                )}
              </button>
              <button
                onClick={handleClose}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {/* Track List */}
              <div className="p-3 max-h-48 overflow-y-auto space-y-1">
                {calmTracks.map((track, index) => (
                  <motion.button
                    key={track.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 5, scale: 1.02 }}
                    onClick={() => handleTrackChange(track)}
                    className={`w-full p-2.5 rounded-xl flex items-center gap-3 transition-all ${
                      currentTrack.id === track.id 
                        ? 'bg-primary/15 text-primary border border-primary/20' 
                        : 'hover:bg-secondary text-foreground'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${track.color} flex items-center justify-center shadow-md`}>
                      {currentTrack.id === track.id && isPlaying ? (
                        <motion.div className="flex gap-0.5 items-end h-4">
                          {[1, 2, 3].map((i) => (
                            <motion.div
                              key={i}
                              className="w-1 bg-white rounded-full"
                              animate={{ height: [4, 14, 4] }}
                              transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
                            />
                          ))}
                        </motion.div>
                      ) : (
                        <Music className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <span className="text-sm font-medium block">{track.title}</span>
                      <span className="text-xs text-muted-foreground">Calm & Relaxing</span>
                    </div>
                    {currentTrack.id === track.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full bg-primary"
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Progress bar */}
          {duration > 0 && (
            <div className="px-4 pb-2">
              <Slider
                value={[currentTime]}
                max={duration}
                step={1}
                onValueChange={handleSeek}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-center gap-4 mb-4">
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevTrack}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <SkipBack className="w-5 h-5 text-foreground" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePlay}
                disabled={isLoading}
                className={`w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br ${currentTrack.color} shadow-lg relative`}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white ml-0.5" />
                )}
                {isPlaying && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-white/30"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextTrack}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <SkipForward className="w-5 h-5 text-foreground" />
              </motion.button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Volume2 className="w-4 h-4 text-foreground" />
                )}
              </motion.button>
              <Slider
                value={[isMuted ? 0 : volume]}
                onValueChange={(v) => {
                  setVolume(v[0]);
                  setIsMuted(false);
                }}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-8 text-right">{isMuted ? 0 : volume}%</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AudioJukebox;
