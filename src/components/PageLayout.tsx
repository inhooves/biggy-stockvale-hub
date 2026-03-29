import { ReactNode } from "react";
import { MainNavigation } from "./MainNavigation";
import { Link } from "react-router-dom";
import { ServiceImageSlideshow } from "./ServiceImageSlideshow";
import Logo from "./Logo";
import { Mail, Phone, MapPin } from "lucide-react";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNavigation />
      {/* Logo Section */}
      <div className="container mx-auto px-4 py-4">
        <Logo size="md" />
      </div>
      <main className="flex-1">{children}</main>
      <ServiceImageSlideshow />

      {/* Footer */}
      <footer className="relative border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 py-10 md:py-14 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
            <div className="col-span-2 md:col-span-1">
              <h3 className="font-display font-bold text-lg mb-4 purple-text">Biggy Round</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The biggest fulfilling stokvel community in Zimbabwe and Africa.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider text-muted-foreground">Quick Links</h4>
              <div className="flex flex-col gap-2.5 text-sm">
                <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
                <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
                <Link to="/benefits" className="hover:text-primary transition-colors">Benefits</Link>
                <Link to="/constitution" className="hover:text-primary transition-colors">Constitution</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider text-muted-foreground">Contact</h4>
              <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
                <a href="mailto:admin@biggyround.co.zw" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Mail className="h-3.5 w-3.5" />
                  admin@biggyround.co.zw
                </a>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" />
                  +263 715 385 960
                </div>
                <p className="pl-5">+263 713 360 948</p>
                <p className="pl-5">+263 773 226 245</p>
              </div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider text-muted-foreground">Follow Us</h4>
              <p className="text-sm text-muted-foreground">Facebook: Coming Soon</p>
            </div>
          </div>
          <div className="section-divider my-8" />
          <div className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Biggy Round Stokvel. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
