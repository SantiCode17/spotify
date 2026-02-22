import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Cancion } from '../../types/api.types';

interface SongCardProps {
  song: Cancion;
  onPress?: () => void;
  index?: number;
  isLiked?: boolean;
  onLikePress?: () => void;
  showAddButton?: boolean;
  onAddPress?: () => void;
}

const SongCard: React.FC<SongCardProps> = ({
  song,
  onPress,
  index,
  isLiked = false,
  onLikePress,
  showAddButton = false,
  onAddPress,
}) => {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const artistName = song.album?.artista?.nombre || 'Artista desconocido';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="flex-row items-center py-2 px-4"
    >
      {/* Índice o imagen */}
      {index !== undefined ? (
        <Text className="text-spotify-gray text-sm w-8 text-center">{index}</Text>
      ) : (
        <View className="w-12 h-12 bg-spotify-darker rounded items-center justify-center">
          <Ionicons name="musical-note" size={24} color="#535353" />
        </View>
      )}

      {/* Info */}
      <View className="flex-1 ml-3">
        <Text className="text-spotify-white text-base font-semibold" numberOfLines={1}>
          {song.titulo}
        </Text>
        <Text className="text-spotify-gray text-sm" numberOfLines={1}>
          {artistName}
          {song.duracion ? ` · ${formatDuration(song.duracion)}` : ''}
        </Text>
      </View>

      {/* Like button */}
      {onLikePress && (
        <TouchableOpacity activeOpacity={0.7} onPress={onLikePress} className="p-2">
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={22}
            color={isLiked ? '#1DB954' : '#535353'}
          />
        </TouchableOpacity>
      )}

      {/* Add to playlist button */}
      {showAddButton && onAddPress && (
        <TouchableOpacity activeOpacity={0.7} onPress={onAddPress} className="p-2">
          <Ionicons name="add-circle-outline" size={24} color="#1DB954" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default SongCard;
