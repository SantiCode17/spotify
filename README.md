# 🎵 Spotify Clone — React Native (Expo)

Clon de Spotify desarrollado como práctica de **Programación Multimedia** (DAM).  
Aplicación móvil multiplataforma con React Native + Expo SDK 54.

## 📱 Capturas

> La API no sirve imágenes — los iconos placeholder sustituyen las carátulas.

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Framework** | React Native 0.81 + Expo SDK 54 |
| **Routing** | Expo Router v6 (file-based) |
| **Estilos** | NativeWind v4 (Tailwind CSS) |
| **Estado global** | Zustand v5 |
| **Data fetching** | TanStack Query v5 |
| **HTTP** | Axios |
| **Persistencia** | SecureStore (credenciales) + AsyncStorage (búsquedas recientes) |
| **Navegación** | Tabs + Drawer + Stack |
| **Backend** | Symfony PHP (Docker) + MySQL 8.0 |

## 📂 Estructura del Proyecto

```
app/                    # Pantallas (Expo Router file-based routing)
├── (auth)/             # Login & Register
├── (app)/
│   ├── (tabs)/         # Home, Search, Library, Add
│   ├── playlist/[id]   # Detalle playlist
│   ├── album/[id]      # Detalle álbum
│   ├── artist/[id]     # Detalle artista
│   ├── podcast/[id]    # Detalle podcast
│   ├── episode/[id]    # Detalle episodio
│   ├── profile.tsx     # Perfil editable
│   ├── config.tsx      # Configuración (switches)
│   └── subscriptions.tsx  # Suscripciones y pagos
src/
├── components/         # Componentes reutilizables
│   ├── cards/          # ArtistCard, AlbumCard, SongCard, etc.
│   ├── ui/             # SpotifyButton, SpotifyInput, SpotifyImage, etc.
│   ├── modals/         # AddToPlaylistModal, CreatePlaylistModal
│   ├── library/        # LibraryItemRow
│   └── lists/          # HorizontalList, VerticalList
├── config/             # API base, queryKeys
├── hooks/              # Custom hooks (useAlbums, useArtists, usePlaylists…)
├── services/           # Servicios API (albumService, playlistService…)
├── store/              # Zustand stores (auth, player)
├── types/              # TypeScript interfaces
└── utils/              # formatters.ts
```

## 🚀 Instalación

### Prerrequisitos

- Node.js ≥ 18
- Expo CLI (`npx expo`)
- Docker (para la API backend)

### 1. Clonar e instalar dependencias

```bash
git clone <repo-url>
cd spotify
npm install
```

### 2. Arrancar el backend (Docker)

```bash
docker start add-dbms       # MySQL 8.0
docker start spotify-api    # Symfony API (puerto 8082)
```

### 3. Configurar la IP

Edita `src/config/api.ts` y pon la IP de tu máquina local:

```ts
const BASE_URL = 'http://<TU_IP>:8082';
```

### 4. Iniciar la app

```bash
npx expo start
```

Escanea el QR con Expo Go (Android) o usa un emulador.

## 🔑 Funcionalidades

- **Autenticación**: Login (por email) + Registro con validación
- **Home**: Playlists seguidas, álbumes seguidos, canciones guardadas
- **Búsqueda**: Debounce desde 3 caracteres, búsquedas recientes persistidas
- **Biblioteca**: 4 tabs (Artistas, Álbumes, Podcasts, Listas) con persistencia del tab activo
- **Detalle**: Playlist, Álbum (con canciones), Artista (álbumes + canciones), Podcast (episodios), Episodio
- **Crear Playlist**: Modal desde tab "+" 
- **Añadir a Playlist**: Modal bottom-sheet desde búsqueda
- **Seguir/Dejar de seguir**: Artistas, álbumes, playlists, podcasts
- **Perfil**: Editable (username, email, género, código postal)
- **Configuración**: Switches (autoplay, ajuste, normalización) con API real
- **Suscripciones**: Plan actual + historial de pagos + activar Premium
- **Drawer lateral**: Navegación a perfil, config, suscripciones + logout

## 👤 Autor

Santiago — DAM · IES La Sénia

## 📄 Licencia

Proyecto académico — uso educativo.
