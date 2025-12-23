import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Calendar, Clock, Video, Phone, MessageSquare, 
  GraduationCap, Users, ArrowRight, CheckCircle
} from 'lucide-react';
import { z } from 'zod';

const services = [
  { id: 'academic', label: 'Academic Counselling', duration: '45 min', price: '৳1,500' },
  { id: 'emotional', label: 'Emotional Support', duration: '60 min', price: '৳2,000' },
  { id: 'parent', label: 'Parent Consultation', duration: '45 min', price: '৳1,800' },
  { id: 'career', label: 'Career Guidance', duration: '60 min', price: '৳2,500' },
];

const sessionTypes = [
  { icon: Video, label: 'Video Call', value: 'video' },
  { icon: Phone, label: 'Phone Call', value: 'phone' },
  { icon: MessageSquare, label: 'Chat Session', value: 'chat' },
];

const appointmentSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  date: z.string().min(1, 'Date is required'),
  studentId: z.string().optional(),
  studentName: z.string().optional(),
});

interface AppointmentFormProps {
  onSuccess?: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ onSuccess }) => {
  const [userType, setUserType] = useState<'student' | 'parent'>('student');
  const [selectedService, setSelectedService] = useState('');
  const [selectedType, setSelectedType] = useState('video');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    notes: '',
    studentId: '',
    studentName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim() || !z.string().email().safeParse(formData.email).success) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      newErrors.phone = 'Valid phone number is required';
    }
    if (!formData.date) newErrors.date = 'Date is required';
    if (!selectedService) newErrors.service = 'Please select a service';
    
    if (userType === 'parent') {
      if (!formData.studentId.trim()) {
        newErrors.studentId = 'Student ID is required for parent appointments';
      }
      if (!formData.studentName.trim()) {
        newErrors.studentName = "Student's name is required";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      if (user) {
        // Save to database for authenticated users
        const { error } = await supabase
          .from('appointments')
          .insert({
            user_id: user.id,
            user_type: userType,
            student_id: userType === 'parent' ? formData.studentId : null,
            student_name: userType === 'parent' ? formData.studentName : null,
            service_type: selectedService,
            session_type: selectedType,
            preferred_date: formData.date,
            preferred_time: formData.time || null,
            notes: formData.notes || null,
          });

        if (error) throw error;

        // Create notification
        await supabase.from('notifications').insert({
          user_id: user.id,
          title: 'Appointment Requested',
          message: `Your ${selectedService} appointment for ${formData.date} has been submitted. We'll confirm within 24 hours.`,
          type: 'appointment',
        });
      }

      setSubmitted(true);
      toast({
        title: 'Appointment Requested!',
        description: 'We will contact you within 24 hours to confirm.',
      });
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Could not submit appointment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-20 h-20 rounded-full bg-primary/20 mx-auto mb-6 flex items-center justify-center"
        >
          <CheckCircle className="w-10 h-10 text-primary" />
        </motion.div>
        <h3 className="text-2xl font-display font-bold text-foreground mb-3">
          Request Submitted!
        </h3>
        <p className="text-muted-foreground mb-6">
          We'll contact you within 24 hours to confirm your appointment.
        </p>
        <Button onClick={() => setSubmitted(false)} variant="outline">
          Book Another Appointment
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* User Type Selection */}
      <div>
        <Label className="text-foreground mb-4 block">I am a...</Label>
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setUserType('student')}
            className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
              userType === 'student'
                ? 'border-primary bg-primary/10'
                : 'border-border bg-secondary/30 hover:border-primary/50'
            }`}
          >
            <GraduationCap className={`w-8 h-8 ${userType === 'student' ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className={`font-medium ${userType === 'student' ? 'text-primary' : 'text-foreground'}`}>
              Student
            </span>
          </motion.button>
          
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setUserType('parent')}
            className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
              userType === 'parent'
                ? 'border-primary bg-primary/10'
                : 'border-border bg-secondary/30 hover:border-primary/50'
            }`}
          >
            <Users className={`w-8 h-8 ${userType === 'parent' ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className={`font-medium ${userType === 'parent' ? 'text-primary' : 'text-foreground'}`}>
              Parent
            </span>
          </motion.button>
        </div>
      </div>

      {/* Parent-specific fields */}
      <AnimatePresence>
        {userType === 'parent' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 overflow-hidden"
          >
            <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
              <p className="text-sm text-foreground">
                <strong>Note:</strong> As a parent, please provide your child's Student ID 
                (format: STU######) which was given upon their registration.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentId" className="text-foreground">
                  Child's Student ID <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="studentId"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value.toUpperCase() })}
                  placeholder="e.g., STU123456"
                  className={`bg-secondary/50 ${errors.studentId ? 'border-destructive' : ''}`}
                />
                {errors.studentId && (
                  <p className="text-sm text-destructive">{errors.studentId}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="studentName" className="text-foreground">
                  Child's Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="studentName"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  placeholder="Enter your child's name"
                  className={`bg-secondary/50 ${errors.studentName ? 'border-destructive' : ''}`}
                />
                {errors.studentName && (
                  <p className="text-sm text-destructive">{errors.studentName}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Service Selection */}
      <div>
        <Label className="text-foreground mb-4 block">Select Service</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {services.map((service) => (
            <motion.button
              key={service.id}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedService(service.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedService === service.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-secondary/30 hover:border-primary/50'
              }`}
            >
              <div className="font-medium text-foreground">{service.label}</div>
              <div className="text-sm text-muted-foreground">
                {service.duration} • {service.price}
              </div>
            </motion.button>
          ))}
        </div>
        {errors.service && (
          <p className="text-sm text-destructive mt-2">{errors.service}</p>
        )}
      </div>

      {/* Session Type */}
      <div>
        <Label className="text-foreground mb-4 block">Session Type</Label>
        <div className="grid grid-cols-3 gap-4">
          {sessionTypes.map((type) => (
            <motion.button
              key={type.value}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
            </motion.button>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-foreground">Your Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter your name"
            className={`bg-secondary/50 ${errors.name ? 'border-destructive' : ''}`}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter your email"
            className={`bg-secondary/50 ${errors.email ? 'border-destructive' : ''}`}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Enter your phone number"
            className={`bg-secondary/50 ${errors.phone ? 'border-destructive' : ''}`}
          />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
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
              className={`bg-secondary/50 pl-10 ${errors.date ? 'border-destructive' : ''}`}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
        </div>
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-foreground">Additional Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Tell us about your concerns or what you'd like to discuss..."
          className="bg-secondary/50 min-h-[120px]"
        />
      </div>

      <Button 
        type="submit" 
        size="lg" 
        className="w-full" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            Submitting...
          </span>
        ) : (
          <>
            Request Appointment
            <ArrowRight className="ml-2 w-5 h-5" />
          </>
        )}
      </Button>
    </motion.form>
  );
};

export default AppointmentForm;
