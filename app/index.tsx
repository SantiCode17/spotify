import { Redirect } from 'expo-router';

const Index = () => {
  // En Fase 3 aquí irá: si hay sesión → tabs, si no → login
  return <Redirect href="/(tabs)/home" />;
};

export default Index;
