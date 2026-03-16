import { Tabs } from 'expo-router';
import { COLORS } from '../../lib/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown:           false,
        tabBarStyle:           { display: 'none' },
        tabBarActiveTintColor: COLORS.primary,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="login" />
      <Tabs.Screen name="forgot-password" />
      <Tabs.Screen name="success" />
      <Tabs.Screen name="register" />
      <Tabs.Screen name="home" />
      <Tabs.Screen name="messages" />
      <Tabs.Screen name="user-profile" />
    </Tabs>
  );
}