import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useAppStore } from '../services/store';

export const useSyncManager = () => {
  const { isOnline, setOnlineStatus, syncQueue, clearQueue, setSyncing, isSyncing, loadQueue } = useAppStore();

  useEffect(() => {
    loadQueue();
    
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = state.isConnected && state.isInternetReachable !== false;
      setOnlineStatus(!!online);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let mounted = true;

    const processQueue = async () => {
      if (isOnline && syncQueue.length > 0 && !isSyncing) {
        setSyncing(true);
        try {
          // API işlemini simüle et (örneğin 2 sn gecikme)
          await new Promise((resolve) => setTimeout(resolve, 2000));
          
          if (mounted) {
            await clearQueue();
          }
        } catch (error) {
          console.error('Senkronizasyon başarısız', error);
        } finally {
          if (mounted) {
            setSyncing(false);
          }
        }
      }
    };

    processQueue();

    return () => {
      mounted = false;
    };
  }, [isOnline, syncQueue.length, isSyncing]);

  return null;
};
