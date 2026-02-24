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
  const { searches: recentSearches, add: addRecent, remove: removeRecent, clear: clearRecent } = useRecentSearches();

  React.useEffect(() => {
    if (data && debouncedQuery.trim().length >= 2) {
      const hasAny =
        data.artistas.length > 0 ||
        data.albums.length > 0 ||
        data.canciones.length > 0 ||
        data.playlists.length > 0 ||
        data.podcasts.length > 0;
      if (hasAny) addRecent(debouncedQuery.trim());
    }
  }, [data, debouncedQuery]);

  const isSearchActive = debouncedQuery.trim().length >= 2;

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
      <View className="px-4 pt-4 pb-2">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-white text-lg font-bold">Búsquedas recientes</Text>
          <TouchableOpacity onPress={clearRecent}>
            <Text className="text-spotify-gray text-sm">Borrar todo</Text>
          </TouchableOpacity>
        </View>
        {recentSearches.map((q) => (
          <TouchableOpacity
            key={q}
            className="flex-row items-center py-2.5"
            activeOpacity={0.7}
            onPress={() => setSearchQuery(q)}
          >
            <View className="w-10 h-10 rounded-full bg-spotify-darker items-center justify-center">
              <Ionicons name="time-outline" size={20} color="#B3B3B3" />
            </View>
            <Text className="text-white text-base ml-3 flex-1" numberOfLines={1}>{q}</Text>
            <TouchableOpacity
              onPress={() => removeRecent(q)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              className="p-2"
            >
              <Ionicons name="close" size={18} color="#535353" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderCategories = () => (
    <View className="px-4 pt-4">
      <Text className="text-white text-lg font-bold mb-3">Explorar categorías</Text>
      <View className="flex-row flex-wrap justify-between">
        {CATEGORIES.map((cat) => (
          <View key={cat.name} style={{ width: '48%', marginBottom: 12 }}>
            <View
              style={{ backgroundColor: cat.color, height: 100, borderRadius: 8 }}
              className="justify-between p-3 overflow-hidden"
            >
              <Ionicons name={cat.icon} size={28} color="rgba(255,255,255,0.6)" style={{ alignSelf: 'flex-end' }} />
              <Text className="text-white text-base font-bold">{cat.name}</Text>
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
            {data.canciones.map((song) => (
              <SongCard
                key={`song-${song.id}`}
                song={song}
                onAddToPlaylist={() => handleAddToPlaylist(song.id)}
              />
            ))}
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
      <Text className="text-white text-[28px] font-bold px-4 pt-4 pb-2">Buscar</Text>

      <View className="px-4 mb-2">
        <View className="flex-row items-center bg-white rounded-lg px-3" style={{ height: 48 }}>
          <Ionicons name="search" size={20} color="#121212" />
          <TextInput
            className="flex-1 ml-2 text-base"
            style={{ color: '#121212', height: 48 }}
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
