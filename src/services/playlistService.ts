import apiClient from '../config/api';
import type { Playlist, Cancion } from '../types/api.types';

/** Obtener playlists propias del usuario */
export const getPlaylistsUsuario = async (userId: number): Promise<Playlist[]> => {
  const response = await apiClient.get(`/usuarios/${userId}/playlists`);
  return response.data;
};

/** Crear nueva playlist */
export const createPlaylist = async (userId: number, titulo: string): Promise<Playlist> => {
  const response = await apiClient.post(`/usuarios/${userId}/playlists`, { titulo });
  return response.data;
};

/** Obtener detalle de una playlist */
export const getPlaylist = async (playlistId: number): Promise<Playlist> => {
  const response = await apiClient.get(`/playlists/${playlistId}`);
  return response.data;
};

/** Obtener canciones de una playlist */
export const getCancionesPlaylist = async (playlistId: number): Promise<Cancion[]> => {
  const response = await apiClient.get(`/playlists/${playlistId}/canciones`);
  return response.data;
};

/** Añadir canción a playlist */
export const addCancionToPlaylist = async (
  playlistId: number,
  cancionId: number
): Promise<void> => {
  await apiClient.post(`/playlists/${playlistId}/canciones`, { cancion_id: cancionId });
};

/** Quitar canción de playlist */
export const removeCancionFromPlaylist = async (
  playlistId: number,
  cancionId: number
): Promise<void> => {
  await apiClient.delete(`/playlists/${playlistId}/canciones/${cancionId}`);
};

/** Obtener todas las playlists públicas */
export const getAllPlaylists = async (): Promise<Playlist[]> => {
  const response = await apiClient.get('/playlists');
  return response.data;
};

/** Obtener playlists seguidas por el usuario */
export const getPlaylistsSeguidas = async (userId: number): Promise<Playlist[]> => {
  const response = await apiClient.get(`/usuarios/${userId}/playlists-seguidas`);
  return response.data;
};

/** Seguir playlist */
export const seguirPlaylist = async (userId: number, playlistId: number): Promise<void> => {
  await apiClient.put(`/usuarios/${userId}/playlists-seguidas/${playlistId}`);
};

/** Dejar de seguir playlist */
export const dejarDeSeguirPlaylist = async (userId: number, playlistId: number): Promise<void> => {
  await apiClient.delete(`/usuarios/${userId}/playlists-seguidas/${playlistId}`);
};
