import React, { useState, useCallback, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  Alert,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuthStore } from '../../store/authStore';
import { useAllSongs } from '../../hooks/useSongs';
import { useAddSongToPlaylist, usePlaylistSongs } from '../../hooks/usePlaylists';
import { getCoverImage } from '../../utils/coverImages';
import { formatDuration } from '../../utils/formatters';
import type { Cancion } from '../../types/api.types';

interface AddSongSearchModalProps {
  visible: boolean;
  playlistId: number;
  onClose: () => void;
}

const AddSongSearchModal: React.FC<AddSongSearchModalProps> = ({
  visible,
  playlistId,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const userId = useAuthStore((s) => s.userId);
  const { data: allSongs, isLoading: loadingSongs } = useAllSongs();
  const { data: playlistSongs } = usePlaylistSongs(playlistId);
  const addSongMutation = useAddSongToPlaylist(playlistId);

  const playlistSongIds = useMemo(
    () => new Set((playlistSongs ?? []).map((s) => s.id)),
    [playlistSongs]
  );

  const filteredSongs = useMemo(() => {
    if (!allSongs) return [];
    const q = query.trim().toLowerCase();
    if (q.length === 0) return allSongs.slice(0, 50);
    return allSongs
      .filter(
        (s) =>
          s.titulo.toLowerCase().includes(q) ||
          (s.album?.artista?.nombre ?? '').toLowerCase().includes(q) ||
          (s.album?.titulo ?? '').toLowerCase().includes(q)
      )
      .slice(0, 50);
  }, [allSongs, query]);

  const handleAddSong = useCallback(
    (song: Cancion) => {
      if (playlistSongIds.has(song.id)) {
        Alert.alert('Ya existe', `"${song.titulo}" ya está en esta playlist`);
        return;
      }
      addSongMutation.mutate(
        { cancionId: song.id, usuarioId: userId! },
        {
          onSuccess: () => {
            Alert.alert('¡Añadida!', `"${song.titulo}" se añadió a la playlist`);
          },
          onError: () => {
            Alert.alert('Error', 'No se pudo añadir la canción');
          },
        }
      );
    },
    [playlistSongIds, addSongMutation, userId]
  );

  const handleClose = () => {
    setQuery('');
    Keyboard.dismiss();
    onClose();
  };

  const renderSong = useCallback(
    ({ item }: { item: Cancion }) => {
      const alreadyAdded = playlistSongIds.has(item.id);
      return (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => !alreadyAdded && handleAddSong(item)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
            paddingHorizontal: 20,
            opacity: alreadyAdded ? 0.4 : 1,
          }}
        >
          <View
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <Image
              source={getCoverImage(item.id, 'song')}
              style={{ width: 48, height: 48, borderRadius: 6 }}
              resizeMode="cover"
            />
          </View>
          <View style={{ flex: 1, marginLeft: 14, marginRight: 12 }}>
            <Text
              style={{
                color: alreadyAdded ? '#1DB954' : '#fff',
                fontSize: 15,
                fontWeight: '600',
                lineHeight: 20,
              }}
              numberOfLines={1}
            >
              {item.titulo}
            </Text>
            <Text
              style={{ color: '#A7A7A7', fontSize: 13, lineHeight: 18, marginTop: 2 }}
              numberOfLines={1}
            >
              {item.album?.artista?.nombre ?? 'Artista'}
              {item.duracion ? ` · ${formatDuration(item.duracion)}` : ''}
            </Text>
          </View>
          {alreadyAdded ? (
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: '#1DB95420',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="checkmark" size={18} color="#1DB954" />
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => handleAddSong(item)}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                borderWidth: 1.5,
                borderColor: '#535353',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="add" size={18} color="#fff" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      );
    },
    [playlistSongIds, handleAddSong]
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View style={{ flex: 1, backgroundColor: '#121212' }}>
        {/* Cabecera con degradado */}
        <LinearGradient
          colors={['#1A3A2A', '#162B20', '#121212']}
          style={{ paddingTop: 54, paddingBottom: 16 }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
            }}
          >
            <TouchableOpacity
              onPress={handleClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: '#00000040',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="close" size={22} color="#fff" />
            </TouchableOpacity>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800' }}>
                Añadir canciones
              </Text>
              <Text style={{ color: '#A7A7A7', fontSize: 13, marginTop: 2 }}>
                Busca y añade canciones a tu playlist
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Barra de busqueda */}
        <View
          style={{
            marginHorizontal: 16,
            marginTop: 4,
            marginBottom: 8,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#2A2A2A',
            borderRadius: 12,
            paddingHorizontal: 14,
            height: 48,
          }}
        >
          <Ionicons name="search" size={20} color="#A7A7A7" />
          <TextInput
            style={{
              flex: 1,
              marginLeft: 12,
              color: '#fff',
              fontSize: 15,
              height: 48,
            }}
            placeholder="Buscar canciones, artistas, álbumes…"
            placeholderTextColor="#686868"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={{ padding: 4 }}>
              <Ionicons name="close-circle" size={20} color="#686868" />
            </TouchableOpacity>
          )}
        </View>

        {/* Pista */}
        {query.length === 0 && !loadingSongs && (
          <View style={{ alignItems: 'center', paddingVertical: 8 }}>
            <Text style={{ color: '#535353', fontSize: 13 }}>
              Mostrando canciones populares
            </Text>
          </View>
        )}

        {/* Contenido */}
        {loadingSongs ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#1DB954" />
            <Text style={{ color: '#686868', fontSize: 14, marginTop: 12 }}>
              Cargando canciones…
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredSongs}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderSong}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, backgroundColor: '#1A1A1A', marginHorizontal: 20 }} />
            )}
            ListEmptyComponent={
              query.length > 0 ? (
                <View style={{ alignItems: 'center', paddingTop: 60 }}>
                  <View
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 36,
                      backgroundColor: '#1A1A1A',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 16,
                    }}
                  >
                    <Ionicons name="search" size={32} color="#535353" />
                  </View>
                  <Text style={{ color: '#fff', fontSize: 17, fontWeight: '700' }}>
                    Sin resultados
                  </Text>
                  <Text style={{ color: '#686868', fontSize: 14, marginTop: 6 }}>
                    No encontramos "{query}"
                  </Text>
                </View>
              ) : null
            }
          />
        )}
      </View>
    </Modal>
  );
};

export default AddSongSearchModal;
