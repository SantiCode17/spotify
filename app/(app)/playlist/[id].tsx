import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuthStore } from '../../../src/store/authStore';
import { usePlayerStore } from '../../../src/store/playerStore';
import {
  usePlaylistDetail,
  usePlaylistSongs,
  useFollowedPlaylists,
  useFollowPlaylist,
  useUnfollowPlaylist,
  useRemoveSongFromPlaylist,
} from '../../../src/hooks/usePlaylists';
import { useSavedSongs, useSaveSong, useUnsaveSong } from '../../../src/hooks/useSongs';
import AddToPlaylistModal from '../../../src/components/modals/AddToPlaylistModal';
import AddSongSearchModal from '../../../src/components/modals/AddSongSearchModal';
import ErrorState from '../../../src/components/ui/ErrorState';
import EmptyState from '../../../src/components/ui/EmptyState';
import { formatDate, formatDuration } from '../../../src/utils/formatters';
import { getCoverImage } from '../../../src/utils/coverImages';
import type { Cancion } from '../../../src/types/api.types';

const PlaylistDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const playlistId = Number(id);
  const userId = useAuthStore((s) => s.userId);

  // Estado de modales
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
  const [selectedSongIdForPlaylist, setSelectedSongIdForPlaylist] = useState<number | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [localSongs, setLocalSongs] = useState<Cancion[]>([]);

  // Player
  const playSongFromQueue = usePlayerStore((s) => s.playSongFromQueue);

  if (!id || isNaN(playlistId)) {
    return (
      <SafeAreaView className="flex-1 bg-spotify-black">
        <ErrorState message="ID de playlist inválido" onRetry={() => router.back()} />
      </SafeAreaView>
    );
  }

  // Queries
  const { data: playlist, isLoading, isError, refetch } = usePlaylistDetail(playlistId);
  const { data: songs, isLoading: songsLoading } = usePlaylistSongs(playlistId);
  const { data: followedPlaylists } = useFollowedPlaylists(userId);
  const { data: savedSongs } = useSavedSongs(userId);

  // Mutaciones
  const followMutation = useFollowPlaylist(userId);
  const unfollowMutation = useUnfollowPlaylist(userId);
  const removeSongMutation = useRemoveSongFromPlaylist(playlistId);
  const saveSongMutation = useSaveSong(userId);
  const unsaveSongMutation = useUnsaveSong(userId);

  // Sincronizar canciones locales con las de la API
  useEffect(() => {
    if (songs) setLocalSongs(songs);
  }, [songs]);

  const savedIds = useMemo(
    () => new Set((savedSongs ?? []).map((s) => s.id)),
    [savedSongs]
  );

  const isFollowed = useMemo(
    () => followedPlaylists?.some((p) => p.id === playlistId) ?? false,
    [followedPlaylists, playlistId]
  );

  const isOwn = playlist?.usuario?.id === userId;

  const toggleFollow = () => {
    if (isFollowed) unfollowMutation.mutate(playlistId);
    else followMutation.mutate(playlistId);
  };

  // Eliminar canción de la playlist (solo propietario)
  const handleDeleteSong = useCallback(
    (song: Cancion) => {
      Alert.alert('Eliminar canción', `¿Quitar "${song.titulo}" de esta playlist?`, [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            removeSongMutation.mutate(song.id);
            setLocalSongs((prev) => prev.filter((s) => s.id !== song.id));
          },
        },
      ]);
    },
    [removeSongMutation]
  );

  // Guardar/quitar de favoritos o abrir modal para añadir a otra playlist
  const handleSongAction = useCallback(
    (songId: number) => {
      if (!userId) return;
      const isAlreadySaved = savedIds.has(songId);
      if (isAlreadySaved) {
        // Ya está guardada: abrir modal para añadir a una playlist
        setSelectedSongIdForPlaylist(songId);
        setShowAddToPlaylistModal(true);
      } else {
        // No guardada: guardar como favorita
        saveSongMutation.mutate(songId);
      }
    },
    [userId, savedIds, saveSongMutation]
  );

  // Mover canción arriba en la lista
  const moveSongUp = useCallback((index: number) => {
    if (index <= 0) return;
    setLocalSongs((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }, []);

  // Mover canción abajo en la lista
  const moveSongDown = useCallback(
    (index: number) => {
      setLocalSongs((prev) => {
        if (index >= prev.length - 1) return prev;
        const next = [...prev];
        [next[index], next[index + 1]] = [next[index + 1], next[index]];
        return next;
      });
    },
    []
  );

  // Reproducir una canción de la playlist con cola
  const handlePlaySong = useCallback(
    (song: Cancion) => {
      playSongFromQueue(song, localSongs);
      router.push(`/song/${song.id}`);
    },
    [localSongs, playSongFromQueue]
  );

  // Reproducir toda la playlist desde el principio
  const handlePlayAll = useCallback(() => {
    if (localSongs.length === 0) return;
    playSongFromQueue(localSongs[0], localSongs);
    router.push(`/song/${localSongs[0].id}`);
  }, [localSongs, playSongFromQueue]);

  // Duración total
  const totalDuration = useMemo(() => {
    const total = localSongs.reduce((acc, s) => acc + (s.duracion ?? 0), 0);
    const hours = Math.floor(total / 3600);
    const mins = Math.floor((total % 3600) / 60);
    if (hours > 0) return `${hours} h ${mins} min`;
    return `${mins} min`;
  }, [localSongs]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-spotify-black items-center justify-center">
        <ActivityIndicator size="large" color="#1DB954" />
      </SafeAreaView>
    );
  }

  if (isError || !playlist) {
    return (
      <SafeAreaView className="flex-1 bg-spotify-black">
        <ErrorState message="No se pudo cargar la playlist" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  // Cabecera de la playlist
  const renderHeader = () => (
    <View>
      <LinearGradient colors={['#1e3a5f', '#162b47', '#121212']} style={{ paddingBottom: 24 }}>
        {/* Barra superior */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 12,
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          {isOwn && (
            <TouchableOpacity
              onPress={() => setIsEditMode((prev) => !prev)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 16,
                backgroundColor: isEditMode ? '#1DB954' : 'transparent',
                borderWidth: isEditMode ? 0 : 1,
                borderColor: '#535353',
              }}
            >
              <Text
                style={{
                  color: isEditMode ? '#000' : '#fff',
                  fontSize: 13,
                  fontWeight: '700',
                }}
              >
                {isEditMode ? 'Hecho' : 'Editar'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Portada y datos */}
        <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
          <View
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.5,
              shadowRadius: 20,
              elevation: 16,
            }}
          >
            <Image
              source={getCoverImage(playlistId, 'playlist')}
              style={{ width: 200, height: 200, borderRadius: 8 }}
              resizeMode="cover"
            />
          </View>
          <Text
            style={{
              color: '#fff',
              fontSize: 24,
              fontWeight: '800',
              textAlign: 'center',
              marginTop: 20,
            }}
          >
            {playlist.titulo}
          </Text>
          {playlist.usuario && (
            <Text style={{ color: '#A7A7A7', fontSize: 14, marginTop: 6 }}>
              De {playlist.usuario.username}
            </Text>
          )}
          <Text style={{ color: '#686868', fontSize: 12, marginTop: 4 }}>
            {localSongs.length} canciones · {totalDuration}
            {playlist.fechaCreacion ? ` · ${formatDate(playlist.fechaCreacion)}` : ''}
          </Text>
        </View>
      </LinearGradient>

      {/* Botones de acción */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 16,
          paddingHorizontal: 20,
          gap: 12,
        }}
      >
        {/* Botón seguir (solo si no es propia) */}
        {!isOwn && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={toggleFollow}
            disabled={followMutation.isPending || unfollowMutation.isPending}
            style={{
              paddingHorizontal: 28,
              paddingVertical: 10,
              borderRadius: 24,
              borderWidth: 1.5,
              borderColor: isFollowed ? '#1DB954' : '#535353',
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: isFollowed ? '#1DB954' : '#fff',
              }}
            >
              {isFollowed ? 'Siguiendo' : 'Seguir'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Botón añadir canciones (propietario, modo normal) */}
        {isOwn && !isEditMode && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowSearchModal(true)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 24,
              paddingVertical: 10,
              borderRadius: 24,
              backgroundColor: '#1DB954',
            }}
          >
            <Ionicons name="add" size={20} color="#000" />
            <Text style={{ color: '#000', fontSize: 14, fontWeight: '700', marginLeft: 6 }}>
              Añadir canciones
            </Text>
          </TouchableOpacity>
        )}

        {/* Indicador modo edición */}
        {isEditMode && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#1A1A1A',
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            <Ionicons name="reorder-three-outline" size={20} color="#A7A7A7" />
            <Text style={{ color: '#A7A7A7', fontSize: 13, fontWeight: '600', marginLeft: 8 }}>
              Usa las flechas para reordenar
            </Text>
          </View>
        )}

        {/* Botón play */}
        <TouchableOpacity
          onPress={handlePlayAll}
          style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: '#1DB954',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 'auto',
          }}
        >
          <Ionicons name="play" size={26} color="#000" style={{ marginLeft: 2 }} />
        </TouchableOpacity>
      </View>

      {songsLoading && <ActivityIndicator color="#1DB954" style={{ marginTop: 8 }} />}
    </View>
  );

  // Renderizar cada canción de la playlist
  const renderSong = ({ item, index }: { item: Cancion; index: number }) => {
    if (isEditMode) {
      return (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
            paddingHorizontal: 16,
            backgroundColor: '#121212',
          }}
        >
          {/* Flechas de reordenar */}
          <View style={{ alignItems: 'center', marginRight: 8, width: 32 }}>
            <TouchableOpacity
              onPress={() => moveSongUp(index)}
              disabled={index === 0}
              hitSlop={{ top: 8, bottom: 4, left: 8, right: 8 }}
              style={{ opacity: index === 0 ? 0.25 : 1, padding: 2 }}
            >
              <Ionicons name="chevron-up" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => moveSongDown(index)}
              disabled={index === localSongs.length - 1}
              hitSlop={{ top: 4, bottom: 8, left: 8, right: 8 }}
              style={{ opacity: index === localSongs.length - 1 ? 0.25 : 1, padding: 2 }}
            >
              <Ionicons name="chevron-down" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <Image
            source={getCoverImage(item.id, 'song')}
            style={{ width: 44, height: 44, borderRadius: 6 }}
            resizeMode="cover"
          />
          <View style={{ flex: 1, marginLeft: 12, marginRight: 8 }}>
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }} numberOfLines={1}>
              {item.titulo}
            </Text>
            <Text style={{ color: '#A7A7A7', fontSize: 13, marginTop: 2 }} numberOfLines={1}>
              {item.album?.artista?.nombre ?? 'Artista'}
              {item.duracion ? ` · ${formatDuration(item.duracion)}` : ''}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => handleDeleteSong(item)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={{ padding: 8 }}
          >
            <Ionicons name="close-circle" size={22} color="#E53935" />
          </TouchableOpacity>
        </View>
      );
    }

    // Modo normal: canción con acciones
    const isSaved = savedIds.has(item.id);
    return (
      <TouchableOpacity
        activeOpacity={0.65}
        onPress={() => handlePlaySong(item)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 10,
          paddingHorizontal: 16,
        }}
      >
        <Text
          style={{
            width: 28,
            textAlign: 'center',
            fontSize: 13,
            color: '#A7A7A7',
            fontWeight: '500',
          }}
        >
          {index + 1}
        </Text>
        <Image
          source={getCoverImage(item.id, 'song')}
          style={{ width: 48, height: 48, borderRadius: 6 }}
          resizeMode="cover"
        />
        <View style={{ flex: 1, marginLeft: 14, marginRight: 12 }}>
          <Text
            style={{ color: '#fff', fontSize: 15, fontWeight: '600', lineHeight: 20 }}
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

        {/* Botón eliminar (solo propietario) */}
        {isOwn && (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation?.();
              handleDeleteSong(item);
            }}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={{ marginRight: 4, padding: 8 }}
          >
            <Ionicons name="trash-outline" size={18} color="#E53935" />
          </TouchableOpacity>
        )}

        {/* Botón añadir a playlist / guardar */}
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation?.();
            // Siempre abrir modal para añadir a una de tus playlists
            setSelectedSongIdForPlaylist(item.id);
            setShowAddToPlaylistModal(true);
          }}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={{ padding: 8 }}
        >
          <Ionicons name="add-circle-outline" size={22} color="#B3B3B3" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-spotify-black">
      <FlatList
        data={localSongs}
        keyExtractor={(item, index) => (item?.id ? `${item.id}-${index}` : `song-${index}`)}
        renderItem={renderSong}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          !songsLoading ? (
            <EmptyState
              icon="musical-note-outline"
              title="Sin canciones"
              subtitle={
                isOwn
                  ? 'Busca canciones y añádelas a tu playlist'
                  : 'Esta playlist aún no tiene canciones'
              }
              actionLabel={isOwn ? 'Añadir canciones' : undefined}
              onAction={isOwn ? () => setShowSearchModal(true) : undefined}
            />
          ) : null
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Modal para añadir canción a una de tus playlists */}
      <AddToPlaylistModal
        visible={showAddToPlaylistModal}
        songId={selectedSongIdForPlaylist}
        onClose={() => {
          setShowAddToPlaylistModal(false);
          setSelectedSongIdForPlaylist(null);
        }}
      />

      {/* Modal para buscar y añadir canciones a esta playlist (propietario) */}
      <AddSongSearchModal
        visible={showSearchModal}
        playlistId={playlistId}
        onClose={() => setShowSearchModal(false)}
      />
    </SafeAreaView>
  );
};

export default PlaylistDetailScreen;
