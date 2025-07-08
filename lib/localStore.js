import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LocalStore {
  constructor() {
    this.db = null;
    this.isReady = false;
    this.listeners = new Map();
  }

  async initialize() {
    try {
      this.db = await SQLite.openDatabaseAsync('vendor_app.db');
      
      // Create tables
      await this.createTables();
      this.isReady = true;
      
      console.log('Local store initialized successfully');
    } catch (error) {
      console.error('Failed to initialize local store:', error);
      throw error;
    }
  }

  async createTables() {
    const tables = [
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        name TEXT,
        businessName TEXT,
        createdAt INTEGER,
        updatedAt INTEGER
      )`,
      `CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        userId TEXT,
        customer TEXT,
        amount REAL,
        status TEXT,
        date TEXT,
        items INTEGER,
        createdAt INTEGER,
        updatedAt INTEGER,
        FOREIGN KEY (userId) REFERENCES users (id)
      )`,
      `CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        userId TEXT,
        name TEXT,
        price REAL,
        stock INTEGER,
        status TEXT,
        createdAt INTEGER,
        updatedAt INTEGER,
        FOREIGN KEY (userId) REFERENCES users (id)
      )`,
      `CREATE TABLE IF NOT EXISTS analytics (
        id TEXT PRIMARY KEY,
        userId TEXT,
        metric TEXT,
        value REAL,
        date TEXT,
        createdAt INTEGER,
        updatedAt INTEGER,
        FOREIGN KEY (userId) REFERENCES users (id)
      )`
    ];

    for (const table of tables) {
      await this.db.execAsync(table);
    }
  }

  // Generic CRUD operations
  async put(table, data) {
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);

    const query = `INSERT OR REPLACE INTO ${table} (${columns}) VALUES (${placeholders})`;
    await this.db.runAsync(query, values);
    
    this.notifyListeners(table, 'put', data);
    return data;
  }

  async get(table, id) {
    const query = `SELECT * FROM ${table} WHERE id = ?`;
    const result = await this.db.getFirstAsync(query, [id]);
    return result;
  }

  async query(table, options = {}) {
    let query = `SELECT * FROM ${table}`;
    const params = [];

    if (options.where) {
      const conditions = Object.entries(options.where)
        .map(([key, value]) => {
          params.push(value);
          return `${key} = ?`;
        })
        .join(' AND ');
      query += ` WHERE ${conditions}`;
    }

    if (options.orderBy) {
      query += ` ORDER BY ${options.orderBy}`;
    }

    if (options.limit) {
      query += ` LIMIT ${options.limit}`;
    }

    const results = await this.db.getAllAsync(query, params);
    return results || [];
  }

  async delete(table, id) {
    const query = `DELETE FROM ${table} WHERE id = ?`;
    await this.db.runAsync(query, [id]);
    this.notifyListeners(table, 'delete', { id });
  }

  // Event system for reactive updates
  subscribe(table, callback) {
    if (!this.listeners.has(table)) {
      this.listeners.set(table, new Set());
    }
    this.listeners.get(table).add(callback);

    // Return unsubscribe function
    return () => {
      const tableListeners = this.listeners.get(table);
      if (tableListeners) {
        tableListeners.delete(callback);
      }
    };
  }

  notifyListeners(table, action, data) {
    const tableListeners = this.listeners.get(table);
    if (tableListeners) {
      tableListeners.forEach(callback => {
        try {
          callback({ action, data, table });
        } catch (error) {
          console.error('Listener error:', error);
        }
      });
    }
  }

  // Sync status simulation
  getSyncStatus() {
    return 'offline'; // Always offline for local-first
  }
}

// Create singleton instance
export const store = new LocalStore();

// Initialize the store
export const initializeStore = async () => {
  await store.initialize();
};

// Helper functions for common operations
export const storeHelpers = {
  // User operations
  async createUser(userData) {
    const user = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...orderData,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    await store.put('orders', order);
    return order;
  },

  async getOrdersByUser(userId) {
    return await store.query('orders', {
      where: { userId },
      orderBy: 'createdAt DESC'
    });
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
      id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...productData,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    await store.put('products', product);
    return product;
  },

  async getProductsByUser(userId) {
    return await store.query('products', {
      where: { userId },
      orderBy: 'createdAt DESC'
    });
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
      id: `analytics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
    const query = { 
      where: { userId },
      orderBy: 'createdAt DESC'
    };
    if (metric) {
      query.where.metric = metric;
    }
    return await store.query('analytics', query);
  }
};