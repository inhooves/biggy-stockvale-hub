import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-transparent" />
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md mx-auto space-y-6 relative z-10"
      >
        <div className="text-9xl font-extrabold purple-text opacity-60">404</div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Page Not Found
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Sorry, the page <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{location.pathname}</span> doesn't exist or may have been moved.
        </p>
        <p className="text-sm text-muted-foreground">
          If you followed a link from WhatsApp, email, or social media, it may be outdated.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button asChild className="bg-gradient-to-r from-primary to-primary/80">
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Go to Homepage
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()} className="flex items-center gap-2 border-border/50">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
        <div className="pt-4">
          <div className="section-divider mb-4" />
          <p className="text-sm text-muted-foreground mb-3">Popular pages:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { to: "/services", label: "Services" },
              { to: "/about", label: "About Us" },
              { to: "/contact", label: "Contact" },
              { to: "/auth", label: "Sign In" },
            ].map((link) => (
              <Button key={link.to} variant="ghost" size="sm" asChild className="hover:bg-primary/5">
                <Link to={link.to}>{link.label}</Link>
              </Button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
