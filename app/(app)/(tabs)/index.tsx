import React from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useAuthStore } from '../../../src/store/authStore';
import { usePlayerStore } from '../../../src/store/playerStore';
import { useFollowedPlaylists } from '../../../src/hooks/usePlaylists';
import { useFollowedAlbums } from '../../../src/hooks/useAlbums';
import { useSavedSongs } from '../../../src/hooks/useSongs';
import { getCoverImage } from '../../../src/utils/coverImages';

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
  const playSongFromQueue = usePlayerStore((s) => s.playSongFromQueue);

  // Hooks de datos
  const playlists = useFollowedPlaylists(userId);
  const albums = useFollowedAlbums(userId);
  const songs = useSavedSongs(userId);

  // Saludo dinamico segun la hora del dia
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Buenos días', emoji: '☀️' };
    if (hour < 18) return { text: 'Buenas tardes', emoji: '🌅' };
    return { text: 'Buenas noches', emoji: '🌙' };
  };

  const greeting = getGreeting();

  // Limitar canciones a 10 para la FlatList
  const displaySongs = songs.data?.slice(0, 10) ?? [];

  return (
    <SafeAreaView className="flex-1 bg-spotify-black">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cabecera con avatar y saludo */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              overflow: 'hidden',
              marginRight: 14,
            }}
          >
            <Image
              source={getCoverImage(user?.id ?? 1, 'user')}
              style={{ width: 38, height: 38, borderRadius: 19 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#fff', fontSize: 26, fontWeight: '800' }}>
              {greeting.text} {greeting.emoji}
            </Text>
          </View>
        </View>

        {/* Seccion 1: Playlists seguidas */}
        <View style={{ marginTop: 20 }}>
          <SectionHeader
            title="Tus Playlists"
            actionLabel="Ver todo"
            onAction={() => router.push({ pathname: '/(app)/(tabs)/library', params: { filter: 'playlists' } })}
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

        {/* Seccion 2: Albums seguidos */}
        <View style={{ marginTop: 28 }}>
          <SectionHeader
            title="Tus Álbumes"
            actionLabel="Ver todo"
            onAction={() => router.push({ pathname: '/(app)/(tabs)/library', params: { filter: 'albums' } })}
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

        {/* Seccion 3: Canciones guardadas (FlatList vertical) */}
        <View style={{ marginTop: 28, marginBottom: 32 }}>
          <SectionHeader
            title="Canciones Guardadas"
            actionLabel="Ver todo"
            onAction={() => router.push('/(app)/liked-songs')}
          />

          {songs.isLoading ? (
            <View className="px-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <ShimmerRow key={i} />
              ))}
            </View>
          ) : songs.isError ? (
            <View style={{ alignItems: 'center', paddingVertical: 32 }}>
              <Ionicons name="cloud-offline-outline" size={36} color="#535353" />
              <Text style={{ color: '#686868', fontSize: 14, marginTop: 8 }}>
                Error al cargar canciones
              </Text>
              <TouchableOpacity onPress={() => songs.refetch()} style={{ marginTop: 8 }}>
                <Text style={{ color: '#1DB954', fontSize: 14, fontWeight: '600' }}>
                  Reintentar
                </Text>
              </TouchableOpacity>
            </View>
          ) : displaySongs.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 32 }}>
              <Ionicons name="heart-outline" size={36} color="#535353" />
              <Text style={{ color: '#686868', fontSize: 14, marginTop: 8 }}>
                Sin canciones guardadas
              </Text>
              <Text style={{ color: '#535353', fontSize: 12, marginTop: 4 }}>
                Guarda canciones para verlas aquí
              </Text>
            </View>
          ) : (
            <FlatList
              data={displaySongs}
              keyExtractor={(song) => song.id.toString()}
              scrollEnabled={false}
              renderItem={({ item: song, index }) => (
                <SongCard
                  song={song}
                  index={index + 1}
                  onPress={() => {
                    playSongFromQueue(song, songs.data ?? []);
                    router.push(`/song/${song.id}`);
                  }}
                />
              )}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
