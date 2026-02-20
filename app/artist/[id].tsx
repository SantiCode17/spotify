import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ArtistDetailScreen = () => {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView className="flex-1 bg-spotify-black">
      <View className="flex-1 items-center justify-center">
        <Text className="text-white text-2xl font-bold">Detalle Artista</Text>
        <Text className="text-spotify-green text-lg mt-2">Artista #{id}</Text>
      </View>
    </SafeAreaView>
  );
};

export default ArtistDetailScreen;
