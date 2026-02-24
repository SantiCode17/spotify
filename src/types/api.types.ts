// ============================
// Interfaces de respuesta de la API
// ============================

export interface Usuario {
  id: number;
  username: string;
  email: string;
  genero?: string;
  fechaNacimiento?: string;
  codigoPostal?: string;
}

export interface Playlist {
  id: number;
  titulo: string;
  numeroCanciones?: number;
  fechaCreacion?: string;
  usuario?: Pick<Usuario, 'id' | 'username' | 'email'>;
}

/** Respuesta de GET /usuarios/{userId}/playlists (wrapper con estado) */
export interface UserPlaylistWrapper {
  playlist: Playlist;
  estado: string;
}

export interface Cancion {
  id: number;
  titulo: string;
  duracion?: number;
  numeroReproducciones?: number;
  album?: {
    id: number;
    titulo: string;
    anyo?: string;
    artista?: { id: number; nombre: string };
  };
}

export interface Artista {
  id: number;
  nombre: string;
}

export interface Album {
  id: number;
  titulo: string;
  anyo?: string;
  artista?: { id: number; nombre: string };
}

export interface Podcast {
  id: number;
  titulo: string;
  descripcion?: string;
  anyo?: string;
}

export interface Capitulo {
  id: number;
  titulo: string;
  descripcion?: string;
  duracion?: number;
  fecha?: string;
  numeroReproducciones?: number;
}

export interface CancionPlaylist {
  cancion: Cancion;
  fechaAnyadida?: string;
  usuario?: Pick<Usuario, 'id' | 'username' | 'email'>;
}

// ─── Plan del usuario ────────────────────────────────────
export interface Plan {
  tipo: string;              // "free" | "premium"
  fechaRevision?: string;    // para plan free
  fechaRenovacion?: string;  // para plan premium
}

// ─── Configuración del usuario ───────────────────────────
export interface Configuracion {
  autoplay: boolean;
  ajuste: boolean;
  normalizacion: boolean;
  calidad: { nombre: string };
  tipoDescarga: { nombre: string };
  idioma: { nombre: string };
}

// ─── Pago ────────────────────────────────────────────────
export interface Pago {
  numeroOrden: number;
  fecha: string; // ISO string
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
  fechaNacimiento: string;
}
