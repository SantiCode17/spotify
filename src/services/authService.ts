import apiClient from '../config/api';
import type { Usuario, LoginCredentials, RegisterData } from '../types/api.types';

// Obtiene la lista de todos los usuarios
export const getUsuarios = async (): Promise<Usuario[]> => {
  const response = await apiClient.get('/usuarios');
  return response.data;
};

// Obtiene un usuario por su ID
export const getUsuarioById = async (id: number): Promise<Usuario> => {
  const response = await apiClient.get(`/usuarios/${id}`);
  return response.data;
};

// Inicia sesion enviando email y password al endpoint POST /login
export const login = async (credentials: LoginCredentials): Promise<Usuario> => {
  try {
    const response = await apiClient.post('/login', {
      email: credentials.email,
      password: credentials.password,
    });
    return response.data;
  } catch (err: any) {
    // Extraer mensaje legible de la respuesta de la API
    if (err.response?.data?.error) {
      throw new Error(err.response.data.error);
    }
    if (err.response?.status === 401) {
      throw new Error('Contraseña incorrecta');
    }
    if (err.response?.status === 404) {
      throw new Error('No se encontró una cuenta con ese email');
    }
    throw new Error('Error al iniciar sesión. Revisa tu conexión.');
  }
};

// Registra un nuevo usuario. La API crea plan Free y configuracion por defecto.
export const register = async (data: RegisterData): Promise<Usuario> => {
  const response = await apiClient.post('/usuarios', {
    username: data.username,
    password: data.password,
    email: data.email,
    fechaNacimiento: data.fechaNacimiento,
  });
  return response.data;
};

// Cierre de sesion (la limpieza real se hace en el store con SecureStore)
export const logout = async (): Promise<void> => {};
