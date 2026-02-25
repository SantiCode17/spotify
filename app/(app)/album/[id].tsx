import React, { useMemo } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuthStore } from '../../../src/store/authStore';
import { usePlayerStore } from '../../../src/store/playerStore';
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
  const playSongFromQueue = usePlayerStore((s) => s.playSongFromQueue);

  const { data: album, isLoading, isError, refetch } = useAlbumDetail(albumId);
  const { data: songs, isLoading: songsLoading } = useAlbumSongs(albumId);
  const { data: followedAlbums } = useFollowedAlbums(userId);

  const followMutation = useFollowAlbum(userId);
  const unfollowMutation = useUnfollowAlbum(userId);

  const isFollowed = useMemo(
    () => followedAlbums?.some((a) => a.id === albumId) ?? false,
    [followedAlbums, albumId]
  );

  // ★ Portada consistente: la misma imagen del álbum para TODAS las canciones
  const albumCover = useMemo(() => getCoverImage(albumId, 'album'), [albumId]);

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
      <LinearGradient colors={['#3b1f2b', '#2a1520', '#121212']} style={{ paddingBottom: 24 }}>
        {/* Volver */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 }}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Portada y datos del album */}
        <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
          <View style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.5,
            shadowRadius: 20,
            elevation: 16,
          }}>
            <Image
              source={albumCover}
              style={{ width: 200, height: 200, borderRadius: 6 }}
              resizeMode="cover"
            />
          </View>
          <Text
            style={{ color: '#fff', fontSize: 24, fontWeight: '800', textAlign: 'center', marginTop: 20 }}
          >
            {album.titulo}
          </Text>
          {album.artista && (
            <TouchableOpacity onPress={() => router.push(`/artist/${album.artista!.id}`)}>
              <Text style={{ color: '#1DB954', fontSize: 14, fontWeight: '600', marginTop: 6 }}>
                {album.artista.nombre}
              </Text>
            </TouchableOpacity>
          )}
          {album.anyo && (
            <Text style={{ color: '#686868', fontSize: 12, marginTop: 4 }}>
              {album.anyo} · {songs?.length ?? 0} canciones
            </Text>
          )}
        </View>
      </LinearGradient>

      {/* Seguir y reproducir */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 16,
          paddingHorizontal: 20,
        }}
      >
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

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            if (songs && songs.length > 0) {
              playSongFromQueue(songs[0], songs);
              router.push(`/song/${songs[0].id}`);
            }
          }}
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

  const renderSong = ({ item, index }: { item: Cancion; index: number }) => (
    <SongCard
      song={item}
      index={index + 1}
      coverOverride={albumCover}
      onPress={() => {
        playSongFromQueue(item, songs ?? []);
        router.push(`/song/${item.id}`);
      }}
    />
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
