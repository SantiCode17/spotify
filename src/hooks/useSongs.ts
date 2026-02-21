import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../config/queryKeys';
import * as songService from '../services/songService';

/** Canciones guardadas (liked songs) del usuario */
export const useSavedSongs = (userId: number | null) => {
  return useQuery({
    queryKey: queryKeys.savedSongs(userId!),
    queryFn: () => songService.getSavedSongs(userId!),
    enabled: !!userId,
  });
};

/** Detalle de una canción */
export const useSongDetail = (songId: number) => {
  return useQuery({
    queryKey: queryKeys.songDetail(songId),
    queryFn: () => songService.getSongDetail(songId),
    enabled: !!songId,
  });
};

/** Todas las canciones */
export const useAllSongs = () => {
  return useQuery({
    queryKey: queryKeys.allSongs(),
    queryFn: () => songService.getAllSongs(),
  });
};

/** Guardar canción (like) */
export const useSaveSong = (userId: number | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cancionId: number) => songService.saveSong(userId!, cancionId),
    onSuccess: () => {
      if (userId) queryClient.invalidateQueries({ queryKey: queryKeys.savedSongs(userId) });
    },
  });
};

/** Quitar canción guardada (unlike) */
export const useUnsaveSong = (userId: number | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cancionId: number) => songService.unsaveSong(userId!, cancionId),
    onSuccess: () => {
      if (userId) queryClient.invalidateQueries({ queryKey: queryKeys.savedSongs(userId) });
    },
  });
};

