import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Artista } from '../../types/api.types';

interface ArtistCardProps {
  artist: Artista;
  onPress?: () => void;
  horizontal?: boolean;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist, onPress, horizontal = true }) => {
  if (horizontal) {
    return (
      <Pressable onPress={onPress} className="mr-4 w-36 items-center">
        <View className="w-36 h-36 bg-spotify-darker rounded-full items-center justify-center overflow-hidden">
          {artist.imagen ? (
            <Image source={{ uri: artist.imagen }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <Ionicons name="person" size={48} color="#535353" />
          )}
        </View>
        <Text className="text-spotify-white text-sm font-semibold mt-2 text-center" numberOfLines={1}>
          {artist.nombre}
        </Text>
        <Text className="text-spotify-gray text-xs mt-1">Artista</Text>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} className="flex-row items-center py-3 px-4">
      <View className="w-12 h-12 bg-spotify-darker rounded-full items-center justify-center overflow-hidden">
        {artist.imagen ? (
          <Image source={{ uri: artist.imagen }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <Ionicons name="person" size={24} color="#535353" />
        )}
      </View>
      <View className="flex-1 ml-3">
        <Text className="text-spotify-white text-base font-semibold" numberOfLines={1}>
          {artist.nombre}
        </Text>
        <Text className="text-spotify-gray text-sm">Artista</Text>
      </View>
    </Pressable>
  );
};

export default ArtistCard;
