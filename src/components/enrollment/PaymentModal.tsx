import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Smartphone, Building, CheckCircle, Loader2, X } from 'lucide-react';
import { Course } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface PaymentModalProps {
  course: Course;
  onComplete: (data: { method: string; transactionId?: string }) => void;
  onCancel: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ course, onComplete, onCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'card' | 'bank'>('bkash');
  const [processing, setProcessing] = useState(false);
  const [verified, setVerified] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');

  const paymentMethods = [
    { id: 'bkash', name: 'bKash', icon: Smartphone, color: 'from-pink-500 to-pink-600' },
    { id: 'nagad', name: 'Nagad', icon: Smartphone, color: 'from-orange-500 to-orange-600' },
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, color: 'from-blue-500 to-blue-600' },
    { id: 'bank', name: 'Bank Transfer', icon: Building, color: 'from-green-500 to-green-600' },
  ];

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setProcessing(false);
    setVerified(true);
    
    // Auto-complete after showing success
    setTimeout(() => {
      const mockTransactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      onComplete({ 
        method: paymentMethod, 
        transactionId: paymentMethod === 'card' ? cardNumber : transactionId || mockTransactionId 
      });
    }, 2000);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Complete Payment</DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!processing && !verified ? (
            <motion.div
              key="payment-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Payment Method Selection */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Select Payment Method</Label>
                <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                  <div className="grid grid-cols-2 gap-3">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`relative flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          paymentMethod === method.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${method.color} text-white`}>
                          <method.icon className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-foreground">{method.name}</span>
                        {paymentMethod === method.id && (
                          <CheckCircle className="w-5 h-5 text-primary absolute top-2 right-2" />
                        )}
                      </label>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Amount Display */}
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 border border-primary/20">
                <div className="flex justify-between items-center">
                  <span className="text-lg text-muted-foreground">Amount to Pay:</span>
                  <span className="text-3xl font-bold text-primary">৳{course.price.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Details Form */}
              <div className="space-y-4">
                {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                  <div>
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input
                      id="mobile"
                      placeholder="01XXX-XXXXXX"
                      className="text-lg"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      You will receive a push notification on your {paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} app to complete the payment.
                    </p>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <>
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="text-lg"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          type="password"
                          maxLength={3}
                          value={cardCVV}
                          onChange={(e) => setCardCVV(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}

                {paymentMethod === 'bank' && (
                  <>
                    <div className="bg-secondary/30 rounded-lg p-4 space-y-2">
                      <p className="font-semibold text-foreground">Bank Account Details:</p>
                      <p className="text-sm text-muted-foreground">Account Name: AIM Centre 360</p>
                      <p className="text-sm text-muted-foreground">Bank: Dutch Bangla Bank</p>
                      <p className="text-sm text-muted-foreground">Account: 1234567890123</p>
                      <p className="text-sm text-muted-foreground">Branch: Dhaka</p>
                    </div>
                    <div>
                      <Label htmlFor="transactionId">Transaction ID</Label>
                      <Input
                        id="transactionId"
                        placeholder="Enter your transaction/reference ID"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        Please enter the transaction ID after completing the bank transfer.
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Security Notice */}
              <div className="flex items-start gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Your payment is secure and encrypted. You'll receive a receipt via email immediately after payment.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={onCancel} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handlePayment} 
                  className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  Pay ৳{course.price.toLocaleString()}
                </Button>
              </div>
            </motion.div>
          ) : processing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="py-12 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="inline-block"
              >
                <Loader2 className="w-16 h-16 text-primary" />
              </motion.div>
              <h3 className="text-2xl font-bold mt-6 text-foreground">Processing Payment...</h3>
              <p className="text-muted-foreground mt-2">Please wait while we verify your payment</p>
              <div className="mt-6 max-w-md mx-auto bg-secondary/30 rounded-lg p-4">
                <div className="space-y-2">
                  <motion.div
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">Connecting to payment gateway...</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    <span className="text-sm text-muted-foreground">Verifying transaction...</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/20 mb-6"
              >
                <CheckCircle className="w-12 h-12 text-green-500" />
              </motion.div>
              <h3 className="text-3xl font-bold text-foreground">Payment Successful!</h3>
              <p className="text-muted-foreground mt-2">Your enrollment is being processed...</p>
              <div className="mt-6 bg-secondary/30 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-muted-foreground">
                  You will receive a confirmation email with your receipt and course access details shortly.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
