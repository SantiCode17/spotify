import apiClient from '../config/api';
import type { Podcast, Capitulo } from '../types/api.types';

// Obtener todos los podcasts
export const getAllPodcasts = async (): Promise<Podcast[]> => {
  const response = await apiClient.get('/podcasts');
  return response.data;
};

// Obtener detalle de un podcast
export const getPodcastDetail = async (podcastId: number): Promise<Podcast> => {
  const response = await apiClient.get(`/podcasts/${podcastId}`);
  return response.data;
};

// Obtener capitulos de un podcast
export const getPodcastEpisodes = async (podcastId: number): Promise<Capitulo[]> => {
  const response = await apiClient.get(`/podcasts/${podcastId}/capitulos`);
  return response.data;
};

// Obtener detalle de un capitulo
export const getEpisodeDetail = async (episodeId: number): Promise<Capitulo> => {
  const response = await apiClient.get(`/capitulos/${episodeId}`);
  return response.data;
};

// Obtener podcasts seguidos por el usuario
export const getFollowedPodcasts = async (userId: number): Promise<Podcast[]> => {
  try {
    const response = await apiClient.get(`/usuarios/${userId}/podcasts-seguidos`);
    return response.data;
  } catch (e: any) {
    if (e.response?.status === 404) return [];
    throw e;
  }
};

// Seguir un podcast
export const followPodcast = async (userId: number, podcastId: number): Promise<void> => {
  await apiClient.put(`/usuarios/${userId}/podcasts-seguidos/${podcastId}`);
};

// Dejar de seguir un podcast
export const unfollowPodcast = async (userId: number, podcastId: number): Promise<void> => {
  await apiClient.delete(`/usuarios/${userId}/podcasts-seguidos/${podcastId}`);
};

