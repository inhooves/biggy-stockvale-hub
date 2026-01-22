import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/Logo';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, LogIn, User, Lock, Mail, KeyRound } from 'lucide-react';

const loginSchema = z.object({
  username: z.string().min(3, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

const MemberLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const validatedData = loginSchema.parse(formData);
      
      // Use edge function to securely look up username -> email mapping
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/member-auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'lookup-username', 
          username: validatedData.username 
        }),
      });

      const lookupResult = await response.json();

      if (!response.ok || lookupResult.error) {
        toast({
          title: 'Login Failed',
          description: 'Invalid username or password.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      const { email, name } = lookupResult;

      // Sign in with Supabase Auth using email and password
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: validatedData.password,
      });

      if (authError) {
        toast({
          title: 'Login Failed',
          description: 'Invalid username or password.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Welcome Back!',
          description: `Hello ${name}, you are now logged in.`,
        });
        navigate('/member/dashboard');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error('Login error:', error);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotEmail) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address.',
        variant: 'destructive',
      });
      return;
    }

    // Send password reset email via Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/member/login`,
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to send password reset email. Please try again.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Password Reset Email Sent',
        description: 'Check your email for a password reset link.',
      });
      setShowForgotPassword(false);
      setForgotEmail('');
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full animate-fade-in">
          <div className="bg-card rounded-2xl p-8 card-elevated border border-border">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4"><Logo size="sm" /></div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Forgot Password
              </h2>
              <p className="text-muted-foreground text-sm">
                Enter your email to receive a password reset link
              </p>
            </div>
            
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail size={16} className="text-primary" />
                  Email Address
                </label>
                <Input
                  type="email"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
              
              <Button type="submit" variant="gold" className="w-full">
                <KeyRound size={18} className="mr-2" />
                Send Reset Link
              </Button>
              
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full"
                onClick={() => setShowForgotPassword(false)}
              >
                Back to Login
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft size={18} />
            Back
          </Button>
          <Logo size="sm" />
          <div className="w-20" />
        </div>
      </header>

      {/* Login Form */}
      <main className="container mx-auto px-4 py-8 max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
            <LogIn size={36} className="text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold gold-text mb-2">
            Member Login
          </h1>
          <p className="text-muted-foreground">
            Welcome back to Biggy Round Stokvel
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 animate-slide-up">
          <div className="bg-card rounded-2xl p-6 card-elevated border border-border space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User size={16} className="text-primary" />
                Username <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.username}
                onChange={e => updateField('username', e.target.value)}
                placeholder="Enter your username"
                className={errors.username ? 'border-destructive' : ''}
                autoComplete="username"
              />
              {errors.username && <p className="text-xs text-destructive">{errors.username}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Lock size={16} className="text-primary" />
                Password <span className="text-destructive">*</span>
              </label>
              <Input
                type="password"
                value={formData.password}
                onChange={e => updateField('password', e.target.value)}
                placeholder="Enter your password"
                className={errors.password ? 'border-destructive' : ''}
                autoComplete="current-password"
              />
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-primary hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <Button 
            type="submit" 
            variant="gold" 
            size="lg" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>

          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              Don't have an account?{' '}
              <Link to="/member/signup" className="text-primary hover:underline font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
};

export default MemberLogin;
