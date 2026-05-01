import { ReactNode } from "react";
import { MainNavigation } from "./MainNavigation";
import { Link } from "react-router-dom";
import { ServiceImageSlideshow } from "./ServiceImageSlideshow";
import Logo from "./Logo";


interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNavigation />
      {/* Logo Section - appears on all pages */}
      <div className="container mx-auto px-4 py-4">
        <Logo size="md" />
      </div>
      <main className="flex-1">{children}</main>
      <ServiceImageSlideshow />
      <footer className="bg-muted/50 border-t border-border py-6 md:py-8">
        <div className="container mx-auto px-3 md:px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="col-span-2 md:col-span-1">
              <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4">Biggy Round</h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                The biggest fulfilling stokvel community in Zimbabwe and Africa.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm md:text-base mb-3 md:mb-4">Quick Links</h4>
              <div className="flex flex-col gap-1.5 md:gap-2 text-xs md:text-sm">
                <Link to="/about" className="hover:text-primary">About Us</Link>
                <Link to="/services" className="hover:text-primary">Services</Link>
                <Link to="/benefits" className="hover:text-primary">Benefits</Link>
                <Link to="/constitution" className="hover:text-primary">Constitution</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm md:text-base mb-3 md:mb-4">Contact</h4>
              <div className="flex flex-col gap-1.5 md:gap-2 text-xs md:text-sm text-muted-foreground">
                <p>admin@biggyround.co.zw</p>
                <p>+263 715 385 960</p>
                <p>+263 713 360 948</p>
                <p>+263 773 226 245</p>
              </div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h4 className="font-semibold text-sm md:text-base mb-3 md:mb-4">Follow Us</h4>
              <p className="text-xs md:text-sm text-muted-foreground">Facebook: Coming Soon</p>
            </div>
          </div>
          <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-border text-center text-xs md:text-sm text-muted-foreground">
            © {new Date().getFullYear()} Biggy Round Stokvel. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
