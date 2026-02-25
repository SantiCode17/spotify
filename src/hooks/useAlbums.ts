import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../config/queryKeys';
import * as albumService from '../services/albumService';

// Albums seguidos por el usuario
export const useFollowedAlbums = (userId: number | null) => {
  return useQuery({
    queryKey: queryKeys.followedAlbums(userId!),
    queryFn: () => albumService.getFollowedAlbums(userId!),
    enabled: !!userId,
  });
};

// Detalle de un album
export const useAlbumDetail = (albumId: number) => {
  return useQuery({
    queryKey: queryKeys.albumDetail(albumId),
    queryFn: () => albumService.getAlbumDetail(albumId),
    enabled: !!albumId,
  });
};

// Canciones de un album
export const useAlbumSongs = (albumId: number) => {
  return useQuery({
    queryKey: queryKeys.albumSongs(albumId),
    queryFn: () => albumService.getAlbumSongs(albumId),
    enabled: !!albumId,
  });
};

// Todos los albums
export const useAllAlbums = () => {
  return useQuery({
    queryKey: queryKeys.allAlbums(),
    queryFn: () => albumService.getAllAlbums(),
  });
};

// Seguir album
export const useFollowAlbum = (userId: number | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (albumId: number) => albumService.followAlbum(userId!, albumId),
    onSuccess: () => {
      if (userId) queryClient.invalidateQueries({ queryKey: queryKeys.followedAlbums(userId) });
    },
  });
};

// Dejar de seguir album
export const useUnfollowAlbum = (userId: number | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (albumId: number) => albumService.unfollowAlbum(userId!, albumId),
    onSuccess: () => {
      if (userId) queryClient.invalidateQueries({ queryKey: queryKeys.followedAlbums(userId) });
    },
  });
};

