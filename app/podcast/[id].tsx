import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PodcastDetailScreen = () => {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView className="flex-1 bg-spotify-black">
      <View className="flex-1 items-center justify-center">
        <Text className="text-white text-2xl font-bold">Detalle Podcast</Text>
        <Text className="text-spotify-green text-lg mt-2">Podcast #{id}</Text>
      </View>
    </SafeAreaView>
  );
};

export default PodcastDetailScreen;
