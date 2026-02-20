import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AlbumDetailScreen = () => {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView className="flex-1 bg-spotify-black">
      <View className="flex-1 items-center justify-center">
        <Text className="text-spotify-white text-2xl font-bold">Detalle Álbum</Text>
        <Text className="text-spotify-green text-lg mt-2">Álbum #{id}</Text>
        <Text className="text-spotify-gray text-sm mt-4">
          Contenido completo en la siguiente fase
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default AlbumDetailScreen;
