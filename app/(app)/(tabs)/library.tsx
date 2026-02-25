import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';

import { useAuthStore } from '../../../src/store/authStore';
import { useFollowedArtists } from '../../../src/hooks/useArtists';
import { useFollowedAlbums } from '../../../src/hooks/useAlbums';
import { useFollowedPodcasts } from '../../../src/hooks/usePodcasts';
import { useFollowedPlaylists, useUserPlaylists } from '../../../src/hooks/usePlaylists';
import { useSavedSongs } from '../../../src/hooks/useSongs';
import * as storageService from '../../../src/services/storageService';
import { getCoverImage } from '../../../src/utils/coverImages';

import EmptyState from '../../../src/components/ui/EmptyState';

import type { Artista, Album, Podcast, Playlist } from '../../../src/types/api.types';

type Filter = 'todo' | 'playlists' | 'artistas' | 'albums' | 'podcasts';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'todo', label: 'Todo' },
  { key: 'playlists', label: 'Playlists' },
  { key: 'artistas', label: 'Artistas' },
  { key: 'albums', label: 'Álbumes' },
  { key: 'podcasts', label: 'Podcasts' },
];

type SortOption = 'recientes' | 'añadido' | 'alfabetico' | 'creador';

const SORT_OPTIONS: { key: SortOption; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'recientes', label: 'Recientes', icon: 'time-outline' },
  { key: 'añadido', label: 'Añadido recientemente', icon: 'calendar-outline' },
  { key: 'alfabetico', label: 'Orden alfabético', icon: 'text-outline' },
  { key: 'creador', label: 'Creador', icon: 'person-outline' },
];

type LibraryItem =
  | { type: 'liked-songs'; count: number }
  | { type: 'playlist'; data: Playlist }
  | { type: 'artist'; data: Artista }
  | { type: 'album'; data: Album }
  | { type: 'podcast'; data: Podcast };

// Obtener el nombre principal de un item para ordenar alfabeticamente
const getItemName = (item: LibraryItem): string => {
  switch (item.type) {
    case 'liked-songs':
      return 'Canciones que te gustan';
    case 'playlist':
      return item.data.titulo;
    case 'artist':
      return item.data.nombre;
    case 'album':
      return item.data.titulo;
    case 'podcast':
      return item.data.titulo;
  }
};

// Obtener el nombre del creador de un item
const getItemCreator = (item: LibraryItem): string => {
  switch (item.type) {
    case 'liked-songs':
      return '';
    case 'playlist':
      return item.data.usuario?.username ?? '';
    case 'artist':
      return item.data.nombre;
    case 'album':
      return item.data.artista?.nombre ?? '';
    case 'podcast':
      return '';
  }
};

// Obtener la fecha de creacion para ordenacion reciente
const getItemDate = (item: LibraryItem): string => {
  switch (item.type) {
    case 'liked-songs':
      return '9999-12-31'; // Siempre primero
    case 'playlist':
      return item.data.fechaCreacion ?? '2000-01-01';
    case 'artist':
      return '2000-01-01';
    case 'album':
      return item.data.anyo ?? '2000';
    case 'podcast':
      return item.data.anyo ?? '2000';
  }
};

// Obtener el ID numerico para el orden de añadido recientemente
const getItemId = (item: LibraryItem): number => {
  switch (item.type) {
    case 'liked-songs':
      return 999999;
    case 'playlist':
      return item.data.id;
    case 'artist':
      return item.data.id;
    case 'album':
      return item.data.id;
    case 'podcast':
      return item.data.id;
  }
};

// Componente de fila memorizado
const LibraryRow = React.memo(({ item }: { item: LibraryItem }) => {
  switch (item.type) {
    case 'liked-songs':
      return (
        <TouchableOpacity
          activeOpacity={0.65}
          onPress={() => router.push('/liked-songs')}
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16 }}
        >
          <LinearGradient
            colors={['#7B2FBE', '#5B21B6']}
            style={{
              width: 60,
              height: 60,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="heart" size={26} color="#FFFFFF" />
          </LinearGradient>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }} numberOfLines={1}>
              Canciones que te gustan
            </Text>
            <Text style={{ color: '#A7A7A7', fontSize: 13, marginTop: 3 }}>
              Playlist · {item.count} canciones
            </Text>
          </View>
        </TouchableOpacity>
      );

    case 'playlist':
      return (
        <TouchableOpacity
          activeOpacity={0.65}
          onPress={() => router.push(`/playlist/${item.data.id}`)}
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16 }}
        >
          <Image
            source={getCoverImage(item.data.id, 'playlist')}
            style={{ width: 60, height: 60, borderRadius: 8 }}
            resizeMode="cover"
          />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }} numberOfLines={1}>
              {item.data.titulo}
            </Text>
            <Text style={{ color: '#A7A7A7', fontSize: 13, marginTop: 3 }} numberOfLines={1}>
              Playlist
              {item.data.usuario ? ` · ${item.data.usuario.username}` : ''}
              {item.data.numeroCanciones != null
                ? ` · ${item.data.numeroCanciones} canciones`
                : ''}
            </Text>
          </View>
        </TouchableOpacity>
      );

    case 'artist':
      return (
        <TouchableOpacity
          activeOpacity={0.65}
          onPress={() => router.push(`/artist/${item.data.id}`)}
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16 }}
        >
          <Image
            source={getCoverImage(item.data.id, 'artist')}
            style={{ width: 60, height: 60, borderRadius: 30 }}
            resizeMode="cover"
          />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }} numberOfLines={1}>
              {item.data.nombre}
            </Text>
            <Text style={{ color: '#A7A7A7', fontSize: 13, marginTop: 3 }}>Artista</Text>
          </View>
        </TouchableOpacity>
      );

    case 'album':
      return (
        <TouchableOpacity
          activeOpacity={0.65}
          onPress={() => router.push(`/album/${item.data.id}`)}
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16 }}
        >
          <Image
            source={getCoverImage(item.data.id, 'album')}
            style={{ width: 60, height: 60, borderRadius: 8 }}
            resizeMode="cover"
          />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }} numberOfLines={1}>
              {item.data.titulo}
            </Text>
            <Text style={{ color: '#A7A7A7', fontSize: 13, marginTop: 3 }} numberOfLines={1}>
              Álbum{item.data.artista ? ` · ${item.data.artista.nombre}` : ''}
            </Text>
          </View>
        </TouchableOpacity>
      );

    case 'podcast':
      return (
        <TouchableOpacity
          activeOpacity={0.65}
          onPress={() => router.push(`/podcast/${item.data.id}`)}
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16 }}
        >
          <Image
            source={getCoverImage(item.data.id, 'podcast')}
            style={{ width: 60, height: 60, borderRadius: 14 }}
            resizeMode="cover"
          />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }} numberOfLines={1}>
              {item.data.titulo}
            </Text>
            <Text style={{ color: '#A7A7A7', fontSize: 13, marginTop: 3 }}>Podcast</Text>
          </View>
        </TouchableOpacity>
      );
  }
});

// Pantalla principal de biblioteca
const LibraryScreen = () => {
  const userId = useAuthStore((s) => s.userId);
  const user = useAuthStore((s) => s.user);
  const params = useLocalSearchParams<{ filter?: string }>();
  const [activeFilter, setActiveFilter] = useState<Filter>('todo');
  const [activeSort, setActiveSort] = useState<SortOption>('recientes');
  const [showSortModal, setShowSortModal] = useState(false);

  useEffect(() => {
    // Si viene un filtro por param de navegación, usarlo
    if (params.filter && FILTERS.some((f) => f.key === params.filter)) {
      setActiveFilter(params.filter as Filter);
      storageService.setLibraryTab(params.filter);
    } else {
      // Restaurar filtro persistido
      storageService.getLibraryTab().then((tab) => {
        if (tab && FILTERS.some((f) => f.key === tab)) {
          setActiveFilter(tab as Filter);
        }
      });
    }
    storageService.getLibrarySort().then((sort) => {
      if (sort && SORT_OPTIONS.some((s) => s.key === sort)) {
        setActiveSort(sort as SortOption);
      }
    });
  }, [params.filter]);

  const handleFilterChange = useCallback((filter: Filter) => {
    setActiveFilter(filter);
    storageService.setLibraryTab(filter);
  }, []);

  const handleSortChange = useCallback((sort: SortOption) => {
    setActiveSort(sort);
    storageService.setLibrarySort(sort);
    setShowSortModal(false);
  }, []);

  const followedArtists = useFollowedArtists(userId);
  const followedAlbums = useFollowedAlbums(userId);
  const followedPodcasts = useFollowedPodcasts(userId);
  const followedPlaylists = useFollowedPlaylists(userId);
  const userPlaylists = useUserPlaylists(userId);
  const savedSongs = useSavedSongs(userId);

  const allPlaylists = useMemo(() => {
    const followed = followedPlaylists.data ?? [];
    const own = userPlaylists.data ?? [];
    const map = new Map<number, Playlist>();
    own.forEach((p) => map.set(p.id, p));
    followed.forEach((p) => {
      if (!map.has(p.id)) map.set(p.id, p);
    });
    return Array.from(map.values());
  }, [followedPlaylists.data, userPlaylists.data]);

  const isLoading =
    followedArtists.isLoading ||
    followedAlbums.isLoading ||
    followedPodcasts.isLoading ||
    followedPlaylists.isLoading ||
    userPlaylists.isLoading ||
    savedSongs.isLoading;

  // Construir y ordenar items
  const items = useMemo<LibraryItem[]>(() => {
    const list: LibraryItem[] = [];

    if (activeFilter === 'todo' || activeFilter === 'playlists') {
      list.push({ type: 'liked-songs', count: savedSongs.data?.length ?? 0 });
      allPlaylists.forEach((p) => list.push({ type: 'playlist', data: p }));
    }

    if (activeFilter === 'todo' || activeFilter === 'artistas') {
      (followedArtists.data ?? []).forEach((a) => list.push({ type: 'artist', data: a }));
    }

    if (activeFilter === 'todo' || activeFilter === 'albums') {
      (followedAlbums.data ?? []).forEach((a) => list.push({ type: 'album', data: a }));
    }

    if (activeFilter === 'todo' || activeFilter === 'podcasts') {
      (followedPodcasts.data ?? []).forEach((p) => list.push({ type: 'podcast', data: p }));
    }

    // Aplicar ordenación
    switch (activeSort) {
      case 'recientes':
        // Ordenar por fecha descendente (más reciente primero)
        list.sort((a, b) => {
          if (a.type === 'liked-songs') return -1;
          if (b.type === 'liked-songs') return 1;
          return getItemDate(b).localeCompare(getItemDate(a));
        });
        break;

      case 'añadido':
        // Ordenar por ID descendente (mayor ID = añadido más recientemente)
        list.sort((a, b) => {
          if (a.type === 'liked-songs') return -1;
          if (b.type === 'liked-songs') return 1;
          return getItemId(b) - getItemId(a);
        });
        break;

      case 'alfabetico':
        // A-Z por nombre, liked-songs siempre primero
        list.sort((a, b) => {
          if (a.type === 'liked-songs') return -1;
          if (b.type === 'liked-songs') return 1;
          return getItemName(a).localeCompare(getItemName(b), 'es', { sensitivity: 'base' });
        });
        break;

      case 'creador':
        // Ordenar por nombre del creador, luego por nombre del item
        list.sort((a, b) => {
          if (a.type === 'liked-songs') return -1;
          if (b.type === 'liked-songs') return 1;
          const creatorA = getItemCreator(a);
          const creatorB = getItemCreator(b);
          const cmp = creatorA.localeCompare(creatorB, 'es', { sensitivity: 'base' });
          if (cmp !== 0) return cmp;
          return getItemName(a).localeCompare(getItemName(b), 'es', { sensitivity: 'base' });
        });
        break;
    }

    return list;
  }, [activeFilter, activeSort, allPlaylists, followedArtists.data, followedAlbums.data, followedPodcasts.data, savedSongs.data]);

  const currentSortLabel = SORT_OPTIONS.find((s) => s.key === activeSort)?.label ?? 'Recientes';

  const renderItem = useCallback(
    ({ item }: { item: LibraryItem }) => <LibraryRow item={item} />,
    []
  );

  const keyExtractor = useCallback(
    (item: LibraryItem, index: number) => {
      switch (item.type) {
        case 'liked-songs':
          return 'liked-songs';
        case 'playlist':
          return `pl-${item.data.id}`;
        case 'artist':
          return `ar-${item.data.id}`;
        case 'album':
          return `al-${item.data.id}`;
        case 'podcast':
          return `po-${item.data.id}`;
        default:
          return `item-${index}`;
      }
    },
    []
  );

  return (
    <SafeAreaView className="flex-1 bg-spotify-black">
      {/* Cabecera */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push('/(app)/profile')}
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            overflow: 'hidden',
            marginRight: 14,
          }}
        >
          <Image
            source={getCoverImage(user?.id ?? 1, 'user')}
            style={{ width: 34, height: 34, borderRadius: 17 }}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800', flex: 1 }}>
          Tu biblioteca
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push('/add-playlist')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{ width: 42, height: 42, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Chips de filtrado */}
      <View style={{ height: 52 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, alignItems: 'center', height: 52 }}
        >
          {FILTERS.map((f, i) => {
            const active = activeFilter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                activeOpacity={0.8}
                onPress={() => handleFilterChange(f.key)}
                style={{
                  paddingHorizontal: 18,
                  paddingVertical: 8,
                  borderRadius: 50,
                  backgroundColor: active ? '#1DB954' : '#2A2A2A',
                  marginRight: i < FILTERS.length - 1 ? 10 : 0,
                }}
              >
                <Text
                  style={{
                    color: active ? '#000' : '#fff',
                    fontSize: 14,
                    fontWeight: '600',
                  }}
                  numberOfLines={1}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Fila de ordenacion */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setShowSortModal(true)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingBottom: 8,
          paddingTop: 2,
        }}
      >
        <Ionicons name="swap-vertical" size={16} color="#1DB954" />
        <Text style={{ color: '#1DB954', fontSize: 13, marginLeft: 6, fontWeight: '700' }}>
          {currentSortLabel}
        </Text>
        <Ionicons name="chevron-down" size={14} color="#1DB954" style={{ marginLeft: 4 }} />
      </TouchableOpacity>

      {/* Contenido */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1DB954" />
        </View>
      ) : items.length === 0 ? (
        <EmptyState
          icon="library-outline"
          title="Tu biblioteca está vacía"
          subtitle="Busca artistas, álbumes o podcasts y síguelos"
          actionLabel="Explorar"
          onAction={() => router.push('/(app)/(tabs)/search')}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
        />
      )}

      {/* Modal de ordenacion */}
      <Modal
        visible={showSortModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowSortModal(false)}
      >
        <View
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' }}
        >
          <Pressable style={{ flex: 1 }} onPress={() => setShowSortModal(false)} />

          <View
            style={{
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              overflow: 'hidden',
            }}
          >
            <LinearGradient colors={['#2A2A2A', '#1A1A1A', '#121212']}>
              {/* Indicador */}
              <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 4 }}>
                <View
                  style={{
                    width: 40,
                    height: 4,
                    backgroundColor: '#535353',
                    borderRadius: 2,
                  }}
                />
              </View>

              {/* Titulo */}
              <Text
                style={{
                  color: '#fff',
                  fontSize: 18,
                  fontWeight: '800',
                  textAlign: 'center',
                  paddingVertical: 16,
                }}
              >
                Ordenar por
              </Text>

              {/* Separador */}
              <View style={{ height: 1, backgroundColor: '#333', marginHorizontal: 20 }} />

              {/* Opciones de ordenacion */}
              {SORT_OPTIONS.map((option) => {
                const isActive = activeSort === option.key;
                return (
                  <TouchableOpacity
                    key={option.key}
                    activeOpacity={0.6}
                    onPress={() => handleSortChange(option.key)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 16,
                      paddingHorizontal: 24,
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: isActive ? '#1DB95420' : '#252525',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons
                        name={option.icon}
                        size={20}
                        color={isActive ? '#1DB954' : '#A7A7A7'}
                      />
                    </View>
                    <Text
                      style={{
                        flex: 1,
                        color: isActive ? '#1DB954' : '#fff',
                        fontSize: 16,
                        fontWeight: isActive ? '700' : '500',
                        marginLeft: 16,
                      }}
                    >
                      {option.label}
                    </Text>
                    {isActive && (
                      <Ionicons name="checkmark" size={22} color="#1DB954" />
                    )}
                  </TouchableOpacity>
                );
              })}

              {/* Cancelar */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowSortModal(false)}
                style={{
                  paddingVertical: 18,
                  alignItems: 'center',
                  borderTopWidth: 1,
                  borderTopColor: '#333',
                  marginTop: 8,
                  marginBottom: 8,
                }}
              >
                <Text style={{ color: '#B3B3B3', fontSize: 15, fontWeight: '600' }}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default LibraryScreen;
