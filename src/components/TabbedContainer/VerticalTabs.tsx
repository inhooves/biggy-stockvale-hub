import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { X } from 'lucide-react';
import { TabItem } from './types';
import { cn } from '@/lib/utils';

interface VerticalTabsProps {
  tabs: TabItem[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
}

export function VerticalTabs({ tabs, activeTabId, onTabChange, onTabClose }: VerticalTabsProps) {
  return (
    <Tabs value={activeTabId} onValueChange={onTabChange} className="w-full h-full flex flex-col">
      <TabsList className="w-full justify-start overflow-x-auto flex-shrink-0 bg-muted/50">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className={cn(
              "relative group flex items-center gap-2 px-4 py-2",
              "data-[state=active]:bg-background data-[state=active]:shadow-sm"
            )}
          >
            <span className="truncate max-w-[150px]">{tab.title}</span>
            {tab.closable !== false && onTabClose && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.id);
                }}
                className="opacity-0 group-hover:opacity-100 hover:bg-destructive/20 rounded p-0.5 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {tabs.map((tab) => (
        <TabsContent 
          key={tab.id} 
          value={tab.id} 
          className="flex-1 overflow-auto mt-0 p-4"
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
