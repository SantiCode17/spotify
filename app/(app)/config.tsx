import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const ConfigScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-spotify-black">
      <View className="px-4 pt-4">
        <Text className="text-spotify-white text-2xl font-bold">Configuración</Text>
      </View>
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="settings-outline" size={64} color="#535353" />
        <Text className="text-spotify-white text-lg font-semibold mt-4">
          Ajustes de la aplicación
        </Text>
        <Text className="text-spotify-gray text-sm mt-2">
          Configuración completa en la siguiente fase
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ConfigScreen;
