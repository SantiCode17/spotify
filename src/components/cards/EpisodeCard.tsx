import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Capitulo } from '../../types/api.types';

interface EpisodeCardProps {
  episode: Capitulo;
  onPress?: () => void;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode, onPress }) => {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const min = Math.floor(seconds / 60);
    return `${min} min`;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="flex-row items-center py-2 px-4"
    >
      <View className="w-12 h-12 bg-spotify-darker rounded-lg items-center justify-center">
        <Ionicons name="play-circle" size={24} color="#1DB954" />
      </View>
      <View className="flex-1 ml-3">
        <Text className="text-spotify-white text-base font-semibold" numberOfLines={1}>
          {episode.titulo}
        </Text>
        {episode.descripcion ? (
          <Text className="text-spotify-gray text-sm" numberOfLines={1}>
            {episode.descripcion}
          </Text>
        ) : null}
        <Text className="text-spotify-light-gray text-xs mt-0.5" numberOfLines={1}>
          {episode.fecha || ''}
          {episode.duracion ? ` · ${formatDuration(episode.duracion)}` : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default EpisodeCard;
