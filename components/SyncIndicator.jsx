import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Wifi, WifiOff, RotateCw } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useStoreContext } from '@/context/StoreContext';

export default function SyncIndicator() {
  const { syncStatus } = useStoreContext();

  const getStatusConfig = () => {
    switch (syncStatus) {
      case 'online':
        return {
          icon: Wifi,
          color: Colors.success,
          text: 'Online',
          backgroundColor: Colors.background
        };
      case 'syncing':
        return {
          icon: RotateCw,
          color: Colors.info,
          text: 'Syncing...',
          backgroundColor: '#dbeafe'
        };
      case 'offline':
      default:
        return {
          icon: WifiOff,
          color: Colors.text.secondary,
          text: 'Offline',
          backgroundColor: Colors.divider
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <View style={[styles.container, { backgroundColor: config.backgroundColor }]}>
      <IconComponent size={12} color={config.color} />
      <Text style={[styles.text, { color: config.color }]}>{config.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 10,
    fontWeight: '500',
    marginLeft: 4,
  },
});