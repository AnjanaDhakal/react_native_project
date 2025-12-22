import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform, AppState } from 'react-native';
import FirebaseService from '@/services/FirebaseService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext({});

export function NotificationProvider({ children }) {
  const [fcmToken, setFcmToken] = useState(null);
  const [notificationPermission, setNotificationPermission] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    initializeNotifications();
    
    // Handle app state changes
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active' && isInitialized) {
        // Refresh token when app becomes active
        refreshFCMToken();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    // Re-initialize when user changes
    if (user && !isInitialized) {
      initializeNotifications();
    } else if (!user && isInitialized) {
      // Clean up when user logs out
      cleanup();
    }
  }, [user]);

  const initializeNotifications = async () => {
    try {
      console.log('Initializing Firebase notifications...');
      
      const success = await FirebaseService.initialize();
      
      if (success) {
        const token = await FirebaseService.getFCMToken();
        setFcmToken(token);
        setNotificationPermission('granted');
        setIsInitialized(true);
        
        console.log('Notifications initialized successfully');
        console.log('FCM Token:', token);
      } else {
        setNotificationPermission('denied');
        console.log('Failed to initialize notifications');
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
      setNotificationPermission('denied');
    }
  };

  const refreshFCMToken = async () => {
    try {
      const token = await FirebaseService.getFCMToken();
      if (token && token !== fcmToken) {
        setFcmToken(token);
        console.log('FCM Token refreshed:', token);
      }
    } catch (error) {
      console.error('Error refreshing FCM token:', error);
    }
  };

  const requestPermission = async () => {
    try {
      const success = await FirebaseService.initialize();
      
      if (success) {
        const token = await FirebaseService.getFCMToken();
        setFcmToken(token);
        setNotificationPermission('granted');
        setIsInitialized(true);
        return true;
      } else {
        setNotificationPermission('denied');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      setNotificationPermission('denied');
      return false;
    }
  };

  const cleanup = async () => {
    try {
      await FirebaseService.deleteToken();
      setFcmToken(null);
      setNotificationPermission(null);
      setIsInitialized(false);
      setNotifications([]);
    } catch (error) {
      console.error('Error cleaning up notifications:', error);
    }
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      ...notification,
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const getUnreadCount = () => {
    return notifications.filter(notification => !notification.read).length;
  };

  const value = {
    fcmToken,
    notificationPermission,
    isInitialized,
    notifications,
    initializeNotifications,
    requestPermission,
    refreshFCMToken,
    addNotification,
    markAsRead,
    clearNotifications,
    getUnreadCount,
    cleanup,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};