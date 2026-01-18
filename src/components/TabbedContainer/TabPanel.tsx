import React from 'react';
import { X } from 'lucide-react';
import { TabPanelProps } from './types';
import { cn } from '@/lib/utils';

export function TabPanel({ tab, onClose, showHeader = true }: TabPanelProps) {
  return (
    <div className="h-full flex flex-col bg-background border border-border rounded-md overflow-hidden">
      {showHeader && (
        <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border flex-shrink-0">
          <span className="font-medium text-sm truncate">{tab.title}</span>
          {tab.closable !== false && onClose && (
            <button
              onClick={onClose}
              className="hover:bg-destructive/20 rounded p-1 transition-colors ml-2"
              aria-label={`Close ${tab.title}`}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
      <div className="flex-1 overflow-auto p-4">
        {tab.content}
      </div>
    </div>
  );
}
