import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Users, ArrowLeft, Sparkles, Search, User, Mail, Hash } from 'lucide-react';
import { z } from 'zod';

const linkSchema = z.object({
  studentId: z.string().regex(/^STU\d{6}$/, 'Student ID must be in format STU followed by 6 digits'),
  studentName: z.string().min(2, 'Student name is required'),
  studentEmail: z.string().email('Valid email is required'),
});

const ParentAuth: React.FC = () => {
  const [step, setStep] = useState<'link' | 'verify'>('link');
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    studentEmail: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    try {
      linkSchema.parse(formData);
      setErrors({});
      return true;
    } catch (e) {
      if (e instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        e.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleVerifyStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      // Check if the student exists with the provided ID
      const { data: student, error: studentError } = await supabase
        .from('profiles')
        .select('user_id, full_name, student_id')
        .eq('student_id', formData.studentId.toUpperCase())
        .single();

      if (studentError || !student) {
        toast({
          title: 'Student Not Found',
          description: 'No student found with this ID. Please check the ID and try again.',
          variant: 'destructive',
        });
        return;
      }

      // Verify the name matches (case insensitive)
      if (student.full_name?.toLowerCase() !== formData.studentName.toLowerCase()) {
        toast({
          title: 'Verification Failed',
          description: 'The student name does not match our records.',
          variant: 'destructive',
        });
        return;
      }

      setVerificationResult(student);
      setStep('verify');
      
      toast({
        title: 'Student Verified!',
        description: `Found student: ${student.full_name}. Please create an account or login to continue.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Could not verify student. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProceedToAuth = () => {
    // Store the verification data in session storage for the auth flow
    sessionStorage.setItem('parentLinkData', JSON.stringify({
      studentId: formData.studentId,
      studentName: formData.studentName,
      studentEmail: formData.studentEmail,
    }));
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent/20 via-background to-primary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-50" />
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-3xl font-display font-bold text-foreground">Parent Portal</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
              Track Your Child's<br />
              <span className="text-primary">Learning Journey</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Link your account to your child's profile to monitor progress, view report cards, and stay connected with their education.
            </p>
            
            <div className="mt-12 space-y-4">
              <div className="flex items-center gap-3 text-foreground">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold">1</span>
                </div>
                <span>Enter your child's Student ID</span>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold">2</span>
                </div>
                <span>Verify student information</span>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold">3</span>
                </div>
                <span>Create your parent account</span>
              </div>
            </div>
          </motion.div>
          
          {/* Floating elements */}
          <motion.div
            className="absolute top-20 right-20 w-32 h-32 rounded-full bg-primary/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="mb-8 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-5 h-5 text-primary" />
              </motion.div>
              <span className="text-sm text-primary font-medium">Parent Portal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
              {step === 'link' ? 'Link to Your Child' : 'Student Verified!'}
            </h2>
            <p className="text-muted-foreground">
              {step === 'link' 
                ? "Enter your child's details to link your accounts" 
                : 'Proceed to create your parent account'}
            </p>
          </div>

          {step === 'link' ? (
            <form onSubmit={handleVerifyStudent} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="studentId" className="text-foreground">
                  Student ID <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="studentId"
                    placeholder="e.g., STU123456"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value.toUpperCase() })}
                    className={`pl-10 bg-secondary/50 ${errors.studentId ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.studentId && (
                  <p className="text-sm text-destructive">{errors.studentId}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  This is the unique ID given to your child upon registration
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentName" className="text-foreground">
                  Student's Full Name <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="studentName"
                    placeholder="Enter your child's full name"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className={`pl-10 bg-secondary/50 ${errors.studentName ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.studentName && (
                  <p className="text-sm text-destructive">{errors.studentName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentEmail" className="text-foreground">
                  Student's Email <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="studentEmail"
                    type="email"
                    placeholder="Enter your child's registered email"
                    value={formData.studentEmail}
                    onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })}
                    className={`pl-10 bg-secondary/50 ${errors.studentEmail ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.studentEmail && (
                  <p className="text-sm text-destructive">{errors.studentEmail}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full py-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Verify Student
                  </>
                )}
              </Button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-xl bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-xl font-bold text-primary-foreground">
                      {verificationResult?.full_name?.charAt(0) || 'S'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {verificationResult?.full_name}
                    </h3>
                    <p className="text-sm text-primary">
                      ID: {verificationResult?.student_id}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Student verified successfully! Create your parent account to access their progress and reports.
                </p>
              </div>

              <Button onClick={handleProceedToAuth} className="w-full py-6">
                Continue to Create Account
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setStep('link')} 
                className="w-full"
              >
                Link Different Student
              </Button>
            </motion.div>
          )}

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Already have an account?
              <button
                type="button"
                onClick={() => navigate('/auth')}
                className="ml-2 text-primary hover:underline font-medium"
              >
                Sign In
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ParentAuth;
