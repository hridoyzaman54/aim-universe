import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lightbulb, BookOpen, Award } from 'lucide-react';

// Achievement Badge
const AchievementBadge: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 1, delay: 2.1, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-1/2 right-12 -translate-y-1/2 z-20"
    >
      <motion.div
        animate={{ 
          y: [0, -6, 0],
          rotate: [0, 3, -3, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.15 }}
        className="relative cursor-pointer group"
      >
        {/* Glow rings */}
        <motion.div
          animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-warning/30"
        />
        <motion.div
          animate={{ scale: [1, 1.6], opacity: [0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          className="absolute inset-0 rounded-full bg-warning/20"
        />
        
        <div className="relative glass-card w-16 h-16 rounded-full flex items-center justify-center border-2 border-warning/50">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-1 rounded-full border border-dashed border-warning/30"
          />
          <Trophy className="w-7 h-7 text-warning" />
        </div>
        
        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap glass-card px-3 py-1.5 rounded-lg"
        >
          <p className="text-xs font-medium text-foreground">Top Performer!</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Floating Knowledge Cards
const KnowledgeCards: React.FC = () => {
  const cards = [
    { icon: Lightbulb, label: 'Ideas', color: 'text-warning', bg: 'bg-warning/10' },
    { icon: BookOpen, label: 'Learn', color: 'text-primary', bg: 'bg-primary/10' },
    { icon: Award, label: 'Achieve', color: 'text-accent', bg: 'bg-accent/10' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.4 }}
      className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 flex gap-3"
    >
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.6, 
            delay: 2.5 + index * 0.15,
            ease: [0.16, 1, 0.3, 1]
          }}
          whileHover={{ y: -5, scale: 1.1 }}
          className="cursor-pointer"
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: index * 0.5
            }}
            className={`glass-card p-3 rounded-xl ${card.bg} border border-border/30`}
          >
            <card.icon className={`w-5 h-5 ${card.color}`} />
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Main component that combines all elements
const HeroEducationalElements: React.FC = () => {
  return (
    <div className="hidden lg:block absolute inset-y-0 right-0 w-1/2 pointer-events-none overflow-hidden">
      {/* Allow pointer events on interactive elements */}
      <div className="relative h-full pointer-events-auto px-4">
        
        <AchievementBadge />
        <KnowledgeCards />
        
        {/* Decorative connecting lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <motion.path
            d="M 100 200 Q 200 300 300 250 T 400 350"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="1"
            strokeDasharray="5,5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 3, delay: 3 }}
          />
          <motion.path
            d="M 150 400 Q 250 350 350 400"
            fill="none"
            stroke="hsl(var(--accent))"
            strokeWidth="1"
            strokeDasharray="5,5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 3, delay: 3.5 }}
          />
        </svg>
      </div>
    </div>
  );
};

export default HeroEducationalElements;
