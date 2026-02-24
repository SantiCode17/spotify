import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  RECENT_SEARCHES: 'recent_searches',
  LIBRARY_TAB: 'library_active_tab',
} as const;

// ─── Búsquedas recientes ───────────────────────────────────────
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
    // silently fail
  }
};

export const removeRecentSearch = async (query: string): Promise<void> => {
  try {
    const current = await getRecentSearches();
    const updated = current.filter((q) => q !== query);
    await AsyncStorage.setItem(KEYS.RECENT_SEARCHES, JSON.stringify(updated));
  } catch {
    // silently fail
  }
};

export const clearRecentSearches = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(KEYS.RECENT_SEARCHES);
  } catch {
    // silently fail
  }
};

// ─── Library tab persistido ────────────────────────────────────
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
    // silently fail
  }
};
