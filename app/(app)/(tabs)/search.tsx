import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useDebounce } from '../../../src/hooks/useDebounce';
import { useSearch } from '../../../src/hooks/useSearch';
import { useRecentSearches } from '../../../src/hooks/useRecentSearches';
import { useSavedSongs, useSaveSong, useUnsaveSong } from '../../../src/hooks/useSongs';
import { useAuthStore } from '../../../src/store/authStore';
import { usePlayerStore } from '../../../src/store/playerStore';

import SectionHeader from '../../../src/components/SectionHeader';
import ArtistCard from '../../../src/components/cards/ArtistCard';
import AlbumCard from '../../../src/components/cards/AlbumCard';
import SongCard from '../../../src/components/cards/SongCard';
import PlaylistCard from '../../../src/components/cards/PlaylistCard';
import PodcastCard from '../../../src/components/cards/PodcastCard';
import AddToPlaylistModal from '../../../src/components/modals/AddToPlaylistModal';

const CATEGORIES = [
  { name: 'Pop', color: '#1DB954', icon: 'musical-notes' as const },
  { name: 'Rock', color: '#E13300', icon: 'flame' as const },
  { name: 'Hip-Hop', color: '#2D46B9', icon: 'headset' as const },
  { name: 'Podcasts', color: '#E8A000', icon: 'mic' as const },
  { name: 'Electrónica', color: '#7B2FBE', icon: 'pulse' as const },
  { name: 'Playlists', color: '#E8601C', icon: 'list' as const },
  { name: 'Jazz', color: '#1a5276', icon: 'cafe' as const },
  { name: 'Clásica', color: '#7d6608', icon: 'radio' as const },
] as const;

const SearchScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSongId, setSelectedSongId] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 400);
  const { data, isLoading, isError } = useSearch(debouncedQuery);
  const userId = useAuthStore((s) => s.userId);
  const playSongFromQueue = usePlayerStore((s) => s.playSongFromQueue);
  const { data: savedSongs } = useSavedSongs(userId ?? null);
  const saveSong = useSaveSong(userId ?? null);
  const unsaveSong = useUnsaveSong(userId ?? null);
  const { searches: recentSearches, add: addRecent, remove: removeRecent, clear: clearRecent } = useRecentSearches();

  React.useEffect(() => {
    if (data && debouncedQuery.trim().length >= 3) {
      const hasAny =
        data.artistas.length > 0 ||
        data.albums.length > 0 ||
        data.canciones.length > 0 ||
        data.playlists.length > 0 ||
        data.podcasts.length > 0;
      if (hasAny) addRecent(debouncedQuery.trim());
    }
  }, [data, debouncedQuery]);

  const isSearchActive = debouncedQuery.trim().length >= 3;

  const hasResults =
    data &&
    (data.artistas.length > 0 ||
      data.albums.length > 0 ||
      data.canciones.length > 0 ||
      data.playlists.length > 0 ||
      data.podcasts.length > 0);

  const handleAddToPlaylist = useCallback((songId: number) => {
    setSelectedSongId(songId);
    setShowAddModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowAddModal(false);
    setSelectedSongId(null);
  }, []);

  const renderRecentSearches = () => {
    if (recentSearches.length === 0) return null;
    return (
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>Búsquedas recientes</Text>
          <TouchableOpacity onPress={clearRecent}>
            <Text style={{ color: '#A7A7A7', fontSize: 13 }}>Borrar todo</Text>
          </TouchableOpacity>
        </View>
        {recentSearches.map((q) => (
          <TouchableOpacity
            key={q}
            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}
            activeOpacity={0.7}
            onPress={() => setSearchQuery(q)}
          >
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                backgroundColor: '#2A2A2A',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="time-outline" size={20} color="#A7A7A7" />
            </View>
            <Text style={{ color: '#fff', fontSize: 15, marginLeft: 14, flex: 1 }} numberOfLines={1}>{q}</Text>
            <TouchableOpacity
              onPress={() => removeRecent(q)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ padding: 8 }}
            >
              <Ionicons name="close" size={18} color="#535353" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderCategories = () => (
    <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
      <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 14 }}>
        Explorar categorías
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {CATEGORIES.map((cat) => (
          <View key={cat.name} style={{ width: '48%', marginBottom: 14 }}>
            <View
              style={{ backgroundColor: cat.color, height: 104, borderRadius: 10, overflow: 'hidden' }}
            >
              <View style={{ flex: 1, justifyContent: 'space-between', padding: 14 }}>
                <Ionicons name={cat.icon} size={30} color="rgba(255,255,255,0.5)" style={{ alignSelf: 'flex-end' }} />
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>{cat.name}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center py-20">
      <Ionicons name="search" size={48} color="#535353" />
      <Text className="text-spotify-gray text-base mt-4 text-center px-8">
        No se encontraron resultados para "{debouncedQuery}"
      </Text>
      <Text className="text-spotify-light-gray text-sm mt-2 text-center px-8">
        Comprueba que está bien escrito o prueba con otras palabras
      </Text>
    </View>
  );

  const renderLoading = () => (
    <View className="flex-1 items-center justify-center py-20">
      <ActivityIndicator size="large" color="#1DB954" />
      <Text className="text-spotify-gray text-sm mt-3">Buscando…</Text>
    </View>
  );

  const renderResults = () => {
    if (!data) return null;
    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {data.artistas.length > 0 && (
          <View className="mt-2">
            <SectionHeader title="Artistas" />
            <FlatList
              data={data.artistas}
              renderItem={({ item }) => (
                <ArtistCard artist={item} onPress={() => router.push(`/artist/${item.id}`)} size="md" />
              )}
              keyExtractor={(a) => `artist-${a.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              nestedScrollEnabled
            />
          </View>
        )}

        {data.albums.length > 0 && (
          <View className="mt-4">
            <SectionHeader title="Álbumes" />
            <FlatList
              data={data.albums}
              renderItem={({ item }) => (
                <AlbumCard album={item} onPress={() => router.push(`/album/${item.id}`)} size="md" />
              )}
              keyExtractor={(a) => `album-${a.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              nestedScrollEnabled
            />
          </View>
        )}

        {data.canciones.length > 0 && (
          <View className="mt-4">
            <SectionHeader title="Canciones" />
                {data.canciones.map((song) => {
                  const savedIds = new Set((savedSongs ?? []).map((s) => s.id));
                  const isFavorite = savedIds.has(song.id);

                  const handleAddPress = () => {
                    if (!userId) {
                      // redirigir a login si no hay usuario
                      router.push('/login');
                      return;
                    }
                    if (!isFavorite) {
                      saveSong.mutate(song.id);
                    } else {
                      // si ya está guardada, abrimos modal para añadir a playlist
                      handleAddToPlaylist(song.id);
                    }
                  };

                  return (
                    <SongCard
                      key={`song-${song.id}`}
                      song={song}
                      onPress={() => {
                        playSongFromQueue(song, data.canciones);
                        router.push(`/song/${song.id}`);
                      }}
                      onAddToPlaylist={handleAddPress}
                      isFavorite={isFavorite}
                    />
                  );
                })}
          </View>
        )}

        {data.playlists.length > 0 && (
          <View className="mt-4">
            <SectionHeader title="Playlists" />
            <FlatList
              data={data.playlists}
              renderItem={({ item }) => (
                <PlaylistCard playlist={item} onPress={() => router.push(`/playlist/${item.id}`)} size="md" />
              )}
              keyExtractor={(p) => `playlist-${p.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              nestedScrollEnabled
            />
          </View>
        )}

        {data.podcasts.length > 0 && (
          <View className="mt-4 mb-4">
            <SectionHeader title="Podcasts" />
            <FlatList
              data={data.podcasts}
              renderItem={({ item }) => (
                <PodcastCard podcast={item} onPress={() => router.push(`/podcast/${item.id}`)} size="md" />
              )}
              keyExtractor={(p) => `podcast-${p.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              nestedScrollEnabled
            />
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-spotify-black">
      <Text style={{ color: '#fff', fontSize: 28, fontWeight: '800', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10 }}>
        Buscar
      </Text>

      <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: 10,
            paddingHorizontal: 14,
            height: 48,
          }}
        >
          <Ionicons name="search" size={20} color="#121212" />
          <TextInput
            style={{ flex: 1, marginLeft: 10, color: '#121212', fontSize: 15, height: 48 }}
            placeholder="Artistas, canciones o podcasts"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity activeOpacity={0.7} onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#121212" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {!isSearchActive ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {renderRecentSearches()}
          {renderCategories()}
        </ScrollView>
      ) : isLoading ? (
        renderLoading()
      ) : isError ? (
        <View className="flex-1 items-center justify-center py-20">
          <Ionicons name="cloud-offline-outline" size={48} color="#535353" />
          <Text className="text-spotify-gray text-base mt-4">Error al buscar</Text>
          <Text className="text-spotify-light-gray text-sm mt-1">Revisa tu conexión a internet</Text>
        </View>
      ) : !hasResults ? (
        renderEmpty()
      ) : (
        renderResults()
      )}

      <AddToPlaylistModal visible={showAddModal} songId={selectedSongId} onClose={handleCloseModal} />
    </SafeAreaView>
  );
};

export default SearchScreen;
