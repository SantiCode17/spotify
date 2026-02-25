import apiClient from '../config/api';
import type { Cancion } from '../types/api.types';

// Caché en memoria para canciones ya enriquecidas (evita llamadas repetidas a la API)
const enrichCache = new Map<number, Cancion>();

// Obtener todas las canciones
export const getAllSongs = async (): Promise<Cancion[]> => {
  const response = await apiClient.get('/canciones');
  return response.data;
};

// Obtener detalle de una canción por ID
export const getSongDetail = async (songId: number): Promise<Cancion> => {
  const response = await apiClient.get(`/canciones/${songId}`);
  const song = response.data as Cancion;
  enrichCache.set(song.id, song);
  return song;
};

// Enriquece canciones que no tienen datos completos de album/artista.
// Usa cache en memoria para no repetir peticiones al servidor.
export const enrichSongs = async (songs: Cancion[]): Promise<Cancion[]> => {
  if (!songs || songs.length === 0) return [];

  const enriched = await Promise.all(
    songs.map(async (song) => {
      // Si ya tiene artista, no hace falta enriquecer
      if (song.album?.artista?.nombre) return song;

      // Comprobar si ya está en caché
      const cached = enrichCache.get(song.id);
      if (cached) return cached;

      try {
        const detail = await apiClient.get(`/canciones/${song.id}`);
        const fullSong = detail.data as Cancion;
        enrichCache.set(fullSong.id, fullSong);
        return fullSong;
      } catch {
        return song;
      }
    })
  );
  return enriched;
};

// Obtener canciones guardadas del usuario
export const getSavedSongs = async (userId: number): Promise<Cancion[]> => {
  try {
    const response = await apiClient.get(`/usuarios/${userId}/canciones-guardadas`);
    const songs: Cancion[] = response.data;
    return enrichSongs(songs);
  } catch (e: any) {
    if (e.response?.status === 404) return [];
    throw e;
  }
};

// Guardar una canción como favorita
export const saveSong = async (userId: number, cancionId: number): Promise<void> => {
  await apiClient.put(`/usuarios/${userId}/canciones-guardadas/${cancionId}`);
};

// Quitar canción de favoritos
export const unsaveSong = async (userId: number, cancionId: number): Promise<void> => {
  await apiClient.delete(`/usuarios/${userId}/canciones-guardadas/${cancionId}`);
};

