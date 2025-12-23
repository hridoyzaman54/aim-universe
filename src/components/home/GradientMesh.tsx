import React from 'react';
import { motion } from 'framer-motion';

const GradientMesh: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 70%)',
          left: '10%',
          top: '20%',
        }}
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 30, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, hsl(180 70% 50% / 0.3) 0%, transparent 70%)',
          right: '5%',
          top: '10%',
        }}
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 50, -20, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
      
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-25"
        style={{
          background: 'radial-gradient(circle, hsl(160 60% 45% / 0.35) 0%, transparent 70%)',
          left: '50%',
          bottom: '10%',
        }}
        animate={{
          x: [0, 30, -50, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
      />

      {/* Mesh grid overlay with subtle animation */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
        <defs>
          <pattern id="mesh-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
            <motion.circle
              cx="30"
              cy="30"
              r="1"
              fill="hsl(var(--primary))"
              animate={{ r: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <line x1="0" y1="30" x2="60" y2="30" stroke="hsl(var(--primary))" strokeWidth="0.5" />
            <line x1="30" y1="0" x2="30" y2="60" stroke="hsl(var(--primary))" strokeWidth="0.5" />
          </pattern>
        </defs>
        <motion.rect
          width="100%"
          height="100%"
          fill="url(#mesh-pattern)"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </svg>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/30"
          style={{
            left: `${5 + (i * 4.5)}%`,
            top: `${10 + (i % 5) * 18}%`,
          }}
          animate={{
            y: [0, -20 - (i % 3) * 10, 0],
            x: [0, (i % 2 === 0 ? 15 : -15), 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 5 + (i % 4) * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Soft noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

export default GradientMesh;
