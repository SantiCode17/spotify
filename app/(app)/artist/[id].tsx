import React, { useMemo } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuthStore } from '../../../src/store/authStore';
import { usePlayerStore } from '../../../src/store/playerStore';
import {
  useArtistDetail,
  useArtistAlbums,
  useArtistSongs,
  useFollowedArtists,
  useFollowArtist,
  useUnfollowArtist,
} from '../../../src/hooks/useArtists';
import SongCard from '../../../src/components/cards/SongCard';
import AlbumCard from '../../../src/components/cards/AlbumCard';
import SectionHeader from '../../../src/components/SectionHeader';
import HorizontalList from '../../../src/components/lists/HorizontalList';
import ErrorState from '../../../src/components/ui/ErrorState';
import { getCoverImage } from '../../../src/utils/coverImages';
import type { Cancion, Album } from '../../../src/types/api.types';

const ArtistDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const artistId = Number(id);
  const userId = useAuthStore((s) => s.userId);
  const playSongFromQueue = usePlayerStore((s) => s.playSongFromQueue);

  const { data: artist, isLoading, isError, refetch } = useArtistDetail(artistId);
  const { data: albums, isLoading: albumsLoading } = useArtistAlbums(artistId);
  const { data: songs, isLoading: songsLoading } = useArtistSongs(artistId);
  const { data: followedArtists } = useFollowedArtists(userId);

  const followMutation = useFollowArtist(userId);
  const unfollowMutation = useUnfollowArtist(userId);

  const isFollowed = useMemo(
    () => followedArtists?.some((a) => a.id === artistId) ?? false,
    [followedArtists, artistId]
  );

  const toggleFollow = () => {
    if (isFollowed) unfollowMutation.mutate(artistId);
    else followMutation.mutate(artistId);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-spotify-black items-center justify-center">
        <ActivityIndicator size="large" color="#1DB954" />
      </SafeAreaView>
    );
  }

  if (isError || !artist) {
    return (
      <SafeAreaView className="flex-1 bg-spotify-black">
        <ErrorState message="No se pudo cargar el artista" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  // Usamos FlatList con canciones como data principal y albums en header
  const renderHeader = () => (
    <View>
      <LinearGradient colors={['#1a3a2a', '#15291f', '#121212']} style={{ paddingBottom: 24 }}>
        {/* Volver */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 }}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Portada y nombre del artista */}
        <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
          <View style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.5,
            shadowRadius: 20,
            elevation: 16,
          }}>
            <Image
              source={getCoverImage(artistId, 'artist')}
              style={{ width: 200, height: 200, borderRadius: 100 }}
              resizeMode="cover"
            />
          </View>
          <Text
            style={{ color: '#fff', fontSize: 26, fontWeight: '800', textAlign: 'center', marginTop: 20 }}
          >
            {artist.nombre}
          </Text>
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
              const shuffled = [...songs].sort(() => Math.random() - 0.5);
              playSongFromQueue(shuffled[0], shuffled);
              router.push(`/song/${shuffled[0].id}`);
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
          <Ionicons name="shuffle" size={26} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Álbumes */}
      <SectionHeader title="Álbumes" />
      <HorizontalList<Album>
        data={albums}
        isLoading={albumsLoading}
        keyExtractor={(a) => a.id.toString()}
        renderItem={(album) => (
          <AlbumCard album={album} onPress={() => router.push(`/album/${album.id}`)} />
        )}
        emptyIcon="disc-outline"
        emptyTitle="Sin álbumes"
      />

      {/* Cabecera de canciones */}
      <SectionHeader title="Canciones populares" />
      {songsLoading && <ActivityIndicator color="#1DB954" style={{ marginTop: 8 }} />}
    </View>
  );

  const renderSong = ({ item, index }: { item: Cancion; index: number }) => (
    <SongCard
      song={item}
      index={index + 1}
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
};

export default ArtistDetailScreen;
