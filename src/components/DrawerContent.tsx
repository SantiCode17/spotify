import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { DrawerContentScrollView, type DrawerContentComponentProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import { router } from 'expo-router';

const DrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  // Iniciales del usuario para el avatar
  const getInitials = (name?: string): string => {
    if (!name) return '?';
    return name
      .split(/[\s_-]+/)
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  const menuItems = [
    { label: 'Mi Perfil', icon: 'person' as const, route: '/(app)/profile' },
    { label: 'Configuración', icon: 'settings' as const, route: '/(app)/config' },
  ];

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1 }}
      style={{ backgroundColor: '#121212' }}
    >
      {/* Header con info del usuario */}
      <View className="px-5 py-6 border-b border-spotify-darker">
        <View className="w-16 h-16 rounded-full bg-spotify-darker items-center justify-center overflow-hidden mb-3">
          {user?.foto_perfil ? (
            <Image source={{ uri: user.foto_perfil }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <Text className="text-spotify-green text-xl font-bold">
              {getInitials(user?.username)}
            </Text>
          )}
        </View>
        <Text className="text-spotify-white text-lg font-bold">
          {user?.username || 'Usuario'}
        </Text>
        <Text className="text-spotify-gray text-sm mt-1">{user?.email || ''}</Text>
      </View>

      {/* Menu items */}
      <View className="flex-1 pt-4">
        {menuItems.map((item) => (
          <Pressable
            key={item.route}
            onPress={() => router.push(item.route as never)}
            className="flex-row items-center px-5 py-4 active:bg-spotify-darker"
          >
            <Ionicons name={item.icon} size={22} color="#B3B3B3" />
            <Text className="text-spotify-gray text-base ml-4 font-semibold">{item.label}</Text>
          </Pressable>
        ))}

        {/* Suscripciones — solo si es premium */}
        {user?.plan === 'premium' && (
          <Pressable
            onPress={() => router.push('/(app)/subscriptions' as never)}
            className="flex-row items-center px-5 py-4 active:bg-spotify-darker"
          >
            <Ionicons name="card" size={22} color="#7B2FBE" />
            <Text className="text-spotify-purple text-base ml-4 font-semibold">Suscripciones</Text>
          </Pressable>
        )}
      </View>

      {/* Footer: Logout + Versión */}
      <View className="border-t border-spotify-darker px-5 py-4">
        <Pressable
          onPress={handleLogout}
          className="flex-row items-center py-3 active:opacity-70"
        >
          <Ionicons name="log-out-outline" size={22} color="#B3B3B3" />
          <Text className="text-spotify-gray text-base ml-4 font-semibold">Cerrar Sesión</Text>
        </Pressable>
        <Text className="text-spotify-light-gray text-xs mt-2 text-center">v1.0.0</Text>
      </View>
    </DrawerContentScrollView>
  );
};

export default DrawerContent;
