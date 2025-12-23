import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Sparkles, Cloud, Flower2, Music } from 'lucide-react';

const floatingIcons = [
  { Icon: Heart, color: 'text-pink-400', delay: 0, x: '10%', y: '20%' },
  { Icon: Star, color: 'text-yellow-400', delay: 0.5, x: '85%', y: '15%' },
  { Icon: Sparkles, color: 'text-primary', delay: 1, x: '75%', y: '70%' },
  { Icon: Cloud, color: 'text-blue-300', delay: 1.5, x: '15%', y: '75%' },
  { Icon: Flower2, color: 'text-purple-400', delay: 2, x: '90%', y: '45%' },
  { Icon: Music, color: 'text-green-400', delay: 2.5, x: '5%', y: '50%' },
];

const FloatingElements: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {floatingIcons.map(({ Icon, color, delay, x, y }, index) => (
        <motion.div
          key={index}
          className={`absolute ${color}`}
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [0.8, 1, 0.8],
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 4,
            delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Icon className="w-6 h-6 md:w-8 md:h-8" />
        </motion.div>
      ))}
      
      {/* Gradient orbs */}
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl"
        style={{ left: '60%', top: '30%' }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
      />
      
      <motion.div
        className="absolute w-48 h-48 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 blur-3xl"
        style={{ left: '20%', top: '60%' }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          delay: 1,
        }}
      />
    </div>
  );
};

export default FloatingElements;
