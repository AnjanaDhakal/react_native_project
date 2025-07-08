import React from 'react';
import { Tabs } from 'expo-router';
import CustomTabBar from '@/components/CustomTabBar';

export default function TabLayout() {
  return (
<Tabs tabBar={(props) => <CustomTabBar {...props} />}>
  <Tabs.Screen
    name="index"
    options={{ headerShown: false, tabBarLabel: 'Home' }}
  />
  <Tabs.Screen
    name="orders"
    options={{ headerShown: false, tabBarLabel: 'My Parcels' }}
  />
  <Tabs.Screen
    name="create"
    options={{ headerShown: false, tabBarLabel: 'Create' }}
  />
  <Tabs.Screen
    name="analytics"
    options={{ headerShown: false, tabBarLabel: 'Analytics' }}
  />
  <Tabs.Screen
    name="profile"
    options={{ headerShown: false, tabBarLabel: 'Profile' }}
  />
</Tabs>

  );
}
