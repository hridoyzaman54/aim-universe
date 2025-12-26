import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Trophy, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Balloon {
  id: number;
  x: number;
  y?: number;
  color: string;
  size: number;
  speed: number;
  soundIndex: number;
}

const colors = [
  'from-red-400 to-red-600',
  'from-blue-400 to-blue-600',
  'from-green-400 to-green-600',
  'from-yellow-400 to-yellow-600',
  'from-purple-400 to-purple-600',
  'from-pink-400 to-pink-600',
  'from-orange-400 to-orange-600',
  'from-cyan-400 to-cyan-600',
];

const popSoundFrequencies = [261, 293, 329, 349, 392, 440, 493, 523];

const BalloonGame: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [poppedPositions, setPoppedPositions] = useState<{ x: number; y: number; color: string }[]>([]);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playPopSound = useCallback((frequency: number) => {
    if (isMuted) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  }, [isMuted]);

  const createBalloon = useCallback((): Balloon => {
    const soundIndex = Math.floor(Math.random() * popSoundFrequencies.length);
    return {
      id: Date.now() + Math.random(),
      x: Math.random() * 80 + 10,
      color: colors[soundIndex],
      size: Math.random() * 30 + 50,
      speed: Math.random() * 2 + 3,
      soundIndex,
    };
  }, []);

  const popBalloon = useCallback((balloon: Balloon, event: React.MouseEvent | React.TouchEvent) => {
    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (rect) {
      const clientX = 'touches' in event ? event.touches[0]?.clientX || 0 : event.clientX;
      const clientY = 'touches' in event ? event.touches[0]?.clientY || 0 : event.clientY;
      
      setPoppedPositions(prev => [...prev, {
        x: clientX - rect.left,
        y: clientY - rect.top,
        color: balloon.color,
      }]);

      setTimeout(() => {
        setPoppedPositions(prev => prev.slice(1));
      }, 500);
    }

    playPopSound(popSoundFrequencies[balloon.soundIndex]);
    setBalloons(prev => prev.filter(b => b.id !== balloon.id));
    setScore(prev => prev + 10);
  }, [playPopSound]);

  useEffect(() => {
    if (!isPlaying) return;

    const spawnInterval = setInterval(() => {
      setBalloons(prev => {
        if (prev.length < 8) {
          return [...prev, createBalloon()];
        }
        return prev;
      });
    }, 1000);

    const moveInterval = setInterval(() => {
      setBalloons(prev => 
        prev.map(balloon => ({
          ...balloon,
          y: balloon.y !== undefined ? balloon.y - balloon.speed : 100 - balloon.speed,
        })).filter(balloon => balloon.y !== undefined && balloon.y > -20)
      );
    }, 50);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(moveInterval);
    };
  }, [isPlaying, createBalloon]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore]);

  const resetGame = () => {
    setIsPlaying(false);
    setBalloons([]);
    setScore(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
            <span className="text-2xl">🎈</span>
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              Balloon Pop Game
            </h2>
            <p className="text-sm text-muted-foreground">
              Pop balloons to hear musical notes!
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-3 hover:bg-secondary rounded-xl transition-colors"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Volume2 className="w-5 h-5 text-foreground" />
          )}
        </button>
      </div>

      {/* Score Board */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Score</p>
          <p className="text-3xl font-bold text-primary">{score}</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Trophy className="w-4 h-4 text-warning" />
            <p className="text-sm text-muted-foreground">High Score</p>
          </div>
          <p className="text-3xl font-bold text-warning">{highScore}</p>
        </Card>
      </div>

      {/* Game Area */}
      <div
        ref={gameAreaRef}
        className="relative h-96 bg-gradient-to-b from-sky-200 via-sky-300 to-sky-400 dark:from-sky-800 dark:via-sky-900 dark:to-indigo-900 rounded-2xl overflow-hidden border border-border"
      >
        {/* Clouds */}
        <div className="absolute inset-0 pointer-events-none">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute w-24 h-12 bg-white/30 dark:bg-white/10 rounded-full blur-sm"
              style={{
                top: `${i * 20}%`,
                left: `${i * 25}%`,
              }}
              animate={{ x: [0, 20, 0] }}
              transition={{ duration: 5 + i, repeat: Infinity }}
            />
          ))}
        </div>

        {/* Balloons */}
        <AnimatePresence>
          {balloons.map((balloon) => (
            <motion.div
              key={balloon.id}
              initial={{ y: '100%', scale: 0 }}
              animate={{ 
                y: `${100 - (balloon.y || 0)}%`,
                scale: 1,
              }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 100 }}
              style={{
                left: `${balloon.x}%`,
                width: balloon.size,
                height: balloon.size * 1.2,
              }}
              className="absolute cursor-pointer"
              onClick={(e) => isPlaying && popBalloon(balloon, e)}
              onTouchStart={(e) => isPlaying && popBalloon(balloon, e)}
            >
              <div 
                className={`w-full h-full rounded-full bg-gradient-to-br ${balloon.color} shadow-lg relative`}
                style={{
                  borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
                }}
              >
                {/* Shine */}
                <div className="absolute top-2 left-2 w-1/4 h-1/4 bg-white/40 rounded-full" />
                {/* String */}
                <div 
                  className="absolute bottom-0 left-1/2 w-0.5 h-8 bg-gray-400"
                  style={{ transform: 'translateX(-50%) translateY(100%)' }}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Pop Effects */}
        <AnimatePresence>
          {poppedPositions.map((pos, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              style={{ left: pos.x, top: pos.y }}
              className="absolute pointer-events-none"
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0 }}
                  animate={{
                    x: Math.cos((i * Math.PI) / 4) * 50,
                    y: Math.sin((i * Math.PI) / 4) * 50,
                    opacity: 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`absolute w-3 h-3 rounded-full bg-gradient-to-br ${pos.color}`}
                />
              ))}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Start Overlay */}
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                🎈
              </motion.div>
              <p className="text-white text-lg mb-4">
                Pop the balloons to score points!
              </p>
              <p className="text-white/70 text-sm mb-4">
                Each color makes a different musical note
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <Button
          size="lg"
          onClick={() => setIsPlaying(!isPlaying)}
          className="gap-2 min-w-32"
        >
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Play
            </>
          )}
        </Button>
        
        <Button
          size="lg"
          variant="outline"
          onClick={resetGame}
          className="gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </Button>
      </div>

      {/* Instructions */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <h4 className="font-semibold text-foreground mb-2">How to Play:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Click or tap balloons before they float away</li>
          <li>• Each balloon color plays a different musical note</li>
          <li>• Try to pop as many as you can!</li>
          <li>• Great for hand-eye coordination and sensory fun</li>
        </ul>
      </Card>
    </motion.div>
  );
};

export default BalloonGame;
