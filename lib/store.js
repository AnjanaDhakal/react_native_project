import { createStore } from '@livestore/core';
import { SQLiteAdapter } from '@livestore/expo-sqlite';

// Define schemas for our data
const schemas = {
  users: {
    id: 'string',
    email: 'string',
    name: 'string',
    businessName: 'string',
    createdAt: 'number',
    updatedAt: 'number'
  },
  orders: {
    id: 'string',
    userId: 'string',
    customer: 'string',
    amount: 'number',
    status: 'string',
    date: 'string',
    items: 'number',
    createdAt: 'number',
    updatedAt: 'number'
  },
  products: {
    id: 'string',
    userId: 'string',
    name: 'string',
    price: 'number',
    stock: 'number',
    status: 'string',
    createdAt: 'number',
    updatedAt: 'number'
  },
  analytics: {
    id: 'string',
    userId: 'string',
    metric: 'string',
    value: 'number',
    date: 'string',
    createdAt: 'number',
    updatedAt: 'number'
  }
};

// Create the store with SQLite adapter
export const store = createStore({
  adapter: new SQLiteAdapter({
    databaseName: 'vendor_app.db',
    schemas
  }),
  syncUrl: process.env.EXPO_PUBLIC_SYNC_URL || null, // Optional sync server
});

// Initialize the store
export const initializeStore = async () => {
  try {
    await store.initialize();
    console.log('Store initialized successfully');
  } catch (error) {
    console.error('Failed to initialize store:', error);
  }
};

// Helper functions for common operations
export const storeHelpers = {
  // User operations
  async createUser(userData) {
    const user = {
      id: `user_${Date.now()}`,
      ...userData,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    await store.put('users', user);
    return user;
  },

  async getUser(id) {
    return await store.get('users', id);
  },

  async updateUser(id, updates) {
    const user = await store.get('users', id);
    if (user) {
      const updatedUser = {
        ...user,
        ...updates,
        updatedAt: Date.now()
      };
      await store.put('users', updatedUser);
      return updatedUser;
    }
    return null;
  },

  // Order operations
  async createOrder(orderData) {
    const order = {
      id: `order_${Date.now()}`,
      ...orderData,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    await store.put('orders', order);
    return order;
  },

  async getOrdersByUser(userId) {
    const allOrders = await store.query('orders', {
      where: { userId }
    });
    return allOrders;
  },

  async updateOrderStatus(orderId, status) {
    const order = await store.get('orders', orderId);
    if (order) {
      const updatedOrder = {
        ...order,
        status,
        updatedAt: Date.now()
      };
      await store.put('orders', updatedOrder);
      return updatedOrder;
    }
    return null;
  },

  // Product operations
  async createProduct(productData) {
    const product = {
      id: `product_${Date.now()}`,
      ...productData,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    await store.put('products', product);
    return product;
  },

  async getProductsByUser(userId) {
    const allProducts = await store.query('products', {
      where: { userId }
    });
    return allProducts;
  },

  async updateProductStock(productId, stock) {
    const product = await store.get('products', productId);
    if (product) {
      const updatedProduct = {
        ...product,
        stock,
        status: stock === 0 ? 'Out of Stock' : stock < 10 ? 'Low Stock' : 'In Stock',
        updatedAt: Date.now()
      };
      await store.put('products', updatedProduct);
      return updatedProduct;
    }
    return null;
  },

  // Analytics operations
  async recordMetric(userId, metric, value, date = new Date().toISOString()) {
    const analyticsEntry = {
      id: `analytics_${Date.now()}`,
      userId,
      metric,
      value,
      date,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    await store.put('analytics', analyticsEntry);
    return analyticsEntry;
  },

  async getAnalyticsByUser(userId, metric = null) {
    const query = { where: { userId } };
    if (metric) {
      query.where.metric = metric;
    }
    return await store.query('analytics', query);
  }
};