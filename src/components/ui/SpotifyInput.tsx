import React from 'react';
import { TextInput, View, Text, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SpotifyInputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

const SpotifyInput: React.FC<SpotifyInputProps> = ({
  label,
  error,
  icon,
  ...props
}) => {
  return (
    <View className="w-full mb-4">
      {label && (
        <Text className="text-spotify-white text-sm font-semibold mb-2">{label}</Text>
      )}
      <View className="flex-row items-center bg-spotify-darker rounded-lg px-4 py-3">
        {icon && (
          <Ionicons name={icon} size={20} color="#B3B3B3" style={{ marginRight: 10 }} />
        )}
        <TextInput
          className="flex-1 text-spotify-white text-base"
          placeholderTextColor="#535353"
          selectionColor="#1DB954"
          {...props}
        />
      </View>
      {error && (
        <Text className="text-red-500 text-xs mt-1">{error}</Text>
      )}
    </View>
  );
};

export default SpotifyInput;
