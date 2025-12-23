import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ScrollReveal from '@/components/ui/ScrollReveal';

const CTASection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <section ref={sectionRef} className="relative py-20 md:py-32 overflow-hidden">
      {/* Parallax Background Image */}
      <motion.div 
        style={{ y: imageY }}
        className="absolute inset-0"
      >
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=800&fit=crop"
          alt="Students collaborating"
          className="w-full h-[120%] object-cover"
        />
        <div className="absolute inset-0 bg-primary/85" />
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              x: [0, i % 2 === 0 ? 20 : -20, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5
            }}
            className="absolute w-2 h-2 rounded-full bg-primary-foreground/30"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <ScrollReveal animation="scale">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 md:w-20 h-16 md:h-20 rounded-full bg-primary-foreground/20 mb-6 md:mb-8 backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-8 md:w-10 h-8 md:h-10 text-primary-foreground" />
              </motion.div>
            </motion.div>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary-foreground mb-4 md:mb-6 px-4">
              Ready to Start Your Learning Journey?
            </h2>

            <p className="text-base md:text-lg lg:text-xl text-primary-foreground/80 mb-8 md:mb-10 max-w-2xl mx-auto px-4">
              Join over 50,000 students already learning with AIM Centre 360. 
              Start your free trial today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
              <Link to="/courses">
                <motion.div 
                  whileHover={{ scale: 1.05, y: -3 }} 
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    className="group px-6 md:px-10 py-5 md:py-6 text-base md:text-lg font-semibold bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg transition-all duration-300 w-full sm:w-auto"
                  >
                    Get Started Free
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="ml-2 w-4 md:w-5 h-4 md:h-5" />
                    </motion.span>
                  </Button>
                </motion.div>
              </Link>
              <Link to="/dashboard">
                <motion.div 
                  whileHover={{ scale: 1.05, y: -3 }} 
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-6 md:px-10 py-5 md:py-6 text-base md:text-lg font-semibold border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 backdrop-blur-sm transition-all duration-300 w-full sm:w-auto"
                  >
                    View Demo
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTASection;
