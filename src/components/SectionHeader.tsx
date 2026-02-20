import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, onSeeAll }) => {
  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      <Text className="text-spotify-white text-xl font-bold">{title}</Text>
      {onSeeAll && (
        <Pressable onPress={onSeeAll}>
          <Text className="text-spotify-gray text-sm font-semibold">Ver todo</Text>
        </Pressable>
      )}
    </View>
  );
};

export default SectionHeader;
