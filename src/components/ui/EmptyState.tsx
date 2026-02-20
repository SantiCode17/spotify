import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'musical-notes-outline',
  title,
  message,
}) => {
  return (
    <View className="items-center justify-center py-12 px-6">
      <Ionicons name={icon} size={64} color="#535353" />
      <Text className="text-spotify-white text-lg font-bold mt-4 text-center">
        {title}
      </Text>
      {message && (
        <Text className="text-spotify-gray text-sm mt-2 text-center">
          {message}
        </Text>
      )}
    </View>
  );
};

export default EmptyState;
