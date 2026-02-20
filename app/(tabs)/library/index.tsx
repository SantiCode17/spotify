import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LibraryScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-spotify-black">
      <View className="flex-1 items-center justify-center">
        <Text className="text-white text-2xl font-bold">Biblioteca</Text>
        <Text className="text-spotify-text-secondary text-sm mt-2">Tu biblioteca musical</Text>
      </View>
    </SafeAreaView>
  );
};

export default LibraryScreen;
