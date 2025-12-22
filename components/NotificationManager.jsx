import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Bell, X, CheckCircle, Clock } from 'lucide-react-native';
import { useNotifications } from '@/context/NotificationContext';
import { Colors } from '@/constants/Colors';

export default function NotificationManager({ visible, onClose }) {
  const {
    notifications,
    markAsRead,
    clearNotifications,
    getUnreadCount,
    fcmToken,
    notificationPermission,
    requestPermission,
  } = useNotifications();

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationPress = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  if (notificationPermission === 'denied') {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
        <View className="flex-1 bg-green-50">
          <View className="flex-row justify-between items-center px-6 pt-15 pb-5 border-b border-gray-200">
            <Text className="text-2xl font-bold text-gray-800">Notifications</Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View className="flex-1 justify-center items-center px-6">
            <Bell size={64} color="#9ca3af" />
            <Text className="text-xl font-bold text-gray-800 mt-4 mb-2">
              Enable Notifications
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              Stay updated with important information about your orders and business.
            </Text>
            <TouchableOpacity
              className="bg-green-600 px-6 py-3 rounded-xl"
              onPress={requestPermission}
            >
              <Text className="text-white font-semibold">Enable Notifications</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-green-50">
        <View className="flex-row justify-between items-center px-6 pt-15 pb-5 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-800">
            Notifications {getUnreadCount() > 0 && `(${getUnreadCount()})`}
          </Text>
          <View className="flex-row items-center">
            {notifications.length > 0 && (
              <TouchableOpacity
                onPress={clearNotifications}
                className="mr-4 px-3 py-1 bg-gray-200 rounded-lg"
              >
                <Text className="text-gray-600 text-sm">Clear All</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onClose} className="p-2">
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* FCM Token Display (for development) */}
        {__DEV__ && fcmToken && (
          <View className="bg-blue-50 p-4 mx-6 mt-4 rounded-lg">
            <Text className="text-sm font-semibold text-blue-800 mb-1">
              FCM Token (Development):
            </Text>
            <Text className="text-xs text-blue-600 font-mono" selectable>
              {fcmToken}
            </Text>
          </View>
        )}

        <ScrollView className="flex-1 px-6">
          {notifications.length === 0 ? (
            <View className="flex-1 justify-center items-center py-16">
              <Bell size={48} color="#9ca3af" />
              <Text className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                No notifications yet
              </Text>
              <Text className="text-gray-600 text-center">
                You'll see important updates and messages here
              </Text>
            </View>
          ) : (
            <View className="py-4">
              {notifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  className={`bg-white rounded-2xl p-4 mb-3 shadow-sm ${
                    !notification.read ? 'border-l-4 border-green-500' : ''
                  }`}
                  onPress={() => handleNotificationPress(notification)}
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <Text className={`text-base font-semibold flex-1 mr-2 ${
                      notification.read ? 'text-gray-600' : 'text-gray-800'
                    }`}>
                      {notification.title || 'Notification'}
                    </Text>
                    <View className="flex-row items-center">
                      {!notification.read && (
                        <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      )}
                      <Clock size={14} color="#9ca3af" />
                      <Text className="text-xs text-gray-500 ml-1">
                        {formatTime(notification.timestamp)}
                      </Text>
                    </View>
                  </View>
                  
                  {notification.body && (
                    <Text className={`text-sm leading-5 ${
                      notification.read ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      {notification.body}
                    </Text>
                  )}

                  {notification.data && (
                    <View className="mt-2 pt-2 border-t border-gray-100">
                      <Text className="text-xs text-gray-400">
                        Additional data: {JSON.stringify(notification.data)}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}