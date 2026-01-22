import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  LogOut, 
  LayoutGrid, 
  LayoutList, 
  User, 
  Bell, 
  HelpCircle,
  Moon,
  Sun,
  Info,
  FileText
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
import { useLayoutPersistence } from '@/components/TabbedContainer/useLayoutPersistence';
import { LayoutMode } from '@/components/TabbedContainer/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface MemberSettingsDropdownProps {
  onNavigateTab?: (tab: string) => void;
  userEmail?: string;
}

export function MemberSettingsDropdown({ onNavigateTab, userEmail }: MemberSettingsDropdownProps) {
  const navigate = useNavigate();
  const { layoutMode, setLayoutMode } = useLayoutPersistence('home-services', 'side-by-side');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Failed to log out');
    } else {
      toast.success('Logged out successfully');
      navigate('/');
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
    document.documentElement.classList.toggle('dark', checked);
    toast.success(`${checked ? 'Dark' : 'Light'} mode enabled`);
  };

  const handleAboutClick = () => {
    if (onNavigateTab) {
      onNavigateTab('about');
    } else {
      navigate('/about');
    }
  };

  const handleConstitutionClick = () => {
    if (onNavigateTab) {
      onNavigateTab('constitution');
    } else {
      navigate('/constitution');
    }
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
            {userEmail && (
              <p className="text-xs text-muted-foreground truncate">
                {userEmail}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* About Us */}
        <DropdownMenuItem onClick={handleAboutClick}>
          <Info className="mr-2 h-4 w-4" />
          About Us
        </DropdownMenuItem>

        {/* Constitution */}
        <DropdownMenuItem onClick={handleConstitutionClick}>
          <FileText className="mr-2 h-4 w-4" />
          Constitution
        </DropdownMenuItem>

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
