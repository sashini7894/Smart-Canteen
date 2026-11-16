import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#ff6b6b' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Canteen Menu',
          tabBarIcon: ({ color, size }) => <Ionicons name="fast-food" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          title: 'Orders & Favs',
          tabBarIcon: ({ color, size }) => <Ionicons name="receipt" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Smart Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}