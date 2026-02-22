import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Artista } from '../../types/api.types';

interface ArtistCardProps {
  artist: Artista;
  onPress: () => void;
  size?: 'sm' | 'md';
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist, onPress, size = 'md' }) => {
  if (size === 'sm') {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        className="flex-row items-center py-2 px-4"
      >
        <View className="w-14 h-14 bg-spotify-darker rounded-full items-center justify-center">
          <Ionicons name="person" size={24} color="#535353" />
        </View>
        <View className="flex-1 ml-3">
          <Text className="text-spotify-white text-base font-semibold" numberOfLines={1}>
            {artist.nombre}
          </Text>
          <Text className="text-spotify-gray text-sm">Artista</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{ width: 150, marginRight: 12 }}
      className="items-center"
    >
      <View
        className="bg-spotify-darker rounded-full items-center justify-center"
        style={{ width: 150, height: 150 }}
      >
        <Ionicons name="person" size={48} color="#535353" />
      </View>
      <Text className="text-spotify-white text-sm font-bold mt-2 text-center" numberOfLines={2}>
        {artist.nombre}
      </Text>
      <Text className="text-spotify-gray text-xs mt-1">Artista</Text>
    </TouchableOpacity>
  );
};

export default ArtistCard;
