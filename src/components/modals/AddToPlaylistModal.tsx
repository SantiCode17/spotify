import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '../../store/authStore';
import { useUserPlaylists } from '../../hooks/usePlaylists';
import * as playlistService from '../../services/playlistService';
import { queryKeys } from '../../config/queryKeys';
import { getCoverImage } from '../../utils/coverImages';
import type { Playlist } from '../../types/api.types';

interface AddToPlaylistModalProps {
  visible: boolean;
  songId: number | null;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  visible,
  songId,
  onClose,
}) => {
  const userId = useAuthStore((s) => s.userId);
  const queryClient = useQueryClient();
  const { data: playlists, isLoading } = useUserPlaylists(userId);

  const addSongMutation = useMutation({
    mutationFn: (playlistId: number) =>
      playlistService.addSongToPlaylist(playlistId, songId!, userId!),
    onSuccess: (_data, playlistId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.playlistSongs(playlistId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.playlistDetail(playlistId) });
      Alert.alert('¡Listo!', 'Canción añadida a la playlist');
      onClose();
    },
    onError: (error: any) => {
      const msg = error?.response?.status === 409
        ? 'Esta canción ya está en la playlist'
        : 'No se pudo añadir la canción';
      Alert.alert('Error', msg);
    },
  });

  const handleSelectPlaylist = (playlist: Playlist) => {
    if (!songId || !userId) return;
    addSongMutation.mutate(playlist.id);
  };

  const renderPlaylistItem = ({ item }: { item: Playlist }) => (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => handleSelectPlaylist(item)}
      disabled={addSongMutation.isPending}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
      }}
    >
      <View
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 6,
        }}
      >
        <Image
          source={getCoverImage(item.id, 'playlist')}
          style={{ width: 56, height: 56, borderRadius: 8 }}
          resizeMode="cover"
        />
      </View>
      <View style={{ flex: 1, marginLeft: 16 }}>
        <Text
          style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}
          numberOfLines={1}
        >
          {item.titulo}
        </Text>
        <Text style={{ color: '#A7A7A7', fontSize: 13, marginTop: 3 }}>
          {item.numeroCanciones ?? 0} canciones
        </Text>
      </View>
      <Ionicons name="add-circle-outline" size={24} color="#1DB954" />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' }}>
        {/* Zona superior: al tocar cierra el modal */}
        <Pressable style={{ flex: 1 }} onPress={onClose} />

        {/* Contenedor del modal */}
        <View
          style={{
            maxHeight: SCREEN_HEIGHT * 0.72,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            overflow: 'hidden',
          }}
        >
          <LinearGradient colors={['#2A2A2A', '#1A1A1A', '#121212']}>
            {/* Indicador */}
            <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 4 }}>
              <View
                style={{
                  width: 40,
                  height: 4,
                  backgroundColor: '#535353',
                  borderRadius: 2,
                }}
              />
            </View>

            {/* Titulo */}
            <View style={{ paddingVertical: 16, paddingHorizontal: 24 }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20,
                  fontWeight: '800',
                  textAlign: 'center',
                }}
              >
                Añadir a playlist
              </Text>
              <Text
                style={{
                  color: '#A7A7A7',
                  fontSize: 13,
                  textAlign: 'center',
                  marginTop: 4,
                }}
              >
                Selecciona la playlist donde quieres añadirla
              </Text>
            </View>

            {/* Separador */}
            <View style={{ height: 1, backgroundColor: '#333', marginHorizontal: 24 }} />

            {/* Contenido */}
            {isLoading ? (
              <View style={{ alignItems: 'center', paddingVertical: 48 }}>
                <ActivityIndicator size="large" color="#1DB954" />
                <Text style={{ color: '#686868', fontSize: 14, marginTop: 12 }}>
                  Cargando playlists…
                </Text>
              </View>
            ) : !playlists || playlists.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24 }}>
                <View
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 36,
                    backgroundColor: '#252525',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <Ionicons name="musical-notes-outline" size={36} color="#535353" />
                </View>
                <Text style={{ color: '#fff', fontSize: 17, fontWeight: '700' }}>
                  No tienes playlists
                </Text>
                <Text
                  style={{
                    color: '#A7A7A7',
                    fontSize: 13,
                    marginTop: 6,
                    textAlign: 'center',
                  }}
                >
                  Crea una playlist primero para poder añadir canciones
                </Text>
              </View>
            ) : (
              <FlatList
                data={playlists}
                renderItem={renderPlaylistItem}
                keyExtractor={(p) => p.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 8 }}
                style={{ maxHeight: SCREEN_HEIGHT * 0.4 }}
                ItemSeparatorComponent={() => (
                  <View style={{ height: 1, backgroundColor: '#1E1E1E', marginHorizontal: 24 }} />
                )}
              />
            )}

            {/* Boton cancelar */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={{
                paddingVertical: 16,
                alignItems: 'center',
                borderTopWidth: 1,
                borderTopColor: '#333',
                marginBottom: 8,
              }}
            >
              <Text style={{ color: '#B3B3B3', fontSize: 15, fontWeight: '600' }}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

export default AddToPlaylistModal;
