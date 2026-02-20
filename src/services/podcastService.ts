import apiClient from '../config/api';
import type { Podcast, Capitulo } from '../types/api.types';

/** Obtener todos los podcasts */
export const getAllPodcasts = async (): Promise<Podcast[]> => {
  const response = await apiClient.get('/podcasts');
  return response.data;
};

/** Obtener detalle de un podcast */
export const getPodcast = async (podcastId: number): Promise<Podcast> => {
  const response = await apiClient.get(`/podcasts/${podcastId}`);
  return response.data;
};

/** Obtener capítulos de un podcast */
export const getCapitulosPodcast = async (podcastId: number): Promise<Capitulo[]> => {
  const response = await apiClient.get(`/podcasts/${podcastId}/capitulos`);
  return response.data;
};

/** Obtener detalle de un capítulo */
export const getCapitulo = async (capituloId: number): Promise<Capitulo> => {
  const response = await apiClient.get(`/capitulos/${capituloId}`);
  return response.data;
};

/** Obtener podcasts seguidos por el usuario */
export const getPodcastsSeguidos = async (userId: number): Promise<Podcast[]> => {
  const response = await apiClient.get(`/usuarios/${userId}/podcasts-seguidos`);
  return response.data;
};

/** Seguir podcast */
export const seguirPodcast = async (userId: number, podcastId: number): Promise<void> => {
  await apiClient.put(`/usuarios/${userId}/podcasts-seguidos/${podcastId}`);
};

/** Dejar de seguir podcast */
export const dejarDeSeguirPodcast = async (userId: number, podcastId: number): Promise<void> => {
  await apiClient.delete(`/usuarios/${userId}/podcasts-seguidos/${podcastId}`);
};
