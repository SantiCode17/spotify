import React from 'react';
import { FlatList, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ShimmerRow } from '../ui/ShimmerPlaceholder';

interface VerticalListProps<T> {
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
  ListHeaderComponent?: React.ReactElement;
  scrollEnabled?: boolean;
}

function VerticalList<T>({
  data,
  renderItem,
  keyExtractor,
  isLoading = false,
  isError = false,
  emptyIcon = 'list-outline',
  emptyTitle = 'No hay elementos',
  emptySubtitle,
  errorMessage = 'Error al cargar datos',
  onRetry,
  ListHeaderComponent,
  scrollEnabled = true,
}: VerticalListProps<T>) {
  if (isLoading) {
    return (
      <View className="px-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <ShimmerRow key={i} />
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
      showsVerticalScrollIndicator={false}
      scrollEnabled={scrollEnabled}
      ListHeaderComponent={ListHeaderComponent}
      ItemSeparatorComponent={() => <View className="h-px bg-spotify-darker mx-4" />}
    />
  );
}

export default VerticalList;
