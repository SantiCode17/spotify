import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../config/queryKeys';
import * as searchService from '../services/searchService';

// Hook de busqueda global. Se activa cuando la query tiene al menos 3 caracteres.
// Mantiene datos anteriores para evitar parpadeos al escribir.
export const useSearch = (query: string) => {
  return useQuery({
    queryKey: queryKeys.search(query),
    queryFn: () => searchService.searchAll(query),
    enabled: query.trim().length >= 3,
    staleTime: 1000 * 60 * 2,
    placeholderData: (prev) => prev,
  });
};
