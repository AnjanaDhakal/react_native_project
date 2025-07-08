import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    setTimeout(() => {
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
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};