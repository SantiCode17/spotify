import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import CreatePlaylistModal from '../../src/components/modals/CreatePlaylistModal';

const AddPlaylistScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-spotify-dark">
      <CreatePlaylistModal onClose={() => router.back()} />
    </SafeAreaView>
  );
};

export default AddPlaylistScreen;
