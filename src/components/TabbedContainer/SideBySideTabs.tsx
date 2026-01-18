import React, { useMemo } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Plus } from 'lucide-react';
import { TabItem } from './types';
import { TabPanel } from './TabPanel';

interface SideBySideTabsProps {
  tabs: TabItem[];
  visibleTabIds: string[];
  maxVisible: number;
  onTabClose: (tabId: string) => void;
  onTabOpen: (tabId: string) => void;
  onVisibleTabsChange: (tabIds: string[]) => void;
}

export function SideBySideTabs({
  tabs,
  visibleTabIds,
  maxVisible,
  onTabClose,
  onTabOpen,
  onVisibleTabsChange,
}: SideBySideTabsProps) {
  const visibleTabs = useMemo(() => {
    return visibleTabIds
      .slice(0, maxVisible)
      .map(id => tabs.find(t => t.id === id))
      .filter((t): t is TabItem => t !== undefined);
  }, [tabs, visibleTabIds, maxVisible]);

  const overflowTabs = useMemo(() => {
    const visibleSet = new Set(visibleTabIds.slice(0, maxVisible));
    return tabs.filter(t => !visibleSet.has(t.id));
  }, [tabs, visibleTabIds, maxVisible]);

  const handleClosePanel = (tabId: string) => {
    const newVisible = visibleTabIds.filter(id => id !== tabId);
    onVisibleTabsChange(newVisible);
    onTabClose(tabId);
  };

  const handleOpenFromOverflow = (tabId: string) => {
    // Add to the beginning (most recently used)
    const newVisible = [tabId, ...visibleTabIds.filter(id => id !== tabId)];
    onVisibleTabsChange(newVisible);
    onTabOpen(tabId);
  };

  if (visibleTabs.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p>No tabs open</p>
          {overflowTabs.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="mt-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Open a tab
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-popover z-50">
                {overflowTabs.map((tab) => (
                  <DropdownMenuItem key={tab.id} onClick={() => handleOpenFromOverflow(tab.id)}>
                    {tab.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Overflow menu when there are hidden tabs */}
      {overflowTabs.length > 0 && (
        <div className="flex justify-end p-2 border-b border-border bg-muted/30">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4 mr-2" />
                {overflowTabs.length} more tab{overflowTabs.length > 1 ? 's' : ''}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover z-50">
              {overflowTabs.map((tab) => (
                <DropdownMenuItem key={tab.id} onClick={() => handleOpenFromOverflow(tab.id)}>
                  {tab.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Resizable panels */}
      <div className="flex-1 p-2">
        {visibleTabs.length === 1 ? (
          <TabPanel
            tab={visibleTabs[0]}
            onClose={() => handleClosePanel(visibleTabs[0].id)}
          />
        ) : (
          <ResizablePanelGroup direction="horizontal" className="h-full gap-1">
            {visibleTabs.map((tab, index) => (
              <React.Fragment key={tab.id}>
                <ResizablePanel
                  defaultSize={100 / visibleTabs.length}
                  minSize={15}
                  className="h-full"
                >
                  <TabPanel
                    tab={tab}
                    onClose={() => handleClosePanel(tab.id)}
                  />
                </ResizablePanel>
                {index < visibleTabs.length - 1 && (
                  <ResizableHandle withHandle className="mx-1" />
                )}
              </React.Fragment>
            ))}
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
}
