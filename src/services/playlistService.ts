import apiClient from '../config/api';
import type { Playlist, Cancion, UserPlaylistWrapper } from '../types/api.types';
import { enrichSongs } from './songService';

// Obtener playlists propias del usuario (la API devuelve [{playlist, estado}])
export const getUserPlaylists = async (userId: number): Promise<Playlist[]> => {
  try {
    const response = await apiClient.get<UserPlaylistWrapper[]>(`/usuarios/${userId}/playlists`);
    return response.data.map((w) => w.playlist);
  } catch (e: any) {
    if (e.response?.status === 404) return [];
    throw e;
  }
};

// Obtener playlists seguidas por el usuario
export const getFollowedPlaylists = async (userId: number): Promise<Playlist[]> => {
  try {
    const response = await apiClient.get(`/usuarios/${userId}/playlists-seguidas`);
    return response.data;
  } catch (e: any) {
    if (e.response?.status === 404) return [];
    throw e;
  }
};

// Obtener detalle de una playlist
export const getPlaylistDetail = async (playlistId: number): Promise<Playlist> => {
  const response = await apiClient.get(`/playlists/${playlistId}`);
  return response.data;
};

// Obtener canciones de una playlist enriquecidas con datos del artista
export const getPlaylistSongs = async (playlistId: number): Promise<Cancion[]> => {
  const response = await apiClient.get(`/playlists/${playlistId}/canciones`);
  const data = response.data;
  if (!Array.isArray(data)) return [];
  // La API puede devolver Cancion[] o CancionPlaylist[] con wrapper {cancion, fechaAnyadida}
  const songs = data.map((item: any) => (item.cancion ? item.cancion : item));
  return enrichSongs(songs);
};

// Crear nueva playlist
export const createPlaylist = async (userId: number, titulo: string): Promise<Playlist> => {
  const response = await apiClient.post(`/usuarios/${userId}/playlists`, { titulo });
  return response.data;
};

// Añadir cancion a una playlist
export const addSongToPlaylist = async (
  playlistId: number,
  cancionId: number,
  usuarioId: number
): Promise<void> => {
  await apiClient.post(`/playlists/${playlistId}/canciones`, { cancionId, usuarioId });
};

// Quitar cancion de una playlist
export const removeSongFromPlaylist = async (
  playlistId: number,
  cancionId: number
): Promise<void> => {
  await apiClient.delete(`/playlists/${playlistId}/canciones/${cancionId}`);
};

// Seguir una playlist
export const followPlaylist = async (userId: number, playlistId: number): Promise<void> => {
  await apiClient.put(`/usuarios/${userId}/playlists-seguidas/${playlistId}`);
};

// Dejar de seguir una playlist
export const unfollowPlaylist = async (userId: number, playlistId: number): Promise<void> => {
  await apiClient.delete(`/usuarios/${userId}/playlists-seguidas/${playlistId}`);
};

// Obtener todas las playlists publicas
export const getPublicPlaylists = async (): Promise<Playlist[]> => {
  const response = await apiClient.get('/playlists');
  return response.data;
};

