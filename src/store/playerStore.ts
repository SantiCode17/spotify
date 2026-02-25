import { create } from 'zustand';
import type { Cancion } from '../types/api.types';

// Tipado del estado y acciones del reproductor
interface PlayerState {
  currentSong: Cancion | null;
  isPlaying: boolean;
  queue: Cancion[];
  queueIndex: number;
  progress: number;
  currentTime: number;
  shuffle: boolean;
  repeat: 'off' | 'all' | 'one';

  setCurrentSong: (song: Cancion) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  clearPlayer: () => void;
  setQueue: (songs: Cancion[]) => void;
  setProgress: (progress: number) => void;
  setCurrentTime: (time: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  playSongFromQueue: (song: Cancion, songs: Cancion[]) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

// Store global del reproductor de música con Zustand
export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  queueIndex: -1,
  progress: 0,
  currentTime: 0,
  shuffle: false,
  repeat: 'off',

  // Establece la canción actual y busca su posición en la cola
  setCurrentSong: (song: Cancion) => {
    const { queue } = get();
    const idx = queue.findIndex((s) => s.id === song.id);
    set({
      currentSong: song,
      isPlaying: true,
      progress: 0,
      currentTime: 0,
      queueIndex: idx >= 0 ? idx : -1,
    });
  },

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  // Limpia el reproductor y reinicia todo el estado
  clearPlayer: () =>
    set({
      currentSong: null,
      isPlaying: false,
      queue: [],
      queueIndex: -1,
      progress: 0,
      currentTime: 0,
    }),

  setQueue: (songs: Cancion[]) => set({ queue: songs }),
  setProgress: (progress: number) => set({ progress }),
  setCurrentTime: (time: number) => set({ currentTime: time }),

  // Reproduce una canción desde un listado, estableciendo toda la cola
  playSongFromQueue: (song: Cancion, songs: Cancion[]) => {
    const idx = songs.findIndex((s) => s.id === song.id);
    set({
      currentSong: song,
      isPlaying: true,
      progress: 0,
      currentTime: 0,
      queue: songs,
      queueIndex: idx >= 0 ? idx : 0,
    });
  },

  // Pasa a la siguiente canción según el modo de repetición y aleatorio
  playNext: () => {
    const { queue, queueIndex, shuffle, repeat } = get();
    if (queue.length === 0) return;

    let nextIndex: number;
    if (repeat === 'one') {
      nextIndex = queueIndex;
    } else if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = queueIndex + 1;
      if (nextIndex >= queue.length) {
        if (repeat === 'all') {
          nextIndex = 0;
        } else {
          set({ isPlaying: false, progress: 0, currentTime: 0 });
          return;
        }
      }
    }

    const nextSong = queue[nextIndex];
    if (nextSong) {
      set({
        currentSong: nextSong,
        queueIndex: nextIndex,
        isPlaying: true,
        progress: 0,
        currentTime: 0,
      });
    }
  },

  // Vuelve a la canción anterior o reinicia si lleva más de 3 segundos
  playPrevious: () => {
    const { queue, queueIndex, currentTime } = get();
    if (queue.length === 0) return;

    if (currentTime > 3) {
      set({ progress: 0, currentTime: 0 });
      return;
    }

    let prevIndex = queueIndex - 1;
    if (prevIndex < 0) prevIndex = queue.length - 1;

    const prevSong = queue[prevIndex];
    if (prevSong) {
      set({
        currentSong: prevSong,
        queueIndex: prevIndex,
        isPlaying: true,
        progress: 0,
        currentTime: 0,
      });
    }
  },

  // Alterna el modo aleatorio
  toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),

  // Cicla entre los modos de repetición: off -> all -> one -> off
  toggleRepeat: () =>
    set((s) => ({
      repeat: s.repeat === 'off' ? 'all' : s.repeat === 'all' ? 'one' : 'off',
    })),
}));
