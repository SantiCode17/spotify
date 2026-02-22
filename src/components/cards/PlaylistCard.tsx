import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Playlist } from '../../types/api.types';

interface PlaylistCardProps {
  playlist: Playlist;
  onPress: () => void;
  size?: 'sm' | 'md';
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onPress, size = 'md' }) => {
  if (size === 'sm') {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        className="flex-row items-center py-2 px-4"
      >
        <View className="w-14 h-14 bg-spotify-darker rounded-lg items-center justify-center">
          <Ionicons name="musical-notes" size={24} color="#535353" />
        </View>
        <View className="flex-1 ml-3">
          <Text className="text-spotify-white text-base font-semibold" numberOfLines={1}>
            {playlist.titulo}
          </Text>
          <Text className="text-spotify-gray text-sm" numberOfLines={1}>
            Playlist
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{ width: 150, marginRight: 12 }}
    >
      <View
        className="bg-spotify-darker rounded-lg items-center justify-center"
        style={{ width: 150, height: 150 }}
      >
        <Ionicons name="musical-notes" size={48} color="#535353" />
      </View>
      <Text className="text-spotify-white text-sm font-bold mt-2" numberOfLines={2}>
        {playlist.titulo}
      </Text>
      <Text className="text-spotify-gray text-xs mt-1">Playlist</Text>
    </TouchableOpacity>
  );
};

export default PlaylistCard;
