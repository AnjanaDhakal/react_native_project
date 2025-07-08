import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Database } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useStoreContext } from '@/context/StoreContext';

export default function SyncIndicator() {
  const { syncStatus, isStoreReady } = useStoreContext();

  if (!isStoreReady) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Database size={12} color={Colors.success} />
      <Text style={styles.text}>Local</Text>
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
    backgroundColor: Colors.background,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 10,
    fontWeight: '500',
    marginLeft: 4,
    color: Colors.success,
  },
});