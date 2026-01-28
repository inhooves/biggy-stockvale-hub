import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Settings } from "lucide-react";
import { SettingsDropdown } from "./SettingsDropdown";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo from "./Logo";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Register Here", path: "/register" },
  { 
    name: "Stokvel Services", 
    path: "/services",
    subItems: [
      { name: "Biggy Groceries", path: "/services/groceries" },
      { name: "Biggy Burial Society", path: "/services/burial" },
      { name: "Biggy Savings Club", path: "/services/savings" },
      { name: "Biggy Investments Club", path: "/services/investments" },
      { name: "Biggy Crowd Funding", path: "/services/crowdfunding" },
    ]
  },
  { 
    name: "Fun & Games", 
    path: "/fun",
    subItems: [
      { name: "Biggy Fun Day", path: "/fun/funday" },
      { name: "Biggy Do or Die", path: "/fun/doordie" },
    ]
  },
  { name: "Constitution", path: "/constitution" },
  { name: "Benefits", path: "/benefits" },
  { name: "Contact Us", path: "/contact" },
  { name: "Biggy Market Place", path: "/marketplace" },
];

export function MainNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="font-display text-lg font-bold gold-text hidden sm:inline">Biggy Round</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              item.subItems ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className={`text-sm ${isActive(item.path) ? 'bg-primary/10 text-primary' : ''}`}
                    >
                      {item.name}
                      <ChevronDown className="ml-1 h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center">
                    {item.subItems.map((subItem) => (
                      <DropdownMenuItem key={subItem.path} asChild>
                        <Link to={subItem.path}>{subItem.name}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  key={item.name}
                  variant="ghost"
                  size="sm"
                  asChild
                  className={`text-sm ${isActive(item.path) ? 'bg-primary/10 text-primary' : ''}`}
                >
                  <Link to={item.path}>{item.name}</Link>
                </Button>
              )
            ))}
          </div>

          {/* Auth Buttons & Settings */}
          <div className="hidden lg:flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/agent">Agent Portal</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/admin">Admin</Link>
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <Link to="/member/signup">Sign Up</Link>
            </Button>
            <SettingsDropdown />
          </div>

          {/* Mobile Menu Button & Settings */}
          <div className="flex items-center gap-1 lg:hidden">
            <SettingsDropdown />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                item.subItems ? (
                  <div key={item.name} className="space-y-1">
                    <span className="px-3 py-2 text-sm font-medium text-muted-foreground">{item.name}</span>
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className="block px-6 py-2 text-sm hover:bg-muted rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 text-sm rounded-md hover:bg-muted ${isActive(item.path) ? 'bg-primary/10 text-primary' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              <div className="flex flex-col gap-2 mt-4 px-3">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link to="/agent">Agent Portal</Link>
                  </Button>
                  <Button size="sm" asChild className="flex-1">
                    <Link to="/admin">Admin</Link>
                  </Button>
                </div>
                <Button variant="secondary" size="sm" asChild className="w-full">
                  <Link to="/member/signup">Member Sign Up</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
