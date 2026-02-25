import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image, Platform, Modal } from 'react-native';
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

const GENERO_OPTIONS = [
  { label: 'Hombre', value: 'H' },
  { label: 'Mujer', value: 'M' },
  { label: 'Prefiero no decirlo', value: 'Prefiero no decirlo' },
];

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
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDay, setTempDay] = useState('');
  const [tempMonth, setTempMonth] = useState('');
  const [tempYear, setTempYear] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username ?? '');
      setEmail(user.email ?? '');
      setGenero(user.genero ?? '');
      setCodigoPostal(user.codigoPostal ?? '');
      if (user.fechaNacimiento) {
        setFechaNacimiento(user.fechaNacimiento);
        // Parsear la fecha para los campos del selector (formato: YYYY-MM-DD o DD/MM/YYYY)
        const parts = user.fechaNacimiento.includes('-')
          ? user.fechaNacimiento.split('-')
          : user.fechaNacimiento.split('/').reverse();
        if (parts.length === 3) {
          setTempYear(parts[0]);
          setTempMonth(parts[1]);
          setTempDay(parts[2]);
        }
      }
    }
  }, [user]);

  const handleSave = () => {
    // Construir la cadena de fecha a partir de las partes
    let dateStr = fechaNacimiento;
    if (tempYear && tempMonth && tempDay) {
      dateStr = `${tempYear}-${tempMonth.padStart(2, '0')}-${tempDay.padStart(2, '0')}`;
    }
    updateMutation.mutate(
      { username, email, genero, codigoPostal, fechaNacimiento: dateStr },
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

  const getGeneroLabel = (value: string) => {
    const option = GENERO_OPTIONS.find((o) => o.value === value);
    return option ? option.label : value || 'Seleccionar';
  };

  const handleDateConfirm = () => {
    const d = parseInt(tempDay, 10);
    const m = parseInt(tempMonth, 10);
    const y = parseInt(tempYear, 10);
    if (!d || !m || !y || d < 1 || d > 31 || m < 1 || m > 12 || y < 1900 || y > 2024) {
      Alert.alert('Error', 'Fecha no válida');
      return;
    }
    setFechaNacimiento(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
    setShowDatePicker(false);
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
        {/* Cabecera con boton volver */}
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
          {/* Selector de genero */}
          <View className="mb-4">
            <Text className="text-[#B3B3B3] text-sm mb-1.5 ml-1">Género</Text>
            {isEditing ? (
              <TouchableOpacity
                onPress={() => setShowGenderPicker(true)}
                className="bg-[#2A2A2A] rounded-xl px-4 py-3.5 flex-row items-center"
              >
                <Ionicons name="male-female-outline" size={20} color="#B3B3B3" />
                <Text className="text-white text-base ml-3 flex-1">
                  {getGeneroLabel(genero)}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#B3B3B3" />
              </TouchableOpacity>
            ) : (
              <View className="bg-[#2A2A2A] rounded-xl px-4 py-3.5 flex-row items-center opacity-60">
                <Ionicons name="male-female-outline" size={20} color="#B3B3B3" />
                <Text className="text-[#B3B3B3] text-base ml-3">
                  {getGeneroLabel(genero)}
                </Text>
              </View>
            )}
          </View>

          {/* Modal selector de genero */}
          <Modal visible={showGenderPicker} transparent animationType="fade">
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setShowGenderPicker(false)}
              className="flex-1 bg-black/60 justify-end"
            >
              <View className="bg-[#282828] rounded-t-2xl pb-8 pt-4 px-4">
                <Text className="text-white text-lg font-bold text-center mb-4">
                  Selecciona tu género
                </Text>
                {GENERO_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => {
                      setGenero(option.value);
                      setShowGenderPicker(false);
                    }}
                    className="py-4 px-4 flex-row items-center justify-between"
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: '#3a3a3a',
                    }}
                  >
                    <Text className="text-white text-base">{option.label}</Text>
                    {genero === option.value && (
                      <Ionicons name="checkmark-circle" size={22} color="#1DB954" />
                    )}
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  onPress={() => setShowGenderPicker(false)}
                  className="mt-4 py-3 items-center"
                >
                  <Text className="text-[#B3B3B3] text-base">Cancelar</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>

          <SpotifyInput
            label="Código Postal"
            value={codigoPostal}
            onChangeText={setCodigoPostal}
            icon="location-outline"
            keyboardType="numeric"
            editable={isEditing}
          />

          {/* Fecha de nacimiento */}
          <View className="mb-4">
            <Text className="text-[#B3B3B3] text-sm mb-1.5 ml-1">Fecha de nacimiento</Text>
            {isEditing ? (
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="bg-[#2A2A2A] rounded-xl px-4 py-3.5 flex-row items-center"
              >
                <Ionicons name="calendar-outline" size={20} color="#B3B3B3" />
                <Text className="text-white text-base ml-3 flex-1">
                  {fechaNacimiento || 'Seleccionar fecha'}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#B3B3B3" />
              </TouchableOpacity>
            ) : (
              <View className="bg-[#2A2A2A] rounded-xl px-4 py-3.5 flex-row items-center opacity-60">
                <Ionicons name="calendar-outline" size={20} color="#B3B3B3" />
                <Text className="text-[#B3B3B3] text-base ml-3">
                  {fechaNacimiento || 'No definida'}
                </Text>
              </View>
            )}
          </View>

          {/* Modal selector de fecha */}
          <Modal visible={showDatePicker} transparent animationType="fade">
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setShowDatePicker(false)}
              className="flex-1 bg-black/60 justify-center px-6"
            >
              <TouchableOpacity activeOpacity={1} onPress={() => {}}>
                <View className="bg-[#282828] rounded-2xl p-6">
                  <Text className="text-white text-lg font-bold text-center mb-6">
                    Fecha de nacimiento
                  </Text>
                  <View className="flex-row gap-3 mb-6">
                    <View className="flex-1">
                      <Text className="text-[#B3B3B3] text-xs mb-1 ml-1">Día</Text>
                      <SpotifyInput
                        value={tempDay}
                        onChangeText={(v) => setTempDay(v.replace(/\D/g, '').slice(0, 2))}
                        placeholder="DD"
                        keyboardType="numeric"
                        editable
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-[#B3B3B3] text-xs mb-1 ml-1">Mes</Text>
                      <SpotifyInput
                        value={tempMonth}
                        onChangeText={(v) => setTempMonth(v.replace(/\D/g, '').slice(0, 2))}
                        placeholder="MM"
                        keyboardType="numeric"
                        editable
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-[#B3B3B3] text-xs mb-1 ml-1">Año</Text>
                      <SpotifyInput
                        value={tempYear}
                        onChangeText={(v) => setTempYear(v.replace(/\D/g, '').slice(0, 4))}
                        placeholder="AAAA"
                        keyboardType="numeric"
                        editable
                      />
                    </View>
                  </View>
                  <View className="flex-row gap-3">
                    <View className="flex-1">
                      <SpotifyButton
                        title="Cancelar"
                        variant="outline"
                        onPress={() => setShowDatePicker(false)}
                        fullWidth
                      />
                    </View>
                    <View className="flex-1">
                      <SpotifyButton
                        title="Confirmar"
                        onPress={handleDateConfirm}
                        fullWidth
                      />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>

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
