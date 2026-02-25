import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCoverImage } from '../../utils/coverImages';
import { formatDurationMin, formatDate } from '../../utils/formatters';
import type { Capitulo } from '../../types/api.types';

interface Props {
  episode: Capitulo;
  onPress?: () => void;
}

const EpisodeCard: React.FC<Props> = ({ episode, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="flex-row items-center py-3 px-4"
    >
      <Image
        source={getCoverImage(episode.id, 'episode')}
        style={{ width: 56, height: 56, borderRadius: 8 }}
        resizeMode="cover"
      />
      <View className="flex-1 ml-3">
        <Text className="text-white text-base font-semibold" numberOfLines={1}>
          {episode.titulo}
        </Text>
        <Text className="text-spotify-gray text-sm" numberOfLines={1}>
          {episode.fecha ? formatDate(episode.fecha) : ''}
          {episode.duracion ? ` · ${formatDurationMin(episode.duracion)}` : ''}
        </Text>
      </View>
      <Ionicons name="play-circle-outline" size={32} color="#1DB954" style={{ marginLeft: 12 }} />
    </TouchableOpacity>
  );
};

export default React.memo(EpisodeCard);
