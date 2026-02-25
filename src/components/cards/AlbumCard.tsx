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
  const imgSize = isSm ? 60 : 148;

  return (
    <TouchableOpacity
      activeOpacity={0.65}
      onPress={onPress}
      style={{ width: isSm ? undefined : imgSize, marginRight: isSm ? 0 : 14 }}
      className={isSm ? 'flex-row items-center py-2 px-4' : ''}
    >
      <Image
        source={getCoverImage(album.id, 'album')}
        style={{ width: imgSize, height: imgSize, borderRadius: isSm ? 8 : 6 }}
        resizeMode="cover"
      />
      {isSm ? (
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }} numberOfLines={1}>
            {album.titulo}
          </Text>
          <Text style={{ color: '#A7A7A7', fontSize: 13, marginTop: 2 }} numberOfLines={1}>
            {album.artista?.nombre ?? 'Álbum'}
          </Text>
        </View>
      ) : (
        <View style={{ marginTop: 10 }}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }} numberOfLines={1}>
            {album.titulo}
          </Text>
          <Text style={{ color: '#A7A7A7', fontSize: 12, marginTop: 2 }} numberOfLines={1}>
            {album.artista?.nombre ?? 'Álbum'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default React.memo(AlbumCard);
