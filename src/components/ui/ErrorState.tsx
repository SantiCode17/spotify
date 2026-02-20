import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Ha ocurrido un error',
  onRetry,
}) => {
  return (
    <View className="items-center justify-center py-12 px-6">
      <Ionicons name="alert-circle-outline" size={64} color="#535353" />
      <Text className="text-spotify-white text-lg font-bold mt-4 text-center">
        ¡Ups!
      </Text>
      <Text className="text-spotify-gray text-sm mt-2 text-center">
        {message}
      </Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          className="mt-4 bg-spotify-green px-6 py-2 rounded-full active:bg-spotify-green-dark"
        >
          <Text className="text-black font-bold text-sm">Reintentar</Text>
        </Pressable>
      )}
    </View>
  );
};

export default ErrorState;
