export type LayoutMode = 'vertical' | 'side-by-side';

export interface TabItem {
  id: string;
  title: string;
  content: React.ReactNode;
  closable?: boolean;
}

export interface TabbedContainerProps {
  tabs: TabItem[];
  defaultLayoutMode?: LayoutMode;
  maxVisiblePanels?: number;
  onTabClose?: (tabId: string) => void;
  onTabsChange?: (tabs: TabItem[]) => void;
  persistKey?: string;
}

export interface TabPanelProps {
  tab: TabItem;
  onClose?: () => void;
  showHeader?: boolean;
}
