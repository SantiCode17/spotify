import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';

const DrawerLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: '#121212',
            width: 280,
          },
          drawerActiveTintColor: '#1DB954',
          drawerInactiveTintColor: '#B3B3B3',
          drawerLabelStyle: {
            fontSize: 14,
            fontWeight: '600',
          },
        }}
      >
        <Drawer.Screen
          name="profile/index"
          options={{
            drawerLabel: 'Mi Perfil',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="settings/index"
          options={{
            drawerLabel: 'Configuración',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="subscriptions/index"
          options={{
            drawerLabel: 'Suscripciones',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="card" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default DrawerLayout;
