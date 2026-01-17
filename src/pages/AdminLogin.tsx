import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Logo from '@/components/Logo';
import { Lock, Mail, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading, signIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  // Check if user is already logged in and is an admin
  useEffect(() => {
    const checkAdminRole = async () => {
      if (!authLoading && user) {
        const { data } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin'
        });
        
        if (data) {
          navigate('/admin/dashboard');
        }
      }
    };
    
    checkAdminRole();
  }, [user, authLoading, navigate]);

  const handleLogin = async (data: LoginFormData) => {
    setIsSubmitting(true);

    try {
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        throw error;
      }

      // Check if the user has admin role
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        throw new Error('Failed to get user after login');
      }

      const { data: isAdmin } = await supabase.rpc('has_role', {
        _user_id: currentUser.id,
        _role: 'admin'
      });

      if (!isAdmin) {
        // Sign out the user if they're not an admin
        await supabase.auth.signOut();
        throw new Error('Access denied. Admin privileges required.');
      }

      toast({
        title: 'Welcome Back!',
        description: 'Successfully logged into admin dashboard.',
      });
      
      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Login Failed',
        description: error.message || 'Invalid credentials or insufficient permissions.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')}
          className="mb-8"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Button>

        {/* Login Card */}
        <div className="bg-card rounded-2xl p-8 card-elevated border border-border animate-scale-in">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Logo size="md" />
            </div>
            <div className="flex items-center justify-center gap-2 text-primary mb-2">
              <ShieldCheck size={20} />
              <span className="text-sm font-medium">Admin Portal</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Secure access to the management dashboard
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail size={16} className="text-muted-foreground" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@biggyround.co.zw"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Lock size={16} className="text-muted-foreground" />
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                variant="gold" 
                size="lg" 
                className="w-full mt-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Authenticating...
                  </>
                ) : (
                  'Sign In to Dashboard'
                )}
              </Button>
            </form>
          </Form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Protected by Biggy Round Security
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
