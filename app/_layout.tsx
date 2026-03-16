import { Inter_400Regular, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { Judson_700Bold } from '@expo-google-fonts/judson';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../contexts/auth-context';
import { RegistrationProvider } from '../contexts/registration-context';

export default function RootLayout() {
  const [loaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Bold':    Inter_700Bold,
    'Judson-Bold':   Judson_700Bold,
  });

  if (!loaded) return null;

  return (
    <AuthProvider>
      <RegistrationProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown:       false,
            contentStyle:      { backgroundColor: '#F5F4FF' },
            animation:         'slide_from_right',
            animationDuration: 350,
          }}
        >
          <Stack.Screen name="(tabs)/index"           options={{ animation: 'fade' }} />
          <Stack.Screen name="(tabs)/login"           options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="(tabs)/forgot-password" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="(tabs)/success"         options={{ animation: 'fade' }} />
          <Stack.Screen name="(tabs)/register"        options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="(tabs)/home"            options={{ animation: 'fade' }} />
          <Stack.Screen name="(tabs)/messages"        options={{ animation: 'fade' }} />
          <Stack.Screen name="(tabs)/user-profile"    options={{ animation: 'fade' }} />
        </Stack>
      </RegistrationProvider>
    </AuthProvider>
  );
}