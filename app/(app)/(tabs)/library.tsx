import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

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

type LibraryItem =
  | { type: 'liked-songs'; count: number }
  | { type: 'playlist'; data: Playlist }
  | { type: 'artist'; data: Artista }
  | { type: 'album'; data: Album }
  | { type: 'podcast'; data: Podcast };

const LibraryScreen = () => {
  const userId = useAuthStore((s) => s.userId);
  const [activeFilter, setActiveFilter] = useState<Filter>('todo');

  useEffect(() => {
    storageService.getLibraryTab().then((tab) => {
      if (tab && FILTERS.some((f) => f.key === tab)) {
        setActiveFilter(tab as Filter);
      }
    });
  }, []);

  const handleFilterChange = useCallback((filter: Filter) => {
    setActiveFilter(filter);
    storageService.setLibraryTab(filter);
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

  // Construir lista unificada
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

    return list;
  }, [activeFilter, allPlaylists, followedArtists.data, followedAlbums.data, followedPodcasts.data, savedSongs.data]);

  const renderItem = useCallback(
    ({ item }: { item: LibraryItem }) => {
      switch (item.type) {
        case 'liked-songs':
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {}}
              className="flex-row items-center py-2 px-4"
            >
              <View
                className="items-center justify-center"
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 4,
                  backgroundColor: '#6C3FC5',
                }}
              >
                <Ionicons name="heart" size={22} color="#FFFFFF" />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-white text-[15px] font-semibold" numberOfLines={1}>
                  Canciones que te gustan
                </Text>
                <Text className="text-spotify-gray text-[13px] mt-0.5">
                  Playlist · {item.count} canciones
                </Text>
              </View>
            </TouchableOpacity>
          );

        case 'playlist':
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push(`/playlist/${item.data.id}`)}
              className="flex-row items-center py-2 px-4"
            >
              <Image
                source={getCoverImage(item.data.id, 'playlist')}
                style={{ width: 52, height: 52, borderRadius: 4 }}
                resizeMode="cover"
              />
              <View className="flex-1 ml-3">
                <Text className="text-white text-[15px] font-semibold" numberOfLines={1}>
                  {item.data.titulo}
                </Text>
                <Text className="text-spotify-gray text-[13px] mt-0.5" numberOfLines={1}>
                  Playlist
                  {item.data.usuario ? ` · ${item.data.usuario.username}` : ''}
                  {item.data.numeroCanciones
                    ? ` · ${item.data.numeroCanciones} canciones`
                    : ''}
                </Text>
              </View>
            </TouchableOpacity>
          );

        case 'artist':
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push(`/artist/${item.data.id}`)}
              className="flex-row items-center py-2 px-4"
            >
              <Image
                source={getCoverImage(item.data.id, 'artist')}
                style={{ width: 52, height: 52, borderRadius: 26 }}
                resizeMode="cover"
              />
              <View className="flex-1 ml-3">
                <Text className="text-white text-[15px] font-semibold" numberOfLines={1}>
                  {item.data.nombre}
                </Text>
                <Text className="text-spotify-gray text-[13px] mt-0.5">Artista</Text>
              </View>
            </TouchableOpacity>
          );

        case 'album':
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push(`/album/${item.data.id}`)}
              className="flex-row items-center py-2 px-4"
            >
              <Image
                source={getCoverImage(item.data.id, 'album')}
                style={{ width: 52, height: 52, borderRadius: 4 }}
                resizeMode="cover"
              />
              <View className="flex-1 ml-3">
                <Text className="text-white text-[15px] font-semibold" numberOfLines={1}>
                  {item.data.titulo}
                </Text>
                <Text className="text-spotify-gray text-[13px] mt-0.5" numberOfLines={1}>
                  Álbum{item.data.artista ? ` · ${item.data.artista.nombre}` : ''}
                </Text>
              </View>
            </TouchableOpacity>
          );

        case 'podcast':
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push(`/podcast/${item.data.id}`)}
              className="flex-row items-center py-2 px-4"
            >
              <Image
                source={getCoverImage(item.data.id, 'podcast')}
                style={{ width: 52, height: 52, borderRadius: 8 }}
                resizeMode="cover"
              />
              <View className="flex-1 ml-3">
                <Text className="text-white text-[15px] font-semibold" numberOfLines={1}>
                  {item.data.titulo}
                </Text>
                <Text className="text-spotify-gray text-[13px] mt-0.5">Podcast</Text>
              </View>
            </TouchableOpacity>
          );
      }
    },
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
      {/* Header */}
      <View className="flex-row items-center px-4 pt-2 pb-1">
        <Text className="text-white text-2xl font-bold flex-1">Tu biblioteca</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push('/add-playlist')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="w-8 h-8 items-center justify-center"
        >
          <Ionicons name="add" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, gap: 8 }}
      >
        {FILTERS.map((f) => {
          const active = activeFilter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              activeOpacity={0.8}
              onPress={() => handleFilterChange(f.key)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderRadius: 16,
                backgroundColor: active ? '#1DB954' : '#232323',
              }}
            >
              <Text
                style={{
                  color: active ? '#000' : '#fff',
                  fontSize: 13,
                  fontWeight: '600',
                }}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Content */}
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
    </SafeAreaView>
  );
};

export default LibraryScreen;
