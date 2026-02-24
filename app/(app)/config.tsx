import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useAuthStore } from '../../src/store/authStore';
import { useUserConfig, useUpdateUserConfig } from '../../src/hooks/useUser';
import ErrorState from '../../src/components/ui/ErrorState';

const CALIDAD_OPTIONS = ['Automático', 'Baja', 'Normal', 'Alta', 'Muy Alta'];
const TIPO_DESCARGA_OPTIONS = ['Automático', 'Baja', 'Normal', 'Alta', 'Muy Alta'];
const IDIOMA_OPTIONS = ['Español', 'Inglés', 'Francés', 'Italiano', 'Alemán'];

type PickerType = 'calidad' | 'tipoDescarga' | 'idioma' | null;

const ConfigScreen = () => {
  const userId = useAuthStore((s) => s.userId);
  const { data: config, isLoading, isError, refetch } = useUserConfig(userId);
  const updateMutation = useUpdateUserConfig(userId);

  const [activePicker, setActivePicker] = useState<PickerType>(null);

  const toggleSwitch = (key: 'autoplay' | 'ajuste' | 'normalizacion') => {
    if (!config) return;
    updateMutation.mutate({ [key]: !config[key] });
  };

  const handlePickerSelect = useCallback(
    (value: string) => {
      if (!activePicker) return;
      updateMutation.mutate(
        { [activePicker]: { nombre: value } },
        {
          onError: () => Alert.alert('Error', 'No se pudo actualizar'),
        }
      );
      setActivePicker(null);
    },
    [activePicker, updateMutation]
  );

  const getPickerOptions = (): string[] => {
    switch (activePicker) {
      case 'calidad':
        return CALIDAD_OPTIONS;
      case 'tipoDescarga':
        return TIPO_DESCARGA_OPTIONS;
      case 'idioma':
        return IDIOMA_OPTIONS;
      default:
        return [];
    }
  };

  const getPickerTitle = (): string => {
    switch (activePicker) {
      case 'calidad':
        return 'Calidad de streaming';
      case 'tipoDescarga':
        return 'Tipo de descarga';
      case 'idioma':
        return 'Idioma';
      default:
        return '';
    }
  };

  const getCurrentValue = (): string => {
    if (!config || !activePicker) return '';
    switch (activePicker) {
      case 'calidad':
        return config.calidad.nombre;
      case 'tipoDescarga':
        return config.tipoDescarga.nombre;
      case 'idioma':
        return config.idioma.nombre;
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-spotify-black items-center justify-center">
        <ActivityIndicator size="large" color="#1DB954" />
      </SafeAreaView>
    );
  }

  if (isError || !config) {
    return (
      <SafeAreaView className="flex-1 bg-spotify-black">
        <ErrorState message="No se pudo cargar la configuración" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const SwitchRow = ({
    label,
    value,
    onToggle,
  }: {
    label: string;
    value: boolean;
    onToggle: () => void;
  }) => (
    <View className="flex-row items-center justify-between py-4 border-b border-spotify-darker">
      <Text className="text-spotify-white text-base">{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#535353', true: '#1DB954' }}
        thumbColor="#fff"
      />
    </View>
  );

  const SelectRow = ({
    label,
    value,
    onPress,
  }: {
    label: string;
    value: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="flex-row items-center justify-between py-4 border-b border-spotify-darker"
    >
      <Text className="text-spotify-white text-base">{label}</Text>
      <View className="flex-row items-center">
        <Text className="text-spotify-green text-sm mr-2">{value}</Text>
        <Ionicons name="chevron-forward" size={16} color="#535353" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-spotify-black">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="flex-row items-center px-4 pt-2 pb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-spotify-white text-2xl font-bold ml-4">Configuración</Text>
        </View>

        <View className="px-4">
          {/* Reproducción */}
          <Text className="text-spotify-green text-sm font-bold uppercase tracking-wider mb-2 mt-2">
            Reproducción
          </Text>
          <SwitchRow label="Autoplay" value={config.autoplay} onToggle={() => toggleSwitch('autoplay')} />
          <SwitchRow label="Ajuste de audio" value={config.ajuste} onToggle={() => toggleSwitch('ajuste')} />
          <SwitchRow label="Normalización" value={config.normalizacion} onToggle={() => toggleSwitch('normalizacion')} />

          {/* Calidad */}
          <Text className="text-spotify-green text-sm font-bold uppercase tracking-wider mb-2 mt-6">
            Calidad de audio
          </Text>
          <SelectRow
            label="Calidad de streaming"
            value={config.calidad.nombre}
            onPress={() => setActivePicker('calidad')}
          />
          <SelectRow
            label="Tipo de descarga"
            value={config.tipoDescarga.nombre}
            onPress={() => setActivePicker('tipoDescarga')}
          />

          {/* General */}
          <Text className="text-spotify-green text-sm font-bold uppercase tracking-wider mb-2 mt-6">
            General
          </Text>
          <SelectRow
            label="Idioma"
            value={config.idioma.nombre}
            onPress={() => setActivePicker('idioma')}
          />
        </View>
      </ScrollView>

      {/* Picker Modal */}
      <Modal
        visible={activePicker !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setActivePicker(null)}
      >
        <Pressable
          className="flex-1 bg-black/80 justify-end"
          onPress={() => setActivePicker(null)}
        >
          <Pressable
            className="bg-spotify-dark"
            style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '50%' }}
            onPress={() => {}}
          >
            <View className="items-center pt-3 pb-1">
              <View className="w-10 h-1 bg-spotify-light-gray rounded-full" />
            </View>
            <Text className="text-spotify-white text-lg font-bold text-center py-3">
              {getPickerTitle()}
            </Text>
            <FlatList
              data={getPickerOptions()}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const isSelected = item === getCurrentValue();
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handlePickerSelect(item)}
                    className="flex-row items-center justify-between py-4 px-6 border-b border-spotify-darker"
                  >
                    <Text
                      className={`text-base ${
                        isSelected ? 'text-spotify-green font-bold' : 'text-spotify-white'
                      }`}
                    >
                      {item}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={22} color="#1DB954" />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActivePicker(null)}
              className="py-4 items-center border-t border-spotify-darker"
            >
              <Text className="text-spotify-gray text-base font-semibold">Cancelar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default ConfigScreen;
