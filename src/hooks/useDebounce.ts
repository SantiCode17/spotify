import { useState, useEffect } from 'react';

/**
 * Hook de debounce — retrasa la actualización de un valor
 * @param value - El valor a hacer debounce
 * @param delay - Delay en milisegundos (default: 300ms)
 * @returns El valor con debounce aplicado
 */
export const useDebounce = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
