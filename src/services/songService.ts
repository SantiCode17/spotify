import apiClient from '../config/api';
import type { Cancion } from '../types/api.types';

/** Obtener todas las canciones */
export const getAllCanciones = async (): Promise<Cancion[]> => {
  const response = await apiClient.get('/canciones');
  return response.data;
};

/** Obtener detalle de una canción */
export const getCancion = async (cancionId: number): Promise<Cancion> => {
  const response = await apiClient.get(`/canciones/${cancionId}`);
  return response.data;
};

/** Obtener canciones guardadas (liked songs) del usuario */
export const getCancionesGuardadas = async (userId: number): Promise<Cancion[]> => {
  const response = await apiClient.get(`/usuarios/${userId}/canciones-guardadas`);
  return response.data;
};

/** Guardar canción (like) */
export const guardarCancion = async (userId: number, cancionId: number): Promise<void> => {
  await apiClient.put(`/usuarios/${userId}/canciones-guardadas/${cancionId}`);
};

/** Quitar canción guardada */
export const quitarCancionGuardada = async (userId: number, cancionId: number): Promise<void> => {
  await apiClient.delete(`/usuarios/${userId}/canciones-guardadas/${cancionId}`);
};
