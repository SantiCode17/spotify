import React from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useEpisodeDetail } from '../../../src/hooks/usePodcasts';
import ErrorState from '../../../src/components/ui/ErrorState';
import { getCoverImage } from '../../../src/utils/coverImages';
import { formatDurationMin, formatDate, formatPlays } from '../../../src/utils/formatters';

const EpisodeDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const episodeId = Number(id);

  const { data: episode, isLoading, isError, refetch } = useEpisodeDetail(episodeId);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-spotify-black items-center justify-center">
        <ActivityIndicator size="large" color="#1DB954" />
      </SafeAreaView>
    );
  }

  if (isError || !episode) {
    return (
      <SafeAreaView className="flex-1 bg-spotify-black">
        <ErrorState message="No se pudo cargar el episodio" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-spotify-black">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Volver */}
        <TouchableOpacity onPress={() => router.back()} className="px-4 pt-2 pb-3">
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Imagen principal */}
        <View className="items-center px-4 pb-4">
          <Image
            source={getCoverImage(episodeId, 'episode')}
            style={{ width: 192, height: 192, borderRadius: 8, marginBottom: 16 }}
            resizeMode="cover"
          />
          <Text className="text-spotify-white text-2xl font-bold text-center">
            {episode.titulo}
          </Text>
        </View>

        {/* Metadatos */}
        <View className="flex-row justify-center gap-4 pb-4">
          {episode.fecha && (
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={14} color="#B3B3B3" />
              <Text className="text-spotify-gray text-xs ml-1">{formatDate(episode.fecha)}</Text>
            </View>
          )}
          {episode.duracion ? (
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={14} color="#B3B3B3" />
              <Text className="text-spotify-gray text-xs ml-1">
                {formatDurationMin(episode.duracion)}
              </Text>
            </View>
          ) : null}
          {episode.numeroReproducciones ? (
            <View className="flex-row items-center">
              <Ionicons name="headset-outline" size={14} color="#B3B3B3" />
              <Text className="text-spotify-gray text-xs ml-1">
                {formatPlays(episode.numeroReproducciones)} repr.
              </Text>
            </View>
          ) : null}
        </View>

        {/* Descripción */}
        {episode.descripcion && (
          <View className="px-4">
            <Text className="text-spotify-white text-base font-semibold mb-2">
              Descripción
            </Text>
            <Text className="text-spotify-gray text-sm leading-5">
              {episode.descripcion}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default EpisodeDetailScreen;
