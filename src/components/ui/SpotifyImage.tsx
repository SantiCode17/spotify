import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SpotifyImageProps {
  // Tipo de contenido para elegir el icono adecuado
  type: 'artist' | 'album' | 'playlist' | 'podcast' | 'song' | 'episode' | 'user';
  // Tamaño en pixeles (ancho = alto)
  size?: number;
  // Si es redondo (para artistas y usuario)
  rounded?: boolean;
}

const ICON_MAP: Record<SpotifyImageProps['type'], keyof typeof Ionicons.glyphMap> = {
  artist: 'person',
  album: 'disc',
  playlist: 'musical-notes',
  podcast: 'mic',
  song: 'musical-note',
  episode: 'play-circle',
  user: 'person',
};

// Componente placeholder de imagen.
// La API no sirve imagenes, se muestra un icono sobre fondo oscuro.
const SpotifyImage: React.FC<SpotifyImageProps> = ({
  type,
  size = 150,
  rounded = false,
}) => {
  const iconSize = Math.floor(size * 0.4);
  const autoRounded = type === 'artist' || type === 'user' || rounded;

  return (
    <View
      className="bg-spotify-darker items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: autoRounded ? size / 2 : 4,
      }}
    >
      <Ionicons name={ICON_MAP[type]} size={iconSize} color="#535353" />
    </View>
  );
};

export default SpotifyImage;
