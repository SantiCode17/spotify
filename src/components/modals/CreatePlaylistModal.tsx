import React, { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import SpotifyInput from '../ui/SpotifyInput';
import SpotifyButton from '../ui/SpotifyButton';
import { useCreatePlaylist } from '../../hooks/usePlaylists';

interface CreatePlaylistModalProps {
  onClose: () => void;
}

const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({ onClose }) => {
  const [titulo, setTitulo] = useState('');
  const [error, setError] = useState('');
  const createPlaylist = useCreatePlaylist();

  const handleCreate = () => {
    // Validaciones
    if (!titulo.trim()) {
      setError('El título no puede estar vacío');
      return;
    }
    if (titulo.trim().length < 3) {
      setError('El título debe tener al menos 3 caracteres');
      return;
    }

    setError('');
    createPlaylist.mutate(titulo.trim(), {
      onSuccess: () => {
        Alert.alert('¡Éxito!', 'Playlist creada correctamente');
        onClose();
      },
      onError: () => {
        Alert.alert('Error', 'No se pudo crear la playlist');
      },
    });
  };

  return (
    <View className="flex-1 bg-spotify-dark justify-center px-6">
      <Text className="text-spotify-white text-2xl font-bold text-center mb-8">
        Nueva Playlist
      </Text>

      <SpotifyInput
        label="Título de la playlist"
        placeholder="Dale un nombre a tu playlist"
        value={titulo}
        onChangeText={setTitulo}
        error={error}
        icon="musical-notes"
        autoFocus
      />

      <View className="mt-6 gap-3">
        <SpotifyButton
          title="Crear Playlist"
          onPress={handleCreate}
          isLoading={createPlaylist.isPending}
          fullWidth
        />
        <SpotifyButton
          title="Cancelar"
          variant="outline"
          onPress={onClose}
          fullWidth
        />
      </View>
    </View>
  );
};

export default CreatePlaylistModal;
