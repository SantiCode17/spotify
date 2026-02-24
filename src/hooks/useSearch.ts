import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../config/queryKeys';
import * as searchService from '../services/searchService';

/**
 * Hook de búsqueda global.
 * Solo se activa cuando la query tiene >= 2 caracteres.
 * keepPreviousData evita parpadeos al cambiar la query.
 */
export const useSearch = (query: string) => {
  return useQuery({
    queryKey: queryKeys.search(query),
    queryFn: () => searchService.searchAll(query),
    enabled: query.trim().length >= 2,
    staleTime: 1000 * 60 * 2, // 2 minutos
    placeholderData: (prev) => prev, // keepPreviousData en v5
  });
};
