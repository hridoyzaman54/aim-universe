import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Lightbulb, BookOpen, Award, CheckCircle } from 'lucide-react';

// Animated Progress Ring
const ProgressRing: React.FC = () => {
  const progress = 78;
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-1/3 left-4 z-20"
    >
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        whileHover={{ scale: 1.1 }}
        className="relative glass-card p-4 cursor-pointer group"
      >
        <motion.div 
          className="absolute -inset-1 bg-gradient-to-r from-success/30 to-primary/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
        
        <div className="relative flex items-center gap-3">
          <div className="relative">
            <svg className="w-20 h-20 progress-ring">
              {/* Background circle */}
              <circle
                className="text-muted/30"
                strokeWidth="6"
                stroke="currentColor"
                fill="transparent"
                r="36"
                cx="40"
                cy="40"
              />
              {/* Progress circle */}
              <motion.circle
                className="text-success"
                strokeWidth="6"
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="36"
                cx="40"
                cy="40"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 2, delay: 2, ease: "easeOut" }}
                style={{
                  strokeDasharray: circumference,
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span 
                className="text-lg font-bold text-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
              >
                {progress}%
              </motion.span>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Weekly Progress</p>
            <p className="text-sm font-semibold text-foreground">12/15 Lessons</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-success" />
              <span className="text-[10px] text-success font-medium">+12% this week</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Achievement Badge
const AchievementBadge: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 1, delay: 2.1, ease: [0.16, 1, 0.3, 1] }}
      className="absolute bottom-1/3 right-8 z-20"
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
      className="absolute bottom-24 left-8 z-20 flex gap-2"
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

// Notification Toast
const NotificationToast: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 3, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-1/2 right-8 z-20"
    >
      <motion.div
        animate={{ x: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.05 }}
        className="glass-card p-3 pr-5 flex items-center gap-3 cursor-pointer group"
      >
        <motion.div 
          className="absolute -inset-1 bg-gradient-to-r from-success/20 to-primary/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
        
        <div className="relative flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center"
          >
            <CheckCircle className="w-5 h-5 text-success" />
          </motion.div>
          
          <div>
            <p className="text-xs font-semibold text-foreground">Assignment Completed!</p>
            <p className="text-[10px] text-muted-foreground">Physics Chapter 5 - 2 min ago</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main component that combines all elements
const HeroEducationalElements: React.FC = () => {
  return (
    <div className="hidden lg:block absolute inset-y-0 right-0 w-1/2 pointer-events-none overflow-hidden">
      {/* Allow pointer events on interactive elements */}
      <div className="relative h-full pointer-events-auto px-4">
        
        <ProgressRing />
        <AchievementBadge />
        <KnowledgeCards />
        <NotificationToast />
        
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
