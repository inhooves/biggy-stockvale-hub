import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  LogOut, 
  UserPlus, 
  LayoutGrid, 
  LayoutList, 
  User, 
  Bell, 
  Shield, 
  HelpCircle,
  Moon,
  Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useLayoutPersistence } from '@/components/TabbedContainer/useLayoutPersistence';
import { LayoutMode } from '@/components/TabbedContainer/types';
import { toast } from 'sonner';

export function SettingsDropdown() {
  const navigate = useNavigate();
  const { user, isAgent, isAdmin, signOut } = useAuth();
  const { layoutMode, setLayoutMode } = useLayoutPersistence('home-services', 'side-by-side');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    // Check if dark mode is already set, default to true
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Failed to log out');
    } else {
      toast.success('Logged out successfully');
      navigate('/');
    }
  };

  const handleAddAccount = () => {
    navigate('/agent/register');
  };

  const handleProfileClick = () => {
    if (!user) {
      // Not logged in, redirect to login
      navigate('/agent/login');
      return;
    }
    
    if (isAgent) {
      navigate('/agent');
    } else if (isAdmin) {
      navigate('/admin');
    } else {
      // Regular user or member - for now redirect to register
      navigate('/register');
    }
  };

  const handleLayoutChange = (value: string) => {
    setLayoutMode(value as LayoutMode);
    toast.success(`Tab format changed to ${value === 'vertical' ? 'Vertical' : 'Side-by-Side'}`);
  };

  const handleNotificationsToggle = (checked: boolean) => {
    setNotifications(checked);
    toast.success(`Notifications ${checked ? 'enabled' : 'disabled'}`);
  };

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    // Toggle dark mode class on document
    document.documentElement.classList.toggle('dark', checked);
    toast.success(`${checked ? 'Dark' : 'Light'} mode enabled`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">Settings</p>
            {user && (
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Tab Format Settings */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <LayoutGrid className="mr-2 h-4 w-4" />
            Tab Format
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={layoutMode} onValueChange={handleLayoutChange}>
              <DropdownMenuRadioItem value="vertical" className="gap-2">
                <LayoutList className="h-4 w-4" />
                Vertical Tabs
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="side-by-side" className="gap-2">
                <LayoutGrid className="h-4 w-4" />
                Side-by-Side Panels
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Appearance */}
        <DropdownMenuItem 
          className="flex items-center justify-between cursor-pointer"
          onSelect={(e) => e.preventDefault()}
        >
          <div className="flex items-center">
            {darkMode ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
            Dark Mode
          </div>
          <Switch 
            checked={darkMode} 
            onCheckedChange={handleDarkModeToggle}
            className="ml-2"
          />
        </DropdownMenuItem>

        {/* Notifications */}
        <DropdownMenuItem 
          className="flex items-center justify-between cursor-pointer"
          onSelect={(e) => e.preventDefault()}
        >
          <div className="flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </div>
          <Switch 
            checked={notifications} 
            onCheckedChange={handleNotificationsToggle}
            className="ml-2"
          />
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Account Management */}
        <DropdownMenuItem onClick={handleProfileClick}>
          <User className="mr-2 h-4 w-4" />
          My Profile
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => navigate('/agent/register')}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Account
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => navigate('/admin')}>
          <Shield className="mr-2 h-4 w-4" />
          Admin Panel
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Help & Support */}
        <DropdownMenuItem onClick={() => navigate('/contact')}>
          <HelpCircle className="mr-2 h-4 w-4" />
          Help & Support
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem 
          onClick={handleLogout}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
