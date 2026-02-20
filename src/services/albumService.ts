import apiClient from '../config/api';
import type { Album, Cancion } from '../types/api.types';

/** Obtener todos los álbumes */
export const getAllAlbums = async (): Promise<Album[]> => {
  const response = await apiClient.get('/albums');
  return response.data;
};

/** Obtener detalle de un álbum */
export const getAlbum = async (albumId: number): Promise<Album> => {
  const response = await apiClient.get(`/albums/${albumId}`);
  return response.data;
};

/** Obtener canciones de un álbum */
export const getCancionesAlbum = async (albumId: number): Promise<Cancion[]> => {
  const response = await apiClient.get(`/albums/${albumId}/canciones`);
  return response.data;
};

/** Obtener álbumes seguidos por el usuario */
export const getAlbumsSeguidos = async (userId: number): Promise<Album[]> => {
  const response = await apiClient.get(`/usuarios/${userId}/albums-seguidos`);
  return response.data;
};

/** Seguir álbum */
export const seguirAlbum = async (userId: number, albumId: number): Promise<void> => {
  await apiClient.put(`/usuarios/${userId}/albums-seguidos/${albumId}`);
};

/** Dejar de seguir álbum */
export const dejarDeSeguirAlbum = async (userId: number, albumId: number): Promise<void> => {
  await apiClient.delete(`/usuarios/${userId}/albums-seguidos/${albumId}`);
};
