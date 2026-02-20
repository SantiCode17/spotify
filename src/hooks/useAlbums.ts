import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import * as albumService from '../services/albumService';

/** Hook para álbumes seguidos */
export const useAlbumsSeguidos = () => {
  const userId = useAuthStore((s) => s.userId);
  return useQuery({
    queryKey: ['albums', 'seguidos', userId],
    queryFn: () => albumService.getAlbumsSeguidos(userId!),
    enabled: !!userId,
  });
};

/** Hook para detalle de álbum */
export const useAlbum = (albumId: number) => {
  return useQuery({
    queryKey: ['album', albumId],
    queryFn: () => albumService.getAlbum(albumId),
    enabled: !!albumId,
  });
};

/** Hook para canciones de un álbum */
export const useCancionesAlbum = (albumId: number) => {
  return useQuery({
    queryKey: ['album', albumId, 'canciones'],
    queryFn: () => albumService.getCancionesAlbum(albumId),
    enabled: !!albumId,
  });
};

/** Mutación para seguir/dejar de seguir álbum */
export const useSeguirAlbum = () => {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.userId);

  return useMutation({
    mutationFn: ({ albumId, seguir }: { albumId: number; seguir: boolean }) =>
      seguir
        ? albumService.seguirAlbum(userId!, albumId)
        : albumService.dejarDeSeguirAlbum(userId!, albumId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums', 'seguidos'] });
    },
  });
};
