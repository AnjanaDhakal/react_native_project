import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, User, Building, Eye, EyeOff } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !name || !businessName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const result = await register(email, password, name, businessName);
      if (result.success) {
        router.replace('/(tabs)');
      }
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
        <ScrollView
    className="bg-green-50 px-6 py-12"
    contentContainerStyle={{ flex: 1 }}
    keyboardShouldPersistTaps="handled"
  >
    <View className="flex-1 justify-center">
        <View style={styles.formCard}>
          <Text style={styles.title}>
            Create Account
          </Text>
          <Text style={styles.subtitle}>
            Join our vendor platform
          </Text>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <User style={styles.inputIcon} size={20} color={Colors.primary} />
              <TextInput
                style={styles.textInput}
                placeholder="Full name"
                placeholderTextColor={Colors.text.secondary}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Building style={styles.inputIcon} size={20} color={Colors.primary} />
              <TextInput
                style={styles.textInput}
                placeholder="Business name"
                placeholderTextColor={Colors.text.secondary}
                value={businessName}
                onChangeText={setBusinessName}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Mail style={styles.inputIcon} size={20} color={Colors.primary} />
              <TextInput
                style={styles.textInput}
                placeholder="Email address"
                placeholderTextColor={Colors.text.secondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Lock style={styles.inputIcon} size={20} color={Colors.primary} />
              <TextInput
                style={[styles.textInput, styles.passwordInput]}
                placeholder="Password (min. 6 characters)"
                placeholderTextColor={Colors.text.secondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color={Colors.primary} />
                ) : (
                  <Eye size={20} color={Colors.primary} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginPrompt}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.green.medium,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    top: 12,
    zIndex: 1,
  },
  textInput: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.green.light,
    borderRadius: 12,
    paddingLeft: 44,
    paddingRight: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text.primary,
  },
  passwordInput: {
    paddingRight: 44,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  registerButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 24,
  },
  registerButtonDisabled: {
    opacity: 0.5,
  },
  registerButtonText: {
    color: Colors.text.onPrimary,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: Colors.text.secondary,
  },
  loginLink: {
    color: Colors.primary,
    fontWeight: '600',
  },
});