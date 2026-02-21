import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../config/queryKeys';
import * as artistService from '../services/artistService';

/** Artistas seguidos por el usuario */
export const useFollowedArtists = (userId: number | null) => {
  return useQuery({
    queryKey: queryKeys.followedArtists(userId!),
    queryFn: () => artistService.getFollowedArtists(userId!),
    enabled: !!userId,
  });
};

/** Detalle de un artista */
export const useArtistDetail = (artistId: number) => {
  return useQuery({
    queryKey: queryKeys.artistDetail(artistId),
    queryFn: () => artistService.getArtistDetail(artistId),
    enabled: !!artistId,
  });
};

/** Álbumes de un artista */
export const useArtistAlbums = (artistId: number) => {
  return useQuery({
    queryKey: queryKeys.artistAlbums(artistId),
    queryFn: () => artistService.getArtistAlbums(artistId),
    enabled: !!artistId,
  });
};

/** Canciones de un artista */
export const useArtistSongs = (artistId: number) => {
  return useQuery({
    queryKey: queryKeys.artistSongs(artistId),
    queryFn: () => artistService.getArtistSongs(artistId),
    enabled: !!artistId,
  });
};

/** Todos los artistas */
export const useAllArtists = () => {
  return useQuery({
    queryKey: queryKeys.allArtists(),
    queryFn: () => artistService.getAllArtists(),
  });
};

/** Seguir artista */
export const useFollowArtist = (userId: number | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (artistId: number) => artistService.followArtist(userId!, artistId),
    onSuccess: () => {
      if (userId) queryClient.invalidateQueries({ queryKey: queryKeys.followedArtists(userId) });
    },
  });
};

/** Dejar de seguir artista */
export const useUnfollowArtist = (userId: number | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (artistId: number) => artistService.unfollowArtist(userId!, artistId),
    onSuccess: () => {
      if (userId) queryClient.invalidateQueries({ queryKey: queryKeys.followedArtists(userId) });
    },
  });
};

