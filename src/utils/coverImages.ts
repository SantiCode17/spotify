// Sistema de portadas aleatorias deterministas.
// Asigna una imagen a cada elemento segun su id y tipo,
// para que siempre se muestre la misma portada para el mismo elemento.
import { ImageSourcePropType } from 'react-native';

// Imagenes de portada disponibles en assets/portadas
const COVERS: ImageSourcePropType[] = [
  require('../../assets/portadas/Bad Bunny - EL ÚLTIMO TOUR DEL MUNDO (2020).jpeg'),
  require('../../assets/portadas/DAISY-Rusowsky.jpeg'),
  require('../../assets/portadas/D_Valentino.jpeg'),
  require('../../assets/portadas/JACKBOYS - JACKBOYS.jpeg'),
  require('../../assets/portadas/La Espalda del Sol-Diego 900.jpeg'),
  require('../../assets/portadas/Lil Uzi Vert - Pink Tape.jpeg'),
  require('../../assets/portadas/Michael Jackson - Thriller.jpeg'),
  require('../../assets/portadas/Moonlight922 by Cruz Cafuné.jpeg'),
  require('../../assets/portadas/SAN JORGE.jpeg'),
  require('../../assets/portadas/Travis Scott.jpeg'),
  require('../../assets/portadas/YHLQMDLG; Bad Bunny.jpeg'),
  require('../../assets/portadas/[ C_ Tangana - Avida Dollars ].jpeg'),
  require('../../assets/portadas/_ (1).jpeg'),
  require('../../assets/portadas/_ (10).jpeg'),
  require('../../assets/portadas/_ (11).jpeg'),
  require('../../assets/portadas/_ (12).jpeg'),
  require('../../assets/portadas/_ (13).jpeg'),
  require('../../assets/portadas/_ (14).jpeg'),
  require('../../assets/portadas/_ (2).jpeg'),
  require('../../assets/portadas/_ (3).jpeg'),
  require('../../assets/portadas/_ (4).jpeg'),
  require('../../assets/portadas/_ (5).jpeg'),
  require('../../assets/portadas/_ (6).jpeg'),
  require('../../assets/portadas/_ (7).jpeg'),
  require('../../assets/portadas/_ (8).jpeg'),
  require('../../assets/portadas/_ (9).jpeg'),
  require('../../assets/portadas/_.jpeg'),
  require('../../assets/portadas/album cover.jpeg'),
  require('../../assets/portadas/beerbong & bentleys.jpeg'),
  require('../../assets/portadas/ctangana.jpeg'),
  require('../../assets/portadas/the bends album cover.jpeg'),
  require('../../assets/portadas/🤑tuff.jpeg'),
];

// Devuelve una portada determinista segun id y tipo de contenido.
// El offset por tipo evita que elementos distintos con el mismo id compartan imagen.
type ContentType = 'album' | 'artist' | 'playlist' | 'podcast' | 'song' | 'episode' | 'user';

const TYPE_OFFSET: Record<ContentType, number> = {
  album: 0,
  artist: 7,
  playlist: 13,
  podcast: 19,
  song: 3,
  episode: 11,
  user: 17,
};

export const getCoverImage = (id: number, type: ContentType): ImageSourcePropType => {
  const offset = TYPE_OFFSET[type] ?? 0;
  const index = (id + offset) % COVERS.length;
  return COVERS[index];
};

export const getCoverImageByIndex = (index: number): ImageSourcePropType => {
  return COVERS[Math.abs(index) % COVERS.length];
};

export const TOTAL_COVERS = COVERS.length;
