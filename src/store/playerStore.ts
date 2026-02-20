import { create } from 'zustand';
import type { Cancion } from '../types/api.types';

interface PlayerState {
  currentSong: Cancion | null;
  isPlaying: boolean;
  queue: Cancion[];

  setCurrentSong: (song: Cancion) => void;
  togglePlay: () => void;
  clearPlayer: () => void;
  setQueue: (songs: Cancion[]) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],

  setCurrentSong: (song: Cancion) => set({ currentSong: song, isPlaying: true }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  clearPlayer: () => set({ currentSong: null, isPlaying: false, queue: [] }),
  setQueue: (songs: Cancion[]) => set({ queue: songs }),
}));
