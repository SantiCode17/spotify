import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../config/queryKeys';
import * as podcastService from '../services/podcastService';

// Podcasts seguidos por el usuario
export const useFollowedPodcasts = (userId: number | null) => {
  return useQuery({
    queryKey: queryKeys.followedPodcasts(userId!),
    queryFn: () => podcastService.getFollowedPodcasts(userId!),
    enabled: !!userId,
  });
};

// Detalle de un podcast
export const usePodcastDetail = (podcastId: number) => {
  return useQuery({
    queryKey: queryKeys.podcastDetail(podcastId),
    queryFn: () => podcastService.getPodcastDetail(podcastId),
    enabled: !!podcastId,
  });
};

// Capitulos de un podcast
export const usePodcastEpisodes = (podcastId: number) => {
  return useQuery({
    queryKey: queryKeys.podcastEpisodes(podcastId),
    queryFn: () => podcastService.getPodcastEpisodes(podcastId),
    enabled: !!podcastId,
  });
};

// Detalle de un episodio
export const useEpisodeDetail = (episodeId: number) => {
  return useQuery({
    queryKey: queryKeys.episodeDetail(episodeId),
    queryFn: () => podcastService.getEpisodeDetail(episodeId),
    enabled: !!episodeId,
  });
};

// Todos los podcasts
export const useAllPodcasts = () => {
  return useQuery({
    queryKey: queryKeys.allPodcasts(),
    queryFn: () => podcastService.getAllPodcasts(),
  });
};

// Seguir podcast
export const useFollowPodcast = (userId: number | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (podcastId: number) => podcastService.followPodcast(userId!, podcastId),
    onSuccess: () => {
      if (userId) queryClient.invalidateQueries({ queryKey: queryKeys.followedPodcasts(userId) });
    },
  });
};

// Dejar de seguir podcast
export const useUnfollowPodcast = (userId: number | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (podcastId: number) => podcastService.unfollowPodcast(userId!, podcastId),
    onSuccess: () => {
      if (userId) queryClient.invalidateQueries({ queryKey: queryKeys.followedPodcasts(userId) });
    },
  });
};

