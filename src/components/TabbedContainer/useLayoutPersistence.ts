import { useState, useEffect, useCallback } from 'react';
import { LayoutMode } from './types';

const STORAGE_PREFIX = 'tabbed-layout-';

export function useLayoutPersistence(persistKey: string, defaultMode: LayoutMode) {
  const storageKey = `${STORAGE_PREFIX}${persistKey}`;
  
  const [layoutMode, setLayoutModeState] = useState<LayoutMode>(() => {
    if (typeof window === 'undefined') return defaultMode;
    const stored = localStorage.getItem(storageKey);
    return (stored as LayoutMode) || defaultMode;
  });

  const [openTabIds, setOpenTabIdsState] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(`${storageKey}-tabs`);
    return stored ? JSON.parse(stored) : [];
  });

  const setLayoutMode = useCallback((mode: LayoutMode) => {
    setLayoutModeState(mode);
    localStorage.setItem(storageKey, mode);
  }, [storageKey]);

  const setOpenTabIds = useCallback((ids: string[]) => {
    setOpenTabIdsState(ids);
    localStorage.setItem(`${storageKey}-tabs`, JSON.stringify(ids));
  }, [storageKey]);

  return { layoutMode, setLayoutMode, openTabIds, setOpenTabIds };
}
