import React from 'react';
import { View, Text } from 'react-native';
import { Database } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useStoreContext } from '@/context/StoreContext';

export default function SyncIndicator() {
  const { syncStatus, isStoreReady } = useStoreContext();

  if (!isStoreReady) {
    return null;
  }

  return (
    <View className="flex-row items-center px-2 py-1 rounded-xl bg-green-50">
      <Database size={12} color={Colors.success} />
      <Text className="text-xs font-medium ml-1 text-green-600">Local</Text>
    </View>
  );
}