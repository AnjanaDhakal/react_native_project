import { Link, Stack } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { Home } from 'lucide-react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 justify-center items-center bg-green-50 px-6">
        <Text className="text-6xl font-bold text-green-800 mb-4">404</Text>
        <Text className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</Text>
        <Text className="text-gray-600 text-center mb-8">
          The page you're looking for doesn't exist.
        </Text>
        <Link href="/" asChild>
          <TouchableOpacity className="bg-green-600 rounded-lg px-6 py-3 flex-row items-center">
            <Home size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Go to Home</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}