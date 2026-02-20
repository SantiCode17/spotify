import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EpisodeDetailScreen = () => {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView className="flex-1 bg-spotify-black">
      <View className="flex-1 items-center justify-center">
        <Text className="text-white text-2xl font-bold">Detalle Episodio</Text>
        <Text className="text-spotify-green text-lg mt-2">Episodio #{id}</Text>
      </View>
    </SafeAreaView>
  );
};

export default EpisodeDetailScreen;
