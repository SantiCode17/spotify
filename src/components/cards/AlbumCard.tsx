import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { getCoverImage } from '../../utils/coverImages';
import type { Album } from '../../types/api.types';

interface Props {
  album: Album;
  size?: 'sm' | 'md';
  onPress?: () => void;
}

const AlbumCard: React.FC<Props> = ({ album, size = 'md', onPress }) => {
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
        source={getCoverImage(album.id, 'album')}
        style={{ width: imgSize, height: imgSize, borderRadius: 4 }}
        resizeMode="cover"
      />
      {isSm ? (
        <View className="flex-1 ml-3">
          <Text className="text-white text-base font-semibold" numberOfLines={1}>
            {album.titulo}
          </Text>
          <Text className="text-spotify-gray text-sm" numberOfLines={1}>
            {album.artista?.nombre ?? 'Álbum'}
          </Text>
        </View>
      ) : (
        <View className="mt-2">
          <Text className="text-white text-sm font-semibold" numberOfLines={1}>
            {album.titulo}
          </Text>
          <Text className="text-spotify-gray text-xs" numberOfLines={1}>
            {album.artista?.nombre ?? 'Álbum'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default React.memo(AlbumCard);
