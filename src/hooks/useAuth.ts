import { useState, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import type { LoginCredentials, RegisterData } from '../types/api.types';

export const useAuth = () => {
  const store = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await store.login(credentials);
      return user;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [store]);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await store.register(data);
      return user;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al registrarse';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [store]);

  const logout = useCallback(async () => {
    await store.logout();
  }, [store]);

  return {
    // Estado
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading,
    error,
    // Acciones
    login,
    register,
    logout,
    clearError,
    refreshUser: store.refreshUser,
  };
};
