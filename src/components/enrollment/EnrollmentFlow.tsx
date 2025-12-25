import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, CreditCard, User, Mail, Phone, MapPin, ArrowRight, ArrowLeft, Shield } from 'lucide-react';
import { Course } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PaymentModal from './PaymentModal';

interface EnrollmentFlowProps {
  course: Course;
  onComplete: (enrollmentData: EnrollmentData) => void;
  onCancel: () => void;
}

export interface EnrollmentData {
  courseId: string;
  studentName: string;
  email: string;
  phone: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  paymentMethod: 'bkash' | 'nagad' | 'card' | 'bank';
  transactionId?: string;
}

const EnrollmentFlow: React.FC<EnrollmentFlowProps> = ({ course, onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const [formData, setFormData] = useState<Partial<EnrollmentData>>({
    courseId: course.id,
    studentName: '',
    email: '',
    phone: '',
    address: '',
    guardianName: '',
    guardianPhone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.studentName?.trim()) newErrors.studentName = 'Name is required';
    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.phone?.trim()) newErrors.phone = 'Phone is required';
    else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.guardianName?.trim()) newErrors.guardianName = 'Guardian name is required';
    if (!formData.guardianPhone?.trim()) newErrors.guardianPhone = 'Guardian phone is required';
    if (!formData.address?.trim()) newErrors.address = 'Address is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePayment = () => {
    if (course.isFree) {
      // Free course - skip payment
      onComplete(formData as EnrollmentData);
    } else {
      setShowPayment(true);
    }
  };

  const handlePaymentComplete = (paymentData: { method: string; transactionId?: string }) => {
    const completeData: EnrollmentData = {
      ...formData as EnrollmentData,
      paymentMethod: paymentData.method as any,
      transactionId: paymentData.transactionId,
    };
    onComplete(completeData);
  };

  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Guardian Info', icon: Shield },
    { number: 3, title: 'Review & Pay', icon: CreditCard },
  ];

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <React.Fragment key={s.number}>
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{
                      scale: step === s.number ? 1.1 : 1,
                      backgroundColor: step >= s.number ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                    }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                      step >= s.number ? 'shadow-lg' : ''
                    }`}
                  >
                    {step > s.number ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <s.icon className="w-6 h-6" />
                    )}
                  </motion.div>
                  <span className={`text-sm mt-2 font-semibold ${
                    step >= s.number ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-4 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      animate={{
                        width: step > s.number ? '100%' : '0%',
                      }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-primary"
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Course Summary */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="flex items-start gap-4">
            <img src={course.thumbnail} alt={course.title} className="w-24 h-16 object-cover rounded-lg" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground">{course.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{course.instructor}</p>
              <div className="flex items-center gap-4 mt-2">
                <Badge>{course.duration}</Badge>
                <Badge>{course.totalLessons} lessons</Badge>
              </div>
            </div>
            <div className="text-right">
              {course.isFree ? (
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">FREE</div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-primary">৳{course.price.toLocaleString()}</div>
                  {course.originalPrice && (
                    <div className="text-sm text-muted-foreground line-through">
                      ৳{course.originalPrice.toLocaleString()}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6">
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-foreground">Student Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="studentName">Full Name *</Label>
                      <Input
                        id="studentName"
                        placeholder="Enter student's full name"
                        value={formData.studentName}
                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                        className={errors.studentName ? 'border-red-500' : ''}
                      />
                      {errors.studentName && <p className="text-sm text-red-500 mt-1">{errors.studentName}</p>}
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="student@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        placeholder="+880 1XXX-XXXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={errors.phone ? 'border-red-500' : ''}
                      />
                      {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-foreground">Guardian Information</h2>
                  <p className="text-sm text-muted-foreground">
                    Parent/guardian details for monitoring student progress
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="guardianName">Guardian Name *</Label>
                      <Input
                        id="guardianName"
                        placeholder="Parent/Guardian full name"
                        value={formData.guardianName}
                        onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                        className={errors.guardianName ? 'border-red-500' : ''}
                      />
                      {errors.guardianName && <p className="text-sm text-red-500 mt-1">{errors.guardianName}</p>}
                    </div>

                    <div>
                      <Label htmlFor="guardianPhone">Guardian Phone *</Label>
                      <Input
                        id="guardianPhone"
                        placeholder="+880 1XXX-XXXXXX"
                        value={formData.guardianPhone}
                        onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                        className={errors.guardianPhone ? 'border-red-500' : ''}
                      />
                      {errors.guardianPhone && <p className="text-sm text-red-500 mt-1">{errors.guardianPhone}</p>}
                    </div>

                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        placeholder="Full address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className={errors.address ? 'border-red-500' : ''}
                      />
                      {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-foreground">Review & Payment</h2>
                  
                  <div className="bg-secondary/30 rounded-lg p-6 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Student Name:</span>
                      <span className="font-semibold text-foreground">{formData.studentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-semibold text-foreground">{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-semibold text-foreground">{formData.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Guardian:</span>
                      <span className="font-semibold text-foreground">{formData.guardianName}</span>
                    </div>
                  </div>

                  <div className="bg-primary/5 rounded-lg p-6 border-2 border-primary/20">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-foreground">Total Amount:</span>
                      <span className="text-3xl font-bold text-primary">
                        {course.isFree ? 'FREE' : `৳${course.price.toLocaleString()}`}
                      </span>
                    </div>
                    {!course.isFree && (
                      <p className="text-sm text-muted-foreground">
                        * You will receive a payment receipt via email after successful payment
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={step === 1 ? onCancel : handleBack}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {step === 1 ? 'Cancel' : 'Back'}
                </Button>

                {step < 3 ? (
                  <Button onClick={handleNext} className="gap-2 bg-gradient-to-r from-primary to-accent">
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button onClick={handlePayment} className="gap-2 bg-gradient-to-r from-primary to-accent">
                    {course.isFree ? 'Complete Enrollment' : 'Proceed to Payment'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          course={course}
          onComplete={handlePaymentComplete}
          onCancel={() => setShowPayment(false)}
        />
      )}
    </>
  );
};

export default EnrollmentFlow;
