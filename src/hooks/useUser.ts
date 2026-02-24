import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../config/queryKeys';
import * as userService from '../services/userService';
import type { Usuario } from '../types/api.types';

/** Datos del usuario */
export const useUser = (userId: number | null) => {
  return useQuery({
    queryKey: queryKeys.user(userId!),
    queryFn: () => userService.getUser(userId!),
    enabled: !!userId,
  });
};

/** Plan del usuario */
export const useUserPlan = (userId: number | null) => {
  return useQuery({
    queryKey: queryKeys.userPlan(userId!),
    queryFn: () => userService.getUserPlan(userId!),
    enabled: !!userId,
  });
};

/** Configuración del usuario */
export const useUserConfig = (userId: number | null) => {
  return useQuery({
    queryKey: queryKeys.userConfig(userId!),
    queryFn: () => userService.getUserConfig(userId!),
    enabled: !!userId,
  });
};

/** Actualizar configuración */
export const useUpdateUserConfig = (userId: number | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => userService.updateUserConfig(userId!, data),
    onSuccess: () => {
      if (userId) queryClient.invalidateQueries({ queryKey: queryKeys.userConfig(userId) });
    },
  });
};

/** Actualizar perfil */
export const useUpdateUser = (userId: number | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Usuario>) => userService.updateUser(userId!, data),
    onSuccess: () => {
      if (userId) queryClient.invalidateQueries({ queryKey: queryKeys.user(userId) });
    },
  });
};

/** Pagos del usuario */
export const useUserPayments = (userId: number | null) => {
  return useQuery({
    queryKey: queryKeys.userPayments(userId!),
    queryFn: () => userService.getUserPayments(userId!),
    enabled: !!userId,
  });
};

/** Activar premium */
export const useActivatePremium = (userId: number | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => userService.activatePremium(userId!),
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.userPlan(userId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.userPayments(userId) });
      }
    },
  });
};

/** Cancelar premium (volver a Free) */
export const useCancelPremium = (userId: number | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => userService.cancelPremium(userId!),
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.userPlan(userId) });
      }
    },
  });
};
