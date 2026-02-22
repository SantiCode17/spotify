import React, { useState } from 'react';
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

import SectionHeader from '../../../src/components/SectionHeader';
import ArtistCard from '../../../src/components/cards/ArtistCard';
import AlbumCard from '../../../src/components/cards/AlbumCard';
import SongCard from '../../../src/components/cards/SongCard';
import PlaylistCard from '../../../src/components/cards/PlaylistCard';
import PodcastCard from '../../../src/components/cards/PodcastCard';
import AddToPlaylistModal from '../../../src/components/modals/AddToPlaylistModal';

// ── Categorías decorativas ──
const CATEGORIES = [
  { name: 'Pop', color: '#1DB954' },
  { name: 'Rock', color: '#E13300' },
  { name: 'Hip-Hop', color: '#2D46B9' },
  { name: 'Podcasts', color: '#E8A000' },
  { name: 'Electrónica', color: '#7B2FBE' },
  { name: 'Playlists', color: '#E8601C' },
] as const;

const SearchScreen = () => {
  const router = useRouter();

  // ── Estado local ──
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSongId, setSelectedSongId] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 400);
  const { data, isLoading, isError } = useSearch(debouncedQuery);

  // ── Helpers ──
  const isSearchActive = debouncedQuery.trim().length >= 3;

  const hasResults =
    data &&
    (data.artistas.length > 0 ||
      data.albums.length > 0 ||
      data.canciones.length > 0 ||
      data.playlists.length > 0 ||
      data.podcasts.length > 0);

  const handleAddToPlaylist = (songId: number) => {
    setSelectedSongId(songId);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setSelectedSongId(null);
  };

  // ── Render: Cuadrícula de categorías ──
  const renderCategories = () => (
    <View className="flex-row flex-wrap px-4 pt-4">
      {CATEGORIES.map((cat) => (
        <View key={cat.name} style={{ width: '48%', marginBottom: 12 }} className="mx-[1%]">
          <View
            style={{ backgroundColor: cat.color, height: 100, borderRadius: 8 }}
            className="justify-end p-3 overflow-hidden"
          >
            <Text className="text-spotify-white text-base font-bold">{cat.name}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  // ── Render: Estado vacío ──
  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center py-20">
      <Ionicons name="search" size={48} color="#535353" />
      <Text className="text-spotify-gray text-base mt-4 text-center px-8">
        No se encontraron resultados para "{debouncedQuery}"
      </Text>
    </View>
  );

  // ── Render: Cargando ──
  const renderLoading = () => (
    <View className="flex-1 items-center justify-center py-20">
      <ActivityIndicator size="large" color="#1DB954" />
      <Text className="text-spotify-gray text-sm mt-3">Buscando…</Text>
    </View>
  );

  // ── Render: Resultados ──
  const renderResults = () => {
    if (!data) return null;
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Artistas */}
        {data.artistas.length > 0 && (
          <View className="mt-2">
            <SectionHeader title="Artistas" />
            <FlatList
              data={data.artistas}
              renderItem={({ item }) => (
                <ArtistCard
                  artist={item}
                  onPress={() => router.push(`/artist/${item.id}`)}
                  size="md"
                />
              )}
              keyExtractor={(a) => a.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              nestedScrollEnabled
            />
          </View>
        )}

        {/* Álbumes */}
        {data.albums.length > 0 && (
          <View className="mt-4">
            <SectionHeader title="Álbumes" />
            <FlatList
              data={data.albums}
              renderItem={({ item }) => (
                <AlbumCard
                  album={item}
                  onPress={() => router.push(`/album/${item.id}`)}
                  size="md"
                />
              )}
              keyExtractor={(a) => a.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              nestedScrollEnabled
            />
          </View>
        )}

        {/* Canciones */}
        {data.canciones.length > 0 && (
          <View className="mt-4">
            <SectionHeader title="Canciones" />
            {data.canciones.map((song) => (
              <View key={song.id}>
                <SongCard
                  song={song}
                  showAddButton
                  onAddPress={() => handleAddToPlaylist(song.id)}
                />
              </View>
            ))}
          </View>
        )}

        {/* Playlists */}
        {data.playlists.length > 0 && (
          <View className="mt-4">
            <SectionHeader title="Playlists" />
            <FlatList
              data={data.playlists}
              renderItem={({ item }) => (
                <PlaylistCard
                  playlist={item}
                  onPress={() => router.push(`/playlist/${item.id}`)}
                  size="md"
                />
              )}
              keyExtractor={(p) => p.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              nestedScrollEnabled
            />
          </View>
        )}

        {/* Podcasts */}
        {data.podcasts.length > 0 && (
          <View className="mt-4 mb-8">
            <SectionHeader title="Podcasts" />
            <FlatList
              data={data.podcasts}
              renderItem={({ item }) => (
                <PodcastCard
                  podcast={item}
                  onPress={() => router.push(`/podcast/${item.id}`)}
                  size="md"
                />
              )}
              keyExtractor={(p) => p.id.toString()}
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
      {/* ── Header ── */}
      <Text className="text-spotify-white text-[28px] font-bold px-4 pt-4 pb-2">
        Buscar
      </Text>

      {/* ── Input de búsqueda ── */}
      <View className="px-4 mb-2">
        <View className="flex-row items-center bg-spotify-white rounded-lg px-3 py-2">
          <Ionicons name="search" size={20} color="#121212" />
          <TextInput
            className="flex-1 ml-2 text-base text-spotify-black"
            placeholder="Artistas, canciones o podcasts"
            placeholderTextColor="#535353"
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

      {/* ── Contenido condicional ── */}
      {!isSearchActive ? (
        // Caso 1: Sin búsqueda activa → categorías
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderCategories()}
        </ScrollView>
      ) : isLoading ? (
        // Caso 2: Cargando
        renderLoading()
      ) : isError ? (
        // Error
        <View className="flex-1 items-center justify-center py-20">
          <Ionicons name="cloud-offline-outline" size={48} color="#535353" />
          <Text className="text-spotify-gray text-base mt-4">Error al buscar</Text>
        </View>
      ) : !hasResults ? (
        // Caso 3: Sin resultados
        renderEmpty()
      ) : (
        // Caso 4: Con resultados
        renderResults()
      )}

      {/* ── Modal Añadir a Playlist ── */}
      <AddToPlaylistModal
        visible={showAddModal}
        songId={selectedSongId}
        onClose={handleCloseModal}
      />
    </SafeAreaView>
  );
};

export default SearchScreen;
