import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedLogoProps {
  className?: string;
  size?: 'default' | 'large';
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ className = '', size = 'default' }) => {
  const logoSize = size === 'large' ? 'w-96 h-96' : 'w-48 h-48';
  const glowMargin = size === 'large' ? '-m-24' : '-m-12';
  const ringMargin1 = size === 'large' ? '-m-16' : '-m-8';
  const ringMargin2 = size === 'large' ? '-m-12' : '-m-6';
  const particleDistance = size === 'large' ? '280px' : '140px';

  return (
    <div className={`relative ${className}`}>
      {/* Outer rotating glow ring 1 - Slow */}
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
        className={`absolute inset-0 ${ringMargin1}`}
      >
        <div className="w-full h-full rounded-full border-2 border-primary/20" />
      </motion.div>

      {/* Outer rotating glow ring 2 - Medium */}
      <motion.div
        animate={{ 
          rotate: -360,
          scale: [1, 1.15, 1]
        }}
        transition={{ 
          rotate: { duration: 15, repeat: Infinity, ease: "linear" },
          scale: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
        }}
        className={`absolute inset-0 ${ringMargin2}`}
      >
        <div className="w-full h-full rounded-full border-2 border-accent/20" />
      </motion.div>


      {/* Main logo - Static, no floating animation */}
      <div className="relative z-10 cursor-pointer">
        {/* Logo image - Clean and clearly visible with subtle glow */}
        <motion.img 
          src="/aim-logo.png" 
          alt="AIM Centre 360" 
          className={`${logoSize} object-contain relative z-10`}
          animate={{
            filter: [
              'drop-shadow(0 0 20px rgba(0, 123, 255, 0.3)) drop-shadow(0 0 40px rgba(138, 43, 226, 0.2))',
              'drop-shadow(0 0 30px rgba(0, 123, 255, 0.4)) drop-shadow(0 0 50px rgba(138, 43, 226, 0.3))',
              'drop-shadow(0 0 20px rgba(0, 123, 255, 0.3)) drop-shadow(0 0 40px rgba(138, 43, 226, 0.2))'
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Subtle rotating energy beams - minimal */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className={`absolute inset-0 ${size === 'large' ? '-m-20' : '-m-10'}`}
      >
        <div className={`absolute top-0 left-1/2 w-0.5 bg-gradient-to-b from-primary/30 to-transparent blur-sm ${size === 'large' ? 'h-24' : 'h-16'}`} />
        <div className={`absolute bottom-0 left-1/2 w-0.5 bg-gradient-to-t from-accent/30 to-transparent blur-sm ${size === 'large' ? 'h-24' : 'h-16'}`} />
        <div className={`absolute left-0 top-1/2 h-0.5 bg-gradient-to-r from-energy/30 to-transparent blur-sm ${size === 'large' ? 'w-24' : 'w-16'}`} />
        <div className={`absolute right-0 top-1/2 h-0.5 bg-gradient-to-l from-primary/30 to-transparent blur-sm ${size === 'large' ? 'w-24' : 'w-16'}`} />
      </motion.div>


      {/* Additional rotating ring effect */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 -m-6"
      >
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <motion.circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="url(#logo-gradient)"
            strokeWidth="0.5"
            strokeDasharray="10 5"
            opacity="0.4"
          />
          <defs>
            <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="50%" stopColor="hsl(var(--accent))" />
              <stop offset="100%" stopColor="hsl(var(--energy))" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
};

export default AnimatedLogo;
