import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'musical-notes-outline',
  title,
  subtitle,
  actionLabel,
  onAction,
}) => {
  return (
    <View className="items-center justify-center py-12 px-6">
      <Ionicons name={icon} size={64} color="#535353" />
      <Text className="text-spotify-white text-lg font-bold mt-4 text-center">
        {title}
      </Text>
      {subtitle && (
        <Text className="text-spotify-gray text-sm mt-2 text-center">
          {subtitle}
        </Text>
      )}
      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          className="mt-4 bg-spotify-green px-6 py-2 rounded-full active:bg-spotify-green-dark"
        >
          <Text className="text-black font-bold text-sm">{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
};

export default EmptyState;
