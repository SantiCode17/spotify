import AsyncStorage from '@react-native-async-storage/async-storage';

// Claves de AsyncStorage para persistencia local
const KEYS = {
  RECENT_SEARCHES: 'recent_searches',
  LIBRARY_TAB: 'library_active_tab',
  LIBRARY_SORT: 'library_sort_option',
} as const;

// Maximo de busquedas recientes almacenadas
const MAX_RECENT = 10;

export const getRecentSearches = async (): Promise<string[]> => {
  try {
    const raw = await AsyncStorage.getItem(KEYS.RECENT_SEARCHES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const addRecentSearch = async (query: string): Promise<void> => {
  try {
    const current = await getRecentSearches();
    const filtered = current.filter((q) => q.toLowerCase() !== query.toLowerCase());
    const updated = [query, ...filtered].slice(0, MAX_RECENT);
    await AsyncStorage.setItem(KEYS.RECENT_SEARCHES, JSON.stringify(updated));
  } catch {
    // Error silencioso
  }
};

export const removeRecentSearch = async (query: string): Promise<void> => {
  try {
    const current = await getRecentSearches();
    const updated = current.filter((q) => q !== query);
    await AsyncStorage.setItem(KEYS.RECENT_SEARCHES, JSON.stringify(updated));
  } catch {
    // Error silencioso
  }
};

export const clearRecentSearches = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(KEYS.RECENT_SEARCHES);
  } catch {
    // Error silencioso
  }
};

// Obtiene la pestaña activa guardada en la biblioteca
export const getLibraryTab = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(KEYS.LIBRARY_TAB);
  } catch {
    return null;
  }
};

export const setLibraryTab = async (tab: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.LIBRARY_TAB, tab);
  } catch {
    // Error silencioso
  }
};

// Obtiene la opcion de ordenacion guardada en la biblioteca
export const getLibrarySort = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(KEYS.LIBRARY_SORT);
  } catch {
    return null;
  }
};

export const setLibrarySort = async (sort: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.LIBRARY_SORT, sort);
  } catch {
    // Error silencioso
  }
};
