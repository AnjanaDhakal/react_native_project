import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert } from 'react-native';

class FirebaseService {
  constructor() {
    this.fcmToken = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      // Request permission for iOS
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
          console.log('Push notification permission denied');
          return false;
        }
      }

      // Get FCM token
      await this.getFCMToken();

      // Set up message handlers
      this.setupMessageHandlers();

      // Listen for token refresh
      this.setupTokenRefreshListener();

      this.isInitialized = true;
      console.log('Firebase service initialized successfully');
      return true;
    } catch (error) {
      console.error('Firebase initialization failed:', error);
      return false;
    }
  }

  async getFCMToken() {
    try {
      // Check if we have a cached token
      const cachedToken = await AsyncStorage.getItem('fcm_token');
      
      // Get current token from Firebase
      const token = await messaging().getToken();
      
      if (token) {
        this.fcmToken = token;
        
        // Cache the token if it's different
        if (cachedToken !== token) {
          await AsyncStorage.setItem('fcm_token', token);
          console.log('FCM Token updated:', token);
          
          // Send token to your server here
          await this.sendTokenToServer(token);
        }
        
        return token;
      } else {
        console.log('Failed to get FCM token');
        return null;
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  async sendTokenToServer(token) {
    try {
      // Replace with your server endpoint
      const response = await fetch('https://your-api.com/api/fcm-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_AUTH_TOKEN', // Add your auth token
        },
        body: JSON.stringify({
          token: token,
          platform: Platform.OS,
          userId: 'USER_ID', // Replace with actual user ID
        }),
      });

      if (response.ok) {
        console.log('FCM token sent to server successfully');
      } else {
        console.error('Failed to send FCM token to server');
      }
    } catch (error) {
      console.error('Error sending FCM token to server:', error);
    }
  }

  setupMessageHandlers() {
    // Handle background messages
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    // Handle foreground messages
    messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);
      
      // Show alert for foreground messages
      if (remoteMessage.notification) {
        Alert.alert(
          remoteMessage.notification.title || 'Notification',
          remoteMessage.notification.body || 'You have a new message',
          [{ text: 'OK' }]
        );
      }
    });

    // Handle notification opened app
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      
      // Navigate to specific screen based on notification data
      this.handleNotificationNavigation(remoteMessage);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          
          // Navigate to specific screen based on notification data
          this.handleNotificationNavigation(remoteMessage);
        }
      });
  }

  setupTokenRefreshListener() {
    // Listen to whether the token changes
    messaging().onTokenRefresh(token => {
      console.log('FCM token refreshed:', token);
      this.fcmToken = token;
      AsyncStorage.setItem('fcm_token', token);
      this.sendTokenToServer(token);
    });
  }

  handleNotificationNavigation(remoteMessage) {
    // Implement navigation logic based on notification data
    if (remoteMessage.data) {
      const { screen, orderId, productId } = remoteMessage.data;
      
      // Example navigation logic
      switch (screen) {
        case 'orders':
          // Navigate to orders screen
          console.log('Navigate to orders screen');
          break;
        case 'order_detail':
          // Navigate to specific order
          console.log('Navigate to order detail:', orderId);
          break;
        case 'products':
          // Navigate to products screen
          console.log('Navigate to products screen');
          break;
        default:
          // Navigate to home screen
          console.log('Navigate to home screen');
          break;
      }
    }
  }

  async deleteToken() {
    try {
      await messaging().deleteToken();
      await AsyncStorage.removeItem('fcm_token');
      this.fcmToken = null;
      console.log('FCM token deleted successfully');
    } catch (error) {
      console.error('Error deleting FCM token:', error);
    }
  }

  getCurrentToken() {
    return this.fcmToken;
  }

  async getCachedToken() {
    try {
      return await AsyncStorage.getItem('fcm_token');
    } catch (error) {
      console.error('Error getting cached token:', error);
      return null;
    }
  }

  isServiceInitialized() {
    return this.isInitialized;
  }
}

export default new FirebaseService();