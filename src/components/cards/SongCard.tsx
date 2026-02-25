import React from 'react';
import { View, Text, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getCoverImage } from '../../utils/coverImages';
import type { Cancion } from '../../types/api.types';

interface Props {
  song: Cancion;
  index?: number;
  onPress?: () => void;
  onAddToPlaylist?: () => void;
  onDelete?: () => void;
  isFavorite?: boolean;
  onFavoritePress?: () => void;
  // Imagen alternativa (usado en pantalla de album para que todas tengan la misma portada)
  coverOverride?: ImageSourcePropType;
}

const SongCard: React.FC<Props> = ({ song, index, onPress, onAddToPlaylist, onDelete, isFavorite, coverOverride }) => {
  const imgSize = 48;

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/song/${song.id}`);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.65}
      onPress={handlePress}
      className="flex-row items-center"
      style={{ paddingVertical: 10, paddingHorizontal: 16 }}
    >
      {index !== undefined && (
        <Text
          className="text-spotify-gray font-medium"
          style={{ width: 28, textAlign: 'center', fontSize: 13 }}
        >
          {index}
        </Text>
      )}
      <Image
        source={coverOverride ?? getCoverImage(song.id, 'song')}
        style={{ width: imgSize, height: imgSize, borderRadius: 6 }}
        resizeMode="cover"
      />
      <View className="flex-1" style={{ marginLeft: 14, marginRight: 12 }}>
        <Text className="text-white font-semibold" style={{ fontSize: 15, lineHeight: 20 }} numberOfLines={1}>
          {song.titulo}
        </Text>
        <Text className="text-[#A7A7A7]" style={{ fontSize: 13, lineHeight: 18, marginTop: 2 }} numberOfLines={1}>
          {song.album?.artista?.nombre ?? 'Artista desconocido'}
        </Text>
      </View>
      {onDelete && (
        <TouchableOpacity
          onPress={onDelete}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={{ marginLeft: 4, padding: 8 }}
        >
          <Ionicons name="trash-outline" size={18} color="#E53935" />
        </TouchableOpacity>
      )}
      {onAddToPlaylist && (
        <TouchableOpacity
          onPress={onAddToPlaylist}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={{ marginLeft: 4, padding: 8 }}
        >
          <Ionicons
            name={isFavorite ? 'checkmark-circle' : 'add-circle-outline'}
            size={22}
            color={isFavorite ? '#1DB954' : '#B3B3B3'}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default React.memo(SongCard);
