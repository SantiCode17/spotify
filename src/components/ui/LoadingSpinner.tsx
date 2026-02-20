import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Cargando...',
  fullScreen = true,
}) => {
  return (
    <View
      className={`items-center justify-center ${
        fullScreen ? 'flex-1 bg-spotify-black' : 'py-8'
      }`}
    >
      <ActivityIndicator size="large" color="#1DB954" />
      {message && (
        <Text className="text-spotify-gray text-sm mt-3">{message}</Text>
      )}
    </View>
  );
};

export default LoadingSpinner;
