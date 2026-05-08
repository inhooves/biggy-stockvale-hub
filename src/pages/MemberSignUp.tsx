import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/Logo';
import { ArrowLeft, UserPlus, LogIn, User, Lock, Mail, Phone, CheckCircle, XCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator';
import { strongPasswordSchema } from '@/lib/passwordValidation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface MemberDetails {
  id: string;
  name: string;
  surname: string | null;
  email: string | null; // masked
  phone: string | null; // masked (last 4)
  id_number: string | null; // masked (first 2)
}

const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  username: z.string()
    .min(4, 'Username must be at least 4 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: strongPasswordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;
type LoginFormData = z.infer<typeof loginSchema>;

const MemberSignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, signIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('signup');
  const [passwordValue, setPasswordValue] = useState('');
  const [step, setStep] = useState<'lookup' | 'verify' | 'credentials'>('lookup');
  const [memberDetails, setMemberDetails] = useState<MemberDetails | null>(null);
  const [detailsVerified, setDetailsVerified] = useState(false);
  const [lookupEmail, setLookupEmail] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleLookup = async () => {
    if (!lookupEmail.trim()) {
      toast({
        title: 'Email Required',
        description: 'Please enter the email address used during your agent registration.',
        variant: 'destructive',
      });
      return;
    }

    setIsLookingUp(true);
    try {
      // Use edge function to securely look up member by email
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/member-auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'lookup-member-by-email', 
          email: lookupEmail.trim() 
        }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        console.error('Lookup error:', result.error);
        toast({
          title: 'Lookup Error',
          description: 'An error occurred while looking up your details. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      if (!result.found) {
        toast({
          title: 'Member Not Found',
          description: 'No registered member found with this email. Please contact your agent or use the exact email provided during registration.',
          variant: 'destructive',
        });
        return;
      }

      if (result.hasAccount) {
        toast({
          title: 'Account Exists',
          description: 'An account already exists for this member. Please use the Login tab.',
          variant: 'destructive',
        });
        setActiveTab('login');
        return;
      }

      setMemberDetails(result.member);
      signUpForm.setValue('email', lookupEmail.trim().toLowerCase());
      setStep('verify');
    } catch (error) {
      console.error('Lookup error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleVerifyDetails = () => {
    if (!detailsVerified) {
      toast({
        title: 'Verification Required',
        description: 'Please confirm that the details shown are correct.',
        variant: 'destructive',
      });
      return;
    }
    setStep('credentials');
  };

  const onSignUp = async (data: SignUpFormData) => {
    if (!memberDetails) {
      toast({
        title: 'Error',
        description: 'Member details not found. Please start over.',
        variant: 'destructive',
      });
      setStep('lookup');
      return;
    }

    setIsSubmitting(true);
    try {
      // Check if username is already taken using edge function
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const checkResponse = await fetch(`${supabaseUrl}/functions/v1/member-auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'check-username-available', 
          username: data.username 
        }),
      });

      const checkResult = await checkResponse.json();

      if (!checkResult.available) {
        toast({
          title: 'Username Taken',
          description: 'This username is already in use. Please choose a different one.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      // Sign up with Supabase Auth using email
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (authError) {
        toast({
          title: 'Sign Up Failed',
          description: authError.message,
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      if (authData.user) {
        // Create member profile linking to agent_customer
        const { error: profileError } = await supabase
          .from('member_profiles')
          .insert({
            user_id: authData.user.id,
            username: data.username.toLowerCase(),
            agent_customer_id: memberDetails.id,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          toast({
            title: 'Profile Error',
            description: 'Account created but profile setup failed. Please contact support.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Registration Successful!',
            description: 'Your account has been created. Please log in to access your dashboard.',
          });
          // Redirect to login page after successful registration
          navigate('/member/login');
        }
      }
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onLogin = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/member-auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login-with-username',
          username: data.username,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.session) {
        toast({
          title: 'Login Failed',
          description: result?.error || 'Invalid username or password.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      const { error: setErr } = await supabase.auth.setSession({
        access_token: result.session.access_token,
        refresh_token: result.session.refresh_token,
      });

      if (setErr) {
        toast({
          title: 'Login Failed',
          description: 'Could not establish session. Please try again.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Welcome Back!',
          description: 'You are now logged in.',
        });
        navigate('/member/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => {
            if (step !== 'lookup' && activeTab === 'signup') {
              setStep('lookup');
              setMemberDetails(null);
              setDetailsVerified(false);
            } else {
              navigate('/');
            }
          }}>
            <ArrowLeft size={18} />
            Back
          </Button>
          <Logo size="sm" />
          <div className="w-20" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
            <UserPlus size={36} className="text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold gold-text mb-2">
            Member Access
          </h1>
          <p className="text-muted-foreground">
            Sign up or login to access your member dashboard
          </p>
        </div>

        <div className="bg-card rounded-2xl p-6 card-elevated border border-border animate-slide-up">
          <Tabs value={activeTab} onValueChange={(val) => {
            setActiveTab(val);
            if (val === 'signup') {
              setStep('lookup');
              setMemberDetails(null);
              setDetailsVerified(false);
            }
          }}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signup" className="flex items-center gap-2">
                <UserPlus size={16} />
                Sign Up
              </TabsTrigger>
              <TabsTrigger value="login" className="flex items-center gap-2">
                <LogIn size={16} />
                Login
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signup">
              {step === 'lookup' && (
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>Step 1:</strong> Enter the email address your agent used during registration to find your details.
                    </p>
                  </div>

                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Not registered by an agent?
                    </p>
                    <Link 
                      to="/register" 
                      className="text-primary hover:underline font-medium text-sm"
                    >
                      Sign up fully here →
                    </Link>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <Mail size={16} className="text-primary" />
                      Email Address <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      value={lookupEmail}
                      onChange={(e) => setLookupEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                    />
                  </div>

                  <Button
                    variant="gold"
                    size="lg"
                    className="w-full"
                    onClick={handleLookup}
                    disabled={isLookingUp}
                  >
                    {isLookingUp ? 'Looking up...' : 'Find My Details'}
                  </Button>
                </div>
              )}

              {step === 'verify' && memberDetails && (
                <div className="space-y-4">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4">
                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                      <CheckCircle size={16} />
                      <strong>Step 2:</strong> Please verify your details below are correct.
                    </p>
                  </div>

                  <Card className="border-primary/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User size={20} className="text-primary" />
                        Your Registered Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Name:</span>
                          <p className="font-medium">{memberDetails.name} {memberDetails.surname || ''}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Email:</span>
                          <p className="font-medium">{memberDetails.email || 'Not provided'}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Phone:</span>
                          <p className="font-medium">{memberDetails.phone || 'Not provided'}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">ID Number:</span>
                          <p className="font-medium">{memberDetails.id_number || 'Not provided'}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Some details are masked for your privacy. Full details are available after signing in.
                      </p>
                    </CardContent>
                  </Card>

                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <Checkbox
                      id="verify-details"
                      checked={detailsVerified}
                      onCheckedChange={(checked) => setDetailsVerified(checked === true)}
                    />
                    <label htmlFor="verify-details" className="text-sm cursor-pointer">
                      I confirm that the details shown above are correct and belong to me.
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex-1"
                      onClick={() => {
                        setStep('lookup');
                        setMemberDetails(null);
                        setDetailsVerified(false);
                      }}
                    >
                      <XCircle size={16} className="mr-2" />
                      Not Me
                    </Button>
                    <Button
                      variant="gold"
                      size="lg"
                      className="flex-1"
                      onClick={handleVerifyDetails}
                      disabled={!detailsVerified}
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Confirm
                    </Button>
                  </div>
                </div>
              )}

              {step === 'credentials' && memberDetails && (
                <Form {...signUpForm}>
                  <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4">
                      <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                        <CheckCircle size={16} />
                        <strong>Step 3:</strong> Create your login credentials.
                      </p>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3 mb-2">
                      <p className="text-sm text-muted-foreground">
                        Creating account for: <strong>{memberDetails.name} {memberDetails.surname || ''}</strong>
                      </p>
                    </div>

                    <FormField
                      control={signUpForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Mail size={16} className="text-primary" />
                            Email <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled className="bg-muted" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signUpForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <User size={16} className="text-primary" />
                            Username <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Choose a username (e.g., john_doe)" 
                              {...field}
                              onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground">
                            4-20 characters, letters, numbers, and underscores only
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signUpForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Lock size={16} className="text-primary" />
                            Password <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Create a strong password" 
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                setPasswordValue(e.target.value);
                              }}
                            />
                          </FormControl>
                          <PasswordStrengthIndicator password={passwordValue} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signUpForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Lock size={16} className="text-primary" />
                            Confirm Password <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Confirm your password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      variant="gold" 
                      size="lg" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>
                </Form>
              )}
            </TabsContent>

            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User size={16} className="text-primary" />
                          Username <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your username" 
                            {...field}
                            onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Lock size={16} className="text-primary" />
                          Password <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter your password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    variant="gold" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default MemberSignUp;