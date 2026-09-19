import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { tokens } from '@/src/theme/tokens';

function TabLabel({ focused, label }: { focused: boolean; label: string }) {
  return (
    <Text style={{ color: focused ? tokens.color.primary : tokens.color.textMuted, fontSize: 11 }}>
      {label}
    </Text>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: tokens.color.surface, borderTopColor: tokens.color.border },
        tabBarActiveTintColor: tokens.color.primary,
        tabBarInactiveTintColor: tokens.color.textMuted,
      }}
    >
      <Tabs.Screen name="home/index" options={{ tabBarLabel: ({ focused }) => <TabLabel focused={focused} label="Home" /> }} />
      <Tabs.Screen name="trending/index" options={{ tabBarLabel: ({ focused }) => <TabLabel focused={focused} label="Trending" /> }} />
      <Tabs.Screen name="search/index" options={{ tabBarLabel: ({ focused }) => <TabLabel focused={focused} label="Search" /> }} />
      <Tabs.Screen name="my-list/index" options={{ tabBarLabel: ({ focused }) => <TabLabel focused={focused} label="My List" /> }} />
      <Tabs.Screen name="profile/index" options={{ tabBarLabel: ({ focused }) => <TabLabel focused={focused} label="Profile" /> }} />
    </Tabs>
  );
}
