import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-md mx-auto space-y-6">
        <div className="text-8xl font-bold text-primary/20">404</div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Page Not Found
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Sorry, the page <span className="font-mono text-sm bg-muted px-2 py-1 rounded">{location.pathname}</span> doesn't exist or may have been moved.
        </p>
        <p className="text-sm text-muted-foreground">
          If you followed a link from WhatsApp, email, or social media, it may be outdated or incorrect.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button asChild>
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Go to Homepage
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">Popular pages:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/services">Services</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/about">About Us</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/contact">Contact</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
