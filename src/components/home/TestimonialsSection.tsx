import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScrollReveal from '@/components/ui/ScrollReveal';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Rahman',
    role: 'Parent of 2',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    quote: 'AIM Centre has transformed how my children learn. The interactive content keeps them engaged, and I can see real progress every week.',
  },
  {
    id: 2,
    name: 'Kamal Hossain',
    role: 'HSC Student',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    quote: 'The AI tutor helped me understand complex physics concepts that I struggled with for months. My grades improved significantly.',
  },
  {
    id: 3,
    name: 'Nusrat Jahan',
    role: 'Parent',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    quote: 'My daughter with special needs finally found a learning platform that adapts to her pace. The sensory-friendly mode is a game changer.',
  },
  {
    id: 4,
    name: 'Rafiq Ahmed',
    role: 'Teacher',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    quote: 'As an educator, I recommend AIM Centre to all my students. The quality of content matches international standards.',
  },
];

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => setCurrentIndex(index);
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-secondary/30 relative overflow-hidden">
      {/* Parallax Background */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-0 left-1/4 w-64 md:w-96 h-64 md:h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-56 md:w-80 h-56 md:h-80 rounded-full bg-accent/5 blur-3xl" />
      </motion.div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <ScrollReveal animation="fadeUp" className="text-center mb-10 md:mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            What Our Community Says
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Join thousands of satisfied learners and parents
          </p>
        </ScrollReveal>

        {/* Testimonial Carousel */}
        <ScrollReveal animation="scale" delay={0.2}>
          <div className="max-w-4xl mx-auto relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                className="bg-card border border-border rounded-2xl p-6 md:p-8 lg:p-12 shadow-card"
              >
                <Quote className="w-10 md:w-12 h-10 md:h-12 text-primary/30 mb-4 md:mb-6" />
                
                <p className="text-lg md:text-xl lg:text-2xl text-foreground leading-relaxed mb-6 md:mb-8">
                  "{testimonials[currentIndex].quote}"
                </p>

                <div className="flex items-center gap-4">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].name}
                    className="w-12 md:w-16 h-12 md:h-16 rounded-full object-cover border-2 border-primary shadow-lg"
                  />
                  <div>
                    <p className="font-display text-base md:text-lg font-semibold text-foreground">
                      {testimonials[currentIndex].name}
                    </p>
                    <p className="text-muted-foreground text-sm md:text-base">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-3 md:gap-4 mt-6 md:mt-8">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goPrev}
                  className="rounded-full border-border hover:border-primary/50 w-10 h-10 md:w-12 md:h-12"
                >
                  <ChevronLeft className="w-4 md:w-5 h-4 md:h-5" />
                </Button>
              </motion.div>

              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => goTo(index)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`h-2 md:h-3 rounded-full transition-all duration-500 ${
                      index === currentIndex ? 'bg-primary w-6 md:w-8' : 'bg-muted w-2 md:w-3 hover:bg-muted-foreground'
                    }`}
                  />
                ))}
              </div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goNext}
                  className="rounded-full border-border hover:border-primary/50 w-10 h-10 md:w-12 md:h-12"
                >
                  <ChevronRight className="w-4 md:w-5 h-4 md:h-5" />
                </Button>
              </motion.div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default TestimonialsSection;
