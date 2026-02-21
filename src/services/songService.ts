import apiClient from '../config/api';
import type { Cancion } from '../types/api.types';

/** Obtener todas las canciones */
export const getAllSongs = async (): Promise<Cancion[]> => {
  const response = await apiClient.get('/canciones');
  return response.data;
};

/** Obtener detalle de una canción */
export const getSongDetail = async (songId: number): Promise<Cancion> => {
  const response = await apiClient.get(`/canciones/${songId}`);
  return response.data;
};

/** Obtener canciones guardadas (liked songs) del usuario */
export const getSavedSongs = async (userId: number): Promise<Cancion[]> => {
  const response = await apiClient.get(`/usuarios/${userId}/canciones-guardadas`);
  return response.data;
};

/** Guardar canción (like) */
export const saveSong = async (userId: number, cancionId: number): Promise<void> => {
  await apiClient.put(`/usuarios/${userId}/canciones-guardadas/${cancionId}`);
};

/** Quitar canción guardada */
export const unsaveSong = async (userId: number, cancionId: number): Promise<void> => {
  await apiClient.delete(`/usuarios/${userId}/canciones-guardadas/${cancionId}`);
};

