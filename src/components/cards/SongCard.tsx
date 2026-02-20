import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Cancion } from '../../types/api.types';

interface SongCardProps {
  song: Cancion;
  onPress?: () => void;
  onAddPress?: () => void;
  showAddButton?: boolean;
}

const SongCard: React.FC<SongCardProps> = ({ song, onPress, onAddPress, showAddButton = false }) => {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <Pressable onPress={onPress} className="flex-row items-center py-3 px-4">
      <View className="w-12 h-12 bg-spotify-darker rounded items-center justify-center overflow-hidden">
        {song.imagen ? (
          <Image source={{ uri: song.imagen }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <Ionicons name="musical-note" size={24} color="#535353" />
        )}
      </View>
      <View className="flex-1 ml-3">
        <Text className="text-spotify-white text-base font-semibold" numberOfLines={1}>
          {song.titulo}
        </Text>
        <Text className="text-spotify-gray text-sm" numberOfLines={1}>
          {song.artista?.nombre || 'Artista desconocido'}
          {song.duracion ? ` • ${formatDuration(song.duracion)}` : ''}
        </Text>
      </View>
      {showAddButton && onAddPress && (
        <Pressable onPress={onAddPress} className="p-2">
          <Ionicons name="add-circle-outline" size={24} color="#1DB954" />
        </Pressable>
      )}
    </Pressable>
  );
};

export default SongCard;
