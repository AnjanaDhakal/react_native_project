import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { StoreProvider } from '@/context/StoreContext';
import { AuthProvider } from '@/context/AuthContext';
import { TodoProvider } from '@/context/TodoContext';
import '../global.css';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <StoreProvider>
      <AuthProvider>
        <TodoProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="+not-found" />
            <Stack.Screen name="(main)/dashboard" />
            <Stack.Screen name="(main)/scanner" />
          </Stack>
          <StatusBar style="auto" />
        </TodoProvider>
      </AuthProvider>
    </StoreProvider>
  );
}