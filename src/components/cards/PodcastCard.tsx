import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { getCoverImage } from '../../utils/coverImages';
import type { Podcast } from '../../types/api.types';

interface Props {
  podcast: Podcast;
  size?: 'sm' | 'md';
  onPress?: () => void;
}

const PodcastCard: React.FC<Props> = ({ podcast, size = 'md', onPress }) => {
  const isSm = size === 'sm';
  const imgSize = isSm ? 56 : 140;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{ width: isSm ? undefined : imgSize }}
      className={isSm ? 'flex-row items-center py-2 px-4' : 'mr-3'}
    >
      <Image
        source={getCoverImage(podcast.id, 'podcast')}
        style={{ width: imgSize, height: imgSize, borderRadius: 8 }}
        resizeMode="cover"
      />
      {isSm ? (
        <View className="flex-1 ml-3">
          <Text className="text-white text-base font-semibold" numberOfLines={1}>
            {podcast.titulo}
          </Text>
          <Text className="text-spotify-gray text-sm">Podcast</Text>
        </View>
      ) : (
        <View className="mt-2">
          <Text className="text-white text-sm font-semibold" numberOfLines={1}>
            {podcast.titulo}
          </Text>
          <Text className="text-spotify-gray text-xs">Podcast</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default React.memo(PodcastCard);
