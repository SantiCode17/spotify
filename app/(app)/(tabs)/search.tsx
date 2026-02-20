import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SearchScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-spotify-black">
      <View className="px-4 pt-4">
        <Text className="text-spotify-white text-2xl font-bold">Buscar</Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <Text className="text-spotify-gray text-base">
          Pantalla de Búsqueda — contenido en la siguiente fase
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;
