import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import * as songService from '../services/songService';

/** Hook para canciones guardadas (liked songs) */
export const useCancionesGuardadas = () => {
  const userId = useAuthStore((s) => s.userId);
  return useQuery({
    queryKey: ['canciones', 'guardadas', userId],
    queryFn: () => songService.getCancionesGuardadas(userId!),
    enabled: !!userId,
  });
};

/** Mutación para guardar/quitar canción */
export const useGuardarCancion = () => {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.userId);

  return useMutation({
    mutationFn: ({ cancionId, guardar }: { cancionId: number; guardar: boolean }) =>
      guardar
        ? songService.guardarCancion(userId!, cancionId)
        : songService.quitarCancionGuardada(userId!, cancionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canciones', 'guardadas'] });
    },
  });
};
