import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const AddPlaylistModal = () => {
  return (
    <SafeAreaView className="flex-1 bg-spotify-card">
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-white text-2xl font-bold mb-4">Nueva Playlist</Text>
        <Text className="text-spotify-text-secondary text-sm mb-8">
          FASE 8 implementará el formulario completo
        </Text>
        <Pressable 
          onPress={() => router.back()}
          className="bg-spotify-green px-8 py-3 rounded-full"
        >
          <Text className="text-black font-bold">Cerrar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default AddPlaylistModal;
