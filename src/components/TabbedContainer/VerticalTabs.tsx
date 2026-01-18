import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, Easing, PanInfo } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
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

export function VerticalTabs({ tabs, activeTabId, onTabChange, onTabClose }: VerticalTabsProps) {
  const isMobile = useIsMobile();
  const [direction, setDirection] = useState(0);

  const currentIndex = tabs.findIndex(tab => tab.id === activeTabId);

  const navigateToTab = useCallback((newIndex: number) => {
    if (newIndex >= 0 && newIndex < tabs.length) {
      setDirection(newIndex > currentIndex ? 1 : -1);
      onTabChange(tabs[newIndex].id);
    }
  }, [tabs, currentIndex, onTabChange]);

  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    const velocityThreshold = 200;

    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      // Swiped left - go to next tab
      navigateToTab(currentIndex + 1);
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      // Swiped right - go to previous tab
      navigateToTab(currentIndex - 1);
    }
  }, [currentIndex, navigateToTab]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: easeOut }}
      className="w-full h-full"
    >
      <Tabs value={activeTabId} onValueChange={(id) => {
        const newIndex = tabs.findIndex(t => t.id === id);
        setDirection(newIndex > currentIndex ? 1 : -1);
        onTabChange(id);
      }} className="w-full h-full flex flex-col">
        {/* Tab navigation with swipe indicators on mobile */}
        <div className="relative flex items-center">
          {isMobile && currentIndex > 0 && (
            <button 
              onClick={() => navigateToTab(currentIndex - 1)}
              className="absolute left-0 z-10 p-1 bg-background/80 rounded-full shadow-sm"
            >
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          
          <TabsList className="w-full justify-start overflow-x-auto flex-shrink-0 bg-muted/50 px-6">
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
          
          {isMobile && currentIndex < tabs.length - 1 && (
            <button 
              onClick={() => navigateToTab(currentIndex + 1)}
              className="absolute right-0 z-10 p-1 bg-background/80 rounded-full shadow-sm"
            >
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Swipe indicator dots on mobile */}
        {isMobile && tabs.length > 1 && (
          <div className="flex justify-center gap-1.5 py-2">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => navigateToTab(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === currentIndex 
                    ? "bg-primary w-4" 
                    : "bg-muted-foreground/30"
                )}
              />
            ))}
          </div>
        )}
        
        {/* Swipeable content area */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait" custom={direction}>
            {tabs.map((tab) => (
              tab.id === activeTabId && (
                <TabsContent 
                  key={tab.id} 
                  value={tab.id} 
                  className="absolute inset-0 mt-0"
                  forceMount
                  asChild
                >
                  <motion.div
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: easeOut }}
                    drag={isMobile ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={handleDragEnd}
                    className="h-full overflow-auto p-4 touch-pan-y"
                  >
                    {tab.content}
                  </motion.div>
                </TabsContent>
              )
            ))}
          </AnimatePresence>
        </div>
      </Tabs>
    </motion.div>
  );
}
