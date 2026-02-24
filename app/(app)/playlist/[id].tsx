import React, { useMemo } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAuthStore } from '../../../src/store/authStore';
import {
  usePlaylistDetail,
  usePlaylistSongs,
  useFollowedPlaylists,
  useFollowPlaylist,
  useUnfollowPlaylist,
} from '../../../src/hooks/usePlaylists';
import SongCard from '../../../src/components/cards/SongCard';
import ErrorState from '../../../src/components/ui/ErrorState';
import EmptyState from '../../../src/components/ui/EmptyState';
import { formatDate } from '../../../src/utils/formatters';
import { getCoverImage } from '../../../src/utils/coverImages';
import type { Cancion } from '../../../src/types/api.types';

const PlaylistDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const playlistId = Number(id);
  const userId = useAuthStore((s) => s.userId);

  // Proteger contra NaN
  if (!id || isNaN(playlistId)) {
    return (
      <SafeAreaView className="flex-1 bg-spotify-black">
        <ErrorState message="ID de playlist inválido" onRetry={() => router.back()} />
      </SafeAreaView>
    );
  }

  const { data: playlist, isLoading, isError, refetch } = usePlaylistDetail(playlistId);
  const { data: songs, isLoading: songsLoading } = usePlaylistSongs(playlistId);
  const { data: followedPlaylists } = useFollowedPlaylists(userId);

  const followMutation = useFollowPlaylist(userId);
  const unfollowMutation = useUnfollowPlaylist(userId);

  const isFollowed = useMemo(
    () => followedPlaylists?.some((p) => p.id === playlistId) ?? false,
    [followedPlaylists, playlistId]
  );

  const isOwn = playlist?.usuario?.id === userId;

  const toggleFollow = () => {
    if (isFollowed) unfollowMutation.mutate(playlistId);
    else followMutation.mutate(playlistId);
  };

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

  const renderHeader = () => (
    <View>
      {/* Back button */}
      <TouchableOpacity onPress={() => router.back()} className="px-4 pt-2 pb-3">
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Hero */}
      <View className="items-center px-4 pb-4">
        <Image
          source={getCoverImage(playlistId, 'playlist')}
          style={{ width: 192, height: 192, borderRadius: 8, marginBottom: 16 }}
          resizeMode="cover"
        />
        <Text className="text-spotify-white text-2xl font-bold text-center">
          {playlist.titulo}
        </Text>
        {playlist.usuario && (
          <Text className="text-spotify-gray text-sm mt-1">
            De {playlist.usuario.username}
          </Text>
        )}
        <Text className="text-spotify-light-gray text-xs mt-1">
          {playlist.numeroCanciones ?? songs?.length ?? 0} canciones
          {playlist.fechaCreacion ? ` · ${formatDate(playlist.fechaCreacion)}` : ''}
        </Text>
      </View>

      {/* Follow button (solo si no es propia) */}
      {!isOwn && (
        <View className="flex-row justify-center pb-4">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={toggleFollow}
            disabled={followMutation.isPending || unfollowMutation.isPending}
            className={`px-6 py-2 rounded-full border ${
              isFollowed ? 'border-spotify-green' : 'border-spotify-light-gray'
            }`}
          >
            <Text
              className={`text-sm font-bold ${
                isFollowed ? 'text-spotify-green' : 'text-spotify-white'
              }`}
            >
              {isFollowed ? 'Siguiendo' : 'Seguir'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Songs header */}
      {songsLoading && <ActivityIndicator color="#1DB954" className="mt-4" />}
    </View>
  );

  const renderSong = ({ item, index }: { item: Cancion; index: number }) => (
    <SongCard song={item} index={index + 1} />
  );

  return (
    <SafeAreaView className="flex-1 bg-spotify-black">
      <FlatList
        data={songs ?? []}
        keyExtractor={(item, index) => item?.id ? item.id.toString() : `song-${index}`}
        renderItem={renderSong}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          !songsLoading ? (
            <EmptyState
              icon="musical-note-outline"
              title="Sin canciones"
              subtitle="Esta playlist aún no tiene canciones"
            />
          ) : null
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
};

export default PlaylistDetailScreen;
