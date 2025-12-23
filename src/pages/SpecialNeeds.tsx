import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import Footer from '@/components/layout/Footer';
import { 
  Brain, Eye, Ear, Hand, Heart, BookOpen, 
  Sparkles, Users, Lightbulb, ArrowRight, 
  CheckCircle, Play, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Section 1: Hero
const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
      <div className="absolute inset-0 bg-hero-pattern opacity-30" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 container mx-auto px-4 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-primary font-medium">Inclusive Education for All</span>
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6 leading-tight">
          Every Child Deserves<br />
          <span className="text-primary">Quality Education</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Specialized learning programs designed for children with special needs. 
          Our adaptive platform ensures personalized education that meets each child where they are.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => navigate('/auth')}>
            Start Learning Today
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button size="lg" variant="outline" className="border-primary/50 text-foreground hover:bg-primary/10">
            <Play className="mr-2 w-5 h-5" />
            Watch Our Approach
          </Button>
        </div>
      </motion.div>
      
      {/* Floating elements */}
      <motion.div
        className="absolute top-1/4 left-10 w-20 h-20 rounded-full bg-primary/20 blur-xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-accent/20 blur-xl"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
    </section>
  );
};

// Section 2: Learning Categories
const categories = [
  { icon: Brain, title: 'Autism Spectrum', color: 'from-blue-500 to-indigo-500', students: '2,400+' },
  { icon: Eye, title: 'Visual Impairment', color: 'from-purple-500 to-pink-500', students: '1,800+' },
  { icon: Ear, title: 'Hearing Impairment', color: 'from-green-500 to-teal-500', students: '1,500+' },
  { icon: Hand, title: 'Physical Disabilities', color: 'from-orange-500 to-red-500', students: '2,100+' },
  { icon: BookOpen, title: 'Learning Disabilities', color: 'from-cyan-500 to-blue-500', students: '3,200+' },
  { icon: Heart, title: 'Emotional Support', color: 'from-pink-500 to-rose-500', students: '1,900+' },
];

const CategoriesSection = () => (
  <section className="py-20 bg-secondary/30">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
          Specialized Learning Programs
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Tailored educational experiences designed by experts for various special needs
        </p>
      </motion.div>
      
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {categories.map((cat, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            whileHover={{ scale: 1.02, y: -5 }}
            className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all cursor-pointer overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4`}>
              <cat.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{cat.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Personalized curriculum and adaptive learning tools
            </p>
            <div className="flex items-center gap-2 text-primary">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">{cat.students} Students</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

// Section 3: Adaptive Learning Features
const features = [
  { title: 'Multi-Sensory Learning', desc: 'Visual, auditory, and tactile learning experiences' },
  { title: 'Customizable Interface', desc: 'Adjust colors, fonts, and layouts for accessibility' },
  { title: 'Progress Tracking', desc: 'Detailed analytics for parents and educators' },
  { title: 'AI-Powered Assistance', desc: 'Smart tutoring that adapts to learning pace' },
  { title: 'Screen Reader Support', desc: 'Full compatibility with assistive technologies' },
  { title: 'Sign Language Videos', desc: 'BSL and ASL interpreted content' },
];

const FeaturesSection = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
            Adaptive Learning <span className="text-primary">Technology</span>
          </h2>
          <p className="text-muted-foreground mb-8">
            Our platform automatically adjusts to each student's unique needs, 
            ensuring an optimal learning experience for everyone.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 p-8 flex items-center justify-center">
            <div className="w-full h-full rounded-2xl bg-card border border-border flex items-center justify-center">
              <div className="text-center p-8">
                <Lightbulb className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Smart Learning</h3>
                <p className="text-muted-foreground">AI-powered adaptive curriculum</p>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <motion.div
            className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-primary/10 blur-xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </div>
  </section>
);

// Section 4: Expert Team
const experts = [
  { name: 'Dr. Sarah Rahman', role: 'Special Education Director', expertise: 'Autism Specialist' },
  { name: 'Mohammad Ali', role: 'Accessibility Expert', expertise: 'Assistive Technology' },
  { name: 'Fatima Khan', role: 'Child Psychologist', expertise: 'Behavioral Therapy' },
  { name: 'Dr. James Wilson', role: 'Speech Therapist', expertise: 'Communication Disorders' },
];

const ExpertsSection = () => (
  <section className="py-20 bg-secondary/30">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
          Meet Our <span className="text-primary">Expert Team</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Certified professionals dedicated to making education accessible
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {experts.map((expert, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{expert.name.charAt(0)}</span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">{expert.name}</h3>
            <p className="text-sm text-primary mb-1">{expert.role}</p>
            <p className="text-xs text-muted-foreground">{expert.expertise}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// Section 5: Success Stories
const stories = [
  { name: 'Rahim', age: 12, condition: 'Autism', achievement: 'Completed grade-level math 6 months early' },
  { name: 'Aisha', age: 8, condition: 'Visual Impairment', achievement: 'Reading at above grade level with audio tools' },
  { name: 'Kamal', age: 14, condition: 'ADHD', achievement: 'Improved focus and completed all courses with honors' },
];

const SuccessStoriesSection = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
          Success <span className="text-primary">Stories</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Real achievements from our amazing students
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stories.map((story, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
            className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20"
          >
            <div className="flex items-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-foreground font-medium mb-4">&ldquo;{story.achievement}&rdquo;</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-semibold">{story.name.charAt(0)}</span>
              </div>
              <div>
                <p className="font-medium text-foreground">{story.name}, {story.age}</p>
                <p className="text-sm text-muted-foreground">{story.condition}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// Section 6: Parent Resources
const resources = [
  { title: 'IEP Planning Guide', desc: 'Complete guide for Individualized Education Programs' },
  { title: 'Home Learning Tips', desc: 'Strategies for supporting learning at home' },
  { title: 'Therapy Resources', desc: 'Access to speech, occupational, and behavioral therapy' },
  { title: 'Community Forum', desc: 'Connect with other parents and educators' },
];

const ParentResourcesSection = () => (
  <section className="py-20 bg-secondary/30">
    <div className="container mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
            Resources for <span className="text-primary">Parents</span>
          </h2>
          <p className="text-muted-foreground mb-8">
            Comprehensive support materials to help you navigate your child&apos;s educational journey
          </p>
          
          <div className="space-y-4">
            {resources.map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {resource.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{resource.desc}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative hidden lg:block"
        >
          <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-accent/20 to-primary/20 p-8 flex items-center justify-center">
            <Users className="w-32 h-32 text-primary/50" />
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

// Section 7: Curriculum Overview
const subjects = [
  { name: 'Mathematics', levels: 'K-12', adapted: true },
  { name: 'Language Arts', levels: 'K-12', adapted: true },
  { name: 'Science', levels: '1-12', adapted: true },
  { name: 'Social Studies', levels: '1-12', adapted: true },
  { name: 'Life Skills', levels: 'All', adapted: true },
  { name: 'Art & Music', levels: 'All', adapted: true },
];

const CurriculumSection = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
          Comprehensive <span className="text-primary">Curriculum</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Full academic program adapted for special needs learners
        </p>
      </motion.div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {subjects.map((subject, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5 }}
            className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 text-center transition-all"
          >
            <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
            <h4 className="font-medium text-foreground text-sm mb-1">{subject.name}</h4>
            <p className="text-xs text-muted-foreground">Grades: {subject.levels}</p>
            {subject.adapted && (
              <span className="inline-block mt-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                Adapted
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// Section 8: Accessibility Commitment
const commitments = [
  'WCAG 2.1 AA Compliant',
  'Screen Reader Optimized',
  'Keyboard Navigation',
  'High Contrast Mode',
  'Text-to-Speech',
  'Adjustable Font Sizes',
];

const AccessibilitySection = () => (
  <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
    <div className="container mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
          Our <span className="text-primary">Accessibility</span> Commitment
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
          We believe technology should adapt to the user, not the other way around
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          {commitments.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="px-6 py-3 rounded-full bg-card border border-border hover:border-primary/50 transition-all"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span className="text-foreground font-medium">{item}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// Section 9: CTA
const CTASection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-accent p-12 md:p-16 text-center"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
              Start Your Child&apos;s<br />Learning Journey Today
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
              Join thousands of families who have transformed their children&apos;s education 
              with our specialized learning programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => navigate('/auth')}
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/50 text-white hover:bg-white/10"
                onClick={() => navigate('/counselling')}
              >
                Schedule Consultation
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const SpecialNeeds: React.FC = () => {
  return (
    <Layout>
      <HeroSection />
      <CategoriesSection />
      <FeaturesSection />
      <ExpertsSection />
      <SuccessStoriesSection />
      <ParentResourcesSection />
      <CurriculumSection />
      <AccessibilitySection />
      <CTASection />
      <Footer />
    </Layout>
  );
};

export default SpecialNeeds;
