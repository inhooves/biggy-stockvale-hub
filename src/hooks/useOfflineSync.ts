import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  getPendingRegistrations,
  deletePendingRegistration,
  PendingRegistration,
} from '@/lib/offlineStorage';
import { useToast } from '@/hooks/use-toast';

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  // Update online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check pending registrations count
  const checkPendingCount = useCallback(async () => {
    try {
      const pending = await getPendingRegistrations();
      setPendingCount(pending.length);
    } catch (error) {
      console.error('Error checking pending registrations:', error);
    }
  }, []);

  useEffect(() => {
    checkPendingCount();
  }, [checkPendingCount]);

  // Sync pending registrations when online
  const syncPendingRegistrations = useCallback(async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    let successCount = 0;
    let failCount = 0;

    try {
      const pending = await getPendingRegistrations();
      
      if (pending.length === 0) {
        setIsSyncing(false);
        return;
      }

      for (const registration of pending) {
        try {
          // Remove local id and created_at before inserting
          const { id, created_at, ...insertData } = registration;
          
          const { error } = await supabase
            .from('agent_customers')
            .insert(insertData);

          if (error) {
            console.error('Error syncing registration:', error);
            failCount++;
          } else {
            await deletePendingRegistration(id);
            successCount++;
          }
        } catch (error) {
          console.error('Error syncing registration:', error);
          failCount++;
        }
      }

      if (successCount > 0) {
        toast({
          title: 'Sync Complete',
          description: `${successCount} offline registration${successCount > 1 ? 's' : ''} synced successfully.`,
        });
      }

      if (failCount > 0) {
        toast({
          title: 'Sync Incomplete',
          description: `${failCount} registration${failCount > 1 ? 's' : ''} failed to sync. Will retry later.`,
          variant: 'destructive',
        });
      }

      await checkPendingCount();
    } catch (error) {
      console.error('Error during sync:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSyncing, toast, checkPendingCount]);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && pendingCount > 0) {
      syncPendingRegistrations();
    }
  }, [isOnline, pendingCount, syncPendingRegistrations]);

  return {
    isOnline,
    pendingCount,
    isSyncing,
    syncPendingRegistrations,
    checkPendingCount,
  };
}
