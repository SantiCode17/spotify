import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useAuthStore } from '../../../src/store/authStore';
import { useFollowedArtists } from '../../../src/hooks/useArtists';
import { useFollowedAlbums } from '../../../src/hooks/useAlbums';
import { useFollowedPodcasts } from '../../../src/hooks/usePodcasts';
import { useFollowedPlaylists, useUserPlaylists } from '../../../src/hooks/usePlaylists';
import { useSavedSongs } from '../../../src/hooks/useSongs';

import ArtistCard from '../../../src/components/cards/ArtistCard';
import AlbumCard from '../../../src/components/cards/AlbumCard';
import PodcastCard from '../../../src/components/cards/PodcastCard';
import PlaylistCard from '../../../src/components/cards/PlaylistCard';
import LibraryItemRow from '../../../src/components/library/LibraryItemRow';
import EmptyState from '../../../src/components/ui/EmptyState';

import type { Artista, Album, Podcast, Playlist } from '../../../src/types/api.types';

type Tab = 'artistas' | 'albums' | 'podcasts' | 'listas';

const TABS: { key: Tab; label: string }[] = [
  { key: 'artistas', label: 'Artistas' },
  { key: 'albums', label: 'Álbumes' },
  { key: 'podcasts', label: 'Podcasts' },
  { key: 'listas', label: 'Listas' },
];

const LibraryScreen = () => {
  const userId = useAuthStore((s) => s.userId);
  const [activeTab, setActiveTab] = useState<Tab>('artistas');

  // Llamar TODOS los hooks al inicio (React hooks no pueden ser condicionales)
  const followedArtists = useFollowedArtists(userId);
  const followedAlbums = useFollowedAlbums(userId);
  const followedPodcasts = useFollowedPodcasts(userId);
  const followedPlaylists = useFollowedPlaylists(userId);
  const userPlaylists = useUserPlaylists(userId);
  const savedSongs = useSavedSongs(userId);

  // Fusionar playlists seguidas + propias para el tab Listas
  const allPlaylists = useMemo(() => {
    const followed = followedPlaylists.data ?? [];
    const own = userPlaylists.data ?? [];
    // Deduplicar por id
    const map = new Map<number, Playlist>();
    own.forEach((p) => map.set(p.id, p));
    followed.forEach((p) => { if (!map.has(p.id)) map.set(p.id, p); });
    return Array.from(map.values());
  }, [followedPlaylists.data, userPlaylists.data]);

  const isListasLoading =
    followedPlaylists.isLoading || userPlaylists.isLoading || savedSongs.isLoading;

  // ─── Renders por Tab ─────────────────────────────────────
  const renderArtistas = () => {
    if (followedArtists.isLoading) return <ActivityIndicator color="#1DB954" className="mt-8" />;
    if (!followedArtists.data?.length) {
      return (
        <EmptyState
          icon="people-outline"
          title="No sigues a ningún artista"
          subtitle="Explora y sigue a tus artistas favoritos"
        />
      );
    }
    return (
      <FlatList
        data={followedArtists.data}
        keyExtractor={(item: Artista) => item.id.toString()}
        renderItem={({ item }) => (
          <ArtistCard
            artist={item}
            size="sm"
            onPress={() => router.push(`/artist/${item.id}`)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    );
  };

  const renderAlbums = () => {
    if (followedAlbums.isLoading) return <ActivityIndicator color="#1DB954" className="mt-8" />;
    if (!followedAlbums.data?.length) {
      return (
        <EmptyState
          icon="albums-outline"
          title="No sigues ningún álbum"
          subtitle="Descubre álbumes y síguelos"
        />
      );
    }
    return (
      <FlatList
        data={followedAlbums.data}
        keyExtractor={(item: Album) => item.id.toString()}
        renderItem={({ item }) => (
          <AlbumCard
            album={item}
            size="sm"
            onPress={() => router.push(`/album/${item.id}`)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    );
  };

  const renderPodcasts = () => {
    if (followedPodcasts.isLoading) return <ActivityIndicator color="#1DB954" className="mt-8" />;
    if (!followedPodcasts.data?.length) {
      return (
        <EmptyState
          icon="mic-outline"
          title="No sigues ningún podcast"
          subtitle="Encuentra podcasts interesantes"
        />
      );
    }
    return (
      <FlatList
        data={followedPodcasts.data}
        keyExtractor={(item: Podcast) => item.id.toString()}
        renderItem={({ item }) => (
          <PodcastCard
            podcast={item}
            size="sm"
            onPress={() => router.push(`/podcast/${item.id}`)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    );
  };

  const renderListas = () => {
    if (isListasLoading) return <ActivityIndicator color="#1DB954" className="mt-8" />;
    if (!allPlaylists.length && !savedSongs.data?.length) {
      return (
        <EmptyState
          icon="list-outline"
          title="Crea tu primera playlist"
          subtitle="Organiza tu música como quieras"
          actionLabel="Crear playlist"
          onAction={() => router.push('/modal/add-playlist')}
        />
      );
    }
    return (
      <FlatList
        data={allPlaylists}
        keyExtractor={(item: Playlist) => item.id.toString()}
        ListHeaderComponent={
          <LibraryItemRow
            icon="heart"
            iconBgColor="#7B2FBE"
            iconColor="#FFFFFF"
            title="Canciones que te gustan"
            subtitle={`${savedSongs.data?.length ?? 0} canciones`}
            onPress={() => router.push('/playlist/liked')}
          />
        }
        renderItem={({ item }) => (
          <PlaylistCard
            playlist={item}
            size="sm"
            onPress={() => router.push(`/playlist/${item.id}`)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'artistas': return renderArtistas();
      case 'albums': return renderAlbums();
      case 'podcasts': return renderPodcasts();
      case 'listas': return renderListas();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-spotify-black">
      {/* ─── Header ─── */}
      <View className="flex-row items-center px-4 pt-2 pb-3">
        <Text className="text-spotify-white text-[28px] font-bold flex-1">
          Tu biblioteca
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push('/modal/add-playlist')}
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            borderWidth: 1.5,
            borderColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* ─── Selector Horizontal ─── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 8 }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.8}
              onPress={() => setActiveTab(tab.key)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: isActive ? '#fff' : 'transparent',
                borderWidth: isActive ? 0 : 1,
                borderColor: '#fff',
              }}
            >
              <Text
                style={{
                  color: isActive ? '#000' : '#fff',
                  fontWeight: '600',
                  fontSize: 14,
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ─── Contenido ─── */}
      <View className="flex-1">
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

export default LibraryScreen;
