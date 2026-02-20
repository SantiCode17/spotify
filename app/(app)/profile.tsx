import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/store/authStore';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <SafeAreaView className="flex-1 bg-spotify-black">
      <View className="px-4 pt-4">
        <Text className="text-spotify-white text-2xl font-bold">Mi Perfil</Text>
      </View>
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-24 h-24 rounded-full bg-spotify-darker items-center justify-center mb-4">
          <Ionicons name="person" size={48} color="#B3B3B3" />
        </View>
        <Text className="text-spotify-white text-xl font-bold">
          {user?.username || 'Usuario'}
        </Text>
        <Text className="text-spotify-gray text-base mt-1">
          {user?.email || 'email@ejemplo.com'}
        </Text>
        <Text className="text-spotify-gray text-sm mt-6">
          Edición de perfil en la siguiente fase
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
