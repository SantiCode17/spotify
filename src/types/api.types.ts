// ============================
// Interfaces de respuesta de la API
// ============================

export interface Usuario {
  id: number;
  username: string;
  email: string;
  genero?: string;
  fecha_nacimiento?: string;
  codigo_postal?: string;
  foto_perfil?: string;
  plan?: string;
}

export interface Plan {
  tipo: 'free' | 'premium';
  fecha_renovacion?: string;
}

export interface Configuracion {
  id: number;
  usuario_id: number;
  idioma?: string;
  tema?: string;
  notificaciones?: boolean;
  calidad_audio?: string;
  [key: string]: unknown;
}

export interface Playlist {
  id: number;
  titulo: string;
  usuario_id: number;
  estado?: string;
  imagen?: string;
  descripcion?: string;
}

export interface Cancion {
  id: number;
  titulo: string;
  duracion?: number;
  artista_id?: number;
  album_id?: number;
  imagen?: string;
  artista?: Artista;
  album?: Album;
}

export interface Artista {
  id: number;
  nombre: string;
  imagen?: string;
  biografia?: string;
}

export interface Album {
  id: number;
  titulo: string;
  artista_id?: number;
  anyo?: number;
  imagen?: string;
  artista?: Artista;
}

export interface Podcast {
  id: number;
  titulo: string;
  descripcion?: string;
  imagen?: string;
}

export interface Capitulo {
  id: number;
  titulo: string;
  descripcion?: string;
  duracion?: number;
  podcast_id: number;
  fecha_publicacion?: string;
}

export interface Pago {
  id: number;
  fecha: string;
  cantidad: number;
  suscripcion_id?: number;
}

export interface Suscripcion {
  id: number;
  tipo: string;
  fecha_inicio: string;
  fecha_fin?: string;
  usuario_id: number;
}

export interface CancionPlaylist {
  cancion: Cancion;
  fecha_anyadida: string;
  usuario_id: number;
}

// Respuesta genérica de la API
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Respuesta paginada
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
}

// Credenciales de login
export interface LoginCredentials {
  email: string;
  password: string;
}

// Datos de registro
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  fecha_nacimiento: string;
}
