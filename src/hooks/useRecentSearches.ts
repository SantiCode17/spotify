import { useState, useEffect, useCallback } from 'react';
import * as storageService from '../services/storageService';

export const useRecentSearches = () => {
  const [searches, setSearches] = useState<string[]>([]);

  const load = useCallback(async () => {
    const data = await storageService.getRecentSearches();
    setSearches(data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = useCallback(async (query: string) => {
    if (query.trim().length < 2) return;
    await storageService.addRecentSearch(query.trim());
    await load();
  }, [load]);

  const remove = useCallback(async (query: string) => {
    await storageService.removeRecentSearch(query);
    await load();
  }, [load]);

  const clear = useCallback(async () => {
    await storageService.clearRecentSearches();
    setSearches([]);
  }, []);

  return { searches, add, remove, clear };
};
