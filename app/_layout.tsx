import { Stack } from 'expo-router';
import { CanteenProvider } from '../context/CanteenContext';

export default function RootLayout() {
  return (
    <CanteenProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="item/[id]"
          options={{ headerShown: true, title: 'Meal Details & Order' }}
        />
      </Stack>
    </CanteenProvider>
  );
}