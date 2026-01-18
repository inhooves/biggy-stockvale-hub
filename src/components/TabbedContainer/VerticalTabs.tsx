import React from 'react';
import { motion, AnimatePresence, Easing } from 'framer-motion';
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

const easeOut: Easing = [0.0, 0.0, 0.2, 1];
const easeIn: Easing = [0.4, 0.0, 1, 1];

export function VerticalTabs({ tabs, activeTabId, onTabChange, onTabClose }: VerticalTabsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: easeOut }}
      className="w-full h-full"
    >
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
        
        <AnimatePresence mode="wait">
          {tabs.map((tab) => (
            <TabsContent 
              key={tab.id} 
              value={tab.id} 
              className="flex-1 overflow-auto mt-0 p-4"
              asChild
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2, ease: easeOut }}
              >
                {tab.content}
              </motion.div>
            </TabsContent>
          ))}
        </AnimatePresence>
      </Tabs>
    </motion.div>
  );
}
