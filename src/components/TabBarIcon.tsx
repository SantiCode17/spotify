import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface TabBarIconProps {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size?: number;
  focused?: boolean;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({ name, color, size = 24, focused }) => {
  return <Ionicons name={name} size={size} color={color} />;
};

export default TabBarIcon;
