import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      <div className="relative flex flex-col items-center gap-8">
        {/* Animated Logo/Brand */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Outer Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 rounded-full border-4 border-primary/20"
          >
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
          
          {/* Inner Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border-4 border-accent/30"
          >
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </motion.div>
          
          {/* Center Pulse */}
          <motion.div
            className="absolute inset-8 rounded-full bg-primary/20"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>

        {/* Loading Text */}
        <motion.div className="flex items-center gap-1">
          {['A', 'I', 'M'].map((letter, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="text-2xl font-bold text-foreground"
            >
              {letter}
            </motion.span>
          ))}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-primary"
          >
            360
          </motion.span>
        </motion.div>

        {/* Loading Dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              animate={{
                y: [0, -8, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
