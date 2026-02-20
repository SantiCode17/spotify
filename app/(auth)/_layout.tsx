import { Stack } from 'expo-router';

const AuthLayout = () => {
  return (
    <Stack screenOptions={{ 
      headerShown: false,
      contentStyle: { backgroundColor: '#121212' }
    }} />
  );
};

export default AuthLayout;
