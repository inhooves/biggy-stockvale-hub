import { ReactNode } from "react";
import { MainNavigation } from "./MainNavigation";
import { Link } from "react-router-dom";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNavigation />
      <main className="flex-1">{children}</main>
      <footer className="bg-muted/50 border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Biggy Round</h3>
              <p className="text-sm text-muted-foreground">
                The biggest fulfilling stokvel community in Zimbabwe and Africa.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="flex flex-col gap-2 text-sm">
                <Link to="/about" className="hover:text-primary">About Us</Link>
                <Link to="/services" className="hover:text-primary">Services</Link>
                <Link to="/benefits" className="hover:text-primary">Benefits</Link>
                <Link to="/constitution" className="hover:text-primary">Constitution</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <p>admin@biggyround.co.zw</p>
                <p>+263 715 385 960</p>
                <p>+263 713 360 948</p>
                <p>+263 773 226 245</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <p className="text-sm text-muted-foreground">Facebook: Coming Soon</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Biggy Round Stokvel. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
