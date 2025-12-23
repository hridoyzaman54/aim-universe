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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AudioJukebox from '@/components/specialneeds/AudioJukebox';
import VisualScheduler from '@/components/specialneeds/VisualScheduler';
import PianoPlayer from '@/components/specialneeds/PianoPlayer';
import BalloonGame from '@/components/specialneeds/BalloonGame';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

// Hero Section
const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
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
        <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
          Every Child Deserves<br />
          <span className="text-primary">Quality Education</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
          Interactive learning tools designed for children with special needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => navigate('/auth')}>
            Start Learning Today
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

// Interactive Activities Section
const ActivitiesSection = () => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Interactive <span className="text-primary">Activities</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Engaging tools for sensory development, coordination, and learning
          </p>
        </motion.div>

        <Tabs defaultValue="scheduler" className="space-y-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 h-auto bg-transparent max-w-2xl mx-auto">
            <TabsTrigger value="scheduler" className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <span className="text-xl">📅</span>
              <span className="text-xs">Schedule</span>
            </TabsTrigger>
            <TabsTrigger value="piano" className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <span className="text-xl">🎹</span>
              <span className="text-xs">Piano</span>
            </TabsTrigger>
            <TabsTrigger value="balloon" className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <span className="text-xl">🎈</span>
              <span className="text-xs">Balloon Game</span>
            </TabsTrigger>
            <TabsTrigger value="music" className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <span className="text-xl">🎵</span>
              <span className="text-xs">Calm Music</span>
            </TabsTrigger>
          </TabsList>

          <div className="max-w-4xl mx-auto">
            <TabsContent value="scheduler">
              <VisualScheduler />
            </TabsContent>
            <TabsContent value="piano">
              <PianoPlayer />
            </TabsContent>
            <TabsContent value="balloon">
              <BalloonGame />
            </TabsContent>
            <TabsContent value="music">
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Click the floating music button in the bottom right corner to open the calm music player!</p>
                <div className="text-6xl animate-bounce">🎵</div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  );
};

// Categories Section
const categories = [
  { icon: Brain, title: 'Autism Spectrum', color: 'from-blue-500 to-indigo-500', students: '2,400+' },
  { icon: Eye, title: 'Visual Impairment', color: 'from-purple-500 to-pink-500', students: '1,800+' },
  { icon: Ear, title: 'Hearing Impairment', color: 'from-green-500 to-teal-500', students: '1,500+' },
  { icon: Hand, title: 'Physical Disabilities', color: 'from-orange-500 to-red-500', students: '2,100+' },
  { icon: BookOpen, title: 'Learning Disabilities', color: 'from-cyan-500 to-blue-500', students: '3,200+' },
  { icon: Heart, title: 'Emotional Support', color: 'from-pink-500 to-rose-500', students: '1,900+' },
];

const CategoriesSection = () => (
  <section className="py-20">
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
          Tailored educational experiences designed by experts
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all cursor-pointer overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4`}>
              <cat.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{cat.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">Personalized curriculum and adaptive learning tools</p>
            <div className="flex items-center gap-2 text-primary">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">{cat.students} Students</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const SpecialNeeds: React.FC = () => {
  return (
    <Layout>
      <HeroSection />
      <ActivitiesSection />
      <CategoriesSection />
      <AudioJukebox />
      <Footer />
    </Layout>
  );
};

export default SpecialNeeds;
