import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import Footer from '@/components/layout/Footer';
import MoodTracker from '@/components/counselling/MoodTracker';
import AppointmentForm from '@/components/counselling/AppointmentForm';
import FloatingElements from '@/components/counselling/FloatingElements';
import { 
  Sparkles, CheckCircle, Star, Brain, Heart, Users, MessageSquare, Clock
} from 'lucide-react';

const services = [
  {
    icon: Brain,
    title: 'Academic Counselling',
    description: 'Personalized guidance for learning challenges, study strategies, and academic planning.',
    duration: '45 min',
    price: '৳1,500'
  },
  {
    icon: Heart,
    title: 'Emotional Support',
    description: 'Safe space to discuss feelings, build resilience, and develop coping strategies.',
    duration: '60 min',
    price: '৳2,000'
  },
  {
    icon: Users,
    title: 'Parent Consultation',
    description: 'Expert guidance for parents on supporting their child\'s educational journey.',
    duration: '45 min',
    price: '৳1,800'
  },
  {
    icon: MessageSquare,
    title: 'Career Guidance',
    description: 'Explore career options, identify strengths, and plan for the future.',
    duration: '60 min',
    price: '৳2,500'
  },
];

const counsellors = [
  {
    name: 'Dr. Fatima Ahmed',
    title: 'Senior Educational Psychologist',
    specialties: ['Learning Disabilities', 'ADHD', 'Autism'],
    experience: '15+ years',
    rating: 4.9
  },
  {
    name: 'Mohammad Hassan',
    title: 'Child Development Specialist',
    specialties: ['Behavioral Issues', 'Anxiety', 'Social Skills'],
    experience: '10+ years',
    rating: 4.8
  },
  {
    name: 'Sarah Khan',
    title: 'Family Therapist',
    specialties: ['Parent-Child Relations', 'Family Dynamics', 'Trauma'],
    experience: '12+ years',
    rating: 4.9
  },
];

const Counselling: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-background to-primary/20" />
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        <FloatingElements />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.div>
              <span className="text-sm text-primary font-medium">Professional Support</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
              Counselling & <span className="text-primary">Support</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Connect with certified counsellors who understand special needs education. 
              Get personalized guidance for your child&apos;s unique journey.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              {['Licensed Professionals', 'Confidential Sessions', 'Flexible Scheduling'].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Mood Tracker Section */}
      <section className="py-16 bg-secondary/30 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              How Are You <span className="text-primary">Feeling</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Track your emotions and get personalized support based on how you're feeling
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto">
            <MoodTracker />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Our <span className="text-primary">Services</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive counselling services tailored for special needs families
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all group"
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <service.icon className="w-10 h-10 mb-4 text-primary group-hover:scale-110 transition-transform" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {service.title}
                </h3>
                <p className="text-sm mb-4 text-muted-foreground">
                  {service.description}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {service.duration}
                  </span>
                  <span className="font-semibold text-primary">{service.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Counsellors Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Meet Our <span className="text-primary">Counsellors</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experienced professionals dedicated to supporting your family
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {counsellors.map((counsellor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all"
              >
                <motion.div 
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <span className="text-2xl font-bold text-primary-foreground">{counsellor.name.charAt(0)}</span>
                </motion.div>
                <h3 className="text-xl font-semibold text-foreground text-center mb-1">
                  {counsellor.name}
                </h3>
                <p className="text-primary text-center mb-4">{counsellor.title}</p>
                
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {counsellor.specialties.map((specialty, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <span>{counsellor.experience}</span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    {counsellor.rating}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment Booking Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Book a <span className="text-primary">Session</span>
              </h2>
              <p className="text-muted-foreground">
                Fill out the form below and we&apos;ll get back to you within 24 hours
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-card border border-border"
            >
              <AppointmentForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: 'How do I prepare for my first session?', a: 'Just be yourself! You can prepare a list of concerns or questions you want to discuss. There\'s no right or wrong way to approach your first session.' },
              { q: 'Are sessions confidential?', a: 'Absolutely. All sessions are strictly confidential. We follow professional ethics guidelines and only share information with your explicit consent.' },
              { q: 'Can I reschedule my appointment?', a: 'Yes, you can reschedule up to 24 hours before your appointment at no extra cost.' },
              { q: 'Do you offer sessions in Bangla?', a: 'Yes, all our counsellors are bilingual and can conduct sessions in either English or Bangla based on your preference.' },
              { q: 'What is the Student ID and how do parents use it?', a: 'Every student receives a unique ID (format: STU######) upon registration. Parents need this ID to book appointments and track their child\'s progress.' },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
              >
                <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </Layout>
  );
};

export default Counselling;
