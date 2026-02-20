import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SpotifyInput from '../../src/components/ui/SpotifyInput';
import SpotifyButton from '../../src/components/ui/SpotifyButton';
import { useAuth } from '../../src/hooks/useAuth';

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  fechaNacimiento?: string;
}

const RegisterScreen = () => {
  const { register, isLoading, error, clearError } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const clearField = (field: keyof FormErrors) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const errors: FormErrors = {};

    // Username
    if (!username.trim()) {
      errors.username = 'El nombre de usuario es obligatorio';
    } else if (username.trim().length < 3) {
      errors.username = 'Mínimo 3 caracteres';
    }

    // Email
    if (!email.trim()) {
      errors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Email no válido';
    }

    // Password
    if (!password) {
      errors.password = 'La contraseña es obligatoria';
    } else if (password.length < 4) {
      errors.password = 'Mínimo 4 caracteres';
    }

    // Confirm password
    if (!confirmPassword) {
      errors.confirmPassword = 'Confirma tu contraseña';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Fecha nacimiento (formato YYYY-MM-DD)
    if (!fechaNacimiento.trim()) {
      errors.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaNacimiento.trim())) {
      errors.fechaNacimiento = 'Formato: AAAA-MM-DD (ej: 2000-01-15)';
    } else {
      const date = new Date(fechaNacimiento.trim());
      if (isNaN(date.getTime())) {
        errors.fechaNacimiento = 'Fecha no válida';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    clearError();
    if (!validate()) return;

    try {
      await register({
        username: username.trim(),
        email: email.trim(),
        password,
        fecha_nacimiento: fechaNacimiento.trim(),
      });
      // Auto-login: el store ya guarda el usuario, redirigir a la app
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
          <View className="flex-1 items-center justify-center px-8 py-6">
            {/* ─── Cabecera ─── */}
            <Ionicons name="musical-notes" size={48} color="#1DB954" />
            <Text className="text-spotify-white text-2xl font-bold mt-2 mb-1">
              Crear Cuenta
            </Text>
            <Text className="text-spotify-gray text-base mb-8">
              Únete a Spotify gratis
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
                label="Nombre de usuario"
                icon="person-outline"
                placeholder="ej: santiago_23"
                value={username}
                onChangeText={(t) => { setUsername(t); clearField('username'); }}
                error={fieldErrors.username}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />

              <SpotifyInput
                label="Email"
                icon="mail-outline"
                placeholder="tu@email.com"
                value={email}
                onChangeText={(t) => { setEmail(t); clearField('email'); }}
                error={fieldErrors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                editable={!isLoading}
              />

              {/* Password con toggle */}
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
                      placeholder="Mínimo 4 caracteres"
                      value={password}
                      onChangeText={(t) => { setPassword(t); clearField('password'); }}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      textContentType="newPassword"
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

              {/* Confirmar password */}
              <View className="w-full mb-4">
                <Text className="text-spotify-white text-sm font-semibold mb-2">
                  Confirmar Contraseña
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
                      placeholder="Repite tu contraseña"
                      value={confirmPassword}
                      onChangeText={(t) => { setConfirmPassword(t); clearField('confirmPassword'); }}
                      secureTextEntry={!showConfirm}
                      autoCapitalize="none"
                      textContentType="newPassword"
                      editable={!isLoading}
                    />
                  </View>
                  <Pressable onPress={() => setShowConfirm(!showConfirm)} hitSlop={8}>
                    <Ionicons
                      name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                      size={22}
                      color="#B3B3B3"
                    />
                  </Pressable>
                </View>
                {fieldErrors.confirmPassword && (
                  <Text className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</Text>
                )}
              </View>

              <SpotifyInput
                label="Fecha de nacimiento"
                icon="calendar-outline"
                placeholder="AAAA-MM-DD (ej: 2000-01-15)"
                value={fechaNacimiento}
                onChangeText={(t) => { setFechaNacimiento(t); clearField('fechaNacimiento'); }}
                error={fieldErrors.fechaNacimiento}
                keyboardType="numeric"
                editable={!isLoading}
              />
            </View>

            {/* ─── Botón Registro ─── */}
            <SpotifyButton
              title="Crear Cuenta"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              onPress={handleRegister}
            />

            {/* ─── Link a login ─── */}
            <View className="flex-row mt-8">
              <Text className="text-spotify-gray text-sm">¿Ya tienes cuenta? </Text>
              <Link href="/(auth)/login" asChild>
                <Pressable>
                  <Text className="text-spotify-green text-sm font-bold">Inicia sesión</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
