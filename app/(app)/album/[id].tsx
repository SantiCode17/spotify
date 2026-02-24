import React, { useMemo } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAuthStore } from '../../../src/store/authStore';
import {
  useAlbumDetail,
  useAlbumSongs,
  useFollowedAlbums,
  useFollowAlbum,
  useUnfollowAlbum,
} from '../../../src/hooks/useAlbums';
import SongCard from '../../../src/components/cards/SongCard';
import ErrorState from '../../../src/components/ui/ErrorState';
import EmptyState from '../../../src/components/ui/EmptyState';
import { getCoverImage } from '../../../src/utils/coverImages';
import type { Cancion } from '../../../src/types/api.types';

const AlbumDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const albumId = Number(id);
  const userId = useAuthStore((s) => s.userId);

  const { data: album, isLoading, isError, refetch } = useAlbumDetail(albumId);
  const { data: songs, isLoading: songsLoading } = useAlbumSongs(albumId);
  const { data: followedAlbums } = useFollowedAlbums(userId);

  const followMutation = useFollowAlbum(userId);
  const unfollowMutation = useUnfollowAlbum(userId);

  const isFollowed = useMemo(
    () => followedAlbums?.some((a) => a.id === albumId) ?? false,
    [followedAlbums, albumId]
  );

  const toggleFollow = () => {
    if (isFollowed) unfollowMutation.mutate(albumId);
    else followMutation.mutate(albumId);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-spotify-black items-center justify-center">
        <ActivityIndicator size="large" color="#1DB954" />
      </SafeAreaView>
    );
  }

  if (isError || !album) {
    return (
      <SafeAreaView className="flex-1 bg-spotify-black">
        <ErrorState message="No se pudo cargar el álbum" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const renderHeader = () => (
    <View>
      {/* Back */}
      <TouchableOpacity onPress={() => router.back()} className="px-4 pt-2 pb-3">
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Hero */}
      <View className="items-center px-4 pb-4">
        <Image
          source={getCoverImage(albumId, 'album')}
          style={{ width: 192, height: 192, borderRadius: 4, marginBottom: 16 }}
          resizeMode="cover"
        />
        <Text className="text-spotify-white text-2xl font-bold text-center">
          {album.titulo}
        </Text>
        {album.artista && (
          <TouchableOpacity onPress={() => router.push(`/artist/${album.artista!.id}`)}>
            <Text className="text-spotify-green text-sm mt-1 font-semibold">
              {album.artista.nombre}
            </Text>
          </TouchableOpacity>
        )}
        {album.anyo && (
          <Text className="text-spotify-light-gray text-xs mt-1">
            {album.anyo} · {songs?.length ?? 0} canciones
          </Text>
        )}
      </View>

      {/* Follow */}
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
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderSong}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          !songsLoading ? (
            <EmptyState
              icon="disc-outline"
              title="Sin canciones"
              subtitle="Este álbum aún no tiene canciones"
            />
          ) : null
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
};

export default AlbumDetailScreen;
