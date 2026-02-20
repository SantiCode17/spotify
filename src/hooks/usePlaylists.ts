import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import * as playlistService from '../services/playlistService';

/** Hook para playlists propias del usuario */
export const usePlaylistsUsuario = () => {
  const userId = useAuthStore((s) => s.userId);
  return useQuery({
    queryKey: ['playlists', 'propias', userId],
    queryFn: () => playlistService.getPlaylistsUsuario(userId!),
    enabled: !!userId,
  });
};

/** Hook para playlists seguidas */
export const usePlaylistsSeguidas = () => {
  const userId = useAuthStore((s) => s.userId);
  return useQuery({
    queryKey: ['playlists', 'seguidas', userId],
    queryFn: () => playlistService.getPlaylistsSeguidas(userId!),
    enabled: !!userId,
  });
};

/** Hook para detalle de playlist */
export const usePlaylist = (playlistId: number) => {
  return useQuery({
    queryKey: ['playlist', playlistId],
    queryFn: () => playlistService.getPlaylist(playlistId),
    enabled: !!playlistId,
  });
};

/** Hook para canciones de playlist */
export const useCancionesPlaylist = (playlistId: number) => {
  return useQuery({
    queryKey: ['playlist', playlistId, 'canciones'],
    queryFn: () => playlistService.getCancionesPlaylist(playlistId),
    enabled: !!playlistId,
  });
};

/** Mutación para crear playlist */
export const useCreatePlaylist = () => {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.userId);

  return useMutation({
    mutationFn: (titulo: string) => playlistService.createPlaylist(userId!, titulo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });
};

/** Mutación para seguir/dejar de seguir playlist */
export const useSeguirPlaylist = () => {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.userId);

  return useMutation({
    mutationFn: ({ playlistId, seguir }: { playlistId: number; seguir: boolean }) =>
      seguir
        ? playlistService.seguirPlaylist(userId!, playlistId)
        : playlistService.dejarDeSeguirPlaylist(userId!, playlistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists', 'seguidas'] });
    },
  });
};

/** Mutación para añadir canción a playlist */
export const useAddCancionToPlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ playlistId, cancionId }: { playlistId: number; cancionId: number }) =>
      playlistService.addCancionToPlaylist(playlistId, cancionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['playlist', variables.playlistId, 'canciones'] });
    },
  });
};

/** Mutación para quitar canción de playlist */
export const useRemoveCancionFromPlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ playlistId, cancionId }: { playlistId: number; cancionId: number }) =>
      playlistService.removeCancionFromPlaylist(playlistId, cancionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['playlist', variables.playlistId, 'canciones'] });
    },
  });
};
