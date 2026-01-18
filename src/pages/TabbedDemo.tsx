import React, { useState } from 'react';
import { TabbedContainer, TabItem } from '@/components/TabbedContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// Demo content components
const DemoContent = ({ title, color }: { title: string; color: string }) => (
  <div className={`h-full min-h-[200px] rounded-lg p-6 ${color}`}>
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <p className="text-muted-foreground mb-4">
      This is sample content for the {title} tab. You can resize panels in side-by-side mode
      by dragging the handles between them.
    </p>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-background/50 rounded p-4">
        <p className="text-sm font-medium">Stat 1</p>
        <p className="text-2xl font-bold">1,234</p>
      </div>
      <div className="bg-background/50 rounded p-4">
        <p className="text-sm font-medium">Stat 2</p>
        <p className="text-2xl font-bold">567</p>
      </div>
    </div>
  </div>
);

const initialTabs: TabItem[] = [
  { id: 'dashboard', title: 'Dashboard', content: <DemoContent title="Dashboard" color="bg-blue-500/10" /> },
  { id: 'analytics', title: 'Analytics', content: <DemoContent title="Analytics" color="bg-green-500/10" /> },
  { id: 'reports', title: 'Reports', content: <DemoContent title="Reports" color="bg-purple-500/10" /> },
  { id: 'settings', title: 'Settings', content: <DemoContent title="Settings" color="bg-orange-500/10" /> },
  { id: 'users', title: 'Users', content: <DemoContent title="Users" color="bg-pink-500/10" /> },
  { id: 'logs', title: 'Activity Logs', content: <DemoContent title="Activity Logs" color="bg-yellow-500/10" /> },
];

export default function TabbedDemo() {
  const [tabs, setTabs] = useState<TabItem[]>(initialTabs);
  const [tabCounter, setTabCounter] = useState(initialTabs.length);

  const handleAddTab = () => {
    const newId = `tab-${tabCounter + 1}`;
    const colors = ['bg-red-500/10', 'bg-teal-500/10', 'bg-indigo-500/10', 'bg-cyan-500/10'];
    const color = colors[tabCounter % colors.length];
    
    setTabs(prev => [
      ...prev,
      {
        id: newId,
        title: `New Tab ${tabCounter + 1}`,
        content: <DemoContent title={`New Tab ${tabCounter + 1}`} color={color} />,
        closable: true,
      }
    ]);
    setTabCounter(prev => prev + 1);
  };

  const handleTabClose = (tabId: string) => {
    setTabs(prev => prev.filter(t => t.id !== tabId));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Tabbed Interface Demo</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Toggle between Vertical Tabs and Side-by-Side panels using the controls
                </p>
              </div>
              <Button onClick={handleAddTab} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Tab
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card className="h-[600px]">
          <CardContent className="p-0 h-full">
            <TabbedContainer
              tabs={tabs}
              defaultLayoutMode="vertical"
              maxVisiblePanels={4}
              onTabClose={handleTabClose}
              persistKey="demo-tabs"
            />
          </CardContent>
        </Card>

        <Card className="mt-6 p-4">
          <h4 className="font-medium mb-2">Features:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• <strong>Vertical Tabs:</strong> Traditional tab strip with single active content view</li>
            <li>• <strong>Side-by-Side:</strong> Multiple resizable panels displayed simultaneously</li>
            <li>• <strong>Overflow Menu:</strong> Access hidden tabs when max visible (4) is exceeded</li>
            <li>• <strong>Persistent Layout:</strong> Your layout choice is saved automatically</li>
            <li>• <strong>Closable Tabs:</strong> Close tabs with the X button</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
