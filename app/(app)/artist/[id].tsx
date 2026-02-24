import React, { useMemo } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAuthStore } from '../../../src/store/authStore';
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
      {/* Back */}
      <TouchableOpacity onPress={() => router.back()} className="px-4 pt-2 pb-3">
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Hero */}
      <View className="items-center px-4 pb-4">
        <Image
          source={getCoverImage(artistId, 'artist')}
          style={{ width: 192, height: 192, borderRadius: 96, marginBottom: 16 }}
          resizeMode="cover"
        />
        <Text className="text-spotify-white text-2xl font-bold text-center">
          {artist.nombre}
        </Text>
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

      {/* Canciones header */}
      <SectionHeader title="Canciones populares" />
      {songsLoading && <ActivityIndicator color="#1DB954" className="mt-2" />}
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
};

export default ArtistDetailScreen;
