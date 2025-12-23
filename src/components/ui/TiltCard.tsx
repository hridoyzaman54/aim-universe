import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  tiltIntensity?: number;
  glowIntensity?: number;
}

const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  glowColor = 'hsl(var(--primary))',
  tiltIntensity = 15,
  glowIntensity = 0.15,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animations
  const springConfig = { stiffness: 300, damping: 30 };
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
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={`relative ${className}`}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 pointer-events-none z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${glowX.get()}% ${glowY.get()}%, ${glowColor.replace(')', ` / ${glowIntensity})`)}, transparent 40%)`,
        }}
        animate={{
          background: isHovered
            ? `radial-gradient(600px circle at ${glowX.get()}% ${glowY.get()}%, ${glowColor.replace(')', ` / ${glowIntensity})`)}, transparent 40%)`
            : 'none',
        }}
      />

      {/* Border glow */}
      <motion.div
        className="absolute -inset-[1px] rounded-xl opacity-0 pointer-events-none z-0"
        style={{
          background: `linear-gradient(to bottom right, ${glowColor.replace(')', ' / 0.3)')}, transparent, ${glowColor.replace(')', ' / 0.3)')})`,
          opacity: isHovered ? 1 : 0,
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Shine effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-10"
        style={{
          opacity: isHovered ? 1 : 0,
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(105deg, transparent 40%, ${glowColor.replace(')', ' / 0.1)')} 45%, ${glowColor.replace(')', ' / 0.2)')} 50%, ${glowColor.replace(')', ' / 0.1)')} 55%, transparent 60%)`,
            transform: 'translateX(-100%)',
          }}
          animate={{
            transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
          }}
          transition={{
            duration: 0.6,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Card content */}
      <motion.div
        className="relative z-[1] h-full"
        style={{
          transform: 'translateZ(20px)',
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </motion.div>

      {/* Subtle shadow that moves with tilt */}
      <motion.div
        className="absolute inset-0 rounded-xl -z-10"
        style={{
          boxShadow: isHovered
            ? `
              0 20px 40px -15px ${glowColor.replace(')', ' / 0.3)')},
              0 10px 20px -10px ${glowColor.replace(')', ' / 0.2)')}
            `
            : '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          transition: 'box-shadow 0.3s ease',
        }}
      />
    </motion.div>
  );
};

export default TiltCard;
