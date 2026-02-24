import apiClient from '../config/api';
import type { Artista, Album, Cancion } from '../types/api.types';

/** Obtener todos los artistas */
export const getAllArtists = async (): Promise<Artista[]> => {
  const response = await apiClient.get('/artistas');
  return response.data;
};

/** Obtener detalle de un artista */
export const getArtistDetail = async (artistId: number): Promise<Artista> => {
  const response = await apiClient.get(`/artistas/${artistId}`);
  return response.data;
};

/** Obtener álbumes de un artista */
export const getArtistAlbums = async (artistId: number): Promise<Album[]> => {
  const response = await apiClient.get(`/artistas/${artistId}/albums`);
  return response.data;
};

/** Obtener canciones de un artista */
export const getArtistSongs = async (artistId: number): Promise<Cancion[]> => {
  const response = await apiClient.get(`/artistas/${artistId}/canciones`);
  return response.data;
};

/** Obtener artistas seguidos por el usuario */
export const getFollowedArtists = async (userId: number): Promise<Artista[]> => {
  try {
    const response = await apiClient.get(`/usuarios/${userId}/artistas-seguidos`);
    return response.data;
  } catch (e: any) {
    if (e.response?.status === 404) return [];
    throw e;
  }
};

/** Seguir artista */
export const followArtist = async (userId: number, artistId: number): Promise<void> => {
  await apiClient.put(`/usuarios/${userId}/artistas-seguidos/${artistId}`);
};

/** Dejar de seguir artista */
export const unfollowArtist = async (userId: number, artistId: number): Promise<void> => {
  await apiClient.delete(`/usuarios/${userId}/artistas-seguidos/${artistId}`);
};

