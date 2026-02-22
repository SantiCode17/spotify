import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LibraryItemRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconBgColor?: string;
  iconColor?: string;
  rounded?: boolean;
  title: string;
  subtitle: string;
  badge?: string;
  onPress: () => void;
}

const LibraryItemRow: React.FC<LibraryItemRowProps> = ({
  icon,
  iconBgColor = '#282828',
  iconColor = '#535353',
  rounded = false,
  title,
  subtitle,
  badge,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="flex-row items-center py-2 px-4"
    >
      <View
        style={{
          width: 56,
          height: 56,
          backgroundColor: iconBgColor,
          borderRadius: rounded ? 28 : 4,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={icon} size={26} color={iconColor} />
      </View>
      <View className="flex-1 ml-3">
        <Text className="text-spotify-white text-base font-semibold" numberOfLines={1}>
          {title}
        </Text>
        <View className="flex-row items-center mt-0.5">
          {badge && (
            <View className="bg-spotify-darker rounded px-1.5 py-0.5 mr-1.5">
              <Text className="text-spotify-gray text-xs font-medium">{badge}</Text>
            </View>
          )}
          <Text className="text-spotify-gray text-sm" numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default LibraryItemRow;
