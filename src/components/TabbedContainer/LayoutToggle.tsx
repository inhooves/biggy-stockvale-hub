import React from 'react';
import { LayoutMode } from './types';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Columns, LayoutList } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutToggleProps {
  mode: LayoutMode;
  onChange: (mode: LayoutMode) => void;
}

export function LayoutToggle({ mode, onChange }: LayoutToggleProps) {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange('vertical')}
              className={cn(
                "h-8 w-8 p-0",
                mode === 'vertical' && "bg-background shadow-sm"
              )}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Vertical Tabs</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange('side-by-side')}
              className={cn(
                "h-8 w-8 p-0",
                mode === 'side-by-side' && "bg-background shadow-sm"
              )}
            >
              <Columns className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Side by Side</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
