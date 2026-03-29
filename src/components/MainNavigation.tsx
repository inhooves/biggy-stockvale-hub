import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { SettingsDropdown } from "./SettingsDropdown";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
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
    ],
    subMenu: {
      name: "Biggy Fun & Games",
      items: [
        { name: "Biggy Fun Day", path: "/fun/funday" },
        { name: "Biggy Do or Die", path: "/fun/doordie" },
      ]
    }
  },
  { name: "Constitution", path: "/constitution" },
  { name: "Benefits", path: "/benefits" },
  { name: "Contact Us", path: "/contact" },
  { name: "Biggy Market Place", path: "/marketplace" },
];

function MobileSubMenu({ subMenu, onNavigate }: { subMenu: { name: string; items: { name: string; path: string }[] }; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-border/50 mt-1 pt-1">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-6 py-2.5 text-sm font-medium text-muted-foreground hover:bg-primary/5 rounded-lg transition-colors"
      >
        {subMenu.name}
        <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && subMenu.items.map((sub) => (
        <Link
          key={sub.path}
          to={sub.path}
          className="block px-10 py-2.5 text-sm hover:bg-primary/5 rounded-lg transition-colors"
          onClick={onNavigate}
        >
          {sub.name}
        </Link>
      ))}
    </div>
  );
}

export function MainNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-2 group">
            <Logo size="sm" />
            <span className="font-display text-lg font-bold gold-text hidden sm:inline">Biggy Round</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => (
              item.subItems ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className={`text-sm font-medium transition-colors ${isActive(item.path) ? 'bg-primary/10 text-primary' : 'hover:bg-primary/5'}`}
                    >
                      {item.name}
                      <ChevronDown className="ml-1 h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="glass-card">
                    {item.subItems.map((subItem) => (
                      <DropdownMenuItem key={subItem.path} asChild>
                        <Link to={subItem.path} className="cursor-pointer">{subItem.name}</Link>
                      </DropdownMenuItem>
                    ))}
                    {(item as any).subMenu && (
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="cursor-pointer">
                          {(item as any).subMenu.name}
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="glass-card">
                          {(item as any).subMenu.items.map((sub: { name: string; path: string }) => (
                            <DropdownMenuItem key={sub.path} asChild>
                              <Link to={sub.path} className="cursor-pointer">{sub.name}</Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  key={item.name}
                  variant="ghost"
                  size="sm"
                  asChild
                  className={`text-sm font-medium transition-colors ${isActive(item.path) ? 'bg-primary/10 text-primary' : 'hover:bg-primary/5'}`}
                >
                  <Link to={item.path}>{item.name}</Link>
                </Button>
              )
            ))}
          </div>

          {/* Auth Buttons & Settings */}
          <div className="hidden lg:flex items-center gap-2">
            <Button variant="outline" size="sm" asChild className="border-border/50 hover:border-primary/30">
              <Link to="/agent">Agent Portal</Link>
            </Button>
            <Button size="sm" asChild className="bg-gradient-to-r from-primary to-primary/80 shadow-sm">
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
              className="hover:bg-primary/5"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                item.subItems ? (
                  <div key={item.name} className="space-y-1">
                    <span className="px-3 py-2.5 text-sm font-medium text-muted-foreground">{item.name}</span>
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className="block px-6 py-2.5 text-sm hover:bg-primary/5 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                    {(item as any).subMenu && (
                      <MobileSubMenu
                        subMenu={(item as any).subMenu}
                        onNavigate={() => setMobileMenuOpen(false)}
                      />
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2.5 text-sm rounded-lg transition-colors ${isActive(item.path) ? 'bg-primary/10 text-primary' : 'hover:bg-primary/5'}`}
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
                  <Button size="sm" asChild className="flex-1 bg-gradient-to-r from-primary to-primary/80">
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
