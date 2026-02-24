import React, { useMemo } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAuthStore } from '../../../src/store/authStore';
import {
  usePodcastDetail,
  usePodcastEpisodes,
  useFollowedPodcasts,
  useFollowPodcast,
  useUnfollowPodcast,
} from '../../../src/hooks/usePodcasts';
import EpisodeCard from '../../../src/components/cards/EpisodeCard';
import ErrorState from '../../../src/components/ui/ErrorState';
import EmptyState from '../../../src/components/ui/EmptyState';
import { getCoverImage } from '../../../src/utils/coverImages';
import type { Capitulo } from '../../../src/types/api.types';

const PodcastDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const podcastId = Number(id);
  const userId = useAuthStore((s) => s.userId);

  const { data: podcast, isLoading, isError, refetch } = usePodcastDetail(podcastId);
  const { data: episodes, isLoading: epsLoading } = usePodcastEpisodes(podcastId);
  const { data: followedPodcasts } = useFollowedPodcasts(userId);

  const followMutation = useFollowPodcast(userId);
  const unfollowMutation = useUnfollowPodcast(userId);

  const isFollowed = useMemo(
    () => followedPodcasts?.some((p) => p.id === podcastId) ?? false,
    [followedPodcasts, podcastId]
  );

  const toggleFollow = () => {
    if (isFollowed) unfollowMutation.mutate(podcastId);
    else followMutation.mutate(podcastId);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-spotify-black items-center justify-center">
        <ActivityIndicator size="large" color="#1DB954" />
      </SafeAreaView>
    );
  }

  if (isError || !podcast) {
    return (
      <SafeAreaView className="flex-1 bg-spotify-black">
        <ErrorState message="No se pudo cargar el podcast" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const renderHeader = () => (
    <View>
      {/* Back */}
      <TouchableOpacity onPress={() => router.back()} className="px-4 pt-2 pb-3">
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Hero */}
      <View className="items-center px-4 pb-4">
        <Image
          source={getCoverImage(podcastId, 'podcast')}
          style={{ width: 192, height: 192, borderRadius: 8, marginBottom: 16 }}
          resizeMode="cover"
        />
        <Text className="text-spotify-white text-2xl font-bold text-center">
          {podcast.titulo}
        </Text>
        {podcast.descripcion && (
          <Text className="text-spotify-gray text-sm mt-2 text-center px-4" numberOfLines={4}>
            {podcast.descripcion}
          </Text>
        )}
        {podcast.anyo && (
          <Text className="text-spotify-light-gray text-xs mt-1">{podcast.anyo}</Text>
        )}
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

      {/* Episodios header */}
      <View className="px-4 py-2">
        <Text className="text-spotify-white text-xl font-bold">
          Episodios ({episodes?.length ?? 0})
        </Text>
      </View>
      {epsLoading && <ActivityIndicator color="#1DB954" className="mt-2" />}
    </View>
  );

  const renderEpisode = ({ item }: { item: Capitulo }) => (
    <EpisodeCard
      episode={item}
      onPress={() => router.push(`/episode/${item.id}`)}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-spotify-black">
      <FlatList
        data={episodes ?? []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderEpisode}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          !epsLoading ? (
            <EmptyState
              icon="mic-off-outline"
              title="Sin episodios"
              subtitle="Este podcast aún no tiene episodios"
            />
          ) : null
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
};

export default PodcastDetailScreen;
