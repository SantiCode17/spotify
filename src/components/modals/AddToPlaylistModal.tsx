import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '../../store/authStore';
import { useUserPlaylists } from '../../hooks/usePlaylists';
import * as playlistService from '../../services/playlistService';
import { queryKeys } from '../../config/queryKeys';
import type { Playlist } from '../../types/api.types';

interface AddToPlaylistModalProps {
  visible: boolean;
  songId: number | null;
  onClose: () => void;
}

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
      Alert.alert('¡Listo!', 'Canción añadida a la playlist');
      onClose();
    },
    onError: () => {
      Alert.alert('Error', 'No se pudo añadir la canción');
    },
  });

  const handleSelectPlaylist = (playlist: Playlist) => {
    if (!songId || !userId) return;
    addSongMutation.mutate(playlist.id);
  };

  const renderPlaylistItem = ({ item }: { item: Playlist }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => handleSelectPlaylist(item)}
      className="flex-row items-center py-3 px-4"
      disabled={addSongMutation.isPending}
    >
      <View className="w-12 h-12 bg-spotify-darker rounded items-center justify-center overflow-hidden">
        {item.imagen ? (
          <Image source={{ uri: item.imagen }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <Ionicons name="musical-notes" size={24} color="#535353" />
        )}
      </View>
      <View className="flex-1 ml-3">
        <Text className="text-spotify-white text-base font-semibold" numberOfLines={1}>
          {item.titulo}
        </Text>
        <Text className="text-spotify-gray text-sm">Tu playlist</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      {/* Fondo oscuro — cierra al pulsar fuera */}
      <Pressable
        className="flex-1 bg-black/80 justify-end"
        onPress={onClose}
      >
        {/* Panel inferior */}
        <Pressable
          className="bg-spotify-dark max-h-[70%]"
          style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
          onPress={() => {}} // evita que el press se propague al fondo
        >
          {/* Handle / Título */}
          <View className="items-center pt-3 pb-1">
            <View className="w-10 h-1 bg-spotify-light-gray rounded-full" />
          </View>
          <Text className="text-spotify-white text-lg font-bold text-center py-3">
            Añadir a playlist
          </Text>

          {/* Contenido */}
          {isLoading ? (
            <View className="items-center py-10">
              <ActivityIndicator size="large" color="#1DB954" />
              <Text className="text-spotify-gray text-sm mt-2">Cargando playlists…</Text>
            </View>
          ) : !playlists || playlists.length === 0 ? (
            <View className="items-center py-10 px-4">
              <Ionicons name="musical-notes-outline" size={40} color="#535353" />
              <Text className="text-spotify-gray text-sm mt-2">No tienes playlists</Text>
              <Text className="text-spotify-light-gray text-xs mt-1">
                Crea una playlist primero
              </Text>
            </View>
          ) : (
            <FlatList
              data={playlists}
              renderItem={renderPlaylistItem}
              keyExtractor={(p) => p.id.toString()}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => (
                <View className="h-px bg-spotify-darker mx-4" />
              )}
            />
          )}

          {/* Botón Cancelar */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onClose}
            className="py-4 items-center border-t border-spotify-darker"
          >
            <Text className="text-red-500 text-base font-semibold">Cancelar</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default AddToPlaylistModal;
