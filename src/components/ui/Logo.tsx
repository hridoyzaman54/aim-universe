import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

interface LogoProps {
  collapsed?: boolean;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ collapsed = false, showText = true, size = 'md' }) => {
  const sizes = {
    sm: { icon: 'w-8 h-8', iconInner: 'w-4 h-4', text: 'text-base', subtext: 'text-[10px]' },
    md: { icon: 'w-10 h-10', iconInner: 'w-5 h-5', text: 'text-lg', subtext: 'text-xs' },
    lg: { icon: 'w-14 h-14', iconInner: 'w-7 h-7', text: 'text-2xl', subtext: 'text-sm' },
  };

  const s = sizes[size];

  return (
    <Link to="/" className="flex items-center gap-3 group">
      <motion.div
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        className={`${s.icon} rounded-xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/25 relative overflow-hidden`}
      >
        {/* Animated glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Icon */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className={`${s.iconInner} text-primary-foreground relative z-10`} />
        </motion.div>
        
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
          animate={{ translateX: ['100%', '-100%'] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
        />
      </motion.div>

      {showText && !collapsed && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="overflow-hidden"
        >
          <h1 className={`font-display font-bold ${s.text} text-foreground leading-none`}>
            <span className="text-primary">শিক্ষক</span>
          </h1>
          <p className={`${s.subtext} text-muted-foreground font-medium tracking-wide`}>
            Shikkhok
          </p>
        </motion.div>
      )}
    </Link>
  );
};

export default Logo;
