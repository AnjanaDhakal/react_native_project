import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { User, Building, Mail, Settings, Bell, CircleHelp as HelpCircle, Shield, LogOut, ChevronRight } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/login');
          }
        },
      ]
    );
  };

  const menuItems = [
    { icon: Settings, label: 'Account Settings', color: '#6b7280' },
    { icon: Bell, label: 'Notifications', color: '#6b7280' },
    { icon: Shield, label: 'Privacy & Security', color: '#6b7280' },
    { icon: HelpCircle, label: 'Help & Support', color: '#6b7280' },
  ];

  return (
    <ScrollView className="flex-1 bg-green-50">
      <View className="px-6 pt-12 pb-6">
        <Text className="text-3xl font-bold text-green-800 mb-8">Profile</Text>
        
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <View className="items-center mb-6">
            <View className="bg-green-50 rounded-full w-20 h-20 justify-center items-center mb-4">
              <User size={32} color={Colors.primary} />
            </View>
            <Text className="text-2xl font-bold text-gray-800 mb-1">{user?.name}</Text>
            <Text className="text-base font-medium text-green-600 mb-1">{user?.businessName}</Text>
            <Text className="text-sm text-gray-500">{user?.email}</Text>
          </View>
          
          <View className="space-y-4">
            <View className="flex-row items-center">
              <Building size={20} color="#6b7280" />
              <Text className="ml-3 text-sm text-gray-600">Business Owner</Text>
            </View>
            <View className="flex-row items-center">
              <Mail size={20} color="#6b7280" />
              <Text className="ml-3 text-sm text-gray-600">Verified Email</Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-2xl mb-6 shadow-sm">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className={`flex-row items-center justify-between p-4 ${
                index < menuItems.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <View className="flex-row items-center">
                <item.icon size={20} color="#6b7280" />
                <Text className="ml-3 text-base font-medium text-gray-800">{item.label}</Text>
              </View>
              <ChevronRight size={20} color="#6b7280" />
            </TouchableOpacity>
          ))}
        </View>

        <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-800">Quick Stats</Text>
          </View>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600 mb-1">156</Text>
              <Text className="text-sm text-gray-600">Products</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-600 mb-1">89</Text>
              <Text className="text-sm text-gray-600">Orders</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-500 mb-1">4.8</Text>
              <Text className="text-sm text-gray-600">Rating</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          className="bg-red-600 rounded-2xl p-4 flex-row items-center justify-center shadow-sm"
          onPress={handleLogout}
        >
          <LogOut size={20} color="white" />
          <Text className="text-white font-semibold text-lg ml-2">Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}