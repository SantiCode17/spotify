import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCoverImage } from '../../utils/coverImages';
import type { Cancion } from '../../types/api.types';

interface Props {
  song: Cancion;
  index?: number;
  onPress?: () => void;
  onAddToPlaylist?: () => void;
}

const SongCard: React.FC<Props> = ({ song, index, onPress, onAddToPlaylist }) => {
  const imgSize = index !== undefined ? 44 : 48;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="flex-row items-center py-2 px-4"
    >
      {index !== undefined && (
        <Text className="text-spotify-gray text-sm w-7 text-center">{index}</Text>
      )}
      <Image
        source={getCoverImage(song.id, 'song')}
        style={{ width: imgSize, height: imgSize, borderRadius: 4 }}
        resizeMode="cover"
      />
      <View className="flex-1 ml-3">
        <Text className="text-white text-base" numberOfLines={1}>
          {song.titulo}
        </Text>
        <Text className="text-spotify-gray text-sm" numberOfLines={1}>
          {song.album?.artista?.nombre ?? 'Artista desconocido'}
        </Text>
      </View>
      {onAddToPlaylist && (
        <TouchableOpacity onPress={onAddToPlaylist} hitSlop={8} className="ml-2 p-1">
          <Ionicons name="add-circle-outline" size={22} color="#B3B3B3" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default React.memo(SongCard);
