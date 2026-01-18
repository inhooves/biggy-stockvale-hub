import React, { useState, useEffect, useCallback } from 'react';
import { TabbedContainerProps, LayoutMode } from './types';
import { VerticalTabs } from './VerticalTabs';
import { SideBySideTabs } from './SideBySideTabs';
import { LayoutToggle } from './LayoutToggle';
import { useLayoutPersistence } from './useLayoutPersistence';

export function TabbedContainer({
  tabs,
  defaultLayoutMode = 'vertical',
  maxVisiblePanels = 4,
  onTabClose,
  onTabsChange,
  persistKey = 'default',
}: TabbedContainerProps) {
  const { layoutMode, setLayoutMode, openTabIds, setOpenTabIds } = useLayoutPersistence(
    persistKey,
    defaultLayoutMode
  );

  // Active tab for vertical mode
  const [activeTabId, setActiveTabId] = useState<string>(() => {
    return tabs.length > 0 ? tabs[0].id : '';
  });

  // Initialize visible tabs for side-by-side mode
  useEffect(() => {
    if (openTabIds.length === 0 && tabs.length > 0) {
      setOpenTabIds(tabs.slice(0, maxVisiblePanels).map(t => t.id));
    }
  }, [tabs, openTabIds.length, maxVisiblePanels, setOpenTabIds]);

  // Ensure active tab exists
  useEffect(() => {
    if (tabs.length > 0 && !tabs.find(t => t.id === activeTabId)) {
      setActiveTabId(tabs[0].id);
    }
  }, [tabs, activeTabId]);

  const handleTabClose = useCallback((tabId: string) => {
    // Update visible tabs in side-by-side mode
    const newOpenIds = openTabIds.filter(id => id !== tabId);
    setOpenTabIds(newOpenIds);

    // Update active tab in vertical mode if needed
    if (activeTabId === tabId) {
      const tabIndex = tabs.findIndex(t => t.id === tabId);
      const nextTab = tabs[tabIndex + 1] || tabs[tabIndex - 1];
      if (nextTab) {
        setActiveTabId(nextTab.id);
      }
    }

    onTabClose?.(tabId);
  }, [tabs, activeTabId, openTabIds, setOpenTabIds, onTabClose]);

  const handleTabOpen = useCallback((tabId: string) => {
    // In vertical mode, just activate the tab
    setActiveTabId(tabId);
  }, []);

  const handleVisibleTabsChange = useCallback((tabIds: string[]) => {
    setOpenTabIds(tabIds);
  }, [setOpenTabIds]);

  const handleLayoutChange = useCallback((mode: LayoutMode) => {
    setLayoutMode(mode);
    // When switching to side-by-side, ensure current active tab is visible
    if (mode === 'side-by-side' && activeTabId && !openTabIds.includes(activeTabId)) {
      setOpenTabIds([activeTabId, ...openTabIds.slice(0, maxVisiblePanels - 1)]);
    }
  }, [activeTabId, openTabIds, maxVisiblePanels, setLayoutMode, setOpenTabIds]);

  if (tabs.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No tabs available
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header with layout toggle */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        <span className="text-sm font-medium text-muted-foreground">
          {layoutMode === 'vertical' ? 'Tab View' : 'Panel View'}
        </span>
        <LayoutToggle mode={layoutMode} onChange={handleLayoutChange} />
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-hidden">
        {layoutMode === 'vertical' ? (
          <VerticalTabs
            tabs={tabs}
            activeTabId={activeTabId}
            onTabChange={setActiveTabId}
            onTabClose={handleTabClose}
          />
        ) : (
          <SideBySideTabs
            tabs={tabs}
            visibleTabIds={openTabIds}
            maxVisible={maxVisiblePanels}
            onTabClose={handleTabClose}
            onTabOpen={handleTabOpen}
            onVisibleTabsChange={handleVisibleTabsChange}
          />
        )}
      </div>
    </div>
  );
}
