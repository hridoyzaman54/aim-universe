import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Music, Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface Key {
  note: string;
  isBlack: boolean;
  frequency: number;
}

const keys: Key[] = [
  { note: 'C', isBlack: false, frequency: 261.63 },
  { note: 'C#', isBlack: true, frequency: 277.18 },
  { note: 'D', isBlack: false, frequency: 293.66 },
  { note: 'D#', isBlack: true, frequency: 311.13 },
  { note: 'E', isBlack: false, frequency: 329.63 },
  { note: 'F', isBlack: false, frequency: 349.23 },
  { note: 'F#', isBlack: true, frequency: 369.99 },
  { note: 'G', isBlack: false, frequency: 392.00 },
  { note: 'G#', isBlack: true, frequency: 415.30 },
  { note: 'A', isBlack: false, frequency: 440.00 },
  { note: 'A#', isBlack: true, frequency: 466.16 },
  { note: 'B', isBlack: false, frequency: 493.88 },
  { note: 'C2', isBlack: false, frequency: 523.25 },
];

const PianoPlayer: React.FC = () => {
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [audioContext] = useState(() => new (window.AudioContext || (window as any).webkitAudioContext)());

  const playNote = useCallback((frequency: number, note: string) => {
    if (isMuted) return;

    setActiveKeys(prev => new Set(prev).add(note));

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    const actualVolume = (volume / 100) * 0.3;
    gainNode.gain.setValueAtTime(actualVolume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.8);

    setTimeout(() => {
      setActiveKeys(prev => {
        const next = new Set(prev);
        next.delete(note);
        return next;
      });
    }, 200);
  }, [audioContext, volume, isMuted]);

  const whiteKeys = keys.filter(k => !k.isBlack);
  const blackKeys = keys.filter(k => k.isBlack);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Music className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">
            Piano Player
          </h2>
          <p className="text-sm text-muted-foreground">
            Tap the keys to play music
          </p>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-4 bg-secondary/50 rounded-xl p-4">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Volume2 className="w-5 h-5 text-foreground" />
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
        <span className="text-sm text-muted-foreground w-10">{volume}%</span>
      </div>

      {/* Piano Keys */}
      <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-6 pt-4 overflow-hidden">
        {/* Wood Grain Effect */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,...')]" />
        
        <div className="relative flex justify-center">
          {/* White Keys */}
          <div className="flex">
            {whiteKeys.map((key, index) => (
              <motion.button
                key={key.note}
                whileTap={{ scale: 0.98 }}
                onMouseDown={() => playNote(key.frequency, key.note)}
                onTouchStart={() => playNote(key.frequency, key.note)}
                className={`relative w-14 h-48 mx-0.5 rounded-b-lg transition-all ${
                  activeKeys.has(key.note)
                    ? 'bg-gradient-to-b from-primary/30 to-primary/10'
                    : 'bg-gradient-to-b from-white to-gray-100'
                } border border-gray-300 shadow-lg hover:from-gray-50 hover:to-gray-200`}
                style={{ zIndex: 1 }}
              >
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-500">
                  {key.note.replace('2', '')}
                </span>
                {activeKeys.has(key.note) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute inset-0 bg-primary/20 rounded-b-lg"
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Black Keys */}
          <div className="absolute top-4 left-0 right-0 flex justify-center pointer-events-none">
            <div className="relative flex" style={{ marginLeft: '0px' }}>
              {whiteKeys.map((whiteKey, index) => {
                const blackKey = blackKeys.find(b => 
                  b.note === whiteKey.note + '#' || 
                  (whiteKey.note === 'C2' ? false : b.note === whiteKey.note + '#')
                );
                
                if (!blackKey || ['E', 'B', 'C2'].includes(whiteKey.note)) {
                  return <div key={whiteKey.note} className="w-14 mx-0.5" />;
                }

                return (
                  <div key={whiteKey.note} className="w-14 mx-0.5 relative">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onMouseDown={() => playNote(blackKey.frequency, blackKey.note)}
                      onTouchStart={() => playNote(blackKey.frequency, blackKey.note)}
                      className={`absolute left-1/2 -translate-x-1/2 w-9 h-28 rounded-b-md transition-all pointer-events-auto ${
                        activeKeys.has(blackKey.note)
                          ? 'bg-gradient-to-b from-primary to-primary/80'
                          : 'bg-gradient-to-b from-gray-900 to-gray-800'
                      } shadow-lg hover:from-gray-800 hover:to-gray-700`}
                      style={{ zIndex: 2 }}
                    >
                      {activeKeys.has(blackKey.note) && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 bg-primary/30 rounded-b-md"
                        />
                      )}
                    </motion.button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Piano Brand */}
        <div className="text-center mt-4">
          <span className="text-xs text-gray-500 font-serif tracking-widest">EDUPRO PIANO</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-muted-foreground">
        Click or tap the keys to play • White keys are natural notes • Black keys are sharps
      </div>
    </motion.div>
  );
};

export default PianoPlayer;
