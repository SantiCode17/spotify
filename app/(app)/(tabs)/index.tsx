import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useAuthStore } from '../../../src/store/authStore';
import { useFollowedPlaylists } from '../../../src/hooks/usePlaylists';
import { useFollowedAlbums } from '../../../src/hooks/useAlbums';
import { useSavedSongs } from '../../../src/hooks/useSongs';

import SectionHeader from '../../../src/components/SectionHeader';
import HorizontalList from '../../../src/components/lists/HorizontalList';
import PlaylistCard from '../../../src/components/cards/PlaylistCard';
import AlbumCard from '../../../src/components/cards/AlbumCard';
import SongCard from '../../../src/components/cards/SongCard';
import { ShimmerRow } from '../../../src/components/ui/ShimmerPlaceholder';

const HomeScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const user = useAuthStore((s) => s.user);
  const userId = useAuthStore((s) => s.userId);

  // ── Data hooks ──
  const playlists = useFollowedPlaylists(userId);
  const albums = useFollowedAlbums(userId);
  const songs = useSavedSongs(userId);

  // ── Saludo dinámico ──
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Buenos días', emoji: '☀️' };
    if (hour < 18) return { text: 'Buenas tardes', emoji: '🌅' };
    return { text: 'Buenas noches', emoji: '🌙' };
  };

  const greeting = getGreeting();

  // ── Avatar con iniciales ──
  const initials = user?.username
    ? user.username.substring(0, 1).toUpperCase()
    : '?';

  // Limitar canciones a 10 para .map()
  const displaySongs = songs.data?.slice(0, 10) ?? [];

  return (
    <SafeAreaView className="flex-1 bg-spotify-black">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Header con avatar + saludo ── */}
        <View className="flex-row items-center px-4 pt-4 pb-2">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            className="w-10 h-10 bg-spotify-darker rounded-full items-center justify-center mr-3"
          >
            <Text className="text-spotify-white text-base font-bold">{initials}</Text>
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-spotify-white text-2xl font-bold">
              {greeting.text} {greeting.emoji}
            </Text>
          </View>
        </View>

        {/* ── Sección 1: Playlists seguidas ── */}
        <View className="mt-4">
          <SectionHeader
            title="Tus Playlists"
            actionLabel="Ver todo"
            onAction={() => router.push('/(app)/(tabs)/library')}
          />
          <HorizontalList
            data={playlists.data}
            renderItem={(playlist) => (
              <PlaylistCard
                playlist={playlist}
                onPress={() => router.push(`/playlist/${playlist.id}`)}
                size="md"
              />
            )}
            keyExtractor={(p) => p.id.toString()}
            isLoading={playlists.isLoading}
            isError={playlists.isError}
            emptyIcon="musical-notes-outline"
            emptyTitle="Sin playlists aún"
            emptySubtitle="Sigue playlists para verlas aquí"
            onRetry={() => playlists.refetch()}
          />
        </View>

        {/* ── Sección 2: Álbumes seguidos ── */}
        <View className="mt-6">
          <SectionHeader
            title="Tus Álbumes"
            actionLabel="Ver todo"
            onAction={() => router.push('/(app)/(tabs)/library')}
          />
          <HorizontalList
            data={albums.data}
            renderItem={(album) => (
              <AlbumCard
                album={album}
                onPress={() => router.push(`/album/${album.id}`)}
                size="md"
              />
            )}
            keyExtractor={(a) => a.id.toString()}
            isLoading={albums.isLoading}
            isError={albums.isError}
            emptyIcon="disc-outline"
            emptyTitle="Sin álbumes aún"
            emptySubtitle="Sigue álbumes para verlos aquí"
            onRetry={() => albums.refetch()}
          />
        </View>

        {/* ── Sección 3: Canciones guardadas (con .map) ── */}
        <View className="mt-6 mb-8">
          <SectionHeader
            title="Canciones Guardadas"
            actionLabel="Ver todo"
            onAction={() => router.push('/(app)/(tabs)/library')}
          />

          {songs.isLoading ? (
            <View className="px-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <ShimmerRow key={i} />
              ))}
            </View>
          ) : songs.isError ? (
            <View className="items-center py-8">
              <Ionicons name="cloud-offline-outline" size={32} color="#535353" />
              <Text className="text-spotify-gray text-sm mt-2">Error al cargar canciones</Text>
              <Text
                onPress={() => songs.refetch()}
                className="text-spotify-green text-sm font-semibold mt-2"
              >
                Reintentar
              </Text>
            </View>
          ) : displaySongs.length === 0 ? (
            <View className="items-center py-8">
              <Ionicons name="heart-outline" size={32} color="#535353" />
              <Text className="text-spotify-gray text-sm mt-2">Sin canciones guardadas</Text>
              <Text className="text-spotify-light-gray text-xs mt-1">
                Guarda canciones para verlas aquí
              </Text>
            </View>
          ) : (
            displaySongs.map((song, index) => (
              <View key={song.id}>
                <SongCard
                  song={song}
                  index={index + 1}
                  isLiked
                  onPress={() => {}}
                />
                {index < displaySongs.length - 1 && (
                  <View className="h-px bg-spotify-darker mx-4" />
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
