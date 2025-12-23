import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Music, Play, Pause, Volume2, VolumeX, 
  X, ChevronUp, ChevronDown, SkipForward, SkipBack 
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const calmTracks = [
  { id: 1, title: 'Ocean Waves', duration: '∞', color: 'from-blue-400 to-cyan-500' },
  { id: 2, title: 'Forest Rain', duration: '∞', color: 'from-green-400 to-emerald-500' },
  { id: 3, title: 'Gentle Piano', duration: '∞', color: 'from-purple-400 to-pink-500' },
  { id: 4, title: 'Birds Singing', duration: '∞', color: 'from-yellow-400 to-orange-500' },
  { id: 5, title: 'Wind Chimes', duration: '∞', color: 'from-indigo-400 to-violet-500' },
];

// Using royalty-free audio URLs
const audioUrls: Record<number, string> = {
  1: 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3',
  2: 'https://assets.mixkit.co/active_storage/sfx/2512/2512-preview.mp3',
  3: 'https://assets.mixkit.co/active_storage/sfx/2550/2550-preview.mp3',
  4: 'https://assets.mixkit.co/active_storage/sfx/2437/2437-preview.mp3',
  5: 'https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3',
};

const AudioJukebox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(calmTracks[0]);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    audioRef.current.volume = volume / 100;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.src = audioUrls[currentTrack.id];
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTrackChange = (track: typeof calmTracks[0]) => {
    setCurrentTrack(track);
    if (audioRef.current && isPlaying) {
      audioRef.current.src = audioUrls[track.id];
      audioRef.current.play().catch(console.error);
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
    }
    setIsPlaying(false);
    setIsOpen(false);
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
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg flex items-center justify-center z-50"
      >
        <Music className="w-6 h-6 text-white" />
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/30"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className={`bg-card border border-border rounded-2xl shadow-2xl overflow-hidden ${
          isMinimized ? 'w-72' : 'w-80'
        }`}>
          {/* Header */}
          <div className={`bg-gradient-to-r ${currentTrack.color} p-4 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <motion.div
                animate={isPlaying ? { rotate: 360 } : {}}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
              >
                <Music className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <p className="text-sm text-white/80">Now Playing</p>
                <p className="font-semibold text-white">{currentTrack.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
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
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
            >
              {/* Track List */}
              <div className="p-3 max-h-40 overflow-y-auto">
                {calmTracks.map((track) => (
                  <motion.button
                    key={track.id}
                    whileHover={{ x: 5 }}
                    onClick={() => handleTrackChange(track)}
                    className={`w-full p-2 rounded-lg flex items-center gap-3 transition-colors ${
                      currentTrack.id === track.id 
                        ? 'bg-primary/10 text-primary' 
                        : 'hover:bg-secondary text-foreground'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${track.color} flex items-center justify-center`}>
                      {currentTrack.id === track.id && isPlaying ? (
                        <motion.div
                          className="flex gap-0.5"
                        >
                          {[1, 2, 3].map((i) => (
                            <motion.div
                              key={i}
                              className="w-1 bg-white rounded-full"
                              animate={{ height: [4, 12, 4] }}
                              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                            />
                          ))}
                        </motion.div>
                      ) : (
                        <Music className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="text-sm font-medium">{track.title}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Controls */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-center gap-4 mb-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
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
                className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br ${currentTrack.color}`}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white ml-0.5" />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextTrack}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <SkipForward className="w-5 h-5 text-foreground" />
              </motion.button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Volume2 className="w-4 h-4 text-foreground" />
                )}
              </button>
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
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AudioJukebox;
