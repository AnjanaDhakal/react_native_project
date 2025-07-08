import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Home, ShoppingCart, BarChart3, User, Plus } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          if (!isFocused) {
            navigation.navigate(route.name);
          }
        };

        const color = isFocused ? Colors.primary : Colors.tabInactive;

        // Custom middle button
        if (route.name === 'create') {
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              onPress={onPress}
              style={styles.middleButtonContainer}
              activeOpacity={0.8}
            >
              <View style={styles.middleButton}>
                <Plus size={24} color="#fff" />
              </View>
            </TouchableOpacity>
          );
        }

        // Icons for other tabs
        let IconComponent;
        switch (route.name) {
          case 'index':
            IconComponent = Home;
            break;
          case 'orders':
            IconComponent = ShoppingCart;
            break;
          case 'analytics':
            IconComponent = BarChart3;
            break;
          case 'profile':
            IconComponent = User;
            break;
        }

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            onPress={onPress}
            style={styles.tabItem}
          >
            {IconComponent && <IconComponent size={22} color={color} />}
            <Text style={{ color, fontSize: 12, marginTop: 2 }}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.tabBackground,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 80,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  middleButtonContainer: {
    top: -20,
  },
  middleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    borderColor:'white'
  },
});
