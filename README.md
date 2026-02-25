# 🎵 Spotify Clone — React Native (Expo)

Clon funcional de Spotify desarrollado como práctica de **Programación Multimedia** del ciclo **DAM** (Desarrollo de Aplicaciones Multiplataforma).  
Aplicación móvil multiplataforma construida con **React Native + Expo SDK 54**, conectada a una API REST en **Symfony PHP** con base de datos **MySQL 8.0**, todo corriendo sobre **Docker**.

---

## � Índice

- [Stack tecnológico](#-stack-tecnológico)
- [Arquitectura del proyecto](#-arquitectura-del-proyecto)
- [Funcionalidades](#-funcionalidades)
- [Sistema de navegación](#-sistema-de-navegación)
- [Gestión de estado y datos](#-gestión-de-estado-y-datos)
- [Persistencia local](#-persistencia-local)
- [Instalación y puesta en marcha](#-instalación-y-puesta-en-marcha)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Autor](#-autor)

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Framework** | React Native + Expo | RN 0.81 · Expo SDK 54 |
| **Lenguaje** | TypeScript | 5.9 |
| **Routing** | Expo Router (file-based) | v6 |
| **Estilos** | NativeWind (Tailwind CSS) | v4 |
| **Estado global** | Zustand | v5 |
| **Data fetching** | TanStack React Query | v5 |
| **HTTP Client** | Axios | 1.13 |
| **Credenciales** | expo-secure-store | 15.x |
| **Almacenamiento local** | AsyncStorage | 2.2 |
| **Animaciones** | React Native Reanimated | 4.1 |
| **Iconos** | @expo/vector-icons (Ionicons) | 15.x |
| **Degradados** | expo-linear-gradient | 15.x |
| **Backend** | Symfony PHP 8.0 (Docker) | — |
| **Base de datos** | MySQL 8.0 (Docker) | — |

## 📂 Arquitectura del Proyecto

El proyecto sigue una **arquitectura por capas** separando presentación, lógica de negocio y acceso a datos:

```
spotify/
│
├── app/                            # Pantallas (Expo Router file-based routing)
│   ├── _layout.tsx                 # Layout raíz (QueryClientProvider + fuentes)
│   ├── index.tsx                   # Redirección inicial según autenticación
│   │
│   ├── (auth)/                     # Grupo de autenticación
│   │   ├── _layout.tsx             # Stack de auth con protección de rutas
│   │   ├── login.tsx               # Pantalla de inicio de sesión
│   │   └── register.tsx            # Pantalla de registro
│   │
│   └── (app)/                      # Grupo principal (usuario autenticado)
│       ├── _layout.tsx             # Drawer + protección de rutas
│       │
│       ├── (tabs)/                 # Navegación por tabs
│       │   ├── _layout.tsx         # Tab bar (Home, Search, +, Library)
│       │   ├── index.tsx           # Home (3 FlatLists horizontales/verticales)
│       │   ├── search.tsx          # Búsqueda global mixta
│       │   ├── library.tsx         # Biblioteca con filtros y ordenación
│       │   └── add.tsx             # Placeholder (el tab + abre un modal)
│       │
│       ├── album/[id].tsx          # Detalle de álbum + canciones
│       ├── artist/[id].tsx         # Detalle de artista + álbumes + canciones
│       ├── playlist/[id].tsx       # Detalle de playlist (CRUD canciones)
│       ├── podcast/[id].tsx        # Detalle de podcast + episodios
│       ├── episode/[id].tsx        # Detalle de episodio
│       ├── song/[id].tsx           # Reproductor (animación, cola, controles)
│       ├── liked-songs.tsx         # Canciones guardadas (favoritas)
│       ├── profile.tsx             # Perfil de usuario (editable)
│       ├── config.tsx              # Configuración (autoplay, calidad, idioma)
│       └── subscriptions.tsx       # Suscripción y pagos
│
├── src/                            # Código fuente organizado por capas
│   │
│   ├── config/                     # Configuración global
│   │   ├── api.ts                  # Cliente Axios + interceptores (SecureStore)
│   │   └── queryKeys.ts           # Claves centralizadas de React Query
│   │
│   ├── types/                      # Interfaces TypeScript
│   │   └── api.types.ts            # Tipos de toda la API
│   │
│   ├── services/                   # Capa de acceso a datos (llamadas HTTP)
│   │   ├── albumService.ts         # CRUD álbumes
│   │   ├── artistService.ts        # CRUD artistas
│   │   ├── authService.ts          # Login, registro, logout
│   │   ├── playlistService.ts      # CRUD playlists + canciones
│   │   ├── podcastService.ts       # Podcasts y episodios
│   │   ├── searchService.ts        # Búsqueda global
│   │   ├── songService.ts          # Canciones (con enrichCache)
│   │   ├── userService.ts          # Perfil, configuración, suscripciones
│   │   └── storageService.ts       # AsyncStorage (búsquedas, preferencias)
│   │
│   ├── hooks/                      # Custom hooks (React Query wrappers)
│   │   ├── useAlbums.ts            # Seguidos, detalle, follow/unfollow
│   │   ├── useArtists.ts           # Seguidos, detalle, follow/unfollow
│   │   ├── useAuth.ts              # Hook de autenticación
│   │   ├── useDebounce.ts          # Debounce genérico
│   │   ├── usePlaylists.ts         # Propias, seguidas, CRUD, follow
│   │   ├── usePodcasts.ts          # Seguidos, detalle, follow/unfollow
│   │   ├── useRecentSearches.ts    # Búsquedas recientes (AsyncStorage)
│   │   ├── useSearch.ts            # Búsqueda global (≥3 caracteres)
│   │   ├── useSongs.ts             # Guardadas, guardar/quitar favoritos
│   │   └── useUser.ts              # Perfil, config, pagos, suscripción
│   │
│   ├── store/                      # Estado global (Zustand)
│   │   ├── authStore.ts            # Autenticación (login, logout, SecureStore)
│   │   └── playerStore.ts          # Reproductor (cola, shuffle, repeat, next/prev)
│   │
│   ├── components/                 # Componentes reutilizables
│   │   ├── cards/                  # Tarjetas de contenido
│   │   │   ├── AlbumCard.tsx
│   │   │   ├── ArtistCard.tsx
│   │   │   ├── EpisodeCard.tsx
│   │   │   ├── PlaylistCard.tsx
│   │   │   ├── PodcastCard.tsx
│   │   │   └── SongCard.tsx
│   │   ├── modals/                 # Modales bottom-sheet
│   │   │   ├── AddToPlaylistModal.tsx    # Añadir canción a playlist
│   │   │   ├── AddSongSearchModal.tsx    # Buscar canciones para añadir
│   │   │   └── CreatePlaylistModal.tsx   # Crear nueva playlist
│   │   ├── ui/                     # Componentes UI genéricos
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorState.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ShimmerPlaceholder.tsx
│   │   │   ├── SpotifyButton.tsx
│   │   │   ├── SpotifyImage.tsx
│   │   │   └── SpotifyInput.tsx
│   │   ├── lists/
│   │   │   └── HorizontalList.tsx  # FlatList horizontal genérica
│   │   ├── library/
│   │   │   └── LibraryItemRow.tsx  # Fila de biblioteca
│   │   ├── DrawerContent.tsx       # Contenido del drawer lateral
│   │   ├── SectionHeader.tsx       # Cabecera de sección con "Ver todo"
│   │   └── TabBarIcon.tsx          # Icono de tab bar
│   │
│   └── utils/                      # Utilidades
│       ├── formatters.ts           # Formato de fechas, duraciones, números
│       └── coverImages.ts          # Imágenes placeholder por tipo
│
├── api-spotify/                    # Backend (Symfony + Docker)
│   └── spotify-api-add/
│       ├── docker-compose.yml      # Contenedor PHP 8.0 + Apache (puerto 8082)
│       ├── spotify.sql             # Dump completo de la base de datos MySQL
│       └── src/Controller/         # Controladores REST (10)
│
├── app.json                        # Configuración de Expo
├── package.json                    # Dependencias del proyecto
├── tsconfig.json                   # Configuración TypeScript
├── tailwind.config.js              # Configuración NativeWind/Tailwind
├── metro.config.js                 # Configuración de Metro bundler
└── babel.config.js                 # Configuración de Babel
```

## ✨ Funcionalidades

### 🔐 Autenticación
- Login por email y contraseña con validación de campos
- Registro de nuevo usuario con todos los datos necesarios
- Persistencia de sesión con **SecureStore** (token + datos de usuario cifrados)
- Protección de rutas: redirige a login si no hay sesión activa
- Logout con limpieza completa de estado

### 🏠 Home
- **3 secciones con FlatList** diferenciadas:
  - Playlists seguidas (FlatList horizontal)
  - Álbumes seguidos (FlatList horizontal)
  - Canciones guardadas (FlatList vertical)
- Saludo dinámico según la hora del día (Buenos días / Buenas tardes / Buenas noches)
- Acceso al Drawer desde el avatar del usuario
- Botón "Ver todo" que redirige al filtro correspondiente de Biblioteca

### 🔍 Búsqueda
- Se activa a partir del **3er carácter** (con debounce de 400ms)
- Resultados **mixtos**: artistas, álbumes, canciones, playlists y podcasts
- Búsquedas recientes persistidas con **AsyncStorage**
- Posibilidad de limpiar búsquedas recientes individualmente o todas a la vez
- Añadir canciones a playlist directamente desde los resultados

### 📚 Biblioteca
- **Chips de filtrado**: Todo, Playlists, Artistas, Álbumes, Podcasts
- **Modal de ordenación**: Recientes, A-Z, Creador, Añadido recientemente
- Persistencia del filtro y orden activos con **AsyncStorage**
- Acceso a "Canciones que te gustan" como primer elemento fijo
- Crear playlists desde el botón +

### ➕ Crear (Tab central)
- El tab central (+) abre un **modal** para crear una nueva playlist
- Campos: título y descripción
- Creación mediante mutación con invalidación de caché automática

### 🎵 Reproductor de Canciones
- Pantalla completa con **portada rotativa animada** (5 segundos por vuelta)
- Barra de progreso simulada
- Controles: **Play/Pausa, Anterior, Siguiente, Shuffle, Repetir**
- Sistema de **cola de reproducción** completo (funcional desde cualquier pantalla)
- Menú de 3 puntos con opciones:
  - Añadir/quitar de favoritos ❤️
  - Añadir a playlist
  - Compartir
  - Ir al álbum / artista
- Sección de información: reproducciones, álbum con portada, artista con foto

### 📀 Pantallas de Detalle
- **Álbum**: portada hero, metadatos, botón seguir, lista de canciones con reproducción en cola
- **Artista**: foto circular, botón seguir, álbumes en horizontal, canciones populares
- **Playlist**: portada, datos, CRUD completo (añadir/eliminar/reordenar canciones)
- **Podcast**: portada, descripción, lista de episodios
- **Episodio**: imagen, metadatos y descripción completa

### 👤 Perfil
- Campos editables: username, email, género, código postal, fecha de nacimiento
- Selector de género (modal)
- Selector de fecha de nacimiento (día/mes/año)
- Avatar con foto del usuario

### ⚙️ Configuración
- Switches funcionales: reproducción automática, ajuste de volumen, normalización de audio
- Selectores: calidad de streaming, idioma
- Datos sincronizados con la API en tiempo real

### 💎 Suscripciones
- Visualización del plan actual (Free / Premium)
- Activación de Premium con un toque
- Lista de ventajas Premium
- Historial completo de pagos

### 📂 Drawer Lateral
- Acceso desde el avatar en Home y Biblioteca
- Opciones: Perfil, Configuración, Suscripciones
- Información del usuario (nombre, email, avatar)
- Cerrar sesión
- Versión de la app

---

## 🧭 Sistema de Navegación

La app combina **3 tipos de navegación** con Expo Router:

```
Stack (raíz)
├── (auth)                    ← Stack: Login / Register
└── (app)                     ← Drawer
    ├── (tabs)                ← Tab Navigator
    │   ├── Home              ← index.tsx
    │   ├── Search            ← search.tsx
    │   ├── + (modal)         ← Abre CreatePlaylistModal
    │   └── Library           ← library.tsx
    │
    ├── profile.tsx           ← Desde Drawer
    ├── config.tsx            ← Desde Drawer
    ├── subscriptions.tsx     ← Desde Drawer
    │
    ├── album/[id].tsx        ← Stack push
    ├── artist/[id].tsx       ← Stack push
    ├── playlist/[id].tsx     ← Stack push
    ├── podcast/[id].tsx      ← Stack push
    ├── episode/[id].tsx      ← Stack push
    ├── song/[id].tsx         ← Stack push (reproductor)
    └── liked-songs.tsx       ← Stack push
```

---

## 🗂️ Gestión de Estado y Datos

### Zustand (estado global)

| Store | Responsabilidad |
|-------|----------------|
| `authStore` | Sesión del usuario, login/logout, persistencia con SecureStore |
| `playerStore` | Canción actual, cola de reproducción, shuffle, repeat, next/prev |

### TanStack React Query (datos del servidor)

- **Queries** con claves centralizadas en `queryKeys.ts`
- **Mutaciones** con invalidación automática de caché tras cada operación
- `staleTime` de 5 minutos para reducir peticiones innecesarias
- `gcTime` de 10 minutos para garbage collection
- `placeholderData` para evitar parpadeos durante la búsqueda

### Custom Hooks

Cada entidad tiene un hook dedicado que encapsula todas las queries y mutaciones necesarias:

| Hook | Funciones principales |
|------|----------------------|
| `useAlbums` | `useFollowedAlbums`, `useAlbumDetail`, `useAlbumSongs`, `useFollowAlbum`, `useUnfollowAlbum` |
| `useArtists` | `useFollowedArtists`, `useArtistDetail`, `useArtistSongs`, `useArtistAlbums`, `useFollowArtist` |
| `usePlaylists` | `useUserPlaylists`, `useFollowedPlaylists`, `usePlaylistDetail`, `useCreatePlaylist`, `useAddSongToPlaylist`, `useRemoveSongFromPlaylist` |
| `useSongs` | `useSavedSongs`, `useSaveSong`, `useUnsaveSong` |
| `usePodcasts` | `useFollowedPodcasts`, `usePodcastDetail`, `usePodcastEpisodes`, `useFollowPodcast` |
| `useSearch` | Búsqueda global mixta activada desde 3 caracteres con debounce |
| `useUser` | `useUserProfile`, `useUpdateProfile`, `useUserConfig`, `useUpdateConfig`, `useUserPayments`, `useActivatePremium` |

---

## 💾 Persistencia Local

| Tecnología | Uso | Seguridad |
|-----------|-----|-----------|
| **expo-secure-store** | Token de sesión, ID y datos del usuario | Cifrado nativo del SO |
| **AsyncStorage** | Búsquedas recientes, filtro activo, orden de biblioteca | Sin cifrar (datos no sensibles) |

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos

- **Node.js** ≥ 18
- **Expo CLI** (`npx expo`)
- **Docker** y **Docker Compose** (para el backend)
- **Expo Go** en el dispositivo móvil (o un emulador Android/iOS)

### 1. Clonar el repositorio

```bash
git clone https://github.com/SantiCode17/spotify.git
cd spotify
```

### 2. Instalar dependencias del frontend

```bash
npm install
```

### 3. Arrancar el backend (Docker)

```bash
# Crear la red Docker compartida (solo la primera vez)
docker network create edu-shared

# Arrancar los contenedores
docker start add-dbms        # MySQL 8.0 (puerto 33006)
docker start spotify-api     # Symfony API (puerto 8082)
```

> La base de datos se inicializa con el dump `api-spotify/spotify-api-add/spotify.sql`.

### 4. Configurar la IP de la API

Edita `src/config/api.ts` y sustituye la IP por la de tu máquina en la red local:

```ts
export const BASE_URL = 'http://<TU_IP_LOCAL>:8082';
```

> Para obtener tu IP: `hostname -I` (Linux) o `ipconfig` (Windows).

### 5. Iniciar la app

```bash
npx expo start
```

Escanea el código QR con **Expo Go** o pulsa `a` para abrir en emulador Android.

### 6. Credenciales de prueba

| Campo | Valor |
|-------|-------|
| **Email** | `doblesmarch@gmail.com` |
| **Contraseña** | `Mepica1801111` |

---

## 🌐 Endpoints de la API

La API REST de Symfony expone los siguientes controladores:

| Controlador | Endpoints principales |
|-------------|----------------------|
| `UsuarioController` | Login, registro, perfil, actualizar datos |
| `CancionController` | Listar, detalle, guardar/quitar favoritos |
| `AlbumController` | Listar, detalle, canciones, seguir/dejar |
| `ArtistaController` | Listar, detalle, canciones, álbumes, seguir/dejar |
| `PlaylistController` | CRUD completo, canciones, seguir/dejar |
| `PodcastController` | Listar, detalle, episodios, seguir/dejar |
| `ConfiguracionController` | Obtener/actualizar preferencias del usuario |
| `PlanController` | Plan actual, activar Premium |
| `PagoController` | Historial de pagos |

**URL base**: `http://<IP>:8082`

---

## 📊 Resumen Técnico

| Métrica | Valor |
|---------|-------|
| Pantallas | 15+ |
| Componentes reutilizables | 20+ |
| Custom hooks | 10 |
| Servicios API | 9 |
| Stores Zustand | 2 |
| Modales bottom-sheet | 5+ |
| Controladores backend | 10 |
| Errores TypeScript | 0 |

---

## 👤 Autor

**Santiago Sánchez March** — 2º DAM · IES La Sénia  
Práctica de Programación Multimedia — Curso 2024/2025

---

## 📄 Licencia

Proyecto académico de uso educativo. No destinado a distribución comercial.
