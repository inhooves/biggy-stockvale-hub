import { Link } from 'react-router-dom';
import { Users, Briefcase, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/Logo';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const AuthEntryPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-gold/5" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />

      {/* Header */}
      <header className="p-6 flex justify-center relative z-10">
        <Link to="/">
          <Logo size="sm" />
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 pb-12 relative z-10">
        <div className="w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
              Welcome to <span className="purple-text">Biggy</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Choose how you'd like to access our platform
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid md:grid-cols-3 gap-6"
          >
            {/* Member Card */}
            <motion.div variants={item}>
              <Card className="group glass-card h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-transparent hover:border-primary/30">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Member</CardTitle>
                  <CardDescription className="text-sm">
                    Join our community as a public member
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full group/btn bg-gradient-to-r from-primary to-primary/80" size="lg">
                    <Link to="/register">
                      Register as Member
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full border-border/50" size="lg">
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
            </motion.div>

            {/* Agent Card */}
            <motion.div variants={item}>
              <Card className="group glass-card h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-transparent hover:border-gold/30">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 group-hover:scale-110 transition-all duration-300">
                    <Briefcase className="w-8 h-8 text-gold" />
                  </div>
                  <CardTitle className="text-xl">Agent</CardTitle>
                  <CardDescription className="text-sm">
                    Manage and recruit members
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full bg-gold text-gold-foreground hover:bg-gold/90" size="lg">
                    <Link to="/agent">
                      Agent Portal
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    Sign in or register as a new agent
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Admin Card */}
            <motion.div variants={item}>
              <Card className="group glass-card h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-transparent hover:border-accent/30">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                    <Shield className="w-8 h-8 text-accent" />
                  </div>
                  <CardTitle className="text-xl">Admin</CardTitle>
                  <CardDescription className="text-sm">
                    System administration access
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild variant="destructive" className="w-full" size="lg">
                    <Link to="/admin">
                      Admin Portal
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    Administrators only
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-10"
          >
            <Button asChild variant="ghost" size="sm">
              <Link to="/">← Back to Home</Link>
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AuthEntryPage;
