import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Podcast } from '../../types/api.types';

interface PodcastCardProps {
  podcast: Podcast;
  onPress?: () => void;
  horizontal?: boolean;
}

const PodcastCard: React.FC<PodcastCardProps> = ({ podcast, onPress, horizontal = true }) => {
  if (horizontal) {
    return (
      <Pressable onPress={onPress} className="mr-4 w-36">
        <View className="w-36 h-36 bg-spotify-darker rounded-lg items-center justify-center overflow-hidden">
          {podcast.imagen ? (
            <Image source={{ uri: podcast.imagen }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <Ionicons name="mic" size={48} color="#535353" />
          )}
        </View>
        <Text className="text-spotify-white text-sm font-semibold mt-2" numberOfLines={1}>
          {podcast.titulo}
        </Text>
        <Text className="text-spotify-gray text-xs mt-1" numberOfLines={1}>
          Podcast
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} className="flex-row items-center py-3 px-4">
      <View className="w-12 h-12 bg-spotify-darker rounded-lg items-center justify-center overflow-hidden">
        {podcast.imagen ? (
          <Image source={{ uri: podcast.imagen }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <Ionicons name="mic" size={24} color="#535353" />
        )}
      </View>
      <View className="flex-1 ml-3">
        <Text className="text-spotify-white text-base font-semibold" numberOfLines={1}>
          {podcast.titulo}
        </Text>
        <Text className="text-spotify-gray text-sm" numberOfLines={1}>
          Podcast
        </Text>
      </View>
    </Pressable>
  );
};

export default PodcastCard;
