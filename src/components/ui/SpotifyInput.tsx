import React from 'react';
import { TextInput, View, Text, TouchableOpacity, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SpotifyInputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
}

const SpotifyInput: React.FC<SpotifyInputProps> = ({
  label,
  error,
  icon,
  rightIcon,
  onRightIconPress,
  ...props
}) => {
  return (
    <View className="w-full mb-4">
      {label && (
        <Text className="text-spotify-white text-sm font-semibold mb-2">{label}</Text>
      )}
      <View
        className={`flex-row items-center bg-spotify-darker rounded-lg px-4 ${
          error ? 'border border-red-500' : ''
        }`}
        style={{ height: 52 }}
      >
        {icon && (
          <Ionicons name={icon} size={20} color="#B3B3B3" style={{ marginRight: 10 }} />
        )}
        <TextInput
          className="flex-1 text-spotify-white text-base"
          placeholderTextColor="#535353"
          selectionColor="#1DB954"
          style={{ height: 52 }}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity activeOpacity={0.7} onPress={onRightIconPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name={rightIcon} size={22} color="#B3B3B3" />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>
      )}
    </View>
  );
};

export default SpotifyInput;
