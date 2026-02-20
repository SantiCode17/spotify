import React from 'react';
import { Pressable, Text, ActivityIndicator, type PressableProps } from 'react-native';

interface SpotifyButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const SpotifyButton: React.FC<SpotifyButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled,
  ...props
}) => {
  const baseClasses = 'items-center justify-center rounded-full flex-row';

  const variantClasses = {
    primary: 'bg-spotify-green active:bg-spotify-green-dark',
    secondary: 'bg-spotify-darker active:bg-spotify-light-gray',
    outline: 'border border-spotify-light-gray active:bg-spotify-darker',
  };

  const sizeClasses = {
    sm: 'px-4 py-2',
    md: 'px-6 py-3',
    lg: 'px-8 py-4',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const textColorClasses = {
    primary: 'text-black',
    secondary: 'text-spotify-white',
    outline: 'text-spotify-white',
  };

  return (
    <Pressable
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
        fullWidth ? 'w-full' : ''
      } ${disabled || isLoading ? 'opacity-50' : ''}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#000000' : '#FFFFFF'}
        />
      ) : (
        <Text className={`font-bold ${textSizeClasses[size]} ${textColorClasses[variant]}`}>
          {title}
        </Text>
      )}
    </Pressable>
  );
};

export default SpotifyButton;
