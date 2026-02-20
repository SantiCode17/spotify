import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// ⚠️ Cambia esta IP por la de tu máquina local
export const BASE_URL = 'http://192.168.1.100:8000';

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
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('No autorizado — redirigir a login');
          break;
        case 404:
          console.error('Recurso no encontrado');
          break;
        case 500:
          console.error('Error interno del servidor');
          break;
        default:
          console.error(`Error HTTP ${error.response.status}`);
      }
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor');
    } else {
      console.error('Error de configuración:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
