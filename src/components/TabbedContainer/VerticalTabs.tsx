import React, { useCallback } from 'react';
import { motion, AnimatePresence, Easing, PanInfo, useMotionValue, useTransform, animate } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { X } from 'lucide-react';
import { TabItem } from './types';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface VerticalTabsProps {
  tabs: TabItem[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
}

const easeOut: Easing = [0.0, 0.0, 0.2, 1];
const easeIn: Easing = [0.4, 0.0, 1, 1];

const SWIPE_THRESHOLD = 50;

export function VerticalTabs({ tabs, activeTabId, onTabChange, onTabClose }: VerticalTabsProps) {
  const isMobile = useIsMobile();
  const x = useMotionValue(0);
  
  const currentIndex = tabs.findIndex(t => t.id === activeTabId);
  
  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    
    // Swipe left (next tab)
    if (offset < -SWIPE_THRESHOLD || velocity < -500) {
      if (currentIndex < tabs.length - 1) {
        onTabChange(tabs[currentIndex + 1].id);
      }
    }
    // Swipe right (previous tab)
    else if (offset > SWIPE_THRESHOLD || velocity > 500) {
      if (currentIndex > 0) {
        onTabChange(tabs[currentIndex - 1].id);
      }
    }
    
    // Animate back to center
    animate(x, 0, { type: 'spring', stiffness: 300, damping: 30 });
  }, [currentIndex, tabs, onTabChange, x]);

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
          {tabs.map((tab, index) => (
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
        
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {tabs.map((tab) => (
              <TabsContent 
                key={tab.id} 
                value={tab.id} 
                className="h-full mt-0 data-[state=inactive]:hidden"
                asChild
              >
                <motion.div
                  className="h-full overflow-auto p-4"
                  drag={isMobile ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  style={{ x }}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: easeOut }}
                >
                  {tab.content}
                  
                  {/* Swipe indicator for mobile */}
                  {isMobile && tabs.length > 1 && (
                    <div className="flex justify-center gap-1.5 mt-4 pb-2">
                      {tabs.map((t, i) => (
                        <div
                          key={t.id}
                          className={cn(
                            "w-2 h-2 rounded-full transition-colors",
                            i === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                          )}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              </TabsContent>
            ))}
          </AnimatePresence>
        </div>
      </Tabs>
    </motion.div>
  );
}
