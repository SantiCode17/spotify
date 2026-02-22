import apiClient from '../config/api';
import type { Usuario, LoginCredentials, RegisterData } from '../types/api.types';

/**
 * Obtiene la lista de todos los usuarios (usado para simular login)
 */
export const getUsuarios = async (): Promise<Usuario[]> => {
  const response = await apiClient.get('/usuarios');
  return response.data;
};

/**
 * Obtiene un usuario por ID
 */
export const getUsuarioById = async (id: number): Promise<Usuario> => {
  const response = await apiClient.get(`/usuarios/${id}`);
  return response.data;
};

/**
 * Simula login: obtiene usuarios y busca coincidencia por email.
 * La API no devuelve el password (es write-only), así que solo
 * verificamos que el email exista. En producción habría JWT.
 */
export const login = async (credentials: LoginCredentials): Promise<Usuario> => {
  const usuarios = await getUsuarios();
  const user = usuarios.find(
    (u: Usuario) => u.email.toLowerCase() === credentials.email.toLowerCase()
  );
  if (!user) {
    throw new Error('No se encontró una cuenta con ese email');
  }
  // No podemos verificar el password porque la API no lo devuelve
  return user;
};

/**
 * Registra un nuevo usuario (POST /usuarios)
 * La API crea automáticamente plan Free + Configuración por defecto.
 */
export const register = async (data: RegisterData): Promise<Usuario> => {
  const response = await apiClient.post('/usuarios', {
    username: data.username,
    password: data.password,
    email: data.email,
    fechaNacimiento: data.fechaNacimiento,
  });
  return response.data;
};

/**
 * Logout — solo limpia datos locales (no hay endpoint server)
 */
export const logout = async (): Promise<void> => {
  // El logout real se maneja en el store (limpiar SecureStore)
};
