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
  const imgSize = isSm ? 60 : 148;

  return (
    <TouchableOpacity
      activeOpacity={0.65}
      onPress={onPress}
      style={{ width: isSm ? undefined : imgSize, marginRight: isSm ? 0 : 14, alignItems: isSm ? undefined : 'center' }}
      className={isSm ? 'flex-row items-center py-2 px-4' : ''}
    >
      <Image
        source={getCoverImage(artist.id, 'artist')}
        style={{ width: imgSize, height: imgSize, borderRadius: imgSize / 2 }}
        resizeMode="cover"
      />
      {isSm ? (
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }} numberOfLines={1}>
            {artist.nombre}
          </Text>
          <Text style={{ color: '#A7A7A7', fontSize: 13, marginTop: 2 }}>Artista</Text>
        </View>
      ) : (
        <View style={{ marginTop: 10, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600', textAlign: 'center' }} numberOfLines={2}>
            {artist.nombre}
          </Text>
          <Text style={{ color: '#A7A7A7', fontSize: 12, marginTop: 2 }}>Artista</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default React.memo(ArtistCard);
