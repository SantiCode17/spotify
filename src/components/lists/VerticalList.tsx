import React from 'react';
import { FlatList, View } from 'react-native';
import LoadingSpinner from '../ui/LoadingSpinner';
import EmptyState from '../ui/EmptyState';
import ErrorState from '../ui/ErrorState';

interface VerticalListProps<T> {
  data: T[] | undefined;
  renderItem: (item: T) => React.ReactElement;
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  isError?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
  ListHeaderComponent?: React.ReactElement;
}

function VerticalList<T>({
  data,
  renderItem,
  keyExtractor,
  isLoading = false,
  isError = false,
  emptyMessage = 'No hay elementos',
  onRetry,
  ListHeaderComponent,
}: VerticalListProps<T>) {
  if (isLoading) {
    return <LoadingSpinner fullScreen={false} />;
  }

  if (isError) {
    return <ErrorState message="Error al cargar datos" onRetry={onRetry} />;
  }

  if (!data || data.length === 0) {
    return <EmptyState title={emptyMessage} />;
  }

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => renderItem(item)}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={ListHeaderComponent}
      ItemSeparatorComponent={() => <View className="h-px bg-spotify-darker mx-4" />}
    />
  );
}

export default VerticalList;
