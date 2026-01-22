import { Link } from 'react-router-dom';
import { Users, Briefcase, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/Logo';

const AuthEntryPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-center">
        <Link to="/">
          <Logo size="sm" />
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Welcome to Biggy
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Choose how you'd like to access our platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Member Card */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Member</CardTitle>
                <CardDescription className="text-sm">
                  Join our community as a public member
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full" size="lg">
                  <Link to="/register">Register as Member</Link>
                </Button>
                <Button asChild variant="outline" className="w-full" size="lg">
                  <Link to="/member/login">Member Sign In</Link>
                </Button>
                <p className="text-xs text-muted-foreground text-center pt-2">
                  Already registered by an agent?{' '}
                  <Link to="/member/signup" className="text-primary hover:underline font-medium">
                    Activate Account
                  </Link>
                </p>
              </CardContent>
            </Card>

            {/* Agent Card */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-secondary/50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                  <Briefcase className="w-8 h-8 text-secondary-foreground" />
                </div>
                <CardTitle className="text-xl">Agent</CardTitle>
                <CardDescription className="text-sm">
                  Manage and recruit members
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90" size="lg">
                  <Link to="/agent">Agent Portal</Link>
                </Button>
                <p className="text-xs text-muted-foreground text-center pt-2">
                  Sign in or register as a new agent
                </p>
              </CardContent>
            </Card>

            {/* Admin Card */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-destructive/30">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4 group-hover:bg-destructive/20 transition-colors">
                  <Shield className="w-8 h-8 text-destructive" />
                </div>
                <CardTitle className="text-xl">Admin</CardTitle>
                <CardDescription className="text-sm">
                  System administration access
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild variant="destructive" className="w-full" size="lg">
                  <Link to="/admin">Admin Portal</Link>
                </Button>
                <p className="text-xs text-muted-foreground text-center pt-2">
                  Administrators only
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-10">
            <Button asChild variant="ghost" size="sm">
              <Link to="/">← Back to Home</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthEntryPage;
