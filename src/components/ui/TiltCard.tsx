import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  tiltIntensity?: number;
  glowIntensity?: number;
  onClick?: () => void;
}

const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  glowColor = 'hsl(var(--primary))',
  tiltIntensity = 15,
  glowIntensity = 0.15,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Mouse position values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animations
  const springConfig = { stiffness: 400, damping: 30 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [tiltIntensity, -tiltIntensity]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-tiltIntensity, tiltIntensity]), springConfig);

  // Glow position
  const glowX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), springConfig);
  const glowY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = (e.clientX - centerX) / rect.width;
    const y = (e.clientY - centerY) / rect.height;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={onClick}
      animate={{
        scale: isPressed ? 0.98 : isHovered ? 1.02 : 1,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={`relative cursor-pointer ${className}`}
    >
      {/* Animated border gradient */}
      <motion.div
        className="absolute -inset-[2px] rounded-xl pointer-events-none z-0"
        style={{
          background: `linear-gradient(45deg, ${glowColor}, transparent, ${glowColor})`,
          backgroundSize: '200% 200%',
          opacity: isHovered ? 0.6 : 0,
        }}
        animate={isHovered ? {
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />

      {/* Glow effect */}
      <motion.div
        className="absolute -inset-px rounded-xl pointer-events-none z-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at 50% 50%, ${glowColor.replace(')', ` / ${glowIntensity * 1.5})`)}, hsl(0 0% 0% / 0) 40%)`,
        }}
      />

      {/* Border glow */}
      <div
        className="absolute -inset-[1px] rounded-xl pointer-events-none z-0 transition-opacity duration-300"
        style={{
          background: `linear-gradient(to bottom right, ${glowColor.replace(')', ' / 0.4)')}, hsl(0 0% 0% / 0), ${glowColor.replace(')', ' / 0.4)')})`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Shine sweep effect on hover */}
      <div
        className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-10"
        style={{
          opacity: isHovered ? 1 : 0,
        }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ 
            x: isHovered ? ['−100%', '200%'] : '-100%',
            opacity: isHovered ? [0, 1, 0] : 0
          }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{
            background: `linear-gradient(105deg, transparent 40%, ${glowColor.replace(')', ' / 0.15)')} 45%, ${glowColor.replace(')', ' / 0.3)')} 50%, ${glowColor.replace(')', ' / 0.15)')} 55%, transparent 60%)`,
          }}
        />
      </div>

      {/* Sparkle effects */}
      {isHovered && (
        <>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full pointer-events-none z-20"
              style={{
                background: glowColor,
                left: `${20 + i * 20}%`,
                top: `${10 + (i % 2) * 80}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1,
                delay: i * 0.2,
                repeat: Infinity,
                repeatDelay: 0.5,
              }}
            />
          ))}
        </>
      )}

      {/* Card content */}
      <motion.div
        className="relative z-[1] h-full"
        style={{
          transform: 'translateZ(30px)',
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </motion.div>

      {/* Dynamic shadow that moves with tilt */}
      <motion.div
        className="absolute inset-0 rounded-xl -z-10"
        animate={{
          boxShadow: isHovered
            ? `
              0 25px 50px -12px ${glowColor.replace(')', ' / 0.35)')},
              0 12px 24px -8px ${glowColor.replace(')', ' / 0.25)')},
              inset 0 1px 0 ${glowColor.replace(')', ' / 0.1)')}
            `
            : '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Click ripple effect */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none z-20"
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: `radial-gradient(circle, ${glowColor.replace(')', ' / 0.3)')} 0%, transparent 70%)`,
          }}
        />
      )}
    </motion.div>
  );
};

export default TiltCard;
