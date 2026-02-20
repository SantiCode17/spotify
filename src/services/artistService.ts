import apiClient from '../config/api';
import type { Artista, Album, Cancion } from '../types/api.types';

/** Obtener todos los artistas */
export const getAllArtistas = async (): Promise<Artista[]> => {
  const response = await apiClient.get('/artistas');
  return response.data;
};

/** Obtener detalle de un artista */
export const getArtista = async (artistaId: number): Promise<Artista> => {
  const response = await apiClient.get(`/artistas/${artistaId}`);
  return response.data;
};

/** Obtener álbumes de un artista */
export const getAlbumsArtista = async (artistaId: number): Promise<Album[]> => {
  const response = await apiClient.get(`/artistas/${artistaId}/albums`);
  return response.data;
};

/** Obtener canciones de un artista */
export const getCancionesArtista = async (artistaId: number): Promise<Cancion[]> => {
  const response = await apiClient.get(`/artistas/${artistaId}/canciones`);
  return response.data;
};

/** Obtener artistas seguidos por el usuario */
export const getArtistasSeguidos = async (userId: number): Promise<Artista[]> => {
  const response = await apiClient.get(`/usuarios/${userId}/artistas-seguidos`);
  return response.data;
};

/** Seguir artista */
export const seguirArtista = async (userId: number, artistaId: number): Promise<void> => {
  await apiClient.put(`/usuarios/${userId}/artistas-seguidos/${artistaId}`);
};

/** Dejar de seguir artista */
export const dejarDeSeguirArtista = async (userId: number, artistaId: number): Promise<void> => {
  await apiClient.delete(`/usuarios/${userId}/artistas-seguidos/${artistaId}`);
};
