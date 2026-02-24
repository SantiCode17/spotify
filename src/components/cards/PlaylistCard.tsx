import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { getCoverImage } from '../../utils/coverImages';
import type { Playlist } from '../../types/api.types';

interface Props {
  playlist: Playlist;
  size?: 'sm' | 'md';
  onPress?: () => void;
}

const PlaylistCard: React.FC<Props> = ({ playlist, size = 'md', onPress }) => {
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
        source={getCoverImage(playlist.id, 'playlist')}
        style={{ width: imgSize, height: imgSize, borderRadius: 8 }}
        resizeMode="cover"
      />
      {isSm ? (
        <View className="flex-1 ml-3">
          <Text className="text-white text-base font-semibold" numberOfLines={1}>
            {playlist.titulo}
          </Text>
          <Text className="text-spotify-gray text-sm" numberOfLines={1}>
            Playlist{playlist.numeroCanciones ? ` · ${playlist.numeroCanciones} canciones` : ''}
          </Text>
        </View>
      ) : (
        <View className="mt-2">
          <Text className="text-white text-sm font-semibold" numberOfLines={1}>
            {playlist.titulo}
          </Text>
          <Text className="text-spotify-gray text-xs" numberOfLines={1}>
            {playlist.numeroCanciones ? `${playlist.numeroCanciones} canciones` : 'Playlist'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default React.memo(PlaylistCard);
