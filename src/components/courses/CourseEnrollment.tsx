import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  CreditCard, 
  Download, 
  FileText, 
  Headphones, 
  Lock, 
  Play, 
  Sparkles,
  X,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Course {
  id: number;
  title: string;
  price: string;
  isFree?: boolean;
}

interface CourseEnrollmentProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (courseId: number) => void;
}

const CourseEnrollment: React.FC<CourseEnrollmentProps> = ({
  course,
  isOpen,
  onClose,
  onEnroll,
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  const handlePaymentSubmit = async () => {
    if (!course.isFree) {
      if (!paymentDetails.cardNumber || !paymentDetails.expiry || !paymentDetails.cvv || !paymentDetails.name) {
        toast.error('Please fill in all payment details');
        return;
      }
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setStep('success');
    onEnroll(course.id);
    toast.success(`Successfully enrolled in ${course.title}!`);
  };

  const handleFreeEnroll = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsProcessing(false);
    setStep('success');
    onEnroll(course.id);
    toast.success(`Successfully enrolled in ${course.title}!`);
  };

  const resetAndClose = () => {
    setStep('details');
    setPaymentDetails({ cardNumber: '', expiry: '', cvv: '', name: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {step === 'success' ? 'Enrollment Complete!' : `Enroll in ${course.title}`}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                <h3 className="font-semibold text-foreground mb-2">{course.title}</h3>
                <div className="flex items-center gap-2">
                  {course.isFree ? (
                    <span className="px-3 py-1 rounded-full bg-success/20 text-success text-sm font-medium">
                      FREE
                    </span>
                  ) : (
                    <span className="text-xl font-bold text-primary">{course.price}</span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-foreground">What you'll get:</h4>
                <ul className="space-y-2">
                  {[
                    'Full course access',
                    'Video lessons',
                    'Downloadable PDFs & slides',
                    'Audio podcasts',
                    'Practice quizzes',
                    'Certificate of completion',
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <Check className="w-4 h-4 text-success" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={course.isFree ? handleFreeEnroll : () => setStep('payment')}
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                  />
                ) : course.isFree ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Enroll for Free
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Proceed to Payment
                  </>
                )}
              </Button>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/30 flex items-center gap-2 text-warning text-sm">
                <Lock className="w-4 h-4" />
                Mock payment - No real charges
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={paymentDetails.name}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="4242 4242 4242 4242"
                    value={paymentDetails.cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                      const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
                      setPaymentDetails({ ...paymentDetails, cardNumber: formatted });
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={paymentDetails.expiry}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                        const formatted = value.length > 2 ? `${value.slice(0, 2)}/${value.slice(2)}` : value;
                        setPaymentDetails({ ...paymentDetails, expiry: formatted });
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      type="password"
                      maxLength={3}
                      value={paymentDetails.cvv}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('details')} className="flex-1">
                  Back
                </Button>
                <Button onClick={handlePaymentSubmit} disabled={isProcessing} className="flex-1">
                  {isProcessing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                    />
                  ) : (
                    <>Pay {course.price}</>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4 py-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-20 h-20 mx-auto rounded-full bg-success/20 flex items-center justify-center"
              >
                <CheckCircle2 className="w-10 h-10 text-success" />
              </motion.div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                You're enrolled!
              </h3>
              <p className="text-sm text-muted-foreground">
                Start learning now from your dashboard
              </p>
              <Button onClick={resetAndClose} className="w-full">
                Go to Course
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default CourseEnrollment;
