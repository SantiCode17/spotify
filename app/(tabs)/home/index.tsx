import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-spotify-black">
      <View className="flex-1 items-center justify-center">
        <Text className="text-white text-2xl font-bold">Home</Text>
        <Text className="text-spotify-text-secondary text-sm mt-2">Pantalla principal</Text>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
