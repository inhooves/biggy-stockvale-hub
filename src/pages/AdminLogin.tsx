import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/Logo';
import { Lock, User, ArrowLeft, ShieldCheck } from 'lucide-react';

const ADMIN_USERNAME = 'BIGGY26';
const ADMIN_PASSWORD = 'Rasspfumet';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem('biggyround_admin', 'true');
      toast({
        title: 'Welcome Back!',
        description: 'Successfully logged into admin dashboard.',
      });
      navigate('/admin/dashboard');
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid username or password.',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

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

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User size={16} className="text-muted-foreground" />
                Username
              </label>
              <Input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter admin username"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Lock size={16} className="text-muted-foreground" />
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            <Button 
              type="submit" 
              variant="gold" 
              size="lg" 
              className="w-full mt-6"
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Protected by Biggy Round Security
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
