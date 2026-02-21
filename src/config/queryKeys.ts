/**
 * Query keys centralizadas para TanStack Query.
 * Garantizan consistencia en queryKey + invalidaciones.
 */
export const queryKeys = {
  // ─── Usuario ─────────────────────────────────────────
  user: (userId: number) => ['user', userId] as const,
  userPlan: (userId: number) => ['user', userId, 'plan'] as const,
  userConfig: (userId: number) => ['user', userId, 'config'] as const,
  userPayments: (userId: number) => ['user', userId, 'payments'] as const,

  // ─── Playlists ───────────────────────────────────────
  userPlaylists: (userId: number) => ['user', userId, 'playlists'] as const,
  followedPlaylists: (userId: number) => ['user', userId, 'followed-playlists'] as const,
  playlistDetail: (playlistId: number) => ['playlist', playlistId] as const,
  playlistSongs: (playlistId: number) => ['playlist', playlistId, 'songs'] as const,
  publicPlaylists: () => ['playlists', 'public'] as const,

  // ─── Artistas ────────────────────────────────────────
  followedArtists: (userId: number) => ['user', userId, 'followed-artists'] as const,
  artistDetail: (artistId: number) => ['artist', artistId] as const,
  artistAlbums: (artistId: number) => ['artist', artistId, 'albums'] as const,
  artistSongs: (artistId: number) => ['artist', artistId, 'songs'] as const,
  allArtists: () => ['artists'] as const,

  // ─── Álbumes ─────────────────────────────────────────
  followedAlbums: (userId: number) => ['user', userId, 'followed-albums'] as const,
  albumDetail: (albumId: number) => ['album', albumId] as const,
  albumSongs: (albumId: number) => ['album', albumId, 'songs'] as const,
  allAlbums: () => ['albums'] as const,

  // ─── Podcasts ────────────────────────────────────────
  followedPodcasts: (userId: number) => ['user', userId, 'followed-podcasts'] as const,
  podcastDetail: (podcastId: number) => ['podcast', podcastId] as const,
  podcastEpisodes: (podcastId: number) => ['podcast', podcastId, 'episodes'] as const,
  episodeDetail: (episodeId: number) => ['episode', episodeId] as const,
  allPodcasts: () => ['podcasts'] as const,

  // ─── Canciones ───────────────────────────────────────
  savedSongs: (userId: number) => ['user', userId, 'saved-songs'] as const,
  songDetail: (songId: number) => ['song', songId] as const,
  allSongs: () => ['songs'] as const,

  // ─── Búsqueda ────────────────────────────────────────
  search: (query: string) => ['search', query] as const,
};
