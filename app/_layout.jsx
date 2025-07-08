import { createContext, useContext, useState, useEffect } from 'react';
import { useStoreContext } from './StoreContext';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { storeHelpers, isStoreReady } = useStoreContext();

  useEffect(() => {
    // Check for existing user session from local store
    const checkExistingSession = async () => {
      if (!isStoreReady) return;
      
      try {
        // In a real app, you'd check for stored session tokens
        // For now, we'll just set loading to false
        setIsLoading(false);
      } catch (error) {
        console.error('Session check failed:', error);
      setIsLoading(false);
    }, 1000);
  }, []);

  const login = async (email, password) => {
    // Simulate login API call
    return new Promise((resolve) => {
      setTimeout(() => {
        setUser({
          id: '1',
          email,
          name: 'John Vendor',
          businessName: 'Green Market Store'
        });
        resolve({ success: true });
      }, 1000);
    });
  };

  const register = async (email, password, name, businessName) => {
    // Simulate registration API call
    return new Promise((resolve) => {
      setTimeout(() => {
        setUser({
          id: '1',
          email,
          name,
          businessName
        });
        resolve({ success: true });
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
          <Stack.Screen name="+not-found" />
          <Stack.Screen name= "(main)/dashboard" />
          <Stack.Screen name="(main)/scanner" />
        </Stack>
        <StatusBar style="auto" />
      </AuthProvider>
    </StoreProvider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};