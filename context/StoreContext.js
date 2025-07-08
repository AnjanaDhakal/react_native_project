import React, { createContext, useContext, useEffect, useState } from 'react';
import { store, initializeStore, storeHelpers } from '@/lib/localStore';

const StoreContext = createContext({});

export function StoreProvider({ children }) {
  const [isStoreReady, setIsStoreReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState('offline');

  useEffect(() => {
    const setupStore = async () => {
      try {
        await initializeStore();
        setIsStoreReady(true);
        setSyncStatus('offline'); // Local-first, always offline
      } catch (error) {
        console.error('Store setup failed:', error);
      }
    };

    setupStore();
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

// Custom hook for reactive data
function useReactiveQuery(table, options = {}) {
  const [data, setData] = useState([]);
  const { isStoreReady } = useStoreContext();

  useEffect(() => {
    if (!isStoreReady || !options.enabled) return;

    const fetchData = async () => {
      try {
        const results = await store.query(table, options);
        setData(results);
      } catch (error) {
        console.error(`Failed to fetch ${table}:`, error);
        setData([]);
      }
    };

    fetchData();

    // Subscribe to changes
    const unsubscribe = store.subscribe(table, () => {
      fetchData();
    });

    return unsubscribe;
  }, [table, isStoreReady, options.enabled, JSON.stringify(options.where)]);

  return data;
}

// Custom hooks for specific data
export const useOrders = (userId) => {
  const { isStoreReady } = useStoreContext();
  return useReactiveQuery('orders', {
    where: { userId },
    enabled: isStoreReady && !!userId
  });
};

export const useProducts = (userId) => {
  const { isStoreReady } = useStoreContext();
  return useReactiveQuery('products', {
    where: { userId },
    enabled: isStoreReady && !!userId
  });
};

export const useAnalytics = (userId) => {
  const { isStoreReady } = useStoreContext();
  return useReactiveQuery('analytics', {
    where: { userId },
    enabled: isStoreReady && !!userId
  });
};