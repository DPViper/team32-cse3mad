import { Tabs, Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, View, Platform } from "react-native";

import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useColorScheme } from "@/hooks/useColorScheme";

import { useAuth } from "@/contexts/AuthContext";
import { Image } from "react-native";
import { useUserProfile } from "@/hooks/useUserProfile";

import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

export default function TabLayout() {
  const theme = useTheme();
  const styles = createThemedStyles(theme);

  const { user, loading } = useAuth();
  const { avatar } = useUserProfile();
  const insets = useSafeAreaInsets();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: theme.textDark,
        tabBarInactiveTintColor: theme.secondary,
        headerShadowVisible: false,
        headerTitleAlign: "center",
        tabBarStyle: {
          ...styles.tabBar,
          // Insets for the bottom tab bar
          paddingBottom: insets.bottom,
          height: 60 + insets.bottom,
        },
        tabBarLabelStyle: styles.tabLabel,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Recommended Favorites",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmarks-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: "Friends",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

function createThemedStyles(theme: any) {
  return StyleSheet.create({
    tabBar: {
      backgroundColor: theme.primary,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingTop: 5,
    },
    tabLabel: {
      fontFamily: "PlusJakartaSans",
    },
    header: {
      backgroundColor: theme.primary,
    },
    headerTitle: {
      fontFamily: "PlusJakartaSansSemiBold",
    },
  });
}
