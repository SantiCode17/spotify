import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Playlist } from '../../types/api.types';

interface PlaylistCardProps {
  playlist: Playlist;
  onPress?: () => void;
  horizontal?: boolean;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onPress, horizontal = true }) => {
  if (horizontal) {
    return (
      <Pressable onPress={onPress} className="mr-4 w-36">
        <View className="w-36 h-36 bg-spotify-darker rounded-lg items-center justify-center overflow-hidden">
          {playlist.imagen ? (
            <Image source={{ uri: playlist.imagen }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <Ionicons name="musical-notes" size={48} color="#535353" />
          )}
        </View>
        <Text className="text-spotify-white text-sm font-semibold mt-2" numberOfLines={1}>
          {playlist.titulo}
        </Text>
        <Text className="text-spotify-gray text-xs mt-1" numberOfLines={1}>
          Playlist
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} className="flex-row items-center py-3 px-4">
      <View className="w-12 h-12 bg-spotify-darker rounded items-center justify-center overflow-hidden">
        {playlist.imagen ? (
          <Image source={{ uri: playlist.imagen }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <Ionicons name="musical-notes" size={24} color="#535353" />
        )}
      </View>
      <View className="flex-1 ml-3">
        <Text className="text-spotify-white text-base font-semibold" numberOfLines={1}>
          {playlist.titulo}
        </Text>
        <Text className="text-spotify-gray text-sm" numberOfLines={1}>
          Playlist
        </Text>
      </View>
    </Pressable>
  );
};

export default PlaylistCard;
