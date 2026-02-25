import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
  Animated,
  Easing,
  Share,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuthStore } from '../../../src/store/authStore';
import { usePlayerStore } from '../../../src/store/playerStore';
import { useSongDetail, useSavedSongs, useSaveSong, useUnsaveSong } from '../../../src/hooks/useSongs';
import AddToPlaylistModal from '../../../src/components/modals/AddToPlaylistModal';
import ErrorState from '../../../src/components/ui/ErrorState';
import { getCoverImage } from '../../../src/utils/coverImages';
import { formatDuration, formatPlays } from '../../../src/utils/formatters';

const SongDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const songId = Number(id);
  const userId = useAuthStore((s) => s.userId);

  // Player store
  const currentSong = usePlayerStore((s) => s.currentSong);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const progress = usePlayerStore((s) => s.progress);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const shuffle = usePlayerStore((s) => s.shuffle);
  const repeat = usePlayerStore((s) => s.repeat);
  const setCurrentSong = usePlayerStore((s) => s.setCurrentSong);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const setProgress = usePlayerStore((s) => s.setProgress);
  const setCurrentTime = usePlayerStore((s) => s.setCurrentTime);
  const pause = usePlayerStore((s) => s.pause);
  const playNext = usePlayerStore((s) => s.playNext);
  const playPrevious = usePlayerStore((s) => s.playPrevious);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
  const toggleRepeat = usePlayerStore((s) => s.toggleRepeat);

  const isThisSongPlaying = currentSong?.id === songId && isPlaying;
  const isThisSongCurrent = currentSong?.id === songId;

  // Modals
  const [showMenu, setShowMenu] = useState(false);
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);

  // Referencia al temporizador de reproduccion simulada
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Valor animado para la rotacion de la portada (efecto vinilo)
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const rotationRef = useRef<Animated.CompositeAnimation | null>(null);

  if (!id || isNaN(songId)) {
    return (
      <SafeAreaView className="flex-1 bg-spotify-black">
        <ErrorState message="ID de canción inválido" onRetry={() => router.back()} />
      </SafeAreaView>
    );
  }

  const { data: song, isLoading, isError, refetch } = useSongDetail(songId);
  const { data: savedSongs } = useSavedSongs(userId);
  const saveMutation = useSaveSong(userId);
  const unsaveMutation = useUnsaveSong(userId);

  const isSaved = savedSongs?.some((s) => s.id === songId) ?? false;
  const duration = song?.duracion ?? 210;

  // Temporizador de reproduccion simulada
  useEffect(() => {
    if (isThisSongPlaying) {
      timerRef.current = setInterval(() => {
        const store = usePlayerStore.getState();
        const newTime = store.currentTime + 1;
        if (newTime >= duration) {
          // Song ended — check repeat mode
          const { repeat: rep } = usePlayerStore.getState();
          if (rep === 'one') {
            usePlayerStore.getState().setCurrentTime(0);
            usePlayerStore.getState().setProgress(0);
          } else {
            usePlayerStore.getState().playNext();
          }
        } else {
          usePlayerStore.getState().setCurrentTime(newTime);
          usePlayerStore.getState().setProgress(newTime / duration);
        }
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isThisSongPlaying, duration]);

  // Animación de rotación de la portada (efecto vinilo, 5 segundos por vuelta)
  useEffect(() => {
    if (isThisSongPlaying) {
      rotationRef.current = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 5000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      rotationRef.current.start();
    } else {
      if (rotationRef.current) {
        rotationRef.current.stop();
      }
    }
  }, [isThisSongPlaying]);

  // Navegar a cancion si cambia la cancion actual (siguiente/anterior)
  useEffect(() => {
    if (currentSong && currentSong.id !== songId) {
      router.replace(`/song/${currentSong.id}`);
    }
  }, [currentSong?.id]);

  const toggleSave = () => {
    if (!userId) return;
    if (isSaved) unsaveMutation.mutate(songId);
    else saveMutation.mutate(songId);
  };

  const handlePlayPress = useCallback(() => {
    if (!song) return;
    if (isThisSongCurrent) {
      togglePlay();
    } else {
      setCurrentSong(song);
    }
  }, [song, isThisSongCurrent, togglePlay, setCurrentSong]);

  const handleShare = async () => {
    if (!song) return;
    try {
      await Share.share({
        message: `🎵 Escucha "${song.titulo}"${song.album?.artista?.nombre ? ` de ${song.album.artista.nombre}` : ''} en Spotify Clone!`,
      });
    } catch {
      // User cancelled
    }
  };

  const displayCurrentTime = isThisSongCurrent ? currentTime : 0;
  const displayProgress = isThisSongCurrent ? progress : 0;

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-spotify-black items-center justify-center">
        <ActivityIndicator size="large" color="#1DB954" />
      </SafeAreaView>
    );
  }

  if (isError || !song) {
    return (
      <SafeAreaView className="flex-1 bg-spotify-black">
        <ErrorState message="No se pudo cargar la canción" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-spotify-black" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <LinearGradient
          colors={['#1a1a2e', '#16213e', '#121212']}
          style={{ paddingBottom: 30 }}
        >
          {/* Barra superior */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingTop: 12,
              paddingBottom: 16,
            }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: '#00000040',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="chevron-down" size={22} color="#fff" />
            </TouchableOpacity>
            <Text
              style={{ color: '#A7A7A7', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5 }}
            >
              Reproduciendo
            </Text>
            <TouchableOpacity
              onPress={() => setShowMenu(true)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: '#00000040',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="ellipsis-horizontal" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Portada con rotacion */}
          <View style={{ alignItems: 'center', paddingHorizontal: 32, marginTop: 8 }}>
            <View
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 18 },
                shadowOpacity: 0.7,
                shadowRadius: 30,
                elevation: 24,
              }}
            >
              <Animated.Image
                source={getCoverImage(songId, 'song')}
                style={{
                  width: 300,
                  height: 300,
                  borderRadius: isThisSongPlaying ? 150 : 12,
                  transform: isThisSongPlaying ? [{ rotate: spin }] : [],
                }}
                resizeMode="cover"
              />
            </View>
          </View>
        </LinearGradient>

        {/* Informacion de la cancion */}
        <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, marginRight: 16 }}>
              <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800' }} numberOfLines={2}>
                {song.titulo}
              </Text>
              {song.album?.artista && (
                <TouchableOpacity
                  onPress={() => router.push(`/artist/${song.album!.artista!.id}`)}
                  style={{ marginTop: 4 }}
                >
                  <Text style={{ color: '#A7A7A7', fontSize: 15, fontWeight: '500' }}>
                    {song.album.artista.nombre}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              onPress={toggleSave}
              disabled={saveMutation.isPending || unsaveMutation.isPending}
            >
              <Ionicons
                name={isSaved ? 'heart' : 'heart-outline'}
                size={28}
                color={isSaved ? '#1DB954' : '#B3B3B3'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Barra de progreso */}
        <View style={{ paddingHorizontal: 24, marginTop: 28 }}>
          <View
            style={{
              height: 4,
              backgroundColor: '#535353',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                height: '100%',
                backgroundColor: '#1DB954',
                borderRadius: 2,
                width: `${displayProgress * 100}%`,
              }}
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <Text style={{ color: '#A7A7A7', fontSize: 12, fontWeight: '500' }}>
              {formatDuration(Math.floor(displayCurrentTime))}
            </Text>
            <Text style={{ color: '#A7A7A7', fontSize: 12, fontWeight: '500' }}>
              {formatDuration(duration)}
            </Text>
          </View>
        </View>

        {/* Controles de reproduccion */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 24,
            marginTop: 16,
            gap: 32,
          }}
        >
          {/* Aleatorio */}
          <TouchableOpacity onPress={toggleShuffle}>
            <Ionicons name="shuffle" size={24} color={shuffle ? '#1DB954' : '#B3B3B3'} />
          </TouchableOpacity>
          {/* Anterior */}
          <TouchableOpacity onPress={playPrevious}>
            <Ionicons name="play-skip-back" size={28} color="#fff" />
          </TouchableOpacity>
          {/* Reproducir/Pausar */}
          <TouchableOpacity
            onPress={handlePlayPress}
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: '#1DB954',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons
              name={isThisSongPlaying ? 'pause' : 'play'}
              size={32}
              color="#000"
              style={isThisSongPlaying ? {} : { marginLeft: 3 }}
            />
          </TouchableOpacity>
          {/* Siguiente */}
          <TouchableOpacity onPress={playNext}>
            <Ionicons name="play-skip-forward" size={28} color="#fff" />
          </TouchableOpacity>
          {/* Repetir */}
          <TouchableOpacity onPress={toggleRepeat}>
            <Ionicons
              name={repeat === 'one' ? 'repeat' : 'repeat'}
              size={24}
              color={repeat !== 'off' ? '#1DB954' : '#B3B3B3'}
            />
            {repeat === 'one' && (
              <View style={{
                position: 'absolute',
                bottom: -4,
                left: 0,
                right: 0,
                alignItems: 'center',
              }}>
                <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#1DB954' }} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Fila de acciones extra */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 24,
            marginTop: 24,
          }}
        >
          <TouchableOpacity
            onPress={() => song.album && router.push(`/album/${song.album.id}`)}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Ionicons name="disc-outline" size={20} color="#A7A7A7" />
            <Text style={{ color: '#A7A7A7', fontSize: 13, marginLeft: 6 }} numberOfLines={1}>
              {song.album?.titulo ?? 'Álbum'}
            </Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: 20 }}>
            <TouchableOpacity onPress={handleShare}>
              <Ionicons name="share-outline" size={22} color="#A7A7A7" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowAddToPlaylist(true)}>
              <Ionicons name="add-circle-outline" size={22} color="#A7A7A7" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Información de la canción */}
        <View style={{ paddingHorizontal: 24, marginTop: 32 }}>
          <Text
            style={{
              color: '#A7A7A7',
              fontSize: 11,
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              marginBottom: 14,
            }}
          >
            Sobre esta canción
          </Text>

          <View style={{ backgroundColor: '#1A1A1A', borderRadius: 16, overflow: 'hidden' }}>
            {/* Reproducciones */}
            {song.numeroReproducciones != null && (
              <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: '#252525',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="headset-outline" size={20} color="#1DB954" />
                </View>
                <View style={{ marginLeft: 14 }}>
                  <Text style={{ color: '#686868', fontSize: 12 }}>Reproducciones</Text>
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
                    {formatPlays(song.numeroReproducciones)}
                  </Text>
                </View>
              </View>
            )}

            {/* Separador */}
            {song.numeroReproducciones != null && song.album && (
              <View style={{ height: 1, backgroundColor: '#252525', marginHorizontal: 16 }} />
            )}

            {/* Álbum con portada */}
            {song.album && (
              <TouchableOpacity
                onPress={() => router.push(`/album/${song.album!.id}`)}
                activeOpacity={0.7}
                style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}
              >
                <Image
                  source={getCoverImage(song.album.id, 'album')}
                  style={{ width: 52, height: 52, borderRadius: 8 }}
                  resizeMode="cover"
                />
                <View style={{ marginLeft: 14, flex: 1 }}>
                  <Text style={{ color: '#686868', fontSize: 12 }}>Álbum</Text>
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }} numberOfLines={1}>
                    {song.album.titulo}
                  </Text>
                  {song.album.anyo && (
                    <Text style={{ color: '#686868', fontSize: 12, marginTop: 2 }}>
                      {song.album.anyo}
                    </Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={16} color="#535353" />
              </TouchableOpacity>
            )}

            {/* Separador */}
            {song.album && song.album?.artista && (
              <View style={{ height: 1, backgroundColor: '#252525', marginHorizontal: 16 }} />
            )}

            {/* Artista con foto */}
            {song.album?.artista && (
              <TouchableOpacity
                onPress={() => router.push(`/artist/${song.album!.artista!.id}`)}
                activeOpacity={0.7}
                style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}
              >
                <Image
                  source={getCoverImage(song.album.artista.id, 'artist')}
                  style={{ width: 52, height: 52, borderRadius: 26 }}
                  resizeMode="cover"
                />
                <View style={{ marginLeft: 14, flex: 1 }}>
                  <Text style={{ color: '#686868', fontSize: 12 }}>Artista</Text>
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }} numberOfLines={1}>
                    {song.album.artista.nombre}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#535353" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Modal del menu de tres puntos */}
      <Modal
        visible={showMenu}
        animationType="slide"
        transparent
        onRequestClose={() => setShowMenu(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' }}>
          <Pressable style={{ flex: 1 }} onPress={() => setShowMenu(false)} />

          <View style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' }}>
            <LinearGradient colors={['#2A2A2A', '#1A1A1A', '#121212']}>
              {/* Indicador del modal */}
              <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 4 }}>
                <View style={{ width: 40, height: 4, backgroundColor: '#535353', borderRadius: 2 }} />
              </View>

              {/* Cabecera de cancion */}
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
                <Image
                  source={getCoverImage(songId, 'song')}
                  style={{ width: 48, height: 48, borderRadius: 6 }}
                  resizeMode="cover"
                />
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }} numberOfLines={1}>
                    {song.titulo}
                  </Text>
                  <Text style={{ color: '#A7A7A7', fontSize: 13, marginTop: 2 }} numberOfLines={1}>
                    {song.album?.artista?.nombre ?? 'Artista'}
                  </Text>
                </View>
              </View>

              <View style={{ height: 1, backgroundColor: '#333', marginHorizontal: 20 }} />

              {/* Opciones del menu */}
              {[
                {
                  icon: isSaved ? 'heart' : 'heart-outline',
                  label: isSaved ? 'Quitar de favoritos' : 'Añadir a favoritos',
                  color: isSaved ? '#1DB954' : '#fff',
                  action: () => { toggleSave(); setShowMenu(false); },
                },
                {
                  icon: 'add-circle-outline',
                  label: 'Añadir a playlist',
                  color: '#fff',
                  action: () => { setShowMenu(false); setTimeout(() => setShowAddToPlaylist(true), 300); },
                },
                {
                  icon: 'share-outline',
                  label: 'Compartir',
                  color: '#fff',
                  action: () => { setShowMenu(false); setTimeout(handleShare, 300); },
                },
                ...(song.album ? [{
                  icon: 'disc-outline' as const,
                  label: `Ver álbum: ${song.album.titulo}`,
                  color: '#fff',
                  action: () => { setShowMenu(false); router.push(`/album/${song.album!.id}`); },
                }] : []),
                ...(song.album?.artista ? [{
                  icon: 'person-outline' as const,
                  label: `Ver artista: ${song.album.artista.nombre}`,
                  color: '#fff',
                  action: () => { setShowMenu(false); router.push(`/artist/${song.album!.artista!.id}`); },
                }] : []),
              ].map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.6}
                  onPress={item.action}
                  style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 24 }}
                >
                  <Ionicons name={item.icon as any} size={22} color={item.color} />
                  <Text style={{ color: item.color, fontSize: 15, fontWeight: '500', marginLeft: 16, flex: 1 }} numberOfLines={1}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}

              {/* Cancelar */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowMenu(false)}
                style={{
                  paddingVertical: 18,
                  alignItems: 'center',
                  borderTopWidth: 1,
                  borderTopColor: '#333',
                  marginTop: 8,
                  marginBottom: 8,
                }}
              >
                <Text style={{ color: '#B3B3B3', fontSize: 15, fontWeight: '600' }}>Cancelar</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </Modal>

      {/* Modal para añadir a playlist */}
      <AddToPlaylistModal
        visible={showAddToPlaylist}
        songId={songId}
        onClose={() => setShowAddToPlaylist(false)}
      />
    </SafeAreaView>
  );
};

export default SongDetailScreen;
