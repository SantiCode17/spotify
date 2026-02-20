import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import LoadingSpinner from '../../src/components/ui/LoadingSpinner';

const AuthLayout = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  // Si todavía se está inicializando, mostramos un spinner
  if (isLoading) {
    return <LoadingSpinner message="Cargando..." />;
  }

  // Si ya está autenticado, redirigir a la app
  if (isAuthenticated) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#121212' },
        animation: 'slide_from_right',
      }}
    />
  );
};

export default AuthLayout;
