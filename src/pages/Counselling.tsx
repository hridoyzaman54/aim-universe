import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, Clock, Video, Phone, MessageSquare, 
  Users, Heart, Brain, Sparkles, CheckCircle,
  ArrowRight, Star
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

const sessionTypes = [
  { icon: Video, label: 'Video Call', value: 'video' },
  { icon: Phone, label: 'Phone Call', value: 'phone' },
  { icon: MessageSquare, label: 'Chat Session', value: 'chat' },
];

const Counselling: React.FC = () => {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState('video');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    notes: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Booking Request Sent!',
      description: 'We will contact you within 24 hours to confirm your appointment.',
    });
    setFormData({ name: '', email: '', phone: '', date: '', time: '', notes: '' });
    setSelectedService(null);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-background to-primary/20" />
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        
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
              <Sparkles className="w-4 h-4 text-primary" />
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
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-foreground">Licensed Professionals</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-foreground">Confidential Sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-foreground">Flexible Scheduling</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-secondary/30">
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
                whileHover={{ y: -5 }}
                onClick={() => setSelectedService(index)}
                className={`p-6 rounded-2xl cursor-pointer transition-all ${
                  selectedService === index 
                    ? 'bg-primary text-primary-foreground border-2 border-primary' 
                    : 'bg-card border border-border hover:border-primary/50'
                }`}
              >
                <service.icon className={`w-10 h-10 mb-4 ${
                  selectedService === index ? 'text-primary-foreground' : 'text-primary'
                }`} />
                <h3 className={`text-lg font-semibold mb-2 ${
                  selectedService === index ? 'text-primary-foreground' : 'text-foreground'
                }`}>
                  {service.title}
                </h3>
                <p className={`text-sm mb-4 ${
                  selectedService === index ? 'text-primary-foreground/80' : 'text-muted-foreground'
                }`}>
                  {service.description}
                </p>
                <div className={`flex items-center justify-between text-sm ${
                  selectedService === index ? 'text-primary-foreground/80' : 'text-muted-foreground'
                }`}>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {service.duration}
                  </span>
                  <span className="font-semibold">{service.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Counsellors Section */}
      <section className="py-20">
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
                className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{counsellor.name.charAt(0)}</span>
                </div>
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

      {/* Booking Form Section */}
      <section className="py-20 bg-secondary/30">
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

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="p-8 rounded-2xl bg-card border border-border"
            >
              {/* Session Type */}
              <div className="mb-8">
                <Label className="text-foreground mb-4 block">Session Type</Label>
                <div className="grid grid-cols-3 gap-4">
                  {sessionTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setSelectedType(type.value)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedType === type.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <type.icon className={`w-6 h-6 mx-auto mb-2 ${
                        selectedType === type.value ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                      <span className={`text-sm ${
                        selectedType === type.value ? 'text-primary font-medium' : 'text-foreground'
                      }`}>
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="bg-secondary/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    className="bg-secondary/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter your phone number"
                    className="bg-secondary/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-foreground">Preferred Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="bg-secondary/50 pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <Label htmlFor="notes" className="text-foreground">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Tell us about your concerns or what you'd like to discuss..."
                  className="bg-secondary/50 min-h-[120px]"
                />
              </div>

              <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90">
                Request Appointment
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
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
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-card border border-border"
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
