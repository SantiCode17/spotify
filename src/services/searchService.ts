import apiClient from '../config/api';
import type { Cancion, Artista, Album, Playlist, Podcast } from '../types/api.types';

// Tipado de resultados de busqueda agrupados por categoria
export interface SearchResults {
  canciones: Cancion[];
  artistas: Artista[];
  albums: Album[];
  playlists: Playlist[];
  podcasts: Podcast[];
}

// Busqueda global: obtiene todos los recursos y filtra en cliente
// (la API no tiene endpoint de busqueda unificado)
export const searchAll = async (query: string): Promise<SearchResults> => {
  const q = query.toLowerCase();

  const [canciones, artistas, albums, playlists, podcasts] = await Promise.all([
    apiClient.get('/canciones').then((r) => r.data),
    apiClient.get('/artistas').then((r) => r.data),
    apiClient.get('/albums').then((r) => r.data),
    apiClient.get('/playlists').then((r) => r.data),
    apiClient.get('/podcasts').then((r) => r.data),
  ]);

  return {
    canciones: (canciones as Cancion[])
      .filter(
        (c) =>
          c.titulo?.toLowerCase().includes(q) ||
          c.album?.artista?.nombre?.toLowerCase().includes(q)
      )
      .slice(0, 10),
    artistas: (artistas as Artista[])
      .filter((a) => a.nombre?.toLowerCase().includes(q))
      .slice(0, 10),
    albums: (albums as Album[])
      .filter(
        (a) =>
          a.titulo?.toLowerCase().includes(q) ||
          a.artista?.nombre?.toLowerCase().includes(q)
      )
      .slice(0, 10),
    playlists: (playlists as Playlist[])
      .filter((p) => p.titulo?.toLowerCase().includes(q))
      .slice(0, 10),
    podcasts: (podcasts as Podcast[])
      .filter((p) => p.titulo?.toLowerCase().includes(q))
      .slice(0, 10),
  };
};
