import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuthStore } from '../../src/store/authStore';
import { usePlayerStore } from '../../src/store/playerStore';
import { useSavedSongs } from '../../src/hooks/useSongs';
import SongCard from '../../src/components/cards/SongCard';
import EmptyState from '../../src/components/ui/EmptyState';
import type { Cancion } from '../../src/types/api.types';

const LikedSongsScreen = () => {
  const userId = useAuthStore((s) => s.userId);
  const playSongFromQueue = usePlayerStore((s) => s.playSongFromQueue);
  const { data: songs, isLoading } = useSavedSongs(userId);

  const renderHeader = () => (
    <View>
      <LinearGradient
        colors={['#5B21B6', '#3B0764', '#121212']}
        style={{ paddingBottom: 24 }}
      >
        {/* Volver */}
        <TouchableOpacity onPress={() => router.back()} className="px-4 pt-2 pb-3">
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View className="items-center px-4">
          <View
            style={{
              width: 180,
              height: 180,
              borderRadius: 8,
              backgroundColor: '#7C3AED',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 16,
              elevation: 12,
            }}
          >
            <Ionicons name="heart" size={64} color="#FFFFFF" />
          </View>
          <Text className="text-white text-2xl font-bold mt-5">
            Canciones que te gustan
          </Text>
          <Text className="text-spotify-gray text-sm mt-1">
            {songs?.length ?? 0} canciones
          </Text>
        </View>
      </LinearGradient>
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

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-spotify-black items-center justify-center">
        <ActivityIndicator size="large" color="#1DB954" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-spotify-black" edges={['top']}>
      <FlatList
        data={songs ?? []}
        keyExtractor={(item) => `liked-${item.id}`}
        renderItem={renderSong}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            icon="heart-outline"
            title="No tienes canciones guardadas"
            subtitle="Pulsa el + en cualquier canción para guardarla"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
};

export default LikedSongsScreen;
