import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, actionLabel, onAction }) => {
  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      <Text className="text-spotify-white text-xl font-bold">{title}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity activeOpacity={0.7} onPress={onAction}>
          <Text className="text-spotify-green text-sm font-semibold">{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SectionHeader;
