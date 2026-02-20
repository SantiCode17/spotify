import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import * as artistService from '../services/artistService';

/** Hook para artistas seguidos */
export const useArtistasSeguidos = () => {
  const userId = useAuthStore((s) => s.userId);
  return useQuery({
    queryKey: ['artistas', 'seguidos', userId],
    queryFn: () => artistService.getArtistasSeguidos(userId!),
    enabled: !!userId,
  });
};

/** Hook para detalle de artista */
export const useArtista = (artistaId: number) => {
  return useQuery({
    queryKey: ['artista', artistaId],
    queryFn: () => artistService.getArtista(artistaId),
    enabled: !!artistaId,
  });
};

/** Hook para álbumes de un artista */
export const useAlbumsArtista = (artistaId: number) => {
  return useQuery({
    queryKey: ['artista', artistaId, 'albums'],
    queryFn: () => artistService.getAlbumsArtista(artistaId),
    enabled: !!artistaId,
  });
};

/** Hook para canciones de un artista */
export const useCancionesArtista = (artistaId: number) => {
  return useQuery({
    queryKey: ['artista', artistaId, 'canciones'],
    queryFn: () => artistService.getCancionesArtista(artistaId),
    enabled: !!artistaId,
  });
};

/** Mutación para seguir/dejar de seguir artista */
export const useSeguirArtista = () => {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.userId);

  return useMutation({
    mutationFn: ({ artistaId, seguir }: { artistaId: number; seguir: boolean }) =>
      seguir
        ? artistService.seguirArtista(userId!, artistaId)
        : artistService.dejarDeSeguirArtista(userId!, artistaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistas', 'seguidos'] });
    },
  });
};
