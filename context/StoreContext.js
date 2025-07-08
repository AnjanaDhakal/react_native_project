import React, { createContext, useContext, useEffect, useState } from 'react';
import { useStore } from '@livestore/react';
import { store, initializeStore, storeHelpers } from '@/lib/store';

const StoreContext = createContext({});

export function StoreProvider({ children }) {
  const [isStoreReady, setIsStoreReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState('offline');

  useEffect(() => {
    const setupStore = async () => {
      try {
        await initializeStore();
        setIsStoreReady(true);
        
        // Listen for sync events
        store.on('sync:start', () => setSyncStatus('syncing'));
        store.on('sync:success', () => setSyncStatus('online'));
        store.on('sync:error', () => setSyncStatus('offline'));
        
        // Start sync if URL is configured
        if (process.env.EXPO_PUBLIC_SYNC_URL) {
          store.startSync();
        }
      } catch (error) {
        console.error('Store setup failed:', error);
      }
    };

    setupStore();

    return () => {
      if (store) {
        store.stopSync();
      }
    };
  }, []);

  return (
    <StoreContext.Provider value={{
      store,
      storeHelpers,
      isStoreReady,
      syncStatus
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStoreContext = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStoreContext must be used within a StoreProvider');
  }
  return context;
};

// Custom hooks for specific data
export const useOrders = (userId) => {
  const { isStoreReady } = useStoreContext();
  const orders = useStore(store, 'orders', {
    where: { userId },
    enabled: isStoreReady && !!userId
  });
  return orders || [];
};

export const useProducts = (userId) => {
  const { isStoreReady } = useStoreContext();
  const products = useStore(store, 'products', {
    where: { userId },
    enabled: isStoreReady && !!userId
  });
  return products || [];
};

export const useAnalytics = (userId) => {
  const { isStoreReady } = useStoreContext();
  const analytics = useStore(store, 'analytics', {
    where: { userId },
    enabled: isStoreReady && !!userId
  });
  return analytics || [];
};