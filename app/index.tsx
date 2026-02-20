import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';
import LoadingSpinner from '../src/components/ui/LoadingSpinner';

const Index = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) {
    return <LoadingSpinner message="Verificando sesión..." />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
};

export default Index;
