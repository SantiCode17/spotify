import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useAuthStore } from '../../src/store/authStore';
import { useUser, useUpdateUser, useUserPlan } from '../../src/hooks/useUser';
import SpotifyInput from '../../src/components/ui/SpotifyInput';
import SpotifyButton from '../../src/components/ui/SpotifyButton';
import ErrorState from '../../src/components/ui/ErrorState';
import { getCoverImage } from '../../src/utils/coverImages';
import { getInitials } from '../../src/utils/formatters';

const ProfileScreen = () => {
  const userId = useAuthStore((s) => s.userId);
  const { data: user, isLoading, isError, refetch } = useUser(userId);
  const { data: plan } = useUserPlan(userId);
  const updateMutation = useUpdateUser(userId);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [genero, setGenero] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username ?? '');
      setEmail(user.email ?? '');
      setGenero(user.genero ?? '');
      setCodigoPostal(user.codigoPostal ?? '');
    }
  }, [user]);

  const handleSave = () => {
    updateMutation.mutate(
      { username, email, genero, codigoPostal },
      {
        onSuccess: () => {
          Alert.alert('¡Éxito!', 'Perfil actualizado correctamente');
          setIsEditing(false);
        },
        onError: () => {
          Alert.alert('Error', 'No se pudo actualizar el perfil');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-spotify-black items-center justify-center">
        <ActivityIndicator size="large" color="#1DB954" />
      </SafeAreaView>
    );
  }

  if (isError || !user) {
    return (
      <SafeAreaView className="flex-1 bg-spotify-black">
        <ErrorState message="No se pudo cargar el perfil" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-spotify-black">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header con back */}
        <View className="flex-row items-center px-4 pt-2 pb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-spotify-white text-2xl font-bold ml-4">Mi Perfil</Text>
        </View>

        {/* Avatar */}
        <View className="items-center pb-6">
          <View className="w-24 h-24 rounded-full bg-spotify-darker items-center justify-center mb-3 overflow-hidden">
            {userId ? (
              <Image
                source={getCoverImage(userId, 'user')}
                style={{ width: 96, height: 96, borderRadius: 48 }}
                resizeMode="cover"
              />
            ) : (
              <Text className="text-spotify-green text-2xl font-bold">
                {getInitials(user.username)}
              </Text>
            )}
          </View>
          <Text className="text-spotify-white text-xl font-bold">{user.username}</Text>
          <Text className="text-spotify-gray text-sm mt-1">{user.email}</Text>
          {plan && (
            <View
              className={`mt-2 px-3 py-1 rounded-full ${
                plan.tipo === 'premium' ? 'bg-spotify-purple' : 'bg-spotify-darker'
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  plan.tipo === 'premium' ? 'text-white' : 'text-spotify-gray'
                }`}
              >
                {plan.tipo === 'premium' ? '★ PREMIUM' : 'FREE'}
              </Text>
            </View>
          )}
        </View>

        {/* Formulario */}
        <View className="px-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-spotify-white text-lg font-semibold">Datos personales</Text>
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <Ionicons
                name={isEditing ? 'close' : 'create-outline'}
                size={22}
                color="#1DB954"
              />
            </TouchableOpacity>
          </View>

          <SpotifyInput
            label="Nombre de usuario"
            value={username}
            onChangeText={setUsername}
            icon="person-outline"
            editable={isEditing}
          />
          <SpotifyInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            icon="mail-outline"
            keyboardType="email-address"
            editable={isEditing}
          />
          <SpotifyInput
            label="Género"
            value={genero}
            onChangeText={setGenero}
            icon="male-female-outline"
            placeholder="H / M / Otro"
            editable={isEditing}
          />
          <SpotifyInput
            label="Código Postal"
            value={codigoPostal}
            onChangeText={setCodigoPostal}
            icon="location-outline"
            keyboardType="numeric"
            editable={isEditing}
          />

          {user.fechaNacimiento && (
            <View className="mb-4">
              <Text className="text-spotify-gray text-sm mb-1">Fecha de nacimiento</Text>
              <View className="bg-spotify-darker rounded-lg px-4 py-3 flex-row items-center">
                <Ionicons name="calendar-outline" size={20} color="#B3B3B3" />
                <Text className="text-spotify-light-gray text-base ml-3">
                  {user.fechaNacimiento}
                </Text>
              </View>
            </View>
          )}

          {isEditing && (
            <SpotifyButton
              title="Guardar cambios"
              onPress={handleSave}
              isLoading={updateMutation.isPending}
              fullWidth
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
