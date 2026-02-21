import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../config/queryKeys';
import * as playlistService from '../services/playlistService';

/** Playlists propias del usuario */
export const useUserPlaylists = (userId: number | null) => {
  return useQuery({
    queryKey: queryKeys.userPlaylists(userId!),
    queryFn: () => playlistService.getUserPlaylists(userId!),
    enabled: !!userId,
  });
};

/** Playlists seguidas por el usuario */
export const useFollowedPlaylists = (userId: number | null) => {
  return useQuery({
    queryKey: queryKeys.followedPlaylists(userId!),
    queryFn: () => playlistService.getFollowedPlaylists(userId!),
    enabled: !!userId,
  });
};

/** Detalle de una playlist */
export const usePlaylistDetail = (playlistId: number) => {
  return useQuery({
    queryKey: queryKeys.playlistDetail(playlistId),
    queryFn: () => playlistService.getPlaylistDetail(playlistId),
    enabled: !!playlistId,
  });
};

/** Canciones de una playlist */
export const usePlaylistSongs = (playlistId: number) => {
  return useQuery({
    queryKey: queryKeys.playlistSongs(playlistId),
    queryFn: () => playlistService.getPlaylistSongs(playlistId),
    enabled: !!playlistId,
  });
};

/** Todas las playlists públicas */
export const usePublicPlaylists = () => {
  return useQuery({
    queryKey: queryKeys.publicPlaylists(),
    queryFn: () => playlistService.getPublicPlaylists(),
  });
};

/** Crear nueva playlist */
export const useCreatePlaylist = (userId: number | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (titulo: string) => playlistService.createPlaylist(userId!, titulo),
    onSuccess: () => {
      if (userId) queryClient.invalidateQueries({ queryKey: queryKeys.userPlaylists(userId) });
    },
  });
};

/** Añadir canción a playlist */
export const useAddSongToPlaylist = (playlistId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cancionId, usuarioId }: { cancionId: number; usuarioId: number }) =>
      playlistService.addSongToPlaylist(playlistId, cancionId, usuarioId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.playlistSongs(playlistId) });
    },
  });
};

/** Quitar canción de playlist */
export const useRemoveSongFromPlaylist = (playlistId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cancionId: number) =>
      playlistService.removeSongFromPlaylist(playlistId, cancionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.playlistSongs(playlistId) });
    },
  });
};

/** Seguir playlist */
export const useFollowPlaylist = (userId: number | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (playlistId: number) => playlistService.followPlaylist(userId!, playlistId),
    onSuccess: () => {
      if (userId) queryClient.invalidateQueries({ queryKey: queryKeys.followedPlaylists(userId) });
    },
  });
};

/** Dejar de seguir playlist */
export const useUnfollowPlaylist = (userId: number | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (playlistId: number) => playlistService.unfollowPlaylist(userId!, playlistId),
    onSuccess: () => {
      if (userId) queryClient.invalidateQueries({ queryKey: queryKeys.followedPlaylists(userId) });
    },
  });
};

