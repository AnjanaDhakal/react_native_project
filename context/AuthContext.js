import { createContext, useContext, useState, useEffect } from 'react';
import { useStoreContext } from './StoreContext';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { storeHelpers, isStoreReady } = useStoreContext();

  useEffect(() => {
    // Check for existing user session when store is ready
    const checkExistingSession = async () => {
      if (!isStoreReady) return;
      
      try {
        // In a real app, you'd check for stored session tokens
        // For now, we'll just set loading to false
        setIsLoading(false);
      } catch (error) {
        console.error('Session check failed:', error);
        setIsLoading(false);
      }
    };

    if (isStoreReady) {
      checkExistingSession();
    } else {
      setIsLoading(false);
    }
  }, [isStoreReady]);

  const login = async (email, password) => {
    try {
      // In a real app, you'd validate credentials against a server
      // For demo purposes, we'll create/find a user in local storage
      const userData = {
        email,
        name: 'John Vendor',
        businessName: 'Green Market Store'
      };
      
      const createdUser = await storeHelpers.createUser(userData);
      setUser(createdUser);
      
      // Seed some initial data for the demo
      await seedInitialData(createdUser.id);
      
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (email, password, name, businessName) => {
    try {
      const userData = {
        email,
        name,
        businessName
      };
      
      const createdUser = await storeHelpers.createUser(userData);
      setUser(createdUser);
      
      // Seed some initial data for the new user
      await seedInitialData(createdUser.id);
      
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const seedInitialData = async (userId) => {
    try {
      // Create sample orders
      const sampleOrders = [
        { userId, customer: 'John Doe', amount: 89.99, status: 'Pending', date: '2024-01-15', items: 3 },
        { userId, customer: 'Jane Smith', amount: 156.50, status: 'Completed', date: '2024-01-15', items: 5 },
        { userId, customer: 'Mike Johnson', amount: 45.75, status: 'Processing', date: '2024-01-14', items: 2 },
        { userId, customer: 'Sarah Wilson', amount: 234.00, status: 'Cancelled', date: '2024-01-14', items: 4 },
        { userId, customer: 'Tom Brown', amount: 67.25, status: 'Completed', date: '2024-01-13', items: 3 },
      ];

      for (const order of sampleOrders) {
        await storeHelpers.createOrder(order);
      }

      // Create sample products
      const sampleProducts = [
        { userId, name: 'Organic Tomatoes', price: 4.99, stock: 150, status: 'In Stock' },
        { userId, name: 'Fresh Lettuce', price: 2.99, stock: 75, status: 'In Stock' },
        { userId, name: 'Green Apples', price: 3.49, stock: 5, status: 'Low Stock' },
        { userId, name: 'Carrots', price: 1.99, stock: 0, status: 'Out of Stock' },
        { userId, name: 'Bell Peppers', price: 5.99, stock: 120, status: 'In Stock' },
      ];

      for (const product of sampleProducts) {
        await storeHelpers.createProduct(product);
      }

      // Create sample analytics data
      const today = new Date();
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        await storeHelpers.recordMetric(userId, 'revenue', Math.floor(Math.random() * 1000) + 500, date.toISOString());
        await storeHelpers.recordMetric(userId, 'orders', Math.floor(Math.random() * 50) + 20, date.toISOString());
        await storeHelpers.recordMetric(userId, 'customers', Math.floor(Math.random() * 30) + 10, date.toISOString());
      }
    } catch (error) {
      console.error('Failed to seed initial data:', error);
    }
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