import { Tabs, Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View, Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import { useAuth } from '@/contexts/AuthContext';
import { Image } from 'react-native';
import { useUserProfile } from '@/hooks/useUserProfile';


export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();
  const { avatar } = useUserProfile();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color }) =>
            avatar ? (
              <Image
                source={{ uri: avatar }}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  borderWidth: focused ? 2 : 0,
                  borderColor: '#7A5C4A',
                }}
              />
            ) : (
              <IconSymbol size={28} name="person.fill" color={color} />
            ),
        }}
      />
    </Tabs>
  );
}
