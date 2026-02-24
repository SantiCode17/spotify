import apiClient from '../config/api';
import type { Usuario, Plan, Configuracion, Pago } from '../types/api.types';


/** Obtener usuario por ID */
export const getUser = async (userId: number): Promise<Usuario> => {
  const response = await apiClient.get(`/usuarios/${userId}`);
  return response.data;
};

/** Actualizar perfil de usuario */
export const updateUser = async (userId: number, data: Partial<Usuario>): Promise<Usuario> => {
  const response = await apiClient.put(`/usuarios/${userId}`, data);
  return response.data;
};

/** Consultar plan actual del usuario */
export const getUserPlan = async (userId: number): Promise<Plan> => {
  const response = await apiClient.get(`/usuarios/${userId}/plan`);
  return response.data;
};

/** Activar plan premium */
export const activatePremium = async (userId: number): Promise<void> => {
  await apiClient.post(`/usuarios/${userId}/premium`);
};

/** Cancelar plan premium (volver a Free) */
export const cancelPremium = async (userId: number): Promise<void> => {
  await apiClient.delete(`/usuarios/${userId}/premium`);
};

/** Obtener configuración del usuario */
export const getUserConfig = async (userId: number): Promise<Configuracion> => {
  const response = await apiClient.get(`/usuarios/${userId}/configuracion`);
  return response.data;
};

/** Actualizar configuración del usuario */
export const updateUserConfig = async (
  userId: number,
  data: Record<string, unknown>
): Promise<Configuracion> => {
  const response = await apiClient.put(`/usuarios/${userId}/configuracion`, data);
  return response.data;
};

/** Obtener historial de pagos */
export const getUserPayments = async (userId: number): Promise<Pago[]> => {
  try {
    const response = await apiClient.get(`/usuarios/${userId}/pagos`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (e: any) {
    if (e.response?.status === 404) return [];
    throw e;
  }
};

/** Obtener todos los usuarios (para búsqueda) */
export const getAllUsers = async (): Promise<Usuario[]> => {
  const response = await apiClient.get('/usuarios');
  return response.data;
};

