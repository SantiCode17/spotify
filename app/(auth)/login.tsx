import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SpotifyInput from '../../src/components/ui/SpotifyInput';
import SpotifyButton from '../../src/components/ui/SpotifyButton';
import { useAuth } from '../../src/hooks/useAuth';

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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 items-center justify-center px-8">
            {/* ─── Logo ─── */}
            <Ionicons name="musical-notes" size={60} color="#1DB954" />
            <Text className="text-spotify-white text-3xl font-bold mt-3 mb-1">
              Spotify
            </Text>
            <Text className="text-spotify-gray text-base mb-10">
              Inicia sesión para continuar
            </Text>

            {/* ─── Error global ─── */}
            {error && (
              <View className="w-full bg-red-900/40 border border-red-500/50 rounded-lg px-4 py-3 mb-5 flex-row items-center">
                <Ionicons name="alert-circle" size={18} color="#ef4444" />
                <Text className="text-red-400 text-sm ml-2 flex-1">{error}</Text>
                <Pressable onPress={clearError} hitSlop={8}>
                  <Ionicons name="close" size={16} color="#ef4444" />
                </Pressable>
              </View>
            )}

            {/* ─── Formulario ─── */}
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

              <View className="w-full mb-4">
                <Text className="text-spotify-white text-sm font-semibold mb-2">
                  Contraseña
                </Text>
                <View className="flex-row items-center bg-spotify-darker rounded-lg px-4 py-3">
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#B3B3B3"
                    style={{ marginRight: 10 }}
                  />
                  <View className="flex-1">
                    <SpotifyInput
                      placeholder="Tu contraseña"
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        if (fieldErrors.password)
                          setFieldErrors((p) => ({ ...p, password: undefined }));
                      }}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      textContentType="password"
                      returnKeyType="done"
                      onSubmitEditing={handleLogin}
                      editable={!isLoading}
                    />
                  </View>
                  <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={22}
                      color="#B3B3B3"
                    />
                  </Pressable>
                </View>
                {fieldErrors.password && (
                  <Text className="text-red-500 text-xs mt-1">{fieldErrors.password}</Text>
                )}
              </View>
            </View>

            {/* ─── Botón Login ─── */}
            <SpotifyButton
              title="Iniciar Sesión"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              onPress={handleLogin}
            />

            {/* ─── Link a registro ─── */}
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
