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

    if (!username.trim()) {
      errors.username = 'El nombre de usuario es obligatorio';
    } else if (username.trim().length < 3) {
      errors.username = 'Mínimo 3 caracteres';
    }

    if (!email.trim()) {
      errors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Email no válido';
    }

    if (!password) {
      errors.password = 'La contraseña es obligatoria';
    } else if (password.length < 4) {
      errors.password = 'Mínimo 4 caracteres';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirma tu contraseña';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

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
        fechaNacimiento: fechaNacimiento.trim(),
      });
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
            {/* ─── Logo ─── */}
            <Image
              source={logo}
              style={{ width: 64, height: 64, marginBottom: 8 }}
              resizeMode="contain"
            />
            <Text className="text-spotify-white text-2xl font-bold mb-1">
              Crear Cuenta
            </Text>
            <Text className="text-spotify-gray text-base mb-8">
              Únete a Spotify gratis
            </Text>

            {/* ─── Error global ─── */}
            {error && (
              <View className="w-full bg-red-900/30 border border-red-500/40 rounded-lg px-4 py-3 mb-4 flex-row items-center">
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

              <SpotifyInput
                label="Contraseña"
                icon="lock-closed-outline"
                placeholder="Mínimo 4 caracteres"
                value={password}
                onChangeText={(t) => { setPassword(t); clearField('password'); }}
                error={fieldErrors.password}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                textContentType="newPassword"
                editable={!isLoading}
                rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                onRightIconPress={() => setShowPassword(!showPassword)}
              />

              <SpotifyInput
                label="Confirmar Contraseña"
                icon="lock-closed-outline"
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChangeText={(t) => { setConfirmPassword(t); clearField('confirmPassword'); }}
                error={fieldErrors.confirmPassword}
                secureTextEntry={!showConfirm}
                autoCapitalize="none"
                textContentType="newPassword"
                editable={!isLoading}
                rightIcon={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                onRightIconPress={() => setShowConfirm(!showConfirm)}
              />

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
            <View className="w-full mt-2">
              <SpotifyButton
                title="Crear Cuenta"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                onPress={handleRegister}
              />
            </View>

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
