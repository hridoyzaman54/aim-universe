import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const LogoHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll();
  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [1, 0.995]), {
    stiffness: 120,
    damping: 20,
  });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      const y = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      setMouse({ x, y });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const logoSrc = '/aim-logo.png';

  return (
    <div ref={containerRef} className="logo-hero relative w-full h-full pointer-events-none lg:pointer-events-auto">
      <motion.div style={{ scale }} className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[440px] h-[440px] lg:w-[560px] lg:h-[560px]">
          <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `translate3d(${mouse.x * 12}px, ${mouse.y * 12}px, 0)` }}>
            <svg className="w-full h-full" viewBox="0 0 520 520" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="ringGrad" x1="0" x2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.95" />
                </linearGradient>
                <radialGradient id="rayGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>
              </defs>
              <g filter="url(#glow)" style={{ mixBlendMode: 'screen' }}>
                {[...Array(14)].map((_, i) => {
                  const angle = (i / 14) * 360;
                  return (
                    <rect key={i} x="260" y="34" width="6" height="84" rx="3" transform={`rotate(${angle} 260 260) translate(-3,0)`} fill="url(#rayGrad)" opacity={0.12} />
                  );
                })}
              </g>
              <g style={{ transformOrigin: '50% 50%' }} className="inner-rot">
                <circle cx="260" cy="260" r="110" fill="none" stroke="url(#ringGrad)" strokeWidth="2.5" strokeDasharray="3 12" strokeLinecap="round" opacity="0.98" />
              </g>
              <g style={{ transformOrigin: '50% 50%' }} className="middle-rot">
                <circle cx="260" cy="260" r="172" fill="none" stroke="#E6E9F2" strokeWidth="1.6" opacity="0.12" />
              </g>
              <g style={{ transformOrigin: '50% 50%' }} className="outer-rot">
                <circle cx="260" cy="260" r="220" fill="none" stroke="url(#ringGrad)" strokeWidth="2" opacity="0.9" strokeLinecap="round" />
              </g>
              <motion.image
                href={logoSrc}
                x={260 - 180}
                y={260 - 180 + 20}
                width={360}
                height={360}
                preserveAspectRatio="xMidYMid meet"
                style={{ transformOrigin: '260px 260px' }}
                animate={{
                  scale: [1, 1.035, 1],
                  rotate: [0, 0.45, -0.45, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
            </svg>
          </div>
        </div>
      </motion.div>
      <style>{`
        .logo-hero { pointer-events: none; }
        .logo-hero img { pointer-events: auto; }
        @keyframes spinInner { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spinOuter { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        .inner-rot { animation: spinInner 7.5s linear infinite; }
        .outer-rot { animation: spinOuter 20s linear infinite; }
        .middle-rot { animation: spinOuter 13s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .inner-rot, .outer-rot, .middle-rot { animation: none !important; }
        }
      `}</style>
    </div>
  );
};

export default LogoHero;
