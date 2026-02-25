import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, actionLabel, onAction }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 12 }}>
      <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800' }}>{title}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity activeOpacity={0.7} onPress={onAction}>
          <Text style={{ color: '#A7A7A7', fontSize: 13, fontWeight: '600' }}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SectionHeader;
