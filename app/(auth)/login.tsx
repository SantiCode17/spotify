import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SpotifyInput from '../../src/components/ui/SpotifyInput';
import SpotifyButton from '../../src/components/ui/SpotifyButton';
import { useAuth } from '../../src/hooks/useAuth';

const logo = require('../../assets/images/Spotify-logo_sinfondo.png');

const LoginScreen = () => {
  const { login, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Email no válido';
    }

    if (!password.trim()) {
      errors.password = 'La contraseña es obligatoria';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    clearError();
    if (!validate()) return;

    try {
      await login({ email: email.trim(), password: password.trim() });
      router.replace('/(app)/(tabs)');
    } catch {
      // El error se muestra desde el hook
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-spotify-black">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center px-8">
            {/* Logo */}
            <Image
              source={logo}
              style={{ width: 80, height: 80, marginBottom: 12 }}
              resizeMode="contain"
            />
            <Text className="text-spotify-white text-3xl font-bold mb-1">
              Spotify
            </Text>
            <Text className="text-spotify-gray text-base mb-10">
              Inicia sesión para continuar
            </Text>

            {/* Error global */}
            {error && (
              <View className="w-full bg-red-900/30 border border-red-500/40 rounded-lg px-4 py-3 mb-4 flex-row items-center">
                <Ionicons name="alert-circle" size={18} color="#ef4444" />
                <Text className="text-red-400 text-sm ml-2 flex-1">{error}</Text>
                <Pressable onPress={clearError} hitSlop={8}>
                  <Ionicons name="close" size={16} color="#ef4444" />
                </Pressable>
              </View>
            )}

            {/* Formulario */}
            <View className="w-full">
              <SpotifyInput
                label="Email"
                icon="mail-outline"
                placeholder="tu@email.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
                }}
                error={fieldErrors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                returnKeyType="next"
                editable={!isLoading}
              />

              <SpotifyInput
                label="Contraseña"
                icon="lock-closed-outline"
                placeholder="Tu contraseña"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
                }}
                error={fieldErrors.password}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                textContentType="password"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                editable={!isLoading}
                rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                onRightIconPress={() => setShowPassword(!showPassword)}
              />
            </View>

            {/* Boton Login */}
            <View className="w-full mt-2">
              <SpotifyButton
                title="Iniciar Sesión"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                onPress={handleLogin}
              />
            </View>

            {/* Enlace a registro */}
            <View className="flex-row mt-8">
              <Text className="text-spotify-gray text-sm">¿No tienes cuenta? </Text>
              <Link href="/(auth)/register" asChild>
                <Pressable>
                  <Text className="text-spotify-green text-sm font-bold">Regístrate</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
