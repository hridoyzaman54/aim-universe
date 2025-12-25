import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, Zap } from 'lucide-react';

interface LogoProps {
  collapsed?: boolean;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ collapsed = false, showText = true, size = 'md' }) => {
  const sizes = {
    sm: { icon: 'w-14 h-14', iconInner: 'w-7 h-7', text: 'text-lg', subtext: 'text-xs' },
    md: { icon: 'w-20 h-20', iconInner: 'w-10 h-10', text: 'text-2xl', subtext: 'text-base' },
    lg: { icon: 'w-24 h-24', iconInner: 'w-12 h-12', text: 'text-4xl', subtext: 'text-lg' },
  };

  const s = sizes[size];

  return (
    <Link to="/" className="flex items-center gap-3 group">
      {/* Actual Logo Image */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${s.icon} flex items-center justify-center flex-shrink-0 relative`}
      >
        <img 
          src="/aim-logo.png" 
          alt="AIM Centre 360" 
          className="w-full h-full object-contain"
        />
      </motion.div>

      {showText && !collapsed && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="overflow-hidden"
        >
          <h1 className={`font-display font-extrabold ${s.text} leading-none`}>
            <span className="text-primary drop-shadow-sm">
              AIM Centre
            </span>
            <span className="text-accent ml-1 drop-shadow-sm">360</span>
          </h1>
          <p className={`${s.subtext} text-foreground font-semibold tracking-wide opacity-80`}>
            Aim High, Achieve Infinity
          </p>
        </motion.div>
      )}
    </Link>
  );
};

export default Logo;
