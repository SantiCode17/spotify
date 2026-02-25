import { Drawer } from 'expo-router/drawer';
import { Redirect } from 'expo-router';
import DrawerContent from '../../src/components/DrawerContent';
import { useAuthStore } from '../../src/store/authStore';
import LoadingSpinner from '../../src/components/ui/LoadingSpinner';

const AppLayout = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) {
    return <LoadingSpinner message="Cargando..." />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Drawer
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#121212',
          width: 280,
        },
        drawerActiveTintColor: '#1DB954',
        drawerInactiveTintColor: '#B3B3B3',
        swipeEdgeWidth: 100,
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: 'Inicio',
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: 'Mi Perfil',
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="config"
        options={{
          drawerLabel: 'Configuración',
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="subscriptions"
        options={{
          drawerLabel: 'Suscripciones',
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="playlist/[id]"
        options={{ drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen
        name="album/[id]"
        options={{ drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen
        name="artist/[id]"
        options={{ drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen
        name="podcast/[id]"
        options={{ drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen
        name="episode/[id]"
        options={{ drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen
        name="add-playlist"
        options={{ drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen
        name="liked-songs"
        options={{ drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen
        name="song/[id]"
        options={{ drawerItemStyle: { display: 'none' } }}
      />
    </Drawer>
  );
};

export default AppLayout;
