import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import * as podcastService from '../services/podcastService';

/** Hook para podcasts seguidos */
export const usePodcastsSeguidos = () => {
  const userId = useAuthStore((s) => s.userId);
  return useQuery({
    queryKey: ['podcasts', 'seguidos', userId],
    queryFn: () => podcastService.getPodcastsSeguidos(userId!),
    enabled: !!userId,
  });
};

/** Hook para detalle de podcast */
export const usePodcast = (podcastId: number) => {
  return useQuery({
    queryKey: ['podcast', podcastId],
    queryFn: () => podcastService.getPodcast(podcastId),
    enabled: !!podcastId,
  });
};

/** Hook para capítulos de un podcast */
export const useCapitulosPodcast = (podcastId: number) => {
  return useQuery({
    queryKey: ['podcast', podcastId, 'capitulos'],
    queryFn: () => podcastService.getCapitulosPodcast(podcastId),
    enabled: !!podcastId,
  });
};

/** Hook para detalle de capítulo */
export const useCapitulo = (capituloId: number) => {
  return useQuery({
    queryKey: ['capitulo', capituloId],
    queryFn: () => podcastService.getCapitulo(capituloId),
    enabled: !!capituloId,
  });
};

/** Mutación para seguir/dejar de seguir podcast */
export const useSeguirPodcast = () => {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.userId);

  return useMutation({
    mutationFn: ({ podcastId, seguir }: { podcastId: number; seguir: boolean }) =>
      seguir
        ? podcastService.seguirPodcast(userId!, podcastId)
        : podcastService.dejarDeSeguirPodcast(userId!, podcastId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['podcasts', 'seguidos'] });
    },
  });
};
