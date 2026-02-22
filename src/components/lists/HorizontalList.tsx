import React from 'react';
import { FlatList, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ShimmerCard } from '../ui/ShimmerPlaceholder';

interface HorizontalListProps<T> {
  data: T[] | undefined;
  renderItem: (item: T) => React.ReactElement;
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  isError?: boolean;
  emptyIcon?: keyof typeof Ionicons.glyphMap;
  emptyTitle?: string;
  emptySubtitle?: string;
  errorMessage?: string;
  onRetry?: () => void;
}

function HorizontalList<T>({
  data,
  renderItem,
  keyExtractor,
  isLoading = false,
  isError = false,
  emptyIcon = 'albums-outline',
  emptyTitle = 'No hay elementos',
  emptySubtitle,
  errorMessage = 'Error al cargar datos',
  onRetry,
}: HorizontalListProps<T>) {
  if (isLoading) {
    return (
      <View className="flex-row px-4">
        {[1, 2, 3].map((i) => (
          <View key={i} style={{ marginRight: 12 }}>
            <ShimmerCard />
          </View>
        ))}
      </View>
    );
  }

  if (isError) {
    return (
      <View className="items-center justify-center py-8 px-4">
        <Ionicons name="cloud-offline-outline" size={32} color="#535353" />
        <Text className="text-spotify-gray text-sm mt-2">{errorMessage}</Text>
        {onRetry && (
          <Text onPress={onRetry} className="text-spotify-green text-sm font-semibold mt-2">
            Reintentar
          </Text>
        )}
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View className="items-center justify-center py-8 px-4">
        <Ionicons name={emptyIcon} size={32} color="#535353" />
        <Text className="text-spotify-gray text-sm mt-2">{emptyTitle}</Text>
        {emptySubtitle && (
          <Text className="text-spotify-light-gray text-xs mt-1">{emptySubtitle}</Text>
        )}
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => renderItem(item)}
      keyExtractor={keyExtractor}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16 }}
    />
  );
}

export default HorizontalList;
