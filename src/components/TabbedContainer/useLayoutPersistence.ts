import { useState, useCallback, useMemo } from 'react';
import { LayoutMode } from './types';

const STORAGE_PREFIX = 'tabbed-layout-';

function getStoredValue<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    if (stored === null) return defaultValue;
    if (typeof defaultValue === 'string') return stored as T;
    return JSON.parse(stored) as T;
  } catch {
    return defaultValue;
  }
}

export function useLayoutPersistence(persistKey: string, defaultMode: LayoutMode) {
  const storageKey = useMemo(() => `${STORAGE_PREFIX}${persistKey}`, [persistKey]);
  
  const [layoutMode, setLayoutModeState] = useState<LayoutMode>(
    () => getStoredValue(storageKey, defaultMode)
  );

  const [openTabIds, setOpenTabIdsState] = useState<string[]>(
    () => getStoredValue(`${storageKey}-tabs`, [] as string[])
  );

  const setLayoutMode = useCallback((mode: LayoutMode) => {
    setLayoutModeState(mode);
    try {
      localStorage.setItem(storageKey, mode);
    } catch {
      // Ignore storage errors
    }
  }, [storageKey]);

  const setOpenTabIds = useCallback((ids: string[]) => {
    setOpenTabIdsState(ids);
    try {
      localStorage.setItem(`${storageKey}-tabs`, JSON.stringify(ids));
    } catch {
      // Ignore storage errors
    }
  }, [storageKey]);

  return { layoutMode, setLayoutMode, openTabIds, setOpenTabIds };
}
