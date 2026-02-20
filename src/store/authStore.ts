import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import type { Usuario, LoginCredentials, RegisterData } from '../types/api.types';
import * as authService from '../services/authService';

// ─── Claves de almacenamiento ────────────────────────────────
const STORE_KEY_USER = 'user_data';
const STORE_KEY_USER_ID = 'user_id';

// ─── Tipos del store ─────────────────────────────────────────
interface AuthState {
  user: Usuario | null;
  userId: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Acciones
  login: (credentials: LoginCredentials) => Promise<Usuario>;
  register: (data: RegisterData) => Promise<Usuario>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// ─── Helpers SecureStore (fallback web → localStorage) ───────
const secureSet = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const secureGet = async (key: string): Promise<string | null> => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }
  return await SecureStore.getItemAsync(key);
};

const secureDelete = async (key: string) => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

// ─── Store ───────────────────────────────────────────────────
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userId: null,
  isAuthenticated: false,
  isLoading: true,

  /**
   * Simula login: busca usuario por email en la API.
   * Guarda datos en SecureStore para persistencia.
   */
  login: async (credentials: LoginCredentials) => {
    const user = await authService.login(credentials);
    await secureSet(STORE_KEY_USER, JSON.stringify(user));
    await secureSet(STORE_KEY_USER_ID, String(user.id));
    set({ user, userId: user.id, isAuthenticated: true });
    return user;
  },

  /**
   * Registra un nuevo usuario con POST /usuarios.
   * Auto-login tras registro exitoso.
   */
  register: async (data: RegisterData) => {
    const user = await authService.register(data);
    await secureSet(STORE_KEY_USER, JSON.stringify(user));
    await secureSet(STORE_KEY_USER_ID, String(user.id));
    set({ user, userId: user.id, isAuthenticated: true });
    return user;
  },

  /**
   * Cierra sesión: limpia SecureStore y resetea estado.
   */
  logout: async () => {
    await secureDelete(STORE_KEY_USER);
    await secureDelete(STORE_KEY_USER_ID);
    set({ user: null, userId: null, isAuthenticated: false });
  },

  /**
   * Inicializa la autenticación al arrancar la app.
   * Lee datos persistidos de SecureStore.
   */
  initializeAuth: async () => {
    try {
      const userStr = await secureGet(STORE_KEY_USER);
      const userIdStr = await secureGet(STORE_KEY_USER_ID);

      if (userStr && userIdStr) {
        const user: Usuario = JSON.parse(userStr);
        set({
          user,
          userId: parseInt(userIdStr, 10),
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error al inicializar autenticación:', error);
      // Si hay error, limpiamos datos corruptos
      await secureDelete(STORE_KEY_USER);
      await secureDelete(STORE_KEY_USER_ID);
      set({ user: null, userId: null, isAuthenticated: false, isLoading: false });
    }
  },

  /**
   * Refresca los datos del usuario desde la API.
   * Útil después de actualizar perfil/plan.
   */
  refreshUser: async () => {
    const { userId } = get();
    if (!userId) return;
    try {
      const user = await authService.getUsuarioById(userId);
      await secureSet(STORE_KEY_USER, JSON.stringify(user));
      set({ user });
    } catch (error) {
      console.error('Error al refrescar usuario:', error);
    }
  },
}));
