import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

export default function Home() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="flex-1 justify-center items-center px-6 py-12">
        {/* Header */}
        <View className="bg-blue-600 rounded-2xl p-8 mb-8 w-full">
          <Text className="text-3xl font-bold text-white text-center mb-2">
            Welcome!
          </Text>
          <Text className="text-blue-100 text-center text-lg">
            Simple React Native App with Tailwind CSS
          </Text>
        </View>

        {/* Feature Cards */}
        <View className="w-full space-y-4 mb-8">
          <View className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <Text className="text-xl font-semibold text-gray-800 mb-2">
              🎨 Tailwind CSS
            </Text>
            <Text className="text-gray-600">
              Utility-first CSS framework for rapid UI development
            </Text>
          </View>

          <View className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <Text className="text-xl font-semibold text-gray-800 mb-2">
              📱 React Native
            </Text>
            <Text className="text-gray-600">
              Build native mobile apps using React
            </Text>
          </View>

          <View className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <Text className="text-xl font-semibold text-gray-800 mb-2">
              🚀 Expo Router
            </Text>
            <Text className="text-gray-600">
              File-based routing for React Native apps
            </Text>
          </View>
        </View>

        {/* Buttons */}
        <View className="w-full space-y-3">
          <TouchableOpacity className="bg-blue-600 rounded-xl py-4 px-6">
            <Text className="text-white text-center font-semibold text-lg">
              Get Started
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-gray-200 rounded-xl py-4 px-6">
            <Text className="text-gray-800 text-center font-semibold text-lg">
              Learn More
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="mt-12 pt-8 border-t border-gray-200 w-full">
          <Text className="text-gray-500 text-center">
            Built with ❤️ using React Native & Tailwind CSS
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}