import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { getCoverImage } from '../../utils/coverImages';
import type { Artista } from '../../types/api.types';

interface Props {
  artist: Artista;
  size?: 'sm' | 'md';
  onPress?: () => void;
}

const ArtistCard: React.FC<Props> = ({ artist, size = 'md', onPress }) => {
  const isSm = size === 'sm';
  const imgSize = isSm ? 56 : 140;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{ width: isSm ? undefined : imgSize }}
      className={isSm ? 'flex-row items-center py-2 px-4' : 'mr-3 items-center'}
    >
      <Image
        source={getCoverImage(artist.id, 'artist')}
        style={{ width: imgSize, height: imgSize, borderRadius: imgSize / 2 }}
        resizeMode="cover"
      />
      {isSm ? (
        <View className="flex-1 ml-3">
          <Text className="text-white text-base font-semibold" numberOfLines={1}>
            {artist.nombre}
          </Text>
          <Text className="text-spotify-gray text-sm">Artista</Text>
        </View>
      ) : (
        <View className="mt-2 items-center">
          <Text className="text-white text-sm font-semibold text-center" numberOfLines={2}>
            {artist.nombre}
          </Text>
          <Text className="text-spotify-gray text-xs">Artista</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default React.memo(ArtistCard);
