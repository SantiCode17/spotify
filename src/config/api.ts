import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// ⚠️ Cambia esta IP por la de tu máquina local (puerto 8082 según docker-compose)
export const BASE_URL = 'http://192.168.1.43:8082';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor de request: añade userId como header si está disponible
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const userId = await SecureStore.getItemAsync('user_id');
      if (userId) {
        config.headers['X-User-Id'] = userId;
      }
    } catch {
      // SecureStore no disponible (web), ignorar
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response: maneja errores globalmente
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? 'unknown';
    const method = error.config?.method?.toUpperCase() ?? '?';

    if (error.response) {
      const { status, data } = error.response;
      const detail = typeof data === 'object' ? JSON.stringify(data) : data;
      switch (status) {
        case 401:
          console.error(`[API 401] ${method} ${url} — No autorizado`);
          break;
        case 404:
          console.error(`[API 404] ${method} ${url} — Recurso no encontrado`);
          break;
        case 500:
          console.error(`[API 500] ${method} ${url} — Error interno: ${detail}`);
          break;
        default:
          console.error(`[API ${status}] ${method} ${url} — ${detail}`);
      }
    } else if (error.request) {
      console.error(`[API] ${method} ${url} — No se recibió respuesta del servidor`);
    } else {
      console.error(`[API] Error de configuración: ${error.message}`);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
